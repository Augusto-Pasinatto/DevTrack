// dados em memória + filtros atuais

export const state = {
  tecnologias: [],
  sessoes: [],
  filtros: {
    busca: "",
    categoria: "",
    status: "",
    ordem: "nome", // "nome" | "nivel" | "recentes"
  },
};

export function setDados({ tecnologias, sessoes }) {
  state.tecnologias = tecnologias;
  state.sessoes = sessoes;
}

export function setFiltros(parcial) {
  Object.assign(state.filtros, parcial);
}

// Minúsculas e sem acentos, para a busca não depender disso.
function normalizar(texto) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

const porNome = (a, b) => a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" });

const ORDENACOES = {
  nome: porNome,
  nivel: (a, b) => b.nivel - a.nivel || porNome(a, b),
  recentes: (a, b) => (b.criadoEm ?? "").localeCompare(a.criadoEm ?? "") || porNome(a, b),
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

// "YYYY-MM" do mês atual no fuso local (as datas das sessões são locais).
function mesAtual(hoje) {
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  return `${hoje.getFullYear()}-${mes}`;
}

// Números dos cards de resumo, calculados com os dados já carregados.
export function getResumo(hoje = new Date()) {
  const prefixoMes = mesAtual(hoje);
  const minutosPorTecnologia = new Map();
  let minutosNoMes = 0;

  for (const sessao of state.sessoes) {
    const minutos = Number(sessao.minutos) || 0;
    const id = String(sessao.tecnologiaId);
    minutosPorTecnologia.set(id, (minutosPorTecnologia.get(id) ?? 0) + minutos);
    if (sessao.data?.startsWith(prefixoMes)) minutosNoMes += minutos;
  }

  let maisEstudada = null;
  let maiorTotal = 0;
  for (const tec of state.tecnologias) {
    const total = minutosPorTecnologia.get(String(tec.id)) ?? 0;
    if (total > maiorTotal) {
      maiorTotal = total;
      maisEstudada = tec;
    }
  }

  return {
    total: state.tecnologias.length,
    estudando: state.tecnologias.filter((tec) => tec.status === "estudando").length,
    minutosNoMes,
    maisEstudada,
  };
}
