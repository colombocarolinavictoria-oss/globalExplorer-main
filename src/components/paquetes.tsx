import { useMemo, useState, useEffect, useRef } from "react";

// Types
export type TravelPackage = {
  id: string;
  title: string;
  location: string;
  description: string;
  price: number;
  currency?: string;
  nights: number;
  imageUrl: string;
  tags: string[];
  rating?: number;
  popular?: boolean;
};

export type TravelPackagesSectionProps = {
  title?: string;
  subtitle?: string;
  packages?: TravelPackage[];
  allTags?: string[];
  onSelect?: (pkg: TravelPackage) => void;
};

// Helpers
const DEFAULT_TAGS = [
  "Argentina",
  "Aventura",
  "Ciudad",
  "Cruceros",
  "Cultural",
  "Exótico",
  "F1",
  "Fútbol",
  "Gastronomía",
  "Grupales",
  "Playa",
  "Premium",
  "Shows",
  "Ski",
];

const DEFAULT_PACKAGES: TravelPackage[] = [
  {
    id: "maldivas-overwater",
    title: "Maldivas Overwater Bungalows",
    location: "Islas Maldivas",
    description:
      "7 noches en bungalow sobre el agua con desayuno. Traslados y snorkel incluidos.",
    price: 3999,
    currency: "USD",
    nights: 7,
    imageUrl:
      "https://www.barcelo.com/guia-turismo/wp-content/uploads/2023/11/maldivas-playas-2.jpg",
    tags: ["Exótico", "Playa", "Premium"],
    rating: 4.9,
    popular: true,
  },
  {
    id: "madrid-futbol-tapas",
    title: "Madrid Fútbol & Tapas",
    location: "Madrid, España",
    description:
      "4 noches con city tour, entrada a partido y ruta de tapas por La Latina.",
    price: 1290,
    currency: "USD",
    nights: 4,
    imageUrl:
      "https://gdconsejosespana.b-cdn.net/wp-content/uploads/2017/09/estadio-santiago-bernabeu-madri.jpg",
    tags: ["Fútbol", "Ciudad", "Gastronomía"],
    rating: 4.6,
  },
  {
    id: "marrakech-sahara",
    title: "Marrakech & Sahara",
    location: "Marruecos",
    description:
      "5 noches entre riad en la medina y campamento en el desierto con cena bereber.",
    price: 1690,
    currency: "USD",
    nights: 5,
    imageUrl:
      "https://cronicasnomadas.com/wp-content/uploads/2017/04/marruecos-09-m25-197.jpg?w=2000&h=1500&crop=1",
    tags: ["Exótico", "Cultural"],
    rating: 4.7,
  },
  {
    id: "patagonia-trek",
    title: "Patagonia Trek Experience",
    location: "El Chaltén, Argentina",
    description:
      "7 noches con trekking al Fitz Roy y laguna de los Tres. Guías certificados.",
    price: 1990,
    currency: "USD",
    nights: 7,
    imageUrl:
      "https://back-packer.org/wp-content/uploads/wanderf%C3%BChrer-fitz-roy-cerro-torre.jpg",
    tags: ["Aventura", "Argentina"],
    rating: 4.8,
    popular: true,
  },
  {
    id: "paris-romantico",
    title: "París Romántico",
    location: "París, Francia",
    description:
      "5 noches con paseo por Sena y visita a Louvre. Hotel boutique cerca de la Torre.",
    price: 1490,
    currency: "USD",
    nights: 5,
    imageUrl:
      "https://viajesyestilo.com/wp-content/uploads/2021/01/Paris-destino-romantico-4.jpg",
    tags: ["Ciudad", "Cultural", "Premium"],
    rating: 4.5,
  },
  {
    id: "amazonia-aventura",
    title: "Amazonía Aventura",
    location: "Manaos, Brasil",
    description:
      "6 noches en lodge selvático con navegaciones, fauna y canopy. Pensión completa.",
    price: 1890,
    currency: "USD",
    nights: 6,
    imageUrl:
      "https://happygringo.com/wp-content/uploads/2022/02/wuaorani-kayak-adventure-kayaking-the-river.jpg",
    tags: ["Aventura", "Exótico"],
    rating: 4.4,
  },
];

