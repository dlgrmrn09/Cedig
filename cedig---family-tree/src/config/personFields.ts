import type { PersonFormData } from "@/src/types/personFormData";

export type PersonFieldKey = keyof PersonFormData;

export interface PersonFieldConfig {
  key: PersonFieldKey;
  label: string;
  type: "text" | "number" | "textarea" | "select" | "toggle";
  required?: boolean;
  placeholder?: string;
  section: string;
}

export type PersonSection = {
  id: string;
  label: string;
  fields: PersonFieldConfig[];
};

export const PERSON_FIELDS: PersonFieldConfig[] = [
  {
    key: "firstName",
    label: "Овог",
    type: "text",
    required: true,
    placeholder: "First Name",
    section: "personal",
  },
  {
    key: "lastName",
    label: "Нэр",
    type: "text",
    required: true,
    placeholder: "Last Name",
    section: "personal",
  },
  {
    key: "clanName",
    label: "Ургийн овог",
    type: "text",
    required: true,
    placeholder: "---",
    section: "personal",
  },
  {
    key: "gender",
    label: "Хүйс",
    type: "select",
    required: true,
    section: "personal",
  },
  {
    key: "birthDate",
    label: "Төрсөн огноо",
    type: "text",
    required: true,
    placeholder: "---",
    section: "personal",
  },
  {
    key: "deathDate",
    label: "Таалал төгссөн",
    type: "text",
    placeholder: "---",
    section: "personal",
  },
  {
    key: "zodiacSign",
    label: "Жил",
    type: "text",
    required: true,
    placeholder: "---",
    section: "personal",
  },
  {
    key: "birthPlace",
    label: "Төрсөн газар",
    required: true,
    type: "text",
    placeholder: "---",
    section: "personal",
  },
  {
    key: "residence",
    label: "Оршин суугаа газар",
    type: "text",
    placeholder: "---",
    section: "personal",
  },
  {
    key: "citizenship",
    label: "Иргэншил",
    type: "text",
    placeholder: "---",
    section: "personal",
  },
  {
    key: "phone",
    label: "Утас",
    type: "text",
    placeholder: "---",
    section: "personal",
  },
  {
    key: "email",
    label: "Email",
    type: "text",
    placeholder: "---",
    section: "personal",
  },
  {
    key: "occupation",
    label: "Мэргэжил",
    type: "text",
    placeholder: "---",
    section: "career",
  },
  {
    key: "education",
    label: "Боловсрол",
    type: "text",
    placeholder: "---",
    section: "career",
  },
  {
    key: "title",
    label: "Цол зэрэг",
    type: "text",
    placeholder: "---",
    section: "career",
  },
  {
    key: "employment",
    label: "Ажил эрхлэлт",
    type: "text",
    placeholder: "---",
    section: "career",
  },
  {
    key: "biography",
    label: "Намтар",
    type: "textarea",
    required: true,
    placeholder: "...",
    section: "career",
  },
  {
    key: "notes",
    label: "Тэмдэглэл",
    type: "textarea",
    placeholder: "...",
    section: "career",
  },
];

function getFieldsBySection(sectionId: string): PersonFieldConfig[] {
  return PERSON_FIELDS.filter((f) => f.section === sectionId);
}

export const PERSON_SECTIONS: PersonSection[] = [
  {
    id: "personal",
    label: "Хувийн мэдээлэл",
    fields: getFieldsBySection("personal"),
  },
  {
    id: "career",
    label: "Амьдралын замнал",
    fields: getFieldsBySection("career"),
  },
];
