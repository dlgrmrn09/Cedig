import type { StateCreator } from "zustand";
import type { Person, AddingRelationType } from "@/src/types/person";
import { createPerson, updatePerson, deletePerson } from "@/src/services/memberService";

const initialPeople: Person[] = [];

export interface PersonSlice {
  people: Person[];
  peopleLoaded: boolean;
  activePersonId: string | null;
  editingPersonId: string | null;
  addingRelationToId: string | null;
  addingRelationType: AddingRelationType;

  addPerson: (data: Omit<Person, "id" | "verified" | "pendingOralHistory">) => void;
  editPerson: (id: string, updates: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  setActivePersonId: (id: string | null) => void;
  setEditingPersonId: (id: string | null) => void;
  setAddingRelation: (id: string | null, type: AddingRelationType) => void;
  setPeople: (people: Person[]) => void;
  setPeopleLoaded: (loaded: boolean) => void;

  addPersonAsync: (treeId: string, data: Omit<Person, "id" | "verified" | "pendingOralHistory">) => Promise<Person>;
  editPersonAsync: (treeId: string, id: string, updates: Partial<Person>) => Promise<Person>;
  deletePersonAsync: (treeId: string, id: string) => Promise<void>;
}

export const createPersonSlice: StateCreator<PersonSlice, [], [], PersonSlice> = (set, get) => ({
  people: initialPeople,
  peopleLoaded: false,
  activePersonId: null,
  editingPersonId: null,
  addingRelationToId: null,
  addingRelationType: null as AddingRelationType,

  addPerson: (personData) =>
    set((state) => {
      const maxId = state.people.reduce((max, p) => {
        const num = parseInt(p.id, 10);
        return isNaN(num) ? max : Math.max(max, num);
      }, 0);
      const newId = `${maxId + 1}`;
      const newPerson: Person = {
        ...personData,
        id: newId,
        verified: false,
        pendingOralHistory: personData.notes?.toLowerCase().includes("oral") || false,
      };
      let updatedPeople = [...state.people, newPerson];
      if (personData.spouseId) {
        updatedPeople = updatedPeople.map((p) =>
          p.id === personData.spouseId ? { ...p, spouseId: newId } : p,
        );
      }
      if (state.addingRelationToId && state.addingRelationType) {
        const targetId = state.addingRelationToId;
        const relType = state.addingRelationType;
        updatedPeople = updatedPeople.map((p) => {
          if (p.id === targetId) {
            if (relType === "father") return { ...p, fatherId: newId };
            if (relType === "mother") return { ...p, motherId: newId };
          }
          return p;
        });
      }
      return { people: updatedPeople };
    }),

  editPerson: (id, updates) =>
    set((state) => ({
      people: state.people.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  deletePerson: (id) =>
    set((state) => ({
      people: state.people
        .filter((p) => p.id !== id)
        .map((p) => {
          const clean = { ...p };
          if (clean.fatherId === id) delete clean.fatherId;
          if (clean.motherId === id) delete clean.motherId;
          if (clean.spouseId === id) delete clean.spouseId;
          return clean;
        }),
      activePersonId: state.activePersonId === id ? null : state.activePersonId,
    })),

  setActivePersonId: (id) => set({ activePersonId: id }),
  setEditingPersonId: (id) => set({ editingPersonId: id }),
  setAddingRelation: (id, type) => set({ addingRelationToId: id, addingRelationType: type }),
  setPeople: (people) => set({ people }),
  setPeopleLoaded: (loaded) => set({ peopleLoaded: loaded }),

  addPersonAsync: async (treeId: string, personData) => {
    try {
      const newPerson = await createPerson(treeId, personData);

      const { addingRelationToId, addingRelationType } = get();

      if (addingRelationToId && addingRelationType) {
        const anchorId = addingRelationToId;

        if (addingRelationType === "father") {
          await updatePerson(treeId, anchorId, { fatherId: newPerson.id });
        } else if (addingRelationType === "mother") {
          await updatePerson(treeId, anchorId, { motherId: newPerson.id });
        } else if (addingRelationType === "spouse") {
          await updatePerson(treeId, anchorId, { spouseId: newPerson.id });
        }
      }

      set((s) => {
        let updatedPeople = [...s.people, newPerson];

        if (s.addingRelationToId && s.addingRelationType) {
          const targetId = s.addingRelationToId;
          const relType = s.addingRelationType;

          updatedPeople = updatedPeople.map((p) => {
            if (p.id === targetId) {
              if (relType === "father") return { ...p, fatherId: newPerson.id };
              if (relType === "mother") return { ...p, motherId: newPerson.id };
              if (relType === "spouse") return { ...p, spouseId: newPerson.id };
            }
            if (p.id === newPerson.id && relType === "spouse") {
              return { ...p, spouseId: targetId };
            }
            return p;
          });

          const targetPerson = updatedPeople.find((p) => p.id === targetId);
          if (relType === "father" && targetPerson?.motherId) {
            updatedPeople = updatedPeople.map((p) =>
              p.id === targetPerson.motherId ? { ...p, spouseId: newPerson.id } : p
            );
          }
          if (relType === "mother" && targetPerson?.fatherId) {
            updatedPeople = updatedPeople.map((p) =>
              p.id === targetPerson.fatherId ? { ...p, spouseId: newPerson.id } : p
            );
          }
        }

        return { people: updatedPeople };
      });
      return newPerson;
    } catch (error) {
      console.error('Failed to add person:', error);
      throw error;
    }
  },

  editPersonAsync: async (treeId: string, id: string, updates: Partial<Person>) => {
    try {
      const updated = await updatePerson(treeId, id, updates);
      set((s) => ({
        people: s.people.map((p) => (p.id === id ? updated : p)),
      }));
      return updated;
    } catch (error) {
      console.error('Failed to edit person:', error);
      throw error;
    }
  },

  deletePersonAsync: async (treeId: string, id: string) => {
    try {
      await deletePerson(treeId, id);
      set((s) => ({
        people: s.people
          .filter((p) => p.id !== id)
          .map((p) => {
            const clean = { ...p };
            if (clean.fatherId === id) delete clean.fatherId;
            if (clean.motherId === id) delete clean.motherId;
            if (clean.spouseId === id) delete clean.spouseId;
            return clean;
          }),
        activePersonId: s.activePersonId === id ? null : s.activePersonId,
      }));
    } catch (error) {
      console.error('Failed to delete person:', error);
      throw error;
    }
  },
});
