import type { StateCreator } from "zustand";
import type { Person, AddingRelationType } from "@/src/types/person";

const initialPeople: Person[] = [
  { id: "1", firstName: "Demberel", lastName: "Bat-Erdene", surname: "Bat-Erdene", clanName: "Sartuul", birthPlace: "Ulaanbaatar", biography: "Sartuul clan header born in Ulaanbaatar. Resided and conducted scientific archives in Khentii province. Spent life recording lineage stories and historic scrolls.", zodiacSign: "Capricorn", birthYear: 1912, birthDate: "1912-01-12", deathDate: "1988", gender: "male", occupation: "Archivist & Scholar", education: "Ulaanbaatar State Academy", awards: ["State Honorary Order of the Polar Star", "Outstanding Academic Scroll"], notes: "Primary scroll lines start here. Discovered high-fidelity family registers dating back to late Qing period.", relationshipLabel: "DIRECT LINE", verified: true, pendingOralHistory: false },
  { id: "2", firstName: "Ganbold", lastName: "Demberel", surname: "Demberel", clanName: "Sartuul", birthPlace: "Ulaanbaatar", biography: "A prominent community elder and legal consultant. Earned numerous awards in archival recording. Continued Demberel's research in preservation of genealogy data.", zodiacSign: "Taurus", birthYear: 1945, birthDate: "1945-05-18", deathDate: "Present", gender: "male", occupation: "Retired Jurist", education: "National University of Mongolia", awards: ["Outstanding Citizen Award", "Cultural Heritage Medal"], notes: "Holds the primary hand-written book records for the CEDIG archive.", relationshipLabel: "HEAD OF CLAN", verified: true, pendingOralHistory: false, fatherId: "1", spouseId: "3" },
  { id: "3", firstName: "Enkhjargal", lastName: "D.", surname: "Dorj", clanName: "Borgijin", birthPlace: "Arkhangai", biography: "Matriarch of the family tree and leading voice in oral narratives of nomadic lineages. Deeply knowledgeable on the family branch trees in western provinces.", zodiacSign: "Virgo", birthYear: 1948, birthDate: "1948-09-02", deathDate: "Present", gender: "female", occupation: "Anatomist Professor", education: "Mongolian Medical University", awards: ["Academic Excellence Trophy"], notes: "Main source for early 20th-century oral records. Verified authenticity of Sartuul connections.", relationshipLabel: "MATRIARCH", verified: true, pendingOralHistory: false, spouseId: "2" },
  { id: "4", firstName: "Batmunkh", lastName: "Ganbold", surname: "Ganbold", clanName: "Sartuul", birthPlace: "Ulaanbaatar", biography: "Tech pioneer and systems architect based in Ulaanbaatar. Initiated the digital preservation of family tree archives (CEDIG project).", zodiacSign: "Scorpio", birthYear: 1975, birthDate: "1975-11-04", deathDate: "Present", gender: "male", occupation: "Lead Systems Developer", education: "Science and Technology University of Mongolia", awards: ["National Innovation Award (2024)", "CEDIG Digital Design Medal"], notes: "Active workspace maintainer.", relationshipLabel: "DESCENDANT", verified: true, pendingOralHistory: false, fatherId: "2", motherId: "3" },
  { id: "5", firstName: "Narantuya", lastName: "Ganbold", surname: "Ganbold", clanName: "Sartuul", birthPlace: "Ulaanbaatar", biography: "Independent researcher of linguistics and historic folklore. Recorded key interviews regarding the Sartuul folk songs.", zodiacSign: "Cancer", birthYear: 1978, birthDate: "1978-07-20", deathDate: "Present", gender: "female", occupation: "Linguist & Philologist", education: "State Pedagogical University", notes: "Documented early-mid 20th century poetry of the clan.", relationshipLabel: "DESCENDANT", verified: false, pendingOralHistory: true, fatherId: "2", motherId: "3" },
  { id: "6", firstName: "Bolormaa", lastName: "Batmunkh", surname: "Batmunkh", clanName: "Sartuul", birthPlace: "Darkhan", biography: "Young descendant expressing active interest in conserving heritage and translating the ancient records to young school children.", zodiacSign: "Pisces", birthYear: 2005, birthDate: "2005-03-12", deathDate: "Present", gender: "female", occupation: "Undergrad Student", notes: "Supplements digital interface uploads with scanned translations.", relationshipLabel: "DESCENDANT", verified: true, pendingOralHistory: false, fatherId: "4" },
];

export interface PersonSlice {
  people: Person[];
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
}

export const createPersonSlice: StateCreator<PersonSlice, [], [], PersonSlice> = (set) => ({
  people: initialPeople,
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
});
