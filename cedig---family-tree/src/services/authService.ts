import { useAppStore } from "../../lib/store";
import type { ViewType } from "@/src/types/common";

export function authService() {
  const store = useAppStore.getState();

  return {
    login: (email: string, name?: string) => store.login(email, name),
    logout: () => store.logout(),
    joinTree: (code: string, treeName?: string) => store.joinTree(code, treeName),
    createTree: (name: string) => store.createTree(name),
    setView: (view: ViewType) => store.setView(view),
    setWorkspaceTab: store.setWorkspaceTab,
  };
}