// --- Formateo de precios ---
const nf = (value: number, currency = "USD") =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency }).format(value);

// --- Normalización de strings ---
const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

// --- Hooks ---
// Scroll horizontal con la rueda del mouse
function useWheelPan(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // Detectamos intención horizontal:
      // - si deltaX > deltaY => el usuario hace un gesto horizontal
      // - o si mantiene Shift => quiere forzar desplazamiento horizontal
      const horizontalIntent =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;

      if (!horizontalIntent) {
        // No interferimos: dejamos que la página haga su scroll vertical normal
        return;
      }

      // Si sí hay intención horizontal, prevenimos el scroll vertical
      e.preventDefault();

      // Usamos el delta más significativo (si viene deltaX lo usamos, si no usamos deltaY)
      const delta =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

      el.scrollLeft += delta;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel as any);
  }, [ref]);
}

// Drag con el mouse
function useDragScroll(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let startScroll = 0;

    const onDown = (e: PointerEvent) => {
      isDown = true;
      startX = e.clientX;
      startScroll = el.scrollLeft;
      el.setPointerCapture(e.pointerId);
      el.classList.add("cursor-grabbing");
    };
    const onMove = (e: PointerEvent) => {
      if (!isDown) return;
      el.scrollLeft = startScroll - (e.clientX - startX);
    };
    const onUp = (e: PointerEvent) => {
      isDown = false;
      el.releasePointerCapture(e.pointerId);
      el.classList.remove("cursor-grabbing");
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [ref]);
}

