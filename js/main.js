// inicialização e listeners de eventos
import * as api from "./api.js";
import { STATUS } from "./config.js";
import {
  state, setTecnologias, setFiltros, getTecnologiasVisiveis,
  getTecnologia, adicionarTecnologia, substituirTecnologia, removerTecnologia,
} from "./state.js";
import { renderTecnologias, limparTecnologias } from "./render.js";
import { validarTecnologia } from "./validation.js";
import {
  mostrarEstado, setCarregando, abrirModal, fecharModal, focarControleDoCard,
  marcarCampo, mostrarErrosFormulario, limparErrosFormulario,
} from "./ui.js";

const formFiltros = document.getElementById("form-filtros");
const listaTecnologias = document.getElementById("lista-tecnologias");
const botaoTentarNovamente = document.querySelector('[data-action="tentar-novamente"]');

const modalTecnologia = document.getElementById("modal-tecnologia");
const tituloModalTecnologia = document.getElementById("modal-tecnologia-titulo");
const formTecnologia = document.getElementById("form-tecnologia");
const botaoSalvar = formTecnologia.querySelector('[type="submit"]');

const modalConfirmacao = document.getElementById("modal-confirmacao");
const textoConfirmacao = document.getElementById("confirmacao-texto");
const botaoConfirmarExclusao = modalConfirmacao.querySelector('[data-action="confirmar-exclusao"]');

// Redesenha a lista a partir do state (sem requisição).
function atualizarTela() {
  if (state.tecnologias.length === 0) {
    limparTecnologias();
    mostrarEstado("vazio");
    return;
  }

  mostrarEstado("lista");
  renderTecnologias(getTecnologiasVisiveis(), state.tecnologias.length);
}

// ====================================================================
// GET — carregamento inicial
// ====================================================================

async function carregarDados() {
  mostrarEstado("carregando");
  botaoTentarNovamente.disabled = true;

  try {
    setTecnologias(await api.getTecnologias());
    atualizarTela();
    console.log(`[OK] ${state.tecnologias.length} tecnologia(s) carregada(s)`);
  } catch (erro) {
    limparTecnologias();
    mostrarEstado("erro", erro.message);
    console.log(`[ERRO] ${erro.message}`);
  } finally {
    botaoTentarNovamente.disabled = false;
  }
}

// ====================================================================
// Filtros e ordenação (aplicados no front)
// ====================================================================

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

// ====================================================================
// POST / PUT — modal de tecnologia (o mesmo formulário para os dois)
// ====================================================================

let idEmEdicao = null; // null = criando uma nova

function lerFormularioTecnologia() {
  const campos = formTecnologia.elements;
  return {
    nome: campos.nome.value.trim(),
    categoria: campos.categoria.value,
    nivel: Number(campos.nivel.value),
    status: campos.status.value,
    meta: campos.meta.value.trim(),
  };
}

function validarFormularioTecnologia() {
  return validarTecnologia(lerFormularioTecnologia(), {
    tecnologias: state.tecnologias,
    idAtual: idEmEdicao,
  });
}

function abrirModalTecnologia(origem, tecnologia = null) {
  idEmEdicao = tecnologia?.id ?? null;
  formTecnologia.reset();
  limparErrosFormulario(formTecnologia);
  tituloModalTecnologia.textContent = tecnologia ? `Editar ${tecnologia.nome}` : "Nova tecnologia";

  if (tecnologia) {
    const campos = formTecnologia.elements;
    campos.nome.value = tecnologia.nome;
    campos.categoria.value = tecnologia.categoria;
    campos.nivel.value = tecnologia.nivel;
    campos.status.value = tecnologia.status;
    campos.meta.value = tecnologia.meta ?? "";
  }

  abrirModal(modalTecnologia, origem);
}

async function salvarTecnologia(evento) {
  evento.preventDefault();
  if (botaoSalvar.disabled) return;

  const erros = validarFormularioTecnologia();
  if (!mostrarErrosFormulario(formTecnologia, erros)) return;

  const dados = lerFormularioTecnologia();
  const editando = idEmEdicao !== null;
  setCarregando(botaoSalvar, true);

  try {
    if (editando) {
      // PUT envia o objeto completo.
      substituirTecnologia(await api.updateTecnologia(idEmEdicao, dados));
    } else {
      adicionarTecnologia(await api.createTecnologia(dados));
    }

    fecharModal(modalTecnologia);
    atualizarTela();
    console.log(`[OK] ${editando ? "Tecnologia atualizada" : "Tecnologia salva"}: ${dados.nome}`);
  } catch (erro) {
    // O modal continua aberto com o que o usuário digitou.
    console.log(`[ERRO] ${erro.message}`);
  } finally {
    setCarregando(botaoSalvar, false);
  }
}

