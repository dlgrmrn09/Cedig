"use client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MoveRight, Download, FileText, SearchIcon, FileSearch, ImageIcon } from "lucide-react";
import { useAppStore } from "@/src/store";
import { useMemo, useState, useEffect, useCallback } from "react";
import { Pagination, SearchInput, EmptyState } from "@/src/components/shared";
import { useDebounce } from "@/hooks/use-debounce";

const TreeCanvas = dynamic(() => import("@/src/features/tree/TreeCanvas"), { ssr: false });

const AccessManagement = dynamic(() => import("@/src/features/access/AccessManagement").then((m) => ({ default: m.AccessManagement })), { ssr: false });
const ActivityTimeline = dynamic(() => import("@/src/features/activity/ActivityTimeline").then((m) => ({ default: m.ActivityTimeline })), { ssr: false });
const SettingsView = dynamic(() => import("@/src/features/settings/SettingsView").then((m) => ({ default: m.SettingsView })), { ssr: false });
const SubscriptionsView = dynamic(() => import("@/src/features/subscriptions/SubscriptionsView").then((m) => ({ default: m.SubscriptionsView })), { ssr: false });
const AdminDashboard = dynamic(() => import("@/src/features/admin/AdminDashboard").then((m) => ({ default: m.AdminDashboard })), { ssr: false });

const PAGE_SIZE = 10;

function useTabUrlState(tabPrefix: string) {
  const qKey = `${tabPrefix}_q`;
  const pKey = `${tabPrefix}_page`;

  const getInitialQuery = () => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get(qKey) || "";
  };

  const getInitialPage = () => {
    if (typeof window === "undefined") return 1;
    const p = parseInt(new URLSearchParams(window.location.search).get(pKey) || "1", 10);
    return isNaN(p) ? 1 : p;
  };

  const [query, setQuery] = useState(getInitialQuery);
  const debouncedQuery = useDebounce(query, 400);
  const [page, setPageInternal] = useState(getInitialPage);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (debouncedQuery) {
      url.searchParams.set(qKey, debouncedQuery);
    } else {
      url.searchParams.delete(qKey);
      url.searchParams.delete(pKey);
    }
    if (page > 1) {
      url.searchParams.set(pKey, String(page));
    } else {
      url.searchParams.delete(pKey);
    }
    window.history.replaceState({}, "", url.toString());
  }, [debouncedQuery, page, qKey, pKey]);

  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);
    setPageInternal(1);
  }, []);

  const setPage = useCallback((p: number) => {
    setPageInternal(p);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return { query, setQuery: handleQueryChange, debouncedQuery, page, setPage };
}

function usePaginatedData<T>(data: T[], page: number, pageSize: number = PAGE_SIZE) {
  return useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;
    return {
      paginatedData: data.slice(start, start + pageSize),
      totalPages,
      totalItems: data.length,
    };
  }, [data, page, pageSize]);
}

function BiographySearch({ value, onChange, loading }: { value: string; onChange: (v: string) => void; loading: boolean }) {
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      placeholder="Намтар хайх (нэр, тодорхойлолт)..."
      loading={loading}
      className="w-full sm:w-72"
    />
  );
}

function PhotoSearch({ value, onChange, loading }: { value: string; onChange: (v: string) => void; loading: boolean }) {
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      placeholder="Зураг хайх (гарчиг, тайлбар)..."
      loading={loading}
      className="w-full sm:w-72"
    />
  );
}

function DocumentSearch({ value, onChange, loading }: { value: string; onChange: (v: string) => void; loading: boolean }) {
  return (
    <SearchInput
      value={value}
      onChange={onChange}
      placeholder="Баримт хайх (гарчиг, тайлбар)..."
      loading={loading}
      className="w-full sm:w-72"
    />
  );
}

