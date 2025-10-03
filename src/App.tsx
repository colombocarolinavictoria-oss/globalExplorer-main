import { useState } from "react";

import Navbar from "./components/navbar";
import HeroCover from "./components/hero";
import Paquetes from "./components/paquetes";
import Price from "./components/pricing";
import Prefooter from "./components/pre-footer";
import Team from "./components/team";
import Footer from "./components/footer";
import ContactSection from "./components/contactSection";
import "./App.css";
import Categorias from "./components/categorias";
import AboutUs from "./components/about";
import PaqueteDetallePage from "./components/PaqueteDetallePage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <HeroCover
        imageUrl="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop"
        heading="Viví tu próxima aventura"
        subheading="Inspirate, elegí y viajá: todo en un solo lugar."
        alt="Vista panorámica de un destino turístico"
        align="center" // "left" | "right"
      />
      <Categorias autoplay={false} />
      <Paquetes />

      <AboutUs
        images={[
          "https://www.interrias.com/wp-content/uploads/2018/04/blog-MOD-2.jpg", // principal
          "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=1000&auto=format&fit=crop", // top-right
          "https://media.istockphoto.com/id/827263174/es/foto/viajes-planificaci%C3%B3n-en-equipo.jpg?s=612x612&w=0&k=20&c=XUE-PnxhPl3ohCULtY3_v_gOONStbXvb9vqOYjJ-N8I=", // bottom-right
        ]}
      />
      <ContactSection />
      <Prefooter />
      <Footer />
    </>
  );
}

export default App;
