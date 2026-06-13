import type { Person, AddingRelationType } from "@/src/types/person";

export interface PersonNodeData {
  person: Person;
  isHighlighted: boolean;
  isActive: boolean;
  isSearchMatch: boolean;
  isActiveSearch: boolean;
  activePathIds: Set<string>;
  setActivePersonId: (id: string | null) => void;
  setAddingRelation: (id: string | null, type: AddingRelationType) => void;
  onHoverEnter: (e: React.MouseEvent, person: Person) => void;
  onHoverLeave: () => void;
}

export interface MarriageNodeData {
  p1: Person;
  p2: Person;
  isCollapsed: boolean;
  hasChildren: boolean;
  onToggleCollapse: () => void;
}
