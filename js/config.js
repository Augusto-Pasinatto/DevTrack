// BASE_URL (troca local ↔ MockAPI aqui)
// Desenvolvimento: json-server local. No final, trocar pela URL do MockAPI
// (ex.: "https://<id>.mockapi.io/api/v1").
export const BASE_URL = "http://localhost:3000";

// Valores aceitos pela API e como aparecem na interface.
export const CATEGORIAS = {
  linguagem: "Linguagem",
  framework: "Framework",
  ferramenta: "Ferramenta",
  conceito: "Conceito",
};

// `cor` é a cor contextual do Bootstrap usada na badge do status.
export const STATUS = {
  "quero-aprender": { rotulo: "Quero aprender", cor: "info" },
  estudando: { rotulo: "Estudando", cor: "warning" },
  domino: { rotulo: "Domino", cor: "success" },
};

export const NIVEL_MIN = 1;
export const NIVEL_MAX = 5;