export function WorkspaceContent() {
  const router = useRouter();
  const { activeWorkspaceTab, people, media, setActivePersonId } = useAppStore();

  const bioSearch = useTabUrlState("bio");
  const photoSearch = useTabUrlState("photo");
  const docSearch = useTabUrlState("doc");

  const biographiesList = useMemo(() => people, [people]);
  const photoArchives = useMemo(() => media.filter((m) => m.type === "photo"), [media]);
  const documentCabinet = useMemo(() => media.filter((m) => m.type !== "photo"), [media]);

  const filteredBiographies = useMemo(() => {
    const q = bioSearch.debouncedQuery.trim().toLowerCase();
    if (!q) return biographiesList;
    return biographiesList.filter((p) => {
      const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
      const bio = (p.biography || "").toLowerCase();
      const clan = (p.clanName || "").toLowerCase();
      const occupation = (p.occupation || "").toLowerCase();
      const awards = (p.awards || []).join(" ").toLowerCase();
      const education = (p.education || "").toLowerCase();
      return fullName.includes(q) || bio.includes(q) || clan.includes(q) || occupation.includes(q) || awards.includes(q) || education.includes(q);
    });
  }, [biographiesList, bioSearch.debouncedQuery]);

  const filteredPhotos = useMemo(() => {
    const q = photoSearch.debouncedQuery.trim().toLowerCase();
    if (!q) return photoArchives;
    return photoArchives.filter((ph) => {
      const title = (ph.title || "").toLowerCase();
      const desc = (ph.description || "").toLowerCase();
      const owner = people.find((p) => p.id === ph.personId);
      const ownerName = owner ? `${owner.firstName} ${owner.lastName}`.toLowerCase() : "";
      const type = (ph.type || "").toLowerCase();
      return title.includes(q) || desc.includes(q) || ownerName.includes(q) || type.includes(q);
    });
  }, [photoArchives, photoSearch.debouncedQuery, people]);

  const filteredDocuments = useMemo(() => {
    const q = docSearch.debouncedQuery.trim().toLowerCase();
    if (!q) return documentCabinet;
    return documentCabinet.filter((dc) => {
      const title = (dc.title || "").toLowerCase();
      const desc = (dc.description || "").toLowerCase();
      const type = (dc.type || "").toLowerCase();
      const owner = people.find((p) => p.id === dc.personId);
      const ownerName = owner ? `${owner.firstName} ${owner.lastName}`.toLowerCase() : "";
      return title.includes(q) || desc.includes(q) || type.includes(q) || ownerName.includes(q);
    });
  }, [documentCabinet, docSearch.debouncedQuery, people]);

  const { paginatedData: paginatedBio, totalPages: bioPages, totalItems: bioTotal } = usePaginatedData(filteredBiographies, bioSearch.page);
  const { paginatedData: paginatedPhotos, totalPages: photoPages, totalItems: photoTotal } = usePaginatedData(filteredPhotos, photoSearch.page);
  const { paginatedData: paginatedDocs, totalPages: docPages, totalItems: docTotal } = usePaginatedData(filteredDocuments, docSearch.page);

  const isSearchingBio = bioSearch.query !== bioSearch.debouncedQuery;
  const isSearchingPhoto = photoSearch.query !== photoSearch.debouncedQuery;
  const isSearchingDoc = docSearch.query !== docSearch.debouncedQuery;

  return (
    <div className="flex-grow overflow-auto relative bg-[#f7f4ec]">
      <div className={`absolute inset-0 z-0 ${activeWorkspaceTab === "tree" ? "block" : "hidden"}`}>
        <TreeCanvas />
      </div>

      <div className={`${activeWorkspaceTab === "tree" ? "hidden" : "p-4 sm:p-6 lg:p-8 relative z-10"}`}>
        {activeWorkspaceTab === "biographies" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-display font-bold">Намтар</h2>
              <BiographySearch value={bioSearch.query} onChange={bioSearch.setQuery} loading={isSearchingBio} />
            </div>
            {filteredBiographies.length === 0 ? (
              <EmptyState
                icon={<SearchIcon className="w-10 h-10" />}
                title="Намтар олдсонгүй."
                description={bioSearch.debouncedQuery ? `"${bioSearch.debouncedQuery}" хайлтаар тохирох намтар байхгүй байна.` : "Одоогоор бүртгэгдсэн намтар байхгүй байна."}
              />
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedBio.map((p) => (
                    <div key={p.id} className="bg-white rounded-2xl border border-stone-150 p-6 flex flex-col justify-between hover:shadow-lg transition space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-display font-bold text-lg text-ink">{p.firstName} {p.lastName}</h3>
                        <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed italic">
                          &ldquo;{p.biography || "Товч намтар хараахан тэмдэглэгдээгүй байна."}&rdquo;
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-bold pt-4 border-t border-stone-100">
                        <span className="text-stone-400">Төрсөн он: {p.birthYear}</span>
                        <button onClick={() => { setActivePersonId(p.id); router.push("/family-tree"); }} className="flex items-center gap-1 bg-pine text-vellum px-3.5 py-1.5 rounded shadow-sm text-xs font-bold hover:bg-opacity-95">
                          Read <MoveRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {bioTotal > PAGE_SIZE && (
                  <div className="flex items-center justify-between pt-4 text-xs text-stone-400">
                    <span>Нийт {bioTotal} намтар</span>
                    <Pagination currentPage={bioSearch.page} totalPages={bioPages} onPageChange={bioSearch.setPage} />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeWorkspaceTab === "photos" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-display font-bold">Гэрэл зургийн цомог</h2>
              <PhotoSearch value={photoSearch.query} onChange={photoSearch.setQuery} loading={isSearchingPhoto} />
            </div>
            {filteredPhotos.length === 0 ? (
              <EmptyState
                icon={<ImageIcon className="w-10 h-10" />}
                title="Зураг олдсонгүй."
                description={photoSearch.debouncedQuery ? `"${photoSearch.debouncedQuery}" хайлтаар тохирох зураг байхгүй байна.` : "Одоогоор цомогт зураг байхгүй байна."}
              />
            ) : (
              <>
                <div className="grid sm:grid-cols-3 gap-6">
                  {paginatedPhotos.map((ph) => {
                    const owner = people.find((p) => p.id === ph.personId);
                    return (
                      <div key={ph.id} className="bg-white rounded-2xl overflow-hidden border border-stone-200 group relative shadow-md">
                        <div className="relative h-48 w-full bg-[#ebdcb9]/40 border-b">
                          <Image src={ph.url} alt={ph.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="p-4 space-y-2">
                          <p className="font-bold text-sm text-ink">{ph.title}</p>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-pine/5 text-ink block truncate font-bold">{owner ? `${owner.firstName} ${owner.lastName}` : "Овгийн архив"}</span>
                          <p className="text-xs text-stone-500 leading-tight">{ph.description}</p>
                          <div className="flex justify-between items-center border-t border-stone-100 pt-3 text-[11px] font-bold">
                            <span className="text-stone-400 font-normal">Хэмжээ: 2.4 MB</span>
                            <button onClick={() => { const link = document.createElement("a"); link.href = ph.url; link.download = ph.title; link.click(); }} className="text-bronze hover:underline flex items-center gap-1 cursor-pointer">
                              <Download className="w-3.5 h-3.5" /> Download
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {photoTotal > PAGE_SIZE && (
                  <div className="flex items-center justify-between pt-4 text-xs text-stone-400">
                    <span>Нийт {photoTotal} зураг</span>
                    <Pagination currentPage={photoSearch.page} totalPages={photoPages} onPageChange={photoSearch.setPage} />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeWorkspaceTab === "documents" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-display font-bold">Бичиг баримтууд</h2>
              <DocumentSearch value={docSearch.query} onChange={docSearch.setQuery} loading={isSearchingDoc} />
            </div>
            {filteredDocuments.length === 0 ? (
              <EmptyState
                icon={<FileSearch className="w-10 h-10" />}
                title="Баримт олдсонгүй."
                description={docSearch.debouncedQuery ? `"${docSearch.debouncedQuery}" хайлтаар тохирох баримт байхгүй байна.` : "Баримт хараахан хавсаргаагүй байна."}
              />
            ) : (
              <>
                <div className="grid sm:grid-cols-2 gap-6">
                  {paginatedDocs.map((dc) => {
                    const owner = people.find((p) => p.id === dc.personId);
                    return (
                      <div key={dc.id} className="bg-white p-5 border border-stone-200 rounded-2xl flex items-start gap-4 shadow-sm hover:border-bronze/35 transition">
                        <div className="w-12 h-12 rounded-xl bg-bronze/10 text-bronze flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className="space-y-2 flex-grow">
                          <div>
                            <p className="font-bold text-sm text-ink">{dc.title}</p>
                            <span className="text-[10px] text-stone-400 font-bold block pt-0.5">Суурь баримт • CSV / JPG скан</span>
                          </div>
                          <p className="text-xs text-stone-500">{dc.description}</p>
                          <div className="flex justify-between items-center text-[10px] border-t border-stone-100 pt-3">
                            <span className="font-bold text-bronze">Гэрчлэгч: {owner ? `${owner.firstName} ${owner.lastName}` : "Овгийн сан"}</span>
                            <button onClick={() => { const link = document.createElement("a"); link.href = dc.url; link.download = dc.title; link.click(); }} className="text-ink font-bold hover:underline flex items-center gap-1">
                              <Download className="w-3 text-emerald-600 inline mr-0.5" /> Download
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {docTotal > PAGE_SIZE && (
                  <div className="flex items-center justify-between pt-4 text-xs text-stone-400">
                    <span>Нийт {docTotal} баримт</span>
                    <Pagination currentPage={docSearch.page} totalPages={docPages} onPageChange={docSearch.setPage} />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeWorkspaceTab === "access" && <AccessManagement />}
        {activeWorkspaceTab === "activity" && <ActivityTimeline />}
        {activeWorkspaceTab === "settings" && <SettingsView />}
        {activeWorkspaceTab === "pricing" && <SubscriptionsView />}
        {activeWorkspaceTab === "admin" && <AdminDashboard />}
      </div>
    </div>
  );
}
