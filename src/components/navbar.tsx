import { useState, useEffect, useRef } from "react";

type Props = {
  logoSrc?: string;
  logoAlt?: string;
  homeHref?: string;
  scrollThreshold?: number;
};

export default function MinimalHamburgerNav({
  logoSrc = "https://www.globalexplorer.com.ar/images/logo.png",
  logoAlt = "Global Explorer",
  homeHref = "/",
  scrollThreshold = 10,
}: Props) {
  const [open, setOpen] = useState(false);
  const [scrollStage, setScrollStage] = useState<"top" | "middle" | "bottom">(
    "top"
  );

  const navRef = useRef<HTMLElement>(null); // ref para calcular altura navbar

  // Cerrar con ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Evitar scroll cuando el panel esté abierto
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // Detectar scroll para cambiar el fondo del navbar
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.body.scrollHeight;

      if (scrollY + viewportHeight >= fullHeight - 200) {
        setScrollStage("bottom");
      } else if (scrollY > scrollThreshold) {
        setScrollStage("middle");
      } else {
        setScrollStage("top");
      }
    };

    onScroll(); // inicial
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollThreshold]);

  // --- Función para hacer scroll a la sección considerando navbar fijo ---
  const scrollToSection = (id: string) => {
    setOpen(false); // cerrar panel lateral
    const el = document.getElementById(id);
    if (el) {
      const navbarHeight = navRef.current?.offsetHeight || 80; // altura del navbar
      const y = el.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <nav ref={navRef} className="fixed top-0 left-0 z-50 w-full">
      {/* Barra superior */}
      <div
        className={`flex items-center justify-between px-4 py-3 transition-all duration-300
    ${
      scrollStage === "top"
        ? "bg-transparent"
        : scrollStage === "middle"
        ? "bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm"
        : "bg-[rgb(59,78,76)] backdrop-blur border-b border-gray-700 shadow-md"
    }`}
      >
        {/* Logo izquierdo */}
        <a href={homeHref} className="inline-flex items-center gap-2 flex-1">
          <img
            src={logoSrc}
            alt={logoAlt}
            className="h-16 w-auto object-contain transition-transform duration-300"
            width={220}
            height={64}
            loading="eager"
          />
        </a>

        {/* Logo central */}
        <div className="flex-1 flex justify-center">
          <img
            src="https://www.hubtravel.com.ar/images/galeria/Sistema/logo.png"
            alt="Hub Travel"
            className="h-14 w-auto object-contain"
            width={180}
            height={56}
            loading="lazy"
          />
        </div>

        {/* Botón hamburguesa a la derecha */}
        <div className="flex-1 flex justify-end">
          <button
            aria-label="Abrir menú"
            aria-haspopup="true"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white/80 backdrop-blur px-3 py-2 text-gray-800 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Backdrop */}
      {open && (
        <button
          aria-label="Cerrar menú"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40"
        />
      )}

      {/* Panel lateral */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-64 max-w-[80vw] transform bg-white shadow-xl transition-transform duration-300
          ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="text-sm font-medium text-gray-600">Menú</span>
          <button
            aria-label="Cerrar"
            onClick={() => setOpen(false)}
            className="rounded p-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2 text-gray-800">
            <li>
              <button
                className="block rounded px-3 py-2 hover:bg-gray-100"
                onClick={() => scrollToSection("Productos")}
              >
                Productos
              </button>
            </li>
            <li>
              <button
                className="block rounded px-3 py-2 hover:bg-gray-100"
                onClick={() => scrollToSection("Nosotros")}
              >
                Nosotros
              </button>
            </li>
            <li>
              <button
                className="block rounded px-3 py-2 hover:bg-gray-100"
                onClick={() => scrollToSection("Contacto")}
              >
                Contacto
              </button>
            </li>
          </ul>
        </nav>

        <div className="mt-auto p-4 text-xs text-gray-500">
          © {new Date().getFullYear()} {logoAlt}
        </div>
      </div>
    </nav>
  );
}
