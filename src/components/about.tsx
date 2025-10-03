import { motion } from "framer-motion";

type AboutUsProps = {
  title?: string;
  description?: string;
  images: [string, string, string]; // [principal, secundaria1, secundaria2]
};

export default function AboutUs({
  title = "Sobre Global Explorer",
  description = "Somos una empresa de viajes y turismo con más de 20 años de experiencia, especializada en brindar soluciones turísticas integrales para agencias y empresas. Combinamos trayectoria, innovación y compromiso para garantizar la mejor experiencia en cada viaje, con respaldo y confianza en cada paso.",
  images,
}: AboutUsProps): JSX.Element {
  const [imgMain, imgTopRight, imgBottomRight] =
    images.length === 3 ? images : ["", "", ""];

  return (
    <section id="Nosotros" className="w-full bg-white py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Texto */}
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {title}
            </h2>
            <p className="mt-1 text-lg italic text-[#B22222]">
              by <span className="font-bold">Hub Travel</span>
            </p>
            <p className="mt-4 text-gray-600 leading-relaxed">{description}</p>
            <ul className="mt-6 space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-600" />
                Tarifas competitivas y disponibilidad garantizada.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-600" />
                Herramientas simples y claras para cotizar y reservar.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-600" />
                Soporte personalizado para tu operación diaria.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-600" />
                Amplia red de proveedores y destinos.
              </li>
              <li className="flex gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-600" />
                Experiencia comprobada en viajes corporativos, de incentivo y de
                placer.
              </li>
            </ul>
          </div>

          {/* Collage de imágenes */}
          <div className="relative h-full">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-100 via-transparent to-purple-100 blur-xl"
            />
            <div className="relative grid grid-cols-6 grid-rows-6 gap-3 h-full">
              {/* Imagen principal */}
              <motion.div
                className="col-span-4 row-span-6 h-full"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="h-full w-full overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-md">
                  <img
                    src={imgMain}
                    alt="Destino destacado Global Explorer"
                    className="h-full w-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Imagen superior derecha */}
              <motion.div
                className="col-span-2 row-span-3 h-full"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              >
                <div className="h-full w-full overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-md">
                  <img
                    src={imgTopRight}
                    alt="Experiencias y servicios"
                    className="h-full w-full object-cover"
                  />
                </div>
              </motion.div>

              {/* Imagen inferior derecha */}
              <motion.div
                className="col-span-2 row-span-3 self-end h-full"
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              >
                <div className="h-full w-full overflow-hidden rounded-2xl ring-1 ring-black/5 shadow-md">
                  <img
                    src={imgBottomRight}
                    alt="Atención a agencias"
                    className="h-full w-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
