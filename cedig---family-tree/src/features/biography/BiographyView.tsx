"use client";

import React, { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { X, Trash2, FileText, Copy, Focus } from "lucide-react";
import type { Person } from "@/src/types/person";
import type { ScrapbookPic, DocumentItem } from "@/src/types/media";
import ShastirBook from "./ShastirBook";
import EditPersonModal from "./EditPersonModal";
import ImageLightbox from "./ImageLightbox";
import DocumentPreview from "./DocumentPreview";
import { UploadDialog } from "@/src/components/shared/UploadDialog";

const PORTRAITS = {
  maleElder: "https://lh3.googleusercontent.com/aida-public/AB6AXuDRhH5YnNp71ctJ3h4DongL33owfDQmSMnYtOGGAN-UdIDr99iTgshhEcduqZpF15ulKCQwy6wq6wEDUZK8qcDXkzYQbW_rKlSKQ689lw0Nw1_31NdKnyG6xr0n0RYMqDKcQz2QjshQn78vtU97vWH2jjTm6rTiGmDf-NzNGVsQPyUT42D4Zedn7Zaq35asQd-giaOrrAXorxI1ULoZgKluZaG62PoRdImXVpP3btSVPX2Dzc69cXkBNTD97y7BqvL2Z21lkHrADhzS",
  femaleElder: "https://lh3.googleusercontent.com/aida-public/AB6AXuCq_iAaRu1aNA95cQ49h8bP5pVCh8o_7bZTttoxE6tAbPRl8rw2y0I9kosVu48OBdBjprJPapbTtxevsmYO9LuTV0sep9gkQcR-mC7Td-7mczd_poMpCxorVrju2xzNpUUqE7BinP6zH8hFgWinCVSY6v2-Rza--JkjAXn1Np8XqL6DQjo_YEmiOPbPM3N1hVmzjYE-z2qDrdhycgkM-qD-ZH-cZZzH49M4EAhv4EbnXhbsIhuhNr3_zKZTYtXgLtIfY9lMw72GyeyP",
  maleYoung: "https://lh3.googleusercontent.com/aida-public/AB6AXuBylTWL_AYkEgQKPA4BdgfQqBKnKUQU3cyN-SRli5IvV1ly-P94ESuBVvDdjesKeNjTPuS5L7CbDvk2ElLIjn49GJC2CorOrhQcL9xdXCaOX5v84EZWi72x2cmKAiIhgr8DkxF8z0wXyOqEyOx8wIFIg8fpfYl-zqo4iXK7qd6TShtGa2h-uENwy4Exv4bqH5f-rrR-BSpaTN5BJM6yHv5idQGIM3VKIGxs8koEJa9np8ZThGXGMdeO4qBKnaNnvkGQk9zmVuBfDV4s",
  femaleYoung: "https://lh3.googleusercontent.com/aida-public/AB6AXuBgCGTA1g1rlJw9evbCL1OqZ1WEswhDDA4yv-89PQ_Y9HkGHwv3OqLBoISsegXWzK6ZybFxC1sd6i6ZlyP7A35if9pThBxYoaPyWRNBVQnQukKbWvISfvm9Xlkb2ZOSKgqrF5BD2gqek934mKweOZ74uRupfAq8VLG1IaDCLv3wHkWlPJK8WZ0pmfDTjzvMJ9ml6jTjC9M8uHgD2Yd0LJAz02zgf_5T-c7zLC2mc1VcPKzRCmef2XV9vPrKBuOBOpzmUlkcoB-YLwmB",
};

const SCRAPBOOK_PICS: ScrapbookPic[] = [
  { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDeyVtj0H1lRQBIzjwyYTKI_nSrNGne9bOUcOLuoaxprxYHJu48-HHsAyNoAhEzMY9UWP1uF5jXRcR43-SaJ1yox9-MQlmQ8TsXPyJgDMuG0XOKt4hhxGj7kARq5KYpTRlvlRW2qWp0rT3EcMriSFNVLGzCWj-G_OfGK4G5nBTd3BCxJhI-MJWhb-nDFpnF-RRiUGBfc3FtaTEPUIODvuwMckgMCS9Hxp36ZTzfMrLHZXtsbol1Uk83gdDWt_f5BbSNO-JU7BX2AbMc", label: "Тал нутаг дахь гэр бүл", year: "1962 он" },
  { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyYeox4Qyf3uKRo6e-iTfGMMHJWFH0jNtvW7iJPdxOGTItnlNph1Gfh3A_eSXh--OzYopfTQeYQG8qik3OVsnIt6vjL1vitcWbRUJm_ytFUz8BaRBcPyQUNZzb4JXxHrI8coYWLCo7xT03z9Btkbgyxzvx-GfWvqQmOUJGzLezWBFvAH-815dzileunjzyjOiH-r2LZOuwThKx2xOdpH_ZU98FRbWLAYakbWKn9ws4zAw0M3n_xf9iuwW18c7M8AJii5SD4DgGfkC_", label: "Гэр дотор сууршил", year: "1978 он" },
  { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKV1zmUhmviuSG4_8lqq1Pe8AqBWHG9kTQ2Y7BnO0vq7FwqgGBqh6T4T2icFiPkZ5Q05OCfugnJbWZk-y41UykjcMHUcFFKOTKOWGUPHMlSvuV-uXc_m8NrE1rYpQ1aZCDqkiknU7b0hhJEato18oiisOVhCd1ZclE_deLA3d_d4UcaZfK8Q_y6jumM40wVhUyvxmMdgPtQSESocaQuuLWevlkdcga4sSq8glL9TXJJGYL917EJ2HZ8z4ZhvL0M4j5A7ySivxt73ne", label: "Уудам талын хурдан хүлэгтнүүд", year: "1985 он" },
  { url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCkRQvxqs3kVUPR6UaPqK6PO8t6EyO1K6itZi7G1Aa9lbWqsSmEzqeb0rGuiOVQTzk_EuzzMRKpnOYp5AXFeZE_n8giIqfVtj0kLgmqmrbRv068_lnCs1cREbejQgLckX3nmH1iVVnib73tO8P_cDFCtnhw-W_AIW-sutV9lvxROkxnzM_qZeGDasukU3Ytgqx327ututrm2KBJ7u4CkjF_zgw8v5TcCGMI25D031QH9dbAjEH7c7o2Ebz4VkNcNJ8N-4gCbHDZ6Lf", label: "Түүхэн судар бичиг баригч", year: "1955 он" },
];

const DOCUMENTS_ARCHIVE: DocumentItem[] = [
  { id: "birth_cert", title: "Төрсний бүртгэлийн хуулбар (Birth Certificate)", desc: "1945 он, Архангай аймгийн гэрчилгээ", fileType: "IMAGE", size: "1.2 MB", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCkRQvxqs3kVUPR6UaPqK6PO8t6EyO1K6itZi7G1Aa9lbWqsSmEzqeb0rGuiOVQTzk_EuzzMRKpnOYp5AXFeZE_n8giIqfVtj0kLgmqmrbRv068_lnCs1cREbejQgLckX3nmH1iVVnib73tO8P_cDFCtnhw-W_AIW-sutV9lvxROkxnzM_qZeGDasukU3Ytgqx327ututrm2KBJ7u4CkjF_zgw8v5TcCGMI25D031QH9dbAjEH7c7o2Ebz4VkNcNJ8N-4gCbHDZ6Lf" },
  { id: "marriage_cert", title: "Гэрлэлтийн баталгааны гэрчилгээ (Marriage Certificate)", desc: "1966 оны түүхэн бүртгэл скан", fileType: "PDF", size: "3.4 MB", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCKV1zmUhmviuSG4_8lqq1Pe8AqBWHG9kTQ2Y7BnO0vq7FwqgGBqh6T4T2icFiPkZ5Q05OCfugnJbWZk-y41UykjcMHUcFFKOTKOWGUPHMlSvuV-uXc_m8NrE1rYpQ1aZCDqkiknU7b0hhJEato18oiisOVhCd1ZclE_deLA3d_d4UcaZfK8Q_y6jumM40wVhUyvxmMdgPtQSESocaQuuLWevlkdcga4sSq8glL9TXJJGYL917EJ2HZ8z4ZhvL0M4j5A7ySivxt73ne" },
  { id: "lineage_scroll", title: "Мэнгэ шүтээний угийн тэмдэглэл (Lineage Scroll)", desc: "Уламжлалт зурхайн товчоон", fileType: "IMAGE", size: "4.8 MB", url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCyYeox4Qyf3uKRo6e-iTfGMMHJWFH0jNtvW7iJPdxOGTItnlNph1Gfh3A_eSXh--OzYopfTQeYQG8qik3OVsnIt6vjL1vitcWbRUJm_ytFUz8BaRBcPyQUNZzb4JXxHrI8coYWLCo7xT03z9Btkbgyxzvx-GfWvqQmOUJGzLezWBFvAH-815dzileunjzyjOiH-r2LZOuwThKx2xOdpH_ZU98FRbWLAYakbWKn9ws4zAw0M3n_xf9iuwW18c7M8AJii5SD4DgGfkC_" },
];

const getMongolianYearAnimal = (year: number) => {
  const animals = ["Бич", "Тахиа", "Нохой", "Гахай", "Хулгана", "Үхэр", "Бар", "Туулай", "Луу", "Могой", "Морь", "Хонь"];
  return animals[year % 12];
};

const getPortraitByAgeAndGender = (gender: "male" | "female", birthYear: number) => {
  const isElderly = birthYear < 1960;
  if (gender === "female") return isElderly ? PORTRAITS.femaleElder : PORTRAITS.femaleYoung;
  return isElderly ? PORTRAITS.maleElder : PORTRAITS.maleYoung;
};

export default function BiographyView() {
  const {
    people,
    activePersonId,
    setActivePersonId,
    editPerson,
    deletePerson,
    setAddingRelation,
    addNotification,
    media,
    addMediaItem,
    deleteMediaItem,
  } = useAppStore();

  const [isEditing, setIsEditing] = useState(false);
  const [activeUploadType, setActiveUploadType] = useState<"photo" | "document" | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; label: string; year: string } | null>(null);
  const [docPreview, setDocPreview] = useState<{ title: string; url: string } | null>(null);

  const activePerson = activePersonId ? people.find((p) => p.id === activePersonId) : null;
  const activePersonMedia = useMemo(() => media.filter((m) => m.personId === activePersonId), [media, activePersonId]);

  const scrapbookPics = useMemo(() => {
    const storePhotos = activePersonMedia.filter((m) => m.type === "photo").map((m) => ({
      id: m.id, url: m.url, label: m.title, year: m.uploadedAt, isDynamic: true,
    }));
    return [...SCRAPBOOK_PICS, ...storePhotos];
  }, [activePersonMedia]);

  const documentsArchive = useMemo(() => {
    const storeDocs = activePersonMedia.filter((m) => m.type === "document" || m.type === "certificate").map((m) => ({
      id: m.id, title: m.title, desc: m.description, fileType: m.type === "certificate" ? "CERT" : "DOC", size: "—", url: m.url, isDynamic: true,
    }));
    return [...DOCUMENTS_ARCHIVE, ...storeDocs];
  }, [activePersonMedia]);

  if (!activePerson || !activePersonId) return null;

  const age = activePerson.deathDate && activePerson.deathDate !== "Present"
    ? parseInt(activePerson.deathDate) - activePerson.birthYear
    : new Date().getFullYear() - activePerson.birthYear;
  const animalYear = getMongolianYearAnimal(activePerson.birthYear);
  const portraitUrl = getPortraitByAgeAndGender(activePerson.gender, activePerson.birthYear);

  const relationships = {
    father: people.find((p) => p.id === activePerson.fatherId),
    mother: people.find((p) => p.id === activePerson.motherId),
    spouse: activePerson.spouseId ? people.find((p) => p.id === activePerson.spouseId) : undefined,
    children: people.filter((p) => p.fatherId === activePersonId || p.motherId === activePersonId),
  };

  const handleSaveChanges = (id: string, data: Partial<Person>) => {
    editPerson(id, data);
    setIsEditing(false);
    addNotification("success", "Profile Updated", `${data.firstName || "Person"}'s record saved.`);
  };

  const handleDeleteRecord = () => {
    if (window.confirm(`Are you sure you want to delete ${activePerson.firstName} ${activePerson.lastName}?`)) {
      deletePerson(activePersonId);
      addNotification("warn", "Record Deleted", `${activePerson.firstName}'s record permanently removed.`);
    }
  };

  const handleCopyProfile = () => {
    navigator.clipboard.writeText(`${activePerson.firstName} ${activePerson.lastName} · ${activePerson.clanName} · b. ${activePerson.birthYear}`);
    addNotification("info", "Copied", "Profile data copied to clipboard.");
  };

  const handleUpload = (data: { title: string; description: string; url: string }) => {
    if (!activePersonId) return;
    addMediaItem({
      personId: activePersonId,
      title: data.title,
      description: data.description || "",
      type: activeUploadType === "photo" ? "photo" : "document",
      url: data.url,
    });
    setActiveUploadType(null);
    addNotification("success", "Амжилттай", `${activeUploadType === "photo" ? "Зураг" : "Баримт"} амжилттай нэмэгдлээ.`);
  };

  const handleFocusOnTree = () => {
    setActivePersonId(null);
  };

  return (
    <div id="book-modal-portal" className="fixed inset-0 z-[110] flex items-center justify-center bg-[#090705]/95">
      <div className="absolute inset-0 z-0" onClick={() => setActivePersonId(null)} />
      <div className="relative z-10 w-full max-w-[1240px] h-full md:h-[780px] lg:h-[820px] flex items-center justify-center p-2 md:p-0 box-border">
        <ShastirBook
          activePerson={activePerson}
          scrapbookPics={scrapbookPics}
          documentsArchive={documentsArchive}
          relationships={relationships}
          setAddingRelation={setAddingRelation}
          deleteMediaItem={deleteMediaItem}
          addNotification={addNotification}
          setActiveUploadType={setActiveUploadType}
          setDocPreview={setDocPreview}
          setLightboxImage={setLightboxImage}
          age={age}
          animalYear={animalYear}
          portraitUrl={portraitUrl}
        />

        <div className="bg-[#24150D] h-14 md:h-full md:w-16 flex flex-row md:flex-col items-center justify-around md:justify-start md:py-4 gap-1 px-2 shrink-0">
          <button onClick={() => setActivePersonId(null)} className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer" title="Close">
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <hr className="hidden md:block w-8 border-white/10" />
          <button onClick={() => setIsEditing(true)} className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer" title="Edit">
            <FileText className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button onClick={handleFocusOnTree} className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer" title="Focus on tree">
            <Focus className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button onClick={handleCopyProfile} className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer" title="Copy profile">
            <Copy className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button onClick={handleDeleteRecord} className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-red-400 transition md:mt-auto cursor-pointer" title="Delete">
            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>

      <EditPersonModal open={isEditing} onClose={() => setIsEditing(false)} person={activePerson} onSave={handleSaveChanges} />
      <UploadDialog open={!!activeUploadType} onClose={() => setActiveUploadType(null)} type={activeUploadType ?? "photo"} onUpload={handleUpload} />
      <ImageLightbox open={!!lightboxImage} onClose={() => setLightboxImage(null)} image={lightboxImage} />
      <DocumentPreview open={!!docPreview} onClose={() => setDocPreview(null)} doc={docPreview} />
    </div>
  );
}
