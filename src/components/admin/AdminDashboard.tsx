"use client";

import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LogOut,
  Upload,
  Eye,
  EyeOff,
  Star,
  Trash2,
  ExternalLink,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ImagePlus,
  MapPin,
  Mail,
  Instagram,
  Ruler,
  FileText,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { GalleryCategory, ModelImage, ModelProfile } from "@/lib/types";
import {
  uploadGalleryImageAction,
  toggleImageVisibilityAction,
  setHeroImageAction,
  updateImageCategoryAction,
  deleteGalleryImageAction,
  updateProfileAction,
  adminSignOutAction,
  ActionResult,
} from "@/actions/admin";

const CATEGORIES: GalleryCategory[] = [
  "Editorial",
  "Comercial",
  "Polaroids",
  "Pasarela",
];

interface AdminDashboardProps {
  profile: ModelProfile;
  adminUser: {
    email: string;
    name?: string | null;
    image?: string | null;
  };
}

export default function AdminDashboard({ profile, adminUser }: AdminDashboardProps) {
  const [isPending, startTransition] = useTransition();
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadCategory, setUploadCategory] = useState<GalleryCategory>("Editorial");
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadIsHero, setUploadIsHero] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Profile saving state
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const gallery: ModelImage[] = profile.gallery || [];
  const visibleCount = gallery.filter((img) => img.visible !== false).length;
  const hiddenCount = gallery.length - visibleCount;

  const getStatValue = (key: keyof NonNullable<ModelProfile["stats"]>) => {
    return profile.stats?.[key] || profile.measurements?.[key] || "";
  };

  const notify = (result: ActionResult) => {
    if (result.success) {
      setFeedback({ type: "success", text: result.message || "Operación completada." });
    } else {
      setFeedback({ type: "error", text: result.error || "Ocurrió un error inesperado." });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(file);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setFeedback({ type: "error", text: "Selecciona una fotografía primero." });
      return;
    }

    setIsUploading(true);
    setFeedback(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("category", uploadCategory);
      formData.append("alt", uploadAlt);
      formData.append("isHero", String(uploadIsHero));

      const res = await uploadGalleryImageAction(formData);
      notify(res);

      if (res.success) {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadAlt("");
        setUploadIsHero(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleVisibility = (imageKey: string, currentVisible: boolean) => {
    setBusyKey(imageKey);
    setFeedback(null);
    startTransition(async () => {
      const res = await toggleImageVisibilityAction(imageKey, currentVisible);
      notify(res);
      setBusyKey(null);
    });
  };

  const handleSetHero = (imageKey: string) => {
    setBusyKey(imageKey);
    setFeedback(null);
    startTransition(async () => {
      const res = await setHeroImageAction(imageKey);
      notify(res);
      setBusyKey(null);
    });
  };

  const handleCategoryChange = (imageKey: string, newCategory: string) => {
    setBusyKey(imageKey);
    setFeedback(null);
    startTransition(async () => {
      const res = await updateImageCategoryAction(imageKey, newCategory);
      notify(res);
      setBusyKey(null);
    });
  };

  const handleDelete = (imageKey: string) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que quieres eliminar esta fotografía permanentemente de la galería?"
    );
    if (!confirmed) return;

    setBusyKey(imageKey);
    setFeedback(null);
    startTransition(async () => {
      const res = await deleteGalleryImageAction(imageKey);
      notify(res);
      setBusyKey(null);
    });
  };

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setFeedback(null);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await updateProfileAction(formData);
      notify(res);
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/70 dark:border-zinc-800/70 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950">
              Admin
            </span>
            <h1 className="text-sm sm:text-base font-semibold tracking-wider uppercase truncate">
              {profile.name || "Agencia Portfolio"}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Admin identity */}
            <div className="hidden sm:flex items-center gap-2.5 pr-2 border-r border-zinc-200 dark:border-zinc-800">
              {adminUser.image && (
                <Image
                  src={adminUser.image}
                  alt={adminUser.name || adminUser.email}
                  width={28}
                  height={28}
                  className="rounded-full object-cover border border-zinc-200 dark:border-zinc-700"
                />
              )}
              <div className="flex flex-col text-right">
                <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200 leading-tight">
                  {adminUser.email}
                </span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                  Sesión activa
                </span>
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs uppercase tracking-wider font-medium rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-zinc-900 dark:hover:border-zinc-100 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Ver Web</span>
            </Link>

            <ThemeToggle />

            <form action={adminSignOutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs uppercase tracking-wider font-semibold rounded-full bg-zinc-100 dark:bg-zinc-900 hover:bg-red-50 dark:hover:bg-red-950/40 text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 border border-zinc-200/80 dark:border-zinc-800 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar sesión</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
        {/* Feedback Banner */}
        {feedback && (
          <div
            role="status"
            className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-sm transition-all ${
              feedback.type === "success"
                ? "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300"
                : "bg-red-50/80 dark:bg-red-950/30 border-red-200 dark:border-red-800/60 text-red-800 dark:text-red-300"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {feedback.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-xs uppercase tracking-wider opacity-70 hover:opacity-100 cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Section 1: Upload Zone */}
        <section className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white dark:bg-zinc-900/40 p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
              Nueva Fotografía
            </span>
            <h2 className="text-xl font-bold tracking-tight mt-1">
              Subir Imagen a la Galería
            </h2>
          </div>

          <form onSubmit={handleUploadSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* File Drop / Picker */}
            <div className="lg:col-span-5">
              <label
                htmlFor="gallery-upload-input"
                className="flex flex-col items-center justify-center w-full h-56 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-900 dark:hover:border-zinc-300 bg-zinc-50/70 dark:bg-zinc-950/50 cursor-pointer transition-colors overflow-hidden relative group"
              >
                {previewUrl ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Vista previa"
                      className="w-full h-full object-contain p-2"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs uppercase tracking-wider font-semibold">
                      Cambiar imagen
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center px-4">
                    <ImagePlus className="w-8 h-8 text-zinc-400 mb-3" />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Haz clic para seleccionar una fotografía
                    </span>
                    <span className="text-xs text-zinc-400 mt-1">
                      JPG, PNG o WebP • Alta resolución
                    </span>
                  </div>
                )}
                <input
                  id="gallery-upload-input"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            </div>

            {/* Metadata Controls */}
            <div className="lg:col-span-7 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="upload-category"
                    className="block text-xs uppercase tracking-widest font-semibold text-zinc-500 mb-2"
                  >
                    Categoría
                  </label>
                  <select
                    id="upload-category"
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as GalleryCategory)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="upload-alt"
                    className="block text-xs uppercase tracking-widest font-semibold text-zinc-500 mb-2"
                  >
                    Descripción / Alt (Opcional)
                  </label>
                  <input
                    id="upload-alt"
                    type="text"
                    value={uploadAlt}
                    onChange={(e) => setUploadAlt(e.target.value)}
                    placeholder="Ej: Editorial Vogue Primavera"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                  />
                </div>
              </div>

              <label className="inline-flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={uploadIsHero}
                  onChange={(e) => setUploadIsHero(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 accent-zinc-900 dark:accent-zinc-100"
                />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  Establecer directamente como <strong>Portada Principal (Hero)</strong>
                </span>
              </label>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isUploading || !selectedFile}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs uppercase tracking-widest font-semibold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Subiendo a Sanity...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Subir Fotografía</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </section>

        {/* Section 2: Gallery Management */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200/70 dark:border-zinc-800/70 pb-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
                Portafolio
              </span>
              <h2 className="text-xl font-bold tracking-tight mt-1">
                Gestión de Galería ({gallery.length})
              </h2>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-medium">
                {visibleCount} Visibles
              </span>
              <span className="px-3 py-1 rounded-full bg-zinc-200/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
                {hiddenCount} Ocultas
              </span>
            </div>
          </div>

          {gallery.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 text-zinc-500 text-sm">
              No hay fotografías cargadas en Sanity todavía. Usa el panel superior para subir la primera.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {gallery.map((img, idx) => {
                const key = img._key || "";
                const isVisible = img.visible !== false;
                const isHero = Boolean(img.isHero);
                const isCardBusy = isPending && busyKey === key;

                return (
                  <div
                    key={key || img.asset?._id || idx}
                    className={`rounded-xl border overflow-hidden bg-white dark:bg-zinc-900/50 transition-all flex flex-col ${
                      isHero
                        ? "border-amber-400/80 dark:border-amber-500/60 ring-1 ring-amber-400/30"
                        : "border-zinc-200/70 dark:border-zinc-800/70"
                    } ${!isVisible ? "opacity-75" : ""}`}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                      {img.asset?.url && (
                        <Image
                          src={img.asset.url}
                          alt={img.alt || "Foto de portafolio"}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className={`object-cover transition-all duration-300 ${
                            !isVisible ? "grayscale-[60%]" : ""
                          }`}
                        />
                      )}

                      {/* Status Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex flex-wrap items-center gap-1.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold backdrop-blur-md ${
                            isVisible
                              ? "bg-emerald-500/90 text-white"
                              : "bg-zinc-900/80 text-zinc-300"
                          }`}
                        >
                          {isVisible ? "Visible" : "Oculta"}
                        </span>

                        {img.category && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-black/65 text-white backdrop-blur-md">
                            {img.category}
                          </span>
                        )}

                        {isHero && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-amber-500 text-white shadow-xs">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            Hero
                          </span>
                        )}
                      </div>

                      {isCardBusy && (
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center">
                          <Loader2 className="w-6 h-6 text-white animate-spin" />
                        </div>
                      )}
                    </div>

                    {/* Controls */}
                    <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1 mb-2">
                          {img.alt || "Sin descripción"}
                        </p>

                        <select
                          aria-label="Cambiar categoría"
                          value={img.category || "Editorial"}
                          disabled={!key || isCardBusy}
                          onChange={(e) => handleCategoryChange(key, e.target.value)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-xs focus:outline-none"
                        >
                          {CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>
                              Categoría: {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 pt-1">
                        {/* Visibility Toggle */}
                        <button
                          type="button"
                          disabled={!key || isCardBusy}
                          onClick={() => handleToggleVisibility(key, isVisible)}
                          title={isVisible ? "Ocultar foto" : "Mostrar foto"}
                          className={`inline-flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer disabled:opacity-40 ${
                            isVisible
                              ? "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                              : "border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300"
                          }`}
                        >
                          {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{isVisible ? "Ocultar" : "Mostrar"}</span>
                        </button>

                        {/* Set Hero Button */}
                        <button
                          type="button"
                          disabled={!key || isCardBusy || isHero}
                          onClick={() => handleSetHero(key)}
                          title="Establecer como portada principal"
                          className={`inline-flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer disabled:cursor-default ${
                            isHero
                              ? "border-amber-400 bg-amber-500/15 text-amber-700 dark:text-amber-300"
                              : "border-zinc-200 dark:border-zinc-800 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 text-zinc-700 dark:text-zinc-300"
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${isHero ? "fill-current" : ""}`} />
                          <span>{isHero ? "Portada" : "Hero"}</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          disabled={!key || isCardBusy}
                          onClick={() => handleDelete(key)}
                          title="Eliminar fotografía"
                          className="inline-flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-[11px] font-medium border border-zinc-200 dark:border-zinc-800 hover:border-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer disabled:opacity-40"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Borrar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Section 3: Profile & Stats Form */}
        <section className="rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white dark:bg-zinc-900/40 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-zinc-400 font-semibold">
                Información Pública
              </span>
              <h2 className="text-xl font-bold tracking-tight mt-1">
                Perfil, Contacto y Medidas (Stats)
              </h2>
            </div>

            {profile.compCardUrl && (
              <a
                href={profile.compCardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white px-3.5 py-2 rounded-full border border-zinc-200 dark:border-zinc-800"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Comp Card PDF actual</span>
              </a>
            )}
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-8">
            {/* Contact & Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label
                  htmlFor="profile-location"
                  className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-zinc-500 mb-2"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Ubicación</span>
                </label>
                <input
                  id="profile-location"
                  name="location"
                  type="text"
                  defaultValue={profile.location || ""}
                  placeholder="Buenos Aires, Argentina"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-email"
                  className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-zinc-500 mb-2"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Email de Booking</span>
                </label>
                <input
                  id="profile-email"
                  name="bookingEmail"
                  type="email"
                  defaultValue={profile.bookingEmail || ""}
                  placeholder="valentinapatri09@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-instagram"
                  className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-zinc-500 mb-2"
                >
                  <Instagram className="w-3.5 h-3.5" />
                  <span>Instagram URL</span>
                </label>
                <input
                  id="profile-instagram"
                  name="instagramUrl"
                  type="url"
                  defaultValue={profile.instagramUrl || ""}
                  placeholder="https://www.instagram.com/val_patri/"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                />
              </div>
            </div>

            {/* Stats */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Ruler className="w-4 h-4 text-zinc-400" />
                <h3 className="text-xs uppercase tracking-widest font-semibold text-zinc-500">
                  Medidas (Stats)
                </h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                <div>
                  <label htmlFor="stat-height" className="block text-xs text-zinc-500 mb-1.5">
                    Altura
                  </label>
                  <input
                    id="stat-height"
                    name="height"
                    type="text"
                    defaultValue={getStatValue("height")}
                    placeholder="178 cm"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                  />
                </div>

                <div>
                  <label htmlFor="stat-bust" className="block text-xs text-zinc-500 mb-1.5">
                    Busto
                  </label>
                  <input
                    id="stat-bust"
                    name="bust"
                    type="text"
                    defaultValue={getStatValue("bust")}
                    placeholder="85 cm"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                  />
                </div>

                <div>
                  <label htmlFor="stat-waist" className="block text-xs text-zinc-500 mb-1.5">
                    Cintura
                  </label>
                  <input
                    id="stat-waist"
                    name="waist"
                    type="text"
                    defaultValue={getStatValue("waist")}
                    placeholder="60 cm"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                  />
                </div>

                <div>
                  <label htmlFor="stat-hips" className="block text-xs text-zinc-500 mb-1.5">
                    Cadera
                  </label>
                  <input
                    id="stat-hips"
                    name="hips"
                    type="text"
                    defaultValue={getStatValue("hips")}
                    placeholder="89 cm"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                  />
                </div>

                <div>
                  <label htmlFor="stat-shoes" className="block text-xs text-zinc-500 mb-1.5">
                    Zapatos
                  </label>
                  <input
                    id="stat-shoes"
                    name="shoes"
                    type="text"
                    defaultValue={getStatValue("shoes")}
                    placeholder="39"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                  />
                </div>

                <div>
                  <label htmlFor="stat-eyes" className="block text-xs text-zinc-500 mb-1.5">
                    Ojos
                  </label>
                  <input
                    id="stat-eyes"
                    name="eyes"
                    type="text"
                    defaultValue={getStatValue("eyes")}
                    placeholder="Verdes"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                  />
                </div>

                <div>
                  <label htmlFor="stat-hair" className="block text-xs text-zinc-500 mb-1.5">
                    Pelo
                  </label>
                  <input
                    id="stat-hair"
                    name="hair"
                    type="text"
                    defaultValue={getStatValue("hair")}
                    placeholder="Castaño"
                    className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs uppercase tracking-widest font-semibold hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
              >
                {isSavingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Guardando...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Guardar Perfil y Medidas</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

