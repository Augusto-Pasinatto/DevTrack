// dados em memória + filtros atuais

export const state = {
  tecnologias: [],
  filtros: {
    busca: "",
    categoria: "",
    status: "",
    ordem: "nome", // "nome" | "nivel"
  },
};

export function setTecnologias(tecnologias) {
  state.tecnologias = tecnologias;
}

export function setFiltros(parcial) {
  Object.assign(state.filtros, parcial);
}

// ---------- Tecnologias ----------

const mesmoId = (a, b) => String(a) === String(b);

export function getTecnologia(id) {
  return state.tecnologias.find((tec) => mesmoId(tec.id, id));
}

export function adicionarTecnologia(tecnologia) {
  state.tecnologias.push(tecnologia);
}

export function substituirTecnologia(tecnologia) {
  const indice = state.tecnologias.findIndex((tec) => mesmoId(tec.id, tecnologia.id));
  if (indice !== -1) state.tecnologias[indice] = tecnologia;
}

export function removerTecnologia(id) {
  state.tecnologias = state.tecnologias.filter((tec) => !mesmoId(tec.id, id));
}

// Minúsculas e sem acentos, para a busca não depender disso.
function normalizar(texto) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

const porNome = (a, b) => a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" });

const ORDENACOES = {
  nome: porNome,
  nivel: (a, b) => b.nivel - a.nivel || porNome(a, b),
};

// Lista que aparece na tela: filtros + ordenação, sem nova requisição.
export function getTecnologiasVisiveis() {
  const { busca, categoria, status, ordem } = state.filtros;
  const termo = normalizar(busca);

  return state.tecnologias
    .filter((tec) =>
      (!categoria || tec.categoria === categoria) &&
      (!status || tec.status === status) &&
      (!termo || normalizar(tec.nome).includes(termo)))
    .sort(ORDENACOES[ordem] ?? porNome);
}