// Validação no blur de cada campo (focusout borbulha, blur não).
formTecnologia.addEventListener("focusout", (evento) => {
  const campo = evento.target;
  if (!campo.name || !modalTecnologia.classList.contains("show")) return;
  // Indo para Salvar/Cancelar/X: não valida aqui. O submit valida tudo, e a
  // mensagem surgindo no mousedown desloca o modal e faz o clique "escapar".
  if (evento.relatedTarget?.matches('[type="submit"], [data-bs-dismiss="modal"]')) return;
  marcarCampo(campo, validarFormularioTecnologia()[campo.name]);
});

// Se o campo já está com erro, revalida enquanto o usuário corrige.
formTecnologia.addEventListener("input", (evento) => {
  const campo = evento.target;
  if (campo.name && campo.classList.contains("is-invalid")) {
    marcarCampo(campo, validarFormularioTecnologia()[campo.name]);
  }
});

formTecnologia.addEventListener("submit", salvarTecnologia);

// Ao abrir, leva o foco para o primeiro campo.
modalTecnologia.addEventListener("shown.bs.modal", () => formTecnologia.elements.nome.focus());

// ====================================================================
// PATCH — status rápido no card, com atualização otimista
// ====================================================================

/**
 * Atualiza a tela na hora e manda o PATCH. Se falhar, volta ao status
 * anterior (desde que ninguém tenha mudado o campo de novo nesse meio-tempo).
 */
async function mudarStatus(tecnologia, status) {
  if (!STATUS[status] || status === tecnologia.status) return;

  const anterior = tecnologia.status;
  tecnologia.status = status;
  atualizarTela();
  focarControleDoCard(tecnologia.id, "mudar-status");

  try {
    await api.patchTecnologia(tecnologia.id, { status });
    console.log(`[OK] ${tecnologia.nome}: status alterado para "${STATUS[status].rotulo}"`);
  } catch (erro) {
    if (tecnologia.status === status) {
      tecnologia.status = anterior;
      atualizarTela();
      focarControleDoCard(tecnologia.id, "mudar-status");
    }
    console.log(`[ERRO] ${erro.message}`);
  }
}

// ====================================================================
// DELETE — exclusão com confirmação
// ====================================================================

let idParaExcluir = null;

function abrirConfirmacaoExclusao(origem, tecnologia) {
  idParaExcluir = tecnologia.id;

  const nome = document.createElement("strong");
  nome.textContent = tecnologia.nome;
  textoConfirmacao.replaceChildren("Excluir ", nome, "? Esta ação não pode ser desfeita.");

  abrirModal(modalConfirmacao, origem);
}

async function confirmarExclusao() {
  const tecnologia = getTecnologia(idParaExcluir);
  if (!tecnologia || botaoConfirmarExclusao.disabled) return;

  setCarregando(botaoConfirmarExclusao, true);

  try {
    await api.deleteTecnologia(tecnologia.id);
    removerTecnologia(tecnologia.id);
    fecharModal(modalConfirmacao);
    atualizarTela();
    console.log(`[OK] ${tecnologia.nome} excluída`);
  } catch (erro) {
    console.log(`[ERRO] ${erro.message}`);
  } finally {
    setCarregando(botaoConfirmarExclusao, false);
  }
}

botaoConfirmarExclusao.addEventListener("click", confirmarExclusao);

// ====================================================================
// Delegação de eventos nos cards
// ====================================================================

listaTecnologias.addEventListener("click", (evento) => {
  const botao = evento.target.closest("button[data-action]");
  if (!botao) return;

  const tecnologia = getTecnologia(botao.dataset.id);
  if (!tecnologia) return;

  switch (botao.dataset.action) {
    case "editar":
      abrirModalTecnologia(botao, tecnologia);
      break;
    case "excluir":
      abrirConfirmacaoExclusao(botao, tecnologia);
      break;
  }
});

listaTecnologias.addEventListener("change", (evento) => {
  const select = evento.target.closest('select[data-action="mudar-status"]');
  if (!select) return;

  const tecnologia = getTecnologia(select.dataset.id);
  if (tecnologia) mudarStatus(tecnologia, select.value);
});

// ====================================================================
// Inicialização
// ====================================================================

for (const botao of document.querySelectorAll('[data-action="nova-tecnologia"]')) {
  botao.addEventListener("click", () => abrirModalTecnologia(botao));
}

formFiltros.addEventListener("input", lerFiltros);
formFiltros.addEventListener("change", lerFiltros);
formFiltros.addEventListener("submit", (evento) => evento.preventDefault());

botaoTentarNovamente.addEventListener("click", carregarDados);

lerFiltros();
carregarDados();
