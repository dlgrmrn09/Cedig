"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import {
  useReactFlow,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from "@xyflow/react";
import { useAppStore } from "@/lib/store";
import type { Person } from "@/src/types/person";

export function useTreeCanvas() {
  const {
    people,
    filters,
    setFilters,
    resetFilters,
    setActivePersonId,
    setAddingRelation,
    activePersonId,
  } = useAppStore();

  const {
    setCenter,
    fitView,
    zoomIn: rxZoomIn,
    zoomOut: rxZoomOut,
  } = useReactFlow();

  // Local state for the search input to allow instant typing feedback
  const [localSearch, setLocalSearch] = useState(filters.searchQuery);
  const [prevSearchQuery, setPrevSearchQuery] = useState(filters.searchQuery);

  // If filters.searchQuery is updated from the outside (like reset), sync local state during rendering
  if (filters.searchQuery !== prevSearchQuery) {
    setPrevSearchQuery(filters.searchQuery);
    setLocalSearch(filters.searchQuery);
  }

  // Debounce the local search state to trigger updates to the global query
  const debouncedSearch = useDebounce(localSearch, 300);

  // Sync debounced search to global filter state
  useEffect(() => {
    setFilters({ searchQuery: debouncedSearch });
  }, [debouncedSearch, setFilters]);

  // Layout Branch Collapse Tracker
  const [collapsedNodeIds, setCollapsedNodeIds] = useState<Set<string>>(
    new Set(),
  );

  // Interactive left sidebar collapse state
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(true);

  // Tooltip Portal Tracker State
  const [hoveredPerson, setHoveredPerson] = useState<Person | null>(null);
  const [hoveredRect, setHoveredRect] = useState<{ x: number; y: number } | null>(null);

  // Filter UI Pane State (Right hand side slide-out)
  const [showFilters, setShowFilters] = useState(true);

  // Year range filter slider local state
  const [localYearRange, setLocalYearRange] = useState<[number, number]>(
    () => filters.yearRange,
  );

  // Trace active ancestor/descendant paths for high-contrast highlight
  const activePathIds = useMemo(() => {
    const ids = new Set<string>();

    const trace = (personId: string | null) => {
      if (!personId) return;
      const visited = new Set<string>();

      const addAncestors = (id: string) => {
        if (visited.has(id)) return;
        visited.add(id);
        ids.add(id);
        const person = people.find((p) => p.id === id);
        if (person) {
          if (person.fatherId) addAncestors(person.fatherId);
          if (person.motherId) addAncestors(person.motherId);
        }
      };

      const addDescendants = (id: string) => {
        if (visited.has(id)) return;
        visited.add(id);
        ids.add(id);
        const children = people.filter(
          (p) => p.fatherId === id || p.motherId === id,
        );
        children.forEach((c) => addDescendants(c.id));
      };

      addAncestors(personId);
      addDescendants(personId);

      const self = people.find((p) => p.id === personId);
      if (self && self.spouseId) {
        ids.add(self.spouseId);
      }
    };

    if (activePersonId) {
      trace(activePersonId);
    }
    return ids;
  }, [activePersonId, people]);

  // Collapsing Toggle Actions
  const toggleMarriageCollapse = (marriageId: string) => {
    setCollapsedNodeIds((prev) => {
      const next = new Set(prev);
      if (next.has(marriageId)) {
        next.delete(marriageId);
      } else {
        next.add(marriageId);
      }
      return next;
    });
  };

  // 1. Recursive display filter to completely hide children of collapsed parent nodes
  const visiblePeople = useMemo(() => {
    const visible = new Set<string>();
    const peopleMap = new Map(people.map((p) => [p.id, p]));

    // Find absolute roots of the tree
    const roots = people.filter((p) => !p.fatherId && !p.motherId);

    const traverse = (pId: string) => {
      if (visible.has(pId)) return;
      visible.add(pId);

      const person = peopleMap.get(pId);
      if (!person) return;

      if (person.spouseId) {
        visible.add(person.spouseId);
      }

      const spouseId = person.spouseId;
      const marriageKey = spouseId
        ? `marriage-${[pId, spouseId].sort().join("-")}`
        : `single-${pId}`;

      if (collapsedNodeIds.has(marriageKey)) {
        // Children collapsed, stop recursion
        return;
      }

      // Select children
      const children = people.filter(
        (c) =>
          c.fatherId === pId ||
          c.motherId === pId ||
          (spouseId && (c.fatherId === spouseId || c.motherId === spouseId)),
      );

      children.forEach((c) => traverse(c.id));
    };

    roots.forEach((r) => traverse(r.id));

    // Fallback security check
    people.forEach((p) => {
      if (!p.fatherId && !p.motherId) {
        traverse(p.id);
      }
    });

    return people.filter((p) => visible.has(p.id));
  }, [people, collapsedNodeIds]);

  // 2. Main generational hierarchical layout algorithm
  const nodePositions = useMemo(() => {
    const pos: Record<string, { x: number; y: number }> = {};
    const levels: Record<string, number> = {};
    const peopleMap = new Map(visiblePeople.map((p) => [p.id, p]));

    visiblePeople.forEach((p) => {
      levels[p.id] = 0;
    });

    let changed = true;
    let pass = 0;
    while (changed && pass < 50) {
      changed = false;
      pass++;
      for (const p of visiblePeople) {
        let l = 0;
        if (p.fatherId && levels[p.fatherId] !== undefined) {
          l = Math.max(l, levels[p.fatherId] + 1);
        }
        if (p.motherId && levels[p.motherId] !== undefined) {
          l = Math.max(l, levels[p.motherId] + 1);
        }
        if (p.spouseId && levels[p.spouseId] !== undefined) {
          l = Math.max(l, levels[p.spouseId]);
        }
        if (levels[p.id] !== l) {
          levels[p.id] = l;
          changed = true;
        }
      }
    }

    visiblePeople.forEach((p) => {
      if (p.spouseId) {
        const spLvl = levels[p.spouseId] || 0;
        const pLvl = levels[p.id] || 0;
        const maxLvl = Math.max(spLvl, pLvl);
        levels[p.id] = maxLvl;
        levels[p.spouseId] = maxLvl;
      }
    });

    const processed = new Set<string>();
    const subtreeWidths: Record<string, number> = {};

    const measureSubtree = (id: string): number => {
      if (subtreeWidths[id] !== undefined) return subtreeWidths[id];

      const person = peopleMap.get(id);
      if (!person) return 140;

      const spouseId = person.spouseId;
      const childIds = visiblePeople
        .filter(
          (p) =>
            p.fatherId === id ||
            p.motherId === id ||
            (spouseId && (p.fatherId === spouseId || p.motherId === spouseId)),
        )
        .map((p) => p.id);

      const uniqueChildren = Array.from(new Set(childIds));

      let childrenWidth = 0;
      if (uniqueChildren.length > 0) {
        uniqueChildren.forEach((childId) => {
          childrenWidth += measureSubtree(childId);
        });
        childrenWidth += (uniqueChildren.length - 1) * 80;
      }

      let ownWidth = spouseId ? 320 : 140;
      const w = Math.max(ownWidth, childrenWidth);
      subtreeWidths[id] = w;
      return w;
    };

    visiblePeople.forEach((p) => {
      measureSubtree(p.id);
    });

    const assignPositions = (id: string, startX: number, level: number) => {
      if (processed.has(id)) return;
      processed.add(id);

      const person = peopleMap.get(id);
      if (!person) return;

      const y = 80 + level * 200;
      const spouseId = person.spouseId;

      if (spouseId) {
        processed.add(spouseId);
        pos[id] = { x: startX - 110, y };
        pos[spouseId] = { x: startX + 110, y };
      } else {
        pos[id] = { x: startX, y };
      }

      const childIds = visiblePeople
        .filter(
          (p) =>
            p.fatherId === id ||
            p.motherId === id ||
            (spouseId && (p.fatherId === spouseId || p.motherId === spouseId)),
        )
        .map((p) => p.id);
      const uniqueChildren = Array.from(new Set(childIds));

      if (uniqueChildren.length > 0) {
        let totalChildrenWidth = 0;
        const childWidths = uniqueChildren.map((childId) => {
          const w = subtreeWidths[childId] || 140;
          totalChildrenWidth += w;
          return w;
        });

        totalChildrenWidth += (uniqueChildren.length - 1) * 80;
        let currentX = startX - totalChildrenWidth / 2;

        uniqueChildren.forEach((childId, idx) => {
          const childWidth = childWidths[idx];
          const cX = currentX + childWidth / 2;
          assignPositions(childId, cX, level + 1);
          currentX += childWidth + 80;
        });
      }
    };

    const roots = visiblePeople.filter((p) => {
      if (p.fatherId || p.motherId) return false;

      if (p.spouseId) {
        const spouse = peopleMap.get(p.spouseId);
        if (spouse) {
          if (spouse.fatherId || spouse.motherId) return false;
          if (p.gender === "female" && spouse.gender === "male") return false;
          if (p.gender === spouse.gender && p.id > spouse.id) return false;
        }
      }
      return true;
    });

    let rootStartX = 370;
    roots.forEach((root) => {
      assignPositions(root.id, rootStartX, levels[root.id] || 0);
      rootStartX += (subtreeWidths[root.id] || 320) + 180;
    });

    visiblePeople.forEach((p) => {
      if (!pos[p.id]) {
        let parentId = p.fatherId || p.motherId;
        if (parentId && pos[parentId]) {
          pos[p.id] = { x: pos[parentId].x, y: pos[parentId].y + 200 };
        } else {
          pos[p.id] = { x: 370, y: 80 + (levels[p.id] || 0) * 200 };
        }
      }
    });

    return pos;
  }, [visiblePeople]);

  // 3. Search matches computed from ALL people — never hides nodes
  const searchMatches = useMemo(() => {
    if (!filters.searchQuery) return [];
    const q = filters.searchQuery.toLowerCase();
    return people.filter((p) => {
      const name = `${p.firstName} ${p.lastName}`.toLowerCase();
      return (
        name.includes(q) ||
        p.clanName.toLowerCase().includes(q) ||
        (p.occupation?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [people, filters.searchQuery]);
  const searchMatchIds = useMemo(
    () => new Set(searchMatches.map((p) => p.id)),
    [searchMatches],
  );

  // 3b. People filtered by non-search criteria only (clan, year, verified, oral)
  const filteredPeople = useMemo(() => {
    return people.filter((p) => {
      const clanMatch =
        filters.selectedClan === "All Clans" ||
        p.clanName.toLowerCase() === filters.selectedClan.toLowerCase();
      const yearMatch =
        p.birthYear >= filters.yearRange[0] &&
        p.birthYear <= filters.yearRange[1];
      const verifiedMatch = !filters.verifiedOnly || p.verified;
      const oralMatch = !filters.pendingOralHistoryOnly || p.pendingOralHistory;
      return clanMatch && yearMatch && verifiedMatch && oralMatch;
    });
  }, [people, filters.selectedClan, filters.yearRange, filters.verifiedOnly, filters.pendingOralHistoryOnly]);

  // Search navigation state
  const [activeSearchIndex, setActiveSearchIndex] = useState(0);

  // Generate unique clans list for dropdown selector
  const clanList = useMemo(() => {
    const list = new Set(people.map((p) => p.clanName));
    return ["All Clans", ...Array.from(list)];
  }, [people]);

  // React Flow Nodes & Edges generators
  const [rfNodes, setRfNodes, onNodesChange] = useNodesState<Node>([]);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Determine which nodes to render — applies non-search filters only
  const activeTargetPeople = useMemo(() => {
    return visiblePeople.filter((p) => {
      if (
        filters.selectedClan !== "All Clans" &&
        p.clanName.toLowerCase() !== filters.selectedClan.toLowerCase()
      )
        return false;
      if (
        p.birthYear < filters.yearRange[0] ||
        p.birthYear > filters.yearRange[1]
      )
        return false;
      if (filters.verifiedOnly && !p.verified) return false;
      if (filters.pendingOralHistoryOnly && !p.pendingOralHistory)
        return false;
      return true;
    });
  }, [
    visiblePeople,
    filters.selectedClan,
    filters.yearRange,
    filters.verifiedOnly,
    filters.pendingOralHistoryOnly,
  ]);

  useEffect(() => {
    const nodesList: Node[] = [];
    const edgesList: Edge[] = [];

    const activeSearchId =
      searchMatches.length > 0 &&
      activeSearchIndex >= 0 &&
      activeSearchIndex < searchMatches.length
        ? searchMatches[activeSearchIndex].id
        : null;

    // Map people to custom React Flow Nodes — ALL visible nodes always rendered
    activeTargetPeople.forEach((p) => {
      const pos = nodePositions[p.id] || { x: 300, y: 300 };
      const isSearchMatch = searchMatchIds.has(p.id);
      nodesList.push({
        id: p.id,
        type: "personNode",
        position: { x: pos.x, y: pos.y },
        data: {
          person: p,
          isHighlighted: isSearchMatch,
          isActive: activePersonId === p.id,
          isSearchMatch,
          isActiveSearch: activeSearchId === p.id,
          activePathIds,
          setActivePersonId,
          setAddingRelation,
          onHoverEnter: (e: React.MouseEvent, person: Person) => {
            setHoveredPerson(person);
            const rect = e.currentTarget.getBoundingClientRect();
            setHoveredRect({ x: rect.left + rect.width / 2, y: rect.bottom + 8 });
          },
          onHoverLeave: () => {
            setHoveredPerson(null);
            setHoveredRect(null);
          },
        },
      });
    });

    // Extract marriage couplings explicitly to render Marriage Hubs
    const processedCouples = new Set<string>();
    activeTargetPeople.forEach((p) => {
      if (p.spouseId) {
        const spouseId = p.spouseId;
        const coupleKey = [p.id, spouseId].sort().join("-");

        if (!processedCouples.has(coupleKey)) {
          processedCouples.add(coupleKey);

          const spouse = activeTargetPeople.find((sp) => sp.id === spouseId);
          if (spouse) {
            const p1 = p;
            const p2 = spouse;
            const pos1 = nodePositions[p1.id];
            const pos2 = nodePositions[p2.id];

            if (pos1 && pos2) {
              const HUB_Y_OFFSET = 45;
              const HUB_CONTAINER_HALF = 16;
              const NODE_HALF = 57.5;
              const midX = (pos1.x + pos2.x) / 2 + NODE_HALF - HUB_CONTAINER_HALF;
              const midY = pos1.y + NODE_HALF - HUB_CONTAINER_HALF + HUB_Y_OFFSET;
              const marriageId = `marriage-${coupleKey}`;

              // Check if couple has child descendants in current tree
              const children = people.filter(
                (c) =>
                  (c.fatherId === p1.id && c.motherId === p2.id) ||
                  (c.fatherId === p2.id && c.motherId === p1.id),
              );
              const hasChildren = children.length > 0;

              // 1. Add gold central connection hub
              nodesList.push({
                id: marriageId,
                type: "marriageNode",
                position: { x: midX, y: midY },
                data: {
                  p1,
                  p2,
                  isCollapsed: collapsedNodeIds.has(marriageId),
                  hasChildren,
                  onToggleCollapse: () => toggleMarriageCollapse(marriageId),
                },
              });

              // 2. Draw Spouse 1 to Hub Connection Edge
              edgesList.push({
                id: `edge-spouse1-${p1.id}`,
                source: p1.id,
                target: marriageId,
                type: "spouse",
                animated: activePathIds.has(p1.id) && activePathIds.has(p2.id),
                style: {
                  stroke: activePathIds.has(p1.id) ? "#C4956A" : "#C4956A",
                  strokeWidth: activePathIds.has(p1.id) ? 3.5 : 2.5,
                },
              });

              // 3. Draw Spouse 2 to Hub Connection Edge
              edgesList.push({
                id: `edge-spouse2-${p2.id}`,
                source: p2.id,
                target: marriageId,
                type: "spouse",
                animated: activePathIds.has(p1.id) && activePathIds.has(p2.id),
                style: {
                  stroke: activePathIds.has(p2.id) ? "#C4956A" : "#C4956A",
                  strokeWidth: activePathIds.has(p2.id) ? 3.5 : 2.5,
                },
              });
            }
          }
        }
      }
    });

    // Map parent-child connections securely from hub or parents
    activeTargetPeople.forEach((c) => {
      if (c.fatherId && c.motherId) {
        const coupleKey = [c.fatherId, c.motherId].sort().join("-");
        const marriageId = `marriage-${coupleKey}`;

        if (nodesList.some((n) => n.id === marriageId)) {
          edgesList.push({
            id: `edge-child-${c.id}`,
            source: marriageId,
            target: c.id,
            type: "child",
            animated: activePathIds.has(c.id),
            style: {
              stroke: activePathIds.has(c.id) ? "#8B7355" : "#8B735599",
              strokeWidth: activePathIds.has(c.id) ? 3.5 : 2.5,
            },
          });
        }
      } else {
        // Direct single parent connections
        const singleParentId = c.fatherId || c.motherId;
        if (singleParentId && nodesList.some((n) => n.id === singleParentId)) {
          edgesList.push({
            id: `edge-single-${singleParentId}-${c.id}`,
            source: singleParentId,
            target: c.id,
            type: "child",
            animated: activePathIds.has(c.id),
            style: {
              stroke: activePathIds.has(c.id) ? "#8B7355" : "#8B735599",
              strokeWidth: activePathIds.has(c.id) ? 3.5 : 2.5,
            },
          });
        }
      }
    });

    setRfNodes(nodesList);
    setRfEdges(edgesList);
  }, [
    activeTargetPeople,
    nodePositions,
    activePersonId,
    activePathIds,
    collapsedNodeIds,
    searchMatches,
    activeSearchIndex,
    searchMatchIds,
    setRfNodes,
    setRfEdges,
    setActivePersonId,
    setAddingRelation,
  ]);

  // Search navigation — pan to active result
  const panToSearchResult = useCallback(
    (index: number) => {
      if (index < 0 || index >= searchMatches.length) return;
      const target = searchMatches[index];
      const pos = nodePositions[target.id];
      if (pos) {
        setCenter(pos.x + 57.5, pos.y + 57.5, { zoom: 1.1, duration: 800 });
      }
    },
    [searchMatches, nodePositions, setCenter],
  );

  const goToNextSearchResult = useCallback(() => {
    if (searchMatches.length === 0) return;
    const next = (activeSearchIndex + 1) % searchMatches.length;
    setActiveSearchIndex(next);
    panToSearchResult(next);
  }, [searchMatches.length, activeSearchIndex, panToSearchResult]);

  const goToPrevSearchResult = useCallback(() => {
    if (searchMatches.length === 0) return;
    const prev =
      (activeSearchIndex - 1 + searchMatches.length) % searchMatches.length;
    setActiveSearchIndex(prev);
    panToSearchResult(prev);
  }, [searchMatches.length, activeSearchIndex, panToSearchResult]);

  // Search Submit — toggle between Enter (next) and Shift+Enter (prev)
  const handleSearchKeyPress = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if ("shiftKey" in e && e.shiftKey) {
      goToPrevSearchResult();
    } else {
      goToNextSearchResult();
    }
  };

  // Zoom helpers powered directly by react-flow engine
  const handleZoomIn = () => rxZoomIn({ duration: 300 });
  const handleZoomOut = () => rxZoomOut({ duration: 300 });
  const handleFitView = () => fitView({ duration: 800, padding: 0.15 });

  return {
    // Store
    filters,
    setFilters,
    resetFilters,
    setActivePersonId,
    setAddingRelation,
    activePersonId,
    people,
    filteredPeople,
    // Local state
    localSearch,
    setLocalSearch,
    collapsedNodeIds,
    isLeftSidebarCollapsed,
    setIsLeftSidebarCollapsed,
    hoveredPerson,
    setHoveredPerson,
    hoveredRect,
    setHoveredRect,
    showFilters,
    setShowFilters,
    localYearRange,
    setLocalYearRange,
    // Computed
    activePathIds,
    visiblePeople,
    nodePositions,
    clanList,
    // RF state
    rfNodes,
    onNodesChange,
    rfEdges,
    onEdgesChange,
    // Search state
    searchMatches,
    activeSearchIndex,
    goToNextSearchResult,
    goToPrevSearchResult,
    // Handlers
    handleSearchKeyPress,
    toggleMarriageCollapse,
    handleZoomIn,
    handleZoomOut,
    handleFitView,
  };
}
