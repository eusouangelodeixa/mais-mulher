import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fixa a raiz do workspace neste projeto. Sem isso, o Next detecta um
  // package-lock.json em ~/ e infere a raiz errada — o que quebra o
  // file-watching (rotas novas não compilam) e emite um aviso a cada start.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
