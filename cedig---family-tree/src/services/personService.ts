import { useAppStore } from "../../lib/store";
import type { Person } from "@/src/types/person";
import type { AddingRelationType } from "@/src/types/person";

export function personService() {
  const store = useAppStore.getState();

  return {
    addPerson: (data: Omit<Person, "id" | "verified" | "pendingOralHistory">) =>
      store.addPerson(data),

    editPerson: (id: string, updates: Partial<Person>) =>
      store.editPerson(id, updates),

    deletePerson: (id: string) =>
      store.deletePerson(id),

    setActivePerson: (id: string | null) =>
      store.setActivePersonId(id),

    setEditingPerson: (id: string | null) =>
      store.setEditingPersonId(id),

    setAddingRelation: (id: string | null, type: AddingRelationType) =>
      store.setAddingRelation(id, type),

    addPersonAsync: (treeId: string, data: Omit<Person, "id" | "verified" | "pendingOralHistory">) =>
      store.addPersonAsync(treeId, data),

    editPersonAsync: (treeId: string, id: string, updates: Partial<Person>) =>
      store.editPersonAsync(treeId, id, updates),

    deletePersonAsync: (treeId: string, id: string) =>
      store.deletePersonAsync(treeId, id),
  };
}