// --- Carrusel ---
function TrackPackages({
  items,
  cardWidth,
  cardHeight,
  onSelect,
  selectedId,
}: {
  items: TravelPackage[];
  cardWidth: number;
  cardHeight: number;
  onSelect?: (pkg: TravelPackage) => void;
  selectedId?: string | null;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useWheelPan(wrapRef);
  useDragScroll(wrapRef);

  // Función para mover el carrusel
  const scrollStep = (dir: 1 | -1) => {
    const el = wrapRef.current;
    if (!el) return;

    const step = cardWidth + 24; // ancho de tarjeta + gap
    const maxScroll = el.scrollWidth - el.clientWidth;
    let newScroll = el.scrollLeft + dir * step;

    // --- 🚀 Movimiento infinito ---
    if (dir === 1 && el.scrollLeft + el.clientWidth >= el.scrollWidth - 5) {
      // si estoy al final y voy a la derecha → vuelvo al inicio
      newScroll = 0;
    }
    if (dir === -1 && el.scrollLeft <= 0) {
      // si estoy al inicio y voy a la izquierda → salto al final
      newScroll = maxScroll;
    }

    el.scrollTo({ left: newScroll, behavior: "smooth" });
  };

  return (
    <div className="relative">
      {/* Gradientes */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent" />

      {/* Contenedor del carrusel (relative) */}
      <div className="relative">
        {/* Contenedor de tarjetas */}
        <div
          ref={wrapRef}
          className="flex overflow-x-auto gap-6 snap-x snap-mandatory cursor-grab select-none scrollbar-none"
          style={{ height: cardHeight }}
        >
          {items.map((pkg) => (
            <article
              key={pkg.id}
              className="flex-shrink-0 w-[var(--w)] snap-start rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"
              style={{ ["--w" as any]: `${cardWidth}px` }}
            >
              <div className="relative h-[200px] w-full overflow-hidden rounded-t-2xl">
                <img
                  src={pkg.imageUrl}
                  alt={pkg.title}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
                {pkg.popular && (
                  <span className="absolute left-3 top-3 rounded-full bg-indigo-600/90 px-3 py-1 text-sm font-semibold text-white shadow">
                    Popular
                  </span>
                )}
              </div>
              <div className="p-4 flex flex-col gap-3">
                <h3 className="text-lg font-bold">{pkg.title}</h3>
                <p className="text-sm text-gray-600 font-semibold">
                  {pkg.location}
                </p>
                <p className="text-sm text-gray-700 line-clamp-2">
                  {pkg.description}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">
                      {pkg.nights}
                    </span>{" "}
                    noches
                  </div>
                  <div className="text-base font-semibold text-red-700">
                    {nf(pkg.price, pkg.currency)}
                  </div>
                </div>
                <button
                  onClick={() => onSelect?.(pkg)}
                  className={`mt-2 rounded-xl border px-5 py-2 text-sm font-semibold shadow-sm transition ${
                    selectedId === pkg.id
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : "border-indigo-600 text-indigo-700 hover:bg-indigo-50"
                  }`}
                >
                  {selectedId === pkg.id ? "Seleccionado" : "Seleccionar"}
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Flechas centradas */}
        <button
          onClick={() => scrollStep(-1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 border border-gray-200 shadow p-3 text-2xl hover:bg-white"
        >
          ‹
        </button>
        <button
          onClick={() => scrollStep(1)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/90 border border-gray-200 shadow p-3 text-2xl hover:bg-white"
        >
          ›
        </button>
      </div>
    </div>
  );
}

// --- Componente principal ---
export default function TravelPackagesSection({
  title = "Paquetes turísticos",
  subtitle = "Experiencias a medida para cada viajero",
  packages = DEFAULT_PACKAGES,
  allTags = DEFAULT_TAGS,
  onSelect,
}: TravelPackagesSectionProps) {
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<
    "popular" | "priceAsc" | "priceDesc" | "nights"
  >("popular");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Ref del contenedor de tags para calcular altura y ajustar carrusel
  const tagsRef = useRef<HTMLDivElement>(null);
  const [tagsHeight, setTagsHeight] = useState(0);

  // Medir altura de tags cuando cambian
  useEffect(() => {
    if (tagsRef.current) {
      setTagsHeight(tagsRef.current.offsetHeight);
    }
  }, [allTags, activeTags]);

  // Toggle de tag
  const toggleTag = (tag: string) =>
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  // Limpiar filtros y búsqueda
  const clearFilters = () => {
    setActiveTags([]);
    setQuery("");
  };

  // Filtrado y ordenamiento de paquetes
  const filtered = useMemo(() => {
    const q = normalize(query);
    let list = packages.filter((p) => {
      const text = normalize(`${p.title} ${p.location} ${p.tags.join(" ")}`);
      const matchesQuery = q ? text.includes(q) : true;
      const matchesTags = activeTags.length
        ? p.tags.some((t) => activeTags.includes(t))
        : true;
      return matchesQuery && matchesTags;
    });

    switch (sort) {
      case "priceAsc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "priceDesc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "nights":
        list.sort((a, b) => b.nights - a.nights);
        break;
      default:
        list.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    }

    return list;
  }, [packages, activeTags, query, sort]);

  // Selección de paquete
  const handleSelect = (pkg: TravelPackage) => {
    setSelectedId(pkg.id);
    onSelect?.(pkg);
  };

  return (
    <section id="Productos" className="w-full bg-white py-20">
      <div className="mx-auto max-w-7xl px-4">
        {/* Título y filtros */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {title}
            </h2>
            <p className="mt-2 text-xl text-gray-600">{subtitle}</p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:mt-0 sm:auto-cols-max sm:grid-flow-col sm:items-center">
            <input
              type="search"
              placeholder="Buscar destino, ciudad, tag…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:min-w-[260px]"
            />

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="popular">Destacados</option>
              <option value="priceAsc">Precio: menor a mayor</option>
              <option value="priceDesc">Precio: mayor a menor</option>
              <option value="nights">Duración</option>
            </select>

            <button
              onClick={clearFilters}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Tags */}
        <div ref={tagsRef} className="mb-4 flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`rounded-xl border px-4 py-1 text-sm font-medium shadow-sm transition ${
                activeTags.includes(tag)
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Carrusel */}
        <TrackPackages
          items={filtered}
          cardWidth={360} // ancho más grande
          cardHeight={420 + tagsHeight + 18} // alto más grande
          onSelect={handleSelect}
          selectedId={selectedId}
        />
      </div>
    </section>
  );
}
