"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useAppStore } from "@/lib/store";
import { X, Trash2, FileText, Copy, Focus } from "lucide-react";
import type { Person } from "@/src/types/person";
import { createMedia, fetchMediaForPerson } from "@/src/services/mediaService";
import ShastirBook from "./ShastirBook";
import EditPersonModal from "./EditPersonModal";
import ImageLightbox from "./ImageLightbox";
import DocumentPreview from "./DocumentPreview";
import { UploadDialog } from "@/src/components/shared/UploadDialog";

const FALLBACK_AVATAR = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect fill='%23ddd' width='120' height='120'/%3E%3Ctext fill='%23999' font-family='sans-serif' font-size='14' dy='.35em' text-anchor='middle' x='60' y='60'%3E?%3C/text%3E%3C/svg%3E";

const getMongolianYearAnimal = (year: number) => {
  const animals = ["Бич", "Тахиа", "Нохой", "Гахай", "Хулгана", "Үхэр", "Бар", "Туулай", "Луу", "Могой", "Морь", "Хонь"];
  return animals[year % 12];
};

export default function BiographyView() {
  const {
    people,
    activePersonId,
    setActivePersonId,
    editPersonAsync,
    deletePersonAsync,
    setAddingRelation,
    addNotification,
    media,
    addMediaItem,
    deleteMediaItem,
    mergePersonMedia,
    familyTreeId,
    trees,
  } = useAppStore();

  const currentTree = trees.find((t) => t.id === familyTreeId);
  const canDelete = currentTree?.role === "Owner" || currentTree?.role === "Admin";

  const [isEditing, setIsEditing] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeUploadType, setActiveUploadType] = useState<"photo" | "document" | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; label: string; year: string } | null>(null);
  const [docPreview, setDocPreview] = useState<{ title: string; url: string } | null>(null);

  const loadedPersonIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!activePersonId || !familyTreeId || activePersonId === loadedPersonIdRef.current) return;
    loadedPersonIdRef.current = activePersonId;

    fetchMediaForPerson(activePersonId, familyTreeId)
      .then((items) => {
        console.log("[BIOGRAPHY] Fetched person media", { personId: activePersonId, count: items.length, items: items.map((i) => ({ id: i.id, type: i.type, url: i.url })) });
        mergePersonMedia(items);
      })
      .catch((err) => {
        console.error("[BIOGRAPHY] Failed to fetch person media", err);
      });
  }, [activePersonId, familyTreeId, mergePersonMedia]);

  const activePerson = activePersonId ? people.find((p) => p.id === activePersonId) : null;
  const activePersonMedia = useMemo(() => media.filter((m) => m.personId === activePersonId), [media, activePersonId]);

  const scrapbookPics = useMemo(() => {
    return activePersonMedia
      .filter((m) => m.type === "photo")
      .map((m) => ({
        id: m.id,
        url: m.url,
        label: m.title,
        year: m.uploadedAt,
        isDynamic: true,
      }));
  }, [activePersonMedia]);

  const documentsArchive = useMemo(() => {
    return activePersonMedia
      .filter((m) => m.type === "document" || m.type === "certificate")
      .map((m) => ({
        id: m.id,
        title: m.title,
        desc: m.description,
        fileType: m.type === "certificate" ? "CERT" : "DOC",
        size: "—",
        url: m.url,
        isDynamic: true,
      }));
  }, [activePersonMedia]);

  if (!activePerson || !activePersonId) return null;

  const age = activePerson.deathDate
    ? parseInt(activePerson.deathDate) - activePerson.birthYear
    : new Date().getFullYear() - activePerson.birthYear;
  const animalYear = getMongolianYearAnimal(activePerson.birthYear);
  const firstPhotoUrl = activePersonMedia.find((m) => m.type === "photo")?.url;
  const portraitUrl = activePerson.avatarUrl || firstPhotoUrl || FALLBACK_AVATAR;

  const relationships = {
    father: people.find((p) => p.id === activePerson.fatherId),
    mother: people.find((p) => p.id === activePerson.motherId),
    spouse: activePerson.spouseId ? people.find((p) => p.id === activePerson.spouseId) : undefined,
    children: people.filter((p) => p.fatherId === activePersonId || p.motherId === activePersonId),
  };

  const handleSaveChanges = async (id: string, data: Partial<Person>) => {
    if (!familyTreeId) return;
    setEditing(true);
    try {
      await editPersonAsync(familyTreeId, id, data);
      setIsEditing(false);
      addNotification("success", "Profile Updated", `${data.firstName || "Person"}'s record saved.`);
    } catch (err) {
      addNotification("warn", "Update Failed", err instanceof Error ? err.message : "Could not update person.");
    } finally {
      setEditing(false);
    }
  };

  const handleDeleteRecord = async () => {
    if (!familyTreeId) return;
    if (!window.confirm(`Are you sure you want to delete ${activePerson.firstName} ${activePerson.lastName}? This action cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deletePersonAsync(familyTreeId, activePersonId);
      addNotification("warn", "Record Deleted", `${activePerson.firstName}'s record permanently removed.`);
    } catch (err) {
      addNotification("warn", "Delete Failed", err instanceof Error ? err.message : "Could not delete person.");
    } finally {
      setDeleting(false);
    }
  };

  const handleCopyProfile = () => {
    navigator.clipboard.writeText(`${activePerson.firstName} ${activePerson.lastName} · ${activePerson.clanName} · b. ${activePerson.birthYear}`);
    addNotification("info", "Copied", "Profile data copied to clipboard.");
  };

  const handleUpload = async (data: { title: string; description: string; url: string; file: File }) => {
    if (!activePersonId || !familyTreeId) return;
    try {
      console.log("[UPLOAD] Calling createMedia", { personId: activePersonId, treeId: familyTreeId, title: data.title, fileName: data.file.name, fileSize: data.file.size });
      const mediaItem = await createMedia(familyTreeId, {
        personId: activePersonId,
        title: data.title,
        description: data.description || "",
        type: activeUploadType === "photo" ? "photo" : "document",
        url: "",
        file: data.file,
      });
      console.log("[UPLOAD] Upload response", { id: mediaItem.id, url: mediaItem.url, type: mediaItem.type });
      addMediaItem(mediaItem);

      if (activeUploadType === "photo" && !activePerson.avatarUrl) {
        console.log("[UPLOAD] Setting as profile photo - no avatar exists");
        await editPersonAsync(familyTreeId, activePersonId, { avatarUrl: mediaItem.url });
        console.log("[UPLOAD] Profile photo set", { avatarUrl: mediaItem.url });
      }

      setActiveUploadType(null);
      addNotification("success", "Амжилттай", `${activeUploadType === "photo" ? "Зураг" : "Баримт"} амжилттай нэмэгдлээ.`);
    } catch (err) {
      console.error("[UPLOAD] Failed", err);
      addNotification("warn", "Алдаа", err instanceof Error ? err.message : "Upload failed.");
    }
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
          canDelete={canDelete}
          addNotification={addNotification}
          setActiveUploadType={setActiveUploadType}
          setDocPreview={setDocPreview}
          setLightboxImage={setLightboxImage}
          setActivePersonId={setActivePersonId}
          age={age}
          animalYear={animalYear}
          portraitUrl={portraitUrl}
        />

        <div className="bg-[#24150D] h-14 md:h-full md:w-16 flex flex-row md:flex-col items-center justify-around md:justify-start md:py-4 gap-1 px-2 shrink-0">
          <button onClick={() => setActivePersonId(null)} className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer" title="Close">
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <hr className="hidden md:block w-8 border-white/10" />
          <button onClick={() => setIsEditing(true)} className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer" title="Edit" disabled={editing}>
            <FileText className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button onClick={handleFocusOnTree} className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer" title="Focus on tree">
            <Focus className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button onClick={handleCopyProfile} className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition cursor-pointer" title="Copy profile">
            <Copy className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          {canDelete && (
            <button onClick={handleDeleteRecord} disabled={deleting} className="p-2 rounded-xl hover:bg-white/10 text-white/60 hover:text-red-400 transition md:mt-auto cursor-pointer" title="Delete">
              <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          )}
        </div>
      </div>

      <EditPersonModal open={isEditing} onClose={() => setIsEditing(false)} person={activePerson} onSave={handleSaveChanges} />
      <UploadDialog open={!!activeUploadType} onClose={() => setActiveUploadType(null)} type={activeUploadType ?? "photo"} onUpload={handleUpload} />
      <ImageLightbox open={!!lightboxImage} onClose={() => setLightboxImage(null)} image={lightboxImage} />
      <DocumentPreview open={!!docPreview} onClose={() => setDocPreview(null)} doc={docPreview} />
    </div>
  );
}
