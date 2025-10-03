import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Seteá VITE_PUBLIC_BASE="/tu-repo/" en el workflow de GH Actions (o hardcodeá abajo)
export default defineConfig(({ command, mode }) => {
  const isBuild = command === "build";
  const publicBase = process.env.VITE_PUBLIC_BASE || "/"; // p/ dev y dominios propios
  return {
    plugins: [react(), tailwindcss()],
    base: isBuild ? publicBase : "/", // en dev siempre '/'
  };
});
