// inicialização e listeners de eventos
import * as api from "./api.js";
import { state, setDados, setFiltros, getTecnologiasVisiveis, getResumo } from "./state.js";
import { renderTecnologias, renderResumo, limparTecnologias } from "./render.js";
import { mostrarEstado } from "./ui.js";

const formFiltros = document.getElementById("form-filtros");
const botaoTentarNovamente = document.querySelector('[data-action="tentar-novamente"]');

// Redesenha resumo e lista a partir do state (sem requisição).
function atualizarTela() {
  renderResumo(getResumo());

  if (state.tecnologias.length === 0) {
    limparTecnologias();
    mostrarEstado("vazio");
    return;
  }

  mostrarEstado("lista");
  renderTecnologias(getTecnologiasVisiveis(), state.tecnologias.length);
}

// Carregamento inicial: tecnologias + sessões (as sessões alimentam o resumo).
async function carregarDados() {
  mostrarEstado("carregando");
  botaoTentarNovamente.disabled = true;

  try {
    const [tecnologias, sessoes] = await Promise.all([api.getTecnologias(), api.getSessoes()]);
    setDados({ tecnologias, sessoes });
    atualizarTela();
  } catch (erro) {
    limparTecnologias();
    renderResumo(null);
    mostrarEstado("erro", erro.message);
  } finally {
    botaoTentarNovamente.disabled = false;
  }
}

// ---------- Filtros e ordenação (aplicados no front) ----------

function lerFiltros() {
  setFiltros({
    busca: document.getElementById("filtro-busca").value,
    categoria: document.getElementById("filtro-categoria").value,
    status: document.getElementById("filtro-status").value,
    ordem: document.getElementById("filtro-ordem").value,
  });
  if (state.tecnologias.length > 0) {
    renderTecnologias(getTecnologiasVisiveis(), state.tecnologias.length);
  }
}

formFiltros.addEventListener("input", lerFiltros);
formFiltros.addEventListener("change", lerFiltros);
formFiltros.addEventListener("submit", (evento) => evento.preventDefault());

botaoTentarNovamente.addEventListener("click", carregarDados);

lerFiltros();
carregarDados();
