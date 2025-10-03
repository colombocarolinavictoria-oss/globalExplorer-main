import React from "react";

export type CategoryItem = {
  title: string;
  imageSrc: string;
  alt?: string;
  href?: string;
};

export type ImageCategoryGridProps = {
  title?: string;
  categories?: CategoryItem[];
};

const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    title: "Destinos exóticos",
    imageSrc: "https://mcdn.wallpapersafari.com/medium/6/63/HQdFhM.jpg",
    alt: "Paisaje exótico",
  },
  {
    title: "Outdoor",
    imageSrc: "https://mcdn.wallpapersafari.com/medium/13/91/uwBEKa.jpg",
    alt: "Bosque",
  },
  {
    title: "Europa",
    imageSrc:
      "https://concepto.de/wp-content/uploads/2020/03/coliseo-romano-scaled-e1731632602779.jpg",
    alt: "Montaña nevada",
  },
  {
    title: "América",
    imageSrc:
      "https://image-tc.galaxy.tf/wijpeg-7ellqz2uqv2l9plk30futx9jr/experiencias-machu-picchu_wide.jpg?crop=0%2C63%2C1200%2C675",
    alt: "Montaña nevada",
  },
  {
    title: "Disney",
    imageSrc:
      "https://hips.hearstapps.com/hmg-prod/images/disney-world-mickey-mouse-minnie-mouse-jpg-1655400733.jpg",
    alt: "Montaña nevada",
  },
  {
    title: "Ski & Nieve",
    imageSrc: "https://mcdn.wallpapersafari.com/medium/59/86/lysgzr.jpg",
    alt: "Montaña nevada",
  },
  {
    title: "Eventos deportivos",
    imageSrc: "https://mcdn.wallpapersafari.com/medium/17/48/3Fqylj.jpg",
    alt: "Estadio",
  },
  {
    title: "Conciertos musicales",
    imageSrc: "https://mcdn.wallpapersafari.com/medium/50/9/grGCi4.jpg",
    alt: "Concierto",
  },
  {
    title: "Cruceros",
    imageSrc: "https://mcdn.wallpapersafari.com/medium/35/65/rO0ve2.jpg",
    alt: "Crucero",
  },
  {
    title: "Grupales",
    imageSrc:
      "https://media.viajando.travel/p/cc11cf9c12a3f4a22500167cd10c5cb2/adjuntos/236/imagenes/000/588/0000588270/viajes-grupales.jpg",
    alt: "Montaña nevada",
  },
  {
    title: "Turismo corporativo",
    imageSrc:
      "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?q=80&w=1200&auto=format&fit=crop",
    alt: "Spa",
  },
];

function CategoryCard({
  item,
  className,
}: {
  item: CategoryItem;
  className?: string;
}) {
  const content = (
    <figure
      className={`relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm transition-shadow duration-300 hover:shadow-md ${
        className ?? ""
      }`}
    >
      {/* Contenedor de la imagen + título que hace zoom al hover */}
      <div className="relative w-full h-48 overflow-hidden group">
        <img
          src={item.imageSrc}
          alt={item.alt ?? item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Título sobre la imagen */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 className="text-white text-xl sm:text-3xl md:text-4xl font-bold text-center drop-shadow-2xl">
            {item.title}
          </h3>
        </div>
      </div>
    </figure>
  );

  return item.href ? (
    <a href={item.href} aria-label={`Ver categoría ${item.title}`}>
      {content}
    </a>
  ) : (
    content
  );
}

const ImageCategoryGrid: React.FC<ImageCategoryGridProps> = ({
  title = "Explorá nuestras categorías",
  categories = DEFAULT_CATEGORIES,
}) => {
  return (
    <section className="w-full bg-white py-10">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
          {title}
        </h2>

        <div className="grid gap-6">
          {/* Fila 1: 2 iguales */}
          <div className="grid grid-cols-2 gap-6">
            {categories.slice(0, 2).map((item, idx) => (
              <CategoryCard key={idx} item={item} />
            ))}
          </div>

          {/* Fila 2: 3 iguales */}
          <div className="grid grid-cols-3 gap-6">
            {categories.slice(2, 5).map((item, idx) => (
              <CategoryCard key={idx} item={item} />
            ))}
          </div>

          {/* Fila 3: 2 de distinto tamaño (izquierda más ancha) */}
          <div className="grid grid-cols-3 gap-6">
            <CategoryCard item={categories[5]} className="col-span-2" />
            <CategoryCard item={categories[6]} />
          </div>

          {/* Fila 4: 3 iguales */}
          <div className="grid grid-cols-3 gap-6">
            {categories.slice(7, 10).map((item, idx) => (
              <CategoryCard key={idx} item={item} />
            ))}
          </div>

          {/* Fila 5: 1 sola foto */}
          <div>
            <CategoryCard item={categories[10]} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageCategoryGrid;
