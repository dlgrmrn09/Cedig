import { useState, useEffect, useCallback, useRef } from 'react';
import * as api from './api';
import type { FamilyTree, TreeMember, UserSearchResult, PendingInvite, JoinRequest } from './types';

export function useFamilyTree(treeId: string | null) {
  const [tree, setTree] = useState<FamilyTree | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!treeId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchFamilyTree(treeId);
      setTree(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tree');
    } finally {
      setLoading(false);
    }
  }, [treeId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { tree, loading, error, refetch: fetch };
}

export function useMembers(treeId: string | null) {
  const [members, setMembers] = useState<TreeMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!treeId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchMembers(treeId);
      setMembers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load members');
    } finally {
      setLoading(false);
    }
  }, [treeId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const changeRole = useCallback(async (targetUserId: string, role: 'Admin' | 'Editor' | 'Viewer') => {
    if (!treeId) return;
    const prevMembers = members;
    setUpdatingRole(targetUserId);

    setMembers((prev) =>
      prev.map((m) => (m.userId === targetUserId ? { ...m, role } : m))
    );

    try {
      await api.updateMemberRole(treeId, { targetUserId, role });
    } catch (err) {
      setMembers(prevMembers);
      throw err;
    } finally {
      setUpdatingRole(null);
    }
  }, [treeId, members]);

  const remove = useCallback(async (userId: string) => {
    if (!treeId) return;
    try {
      await api.removeMember(treeId, userId);
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
    } catch (err) {
      throw err;
    }
  }, [treeId]);

  return { members, loading, error, updatingRole, changeRole, remove, refetch: fetch };
}

export function useUserSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = useCallback((q: string) => {
    setQuery(q);
    setError(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!q || q.length < 2) {
      setResults([]);
      return;
    }

    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await api.searchUsers(q);
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  }, []);

  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
    setSearching(false);
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  return { query, results, searching, error, search, clear };
}

export function useInviteMember(treeId: string | null) {
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const invite = useCallback(async (userId: string, role: 'Editor' | 'Viewer') => {
    if (!treeId) return;
    setInviting(true);
    setError(null);
    try {
      await api.inviteMember(treeId, { userId, role });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Invitation failed';
      setError(message);
      throw err;
    } finally {
      setInviting(false);
    }
  }, [treeId]);

  return { inviting, error, invite, clearError: () => setError(null) };
}

export function usePendingInvites() {
  const [invites, setInvites] = useState<PendingInvite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [declining, setDeclining] = useState<string | null>(null);
  const [accepted, setAccepted] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchPendingInvites();
      setInvites(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invitations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const accept = useCallback(async (inviteId: string) => {
    setAccepting(inviteId);
    try {
      const result = await api.acceptInvite(inviteId);
      // Show accepted state before removing
      setAccepted(inviteId);
      setTimeout(() => {
        setInvites((prev) => prev.filter((inv) => inv.id !== inviteId));
        setAccepted(null);
      }, 2000);
      return result;
    } catch (err) {
      setAccepting(null);
      throw err;
    } finally {
      setAccepting((prev) => (prev === inviteId ? null : prev));
    }
  }, []);

  const decline = useCallback(async (inviteId: string) => {
    setDeclining(inviteId);
    try {
      await api.declineInvite(inviteId);
      setInvites((prev) => prev.filter((inv) => inv.id !== inviteId));
    } catch (err) {
      throw err;
    } finally {
      setDeclining(null);
    }
  }, []);

  return { invites, loading, error, accepting, declining, accepted, accept, decline, refetch: fetch };
}

export function useJoinRequests(treeId: string | null) {
  const [requests, setRequests] = useState<JoinRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acting, setActing] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!treeId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchJoinRequests(treeId);
      setRequests(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  }, [treeId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const approve = useCallback(async (requestId: string) => {
    if (!treeId) return;
    setActing(requestId);
    try {
      await api.approveJoinRequest(treeId, requestId);
      setRequests((prev) => prev.map((r) => r.id === requestId ? { ...r, status: 'Approved' as const } : r));
    } finally {
      setActing(null);
    }
  }, [treeId]);

  const reject = useCallback(async (requestId: string) => {
    if (!treeId) return;
    setActing(requestId);
    try {
      await api.rejectJoinRequest(treeId, requestId);
      setRequests((prev) => prev.map((r) => r.id === requestId ? { ...r, status: 'Rejected' as const } : r));
    } finally {
      setActing(null);
    }
  }, [treeId]);

  const pendingCount = requests.filter((r) => r.status === 'Pending').length;

  return { requests, loading, error, acting, approve, reject, pendingCount, refetch: fetch };
}
