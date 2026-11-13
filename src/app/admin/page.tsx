import Link from "next/link";
import { Lock, ArrowLeft, ShieldAlert } from "lucide-react";
import { auth, isAllowedAdminEmail, signIn } from "@/auth";
import { client } from "@/lib/sanity.client";
import { ModelProfile } from "@/lib/types";
import AdminDashboard from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const ADMIN_MODEL_QUERY = `
  *[_type == "modelProfile"][0] {
    _id,
    name,
    bio,
    location,
    bookingEmail,
    instagramUrl,
    "compCardUrl": compCard.asset->url,
    stats {
      height,
      bust,
      waist,
      hips,
      shoes,
      eyes,
      hair
    },
    measurements {
      height,
      bust,
      waist,
      hips,
      shoes,
      eyes,
      hair
    },
    "gallery": gallery[] {
      _key,
      asset-> {
        _id,
        url,
        metadata {
          dimensions {
            width,
            height,
            aspectRatio
          }
        }
      },
      alt,
      category,
      isHero,
      visible
    }
  }
`;

async function getAdminModelProfile(): Promise<ModelProfile> {
  try {
    const data = await client.fetch<ModelProfile | null>(
      ADMIN_MODEL_QUERY,
      {},
      { cache: "no-store" }
    );

    if (data) {
      return {
        ...data,
        gallery: data.gallery || [],
      };
    }
  } catch (error) {
    console.error("[Admin Page] Error fetching modelProfile from Sanity:", error);
  }

  return {
    name: "Valentina Patri",
    bio: "",
    location: "Buenos Aires, Argentina",
    bookingEmail: "valentinapatri09@gmail.com",
    instagramUrl: "",
    compCardUrl: null,
    stats: {},
    measurements: {},
    gallery: [],
  };
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await auth();
  const resolvedParams = await searchParams;
  const userEmail = session?.user?.email;
  const isAdmin = Boolean(session && isAllowedAdminEmail(userEmail));

  if (!isAdmin) {
    const hasAccessError =
      resolvedParams?.error === "AccessDenied" ||
      (Boolean(session) && !isAllowedAdminEmail(userEmail));

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-zinc-200/30 dark:bg-zinc-800/20 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/50 backdrop-blur-md p-8 sm:p-10 shadow-xl text-center space-y-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
            <Lock className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] uppercase tracking-widest text-zinc-400 font-semibold">
              Acceso Restringido
            </span>
            <h1 className="text-2xl font-bold tracking-tight uppercase">
              Panel de Gestión
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-light">
              Inicia sesión con una cuenta autorizada para administrar el portafolio, las fotografías y las medidas.
            </p>
          </div>

          {hasAccessError && (
            <div className="flex items-start gap-2.5 text-left p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Acceso denegado. Tu cuenta de Google no se encuentra autorizada en la lista de administradores.
              </span>
            </div>
          )}

          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/admin" });
            }}
          >
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 text-xs uppercase tracking-widest font-semibold hover:opacity-90 transition-all cursor-pointer shadow-sm active:scale-[0.99]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81Z"
                />
              </svg>
              <span>Continuar con Google</span>
            </button>
          </form>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver al portafolio</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const profile = await getAdminModelProfile();

  return (
    <AdminDashboard
      profile={profile}
      adminUser={{
        email: userEmail || "",
        name: session?.user?.name,
        image: session?.user?.image,
      }}
    />
  );
}

