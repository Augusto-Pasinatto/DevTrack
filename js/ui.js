// toasts, spinners, modais de confirmação

const estados = {
  carregando: document.getElementById("estado-carregando"),
  erro: document.getElementById("estado-erro"),
  vazio: document.getElementById("estado-vazio"),
  lista: document.getElementById("lista-tecnologias"),
};
const mensagemErro = estados.erro.querySelector("p");

/**
 * Mostra só um dos estados do painel de tecnologias:
 * "carregando" | "erro" | "vazio" | "lista".
 */
export function mostrarEstado(nome, mensagem) {
  for (const [chave, elemento] of Object.entries(estados)) {
    elemento.classList.toggle("d-none", chave !== nome);
  }
  if (nome === "erro" && mensagem) mensagemErro.textContent = mensagem;
}

// ---------- Toasts ----------

const areaToasts = document.getElementById("area-toasts");
const templateToast = document.getElementById("template-toast");

const TIPOS_TOAST = {
  ok: { prefixo: "[OK]", borda: "border-success" },
  erro: { prefixo: "[ERRO]", borda: "border-danger" },
};

export function mostrarToast(mensagem, tipo = "ok") {
  const { prefixo, borda } = TIPOS_TOAST[tipo] ?? TIPOS_TOAST.ok;
  const toast = templateToast.content.firstElementChild.cloneNode(true);

  toast.classList.remove("border-success");
  toast.classList.add(borda);
  toast.querySelector(".toast-body").textContent = `${prefixo} ${mensagem}`;

  areaToasts.append(toast);
  toast.addEventListener("hidden.bs.toast", () => toast.remove());
  window.bootstrap.Toast.getOrCreateInstance(toast).show();
}

// ---------- Spinner nos botões ----------

// Desabilita o botão e mostra o spinner dele enquanto a requisição roda.
export function setCarregando(botao, carregando) {
  botao.disabled = carregando;
  botao.setAttribute("aria-busy", String(carregando));
  botao.querySelector(".spinner-border")?.classList.toggle("d-none", !carregando);
}

// ---------- Modais ----------

const BOTAO_PADRAO_FOCO = '[data-action="nova-tecnologia"]';

/**
 * Abre um modal lembrando qual botão o abriu. Ao fechar, o foco volta para
 * esse botão; se ele tiver sido redesenhado, procura o equivalente (mesmo
 * data-id e data-action); se não existir mais, vai para "Nova tecnologia".
 */
export function abrirModal(elemento, origem) {
  const { id, action } = origem?.dataset ?? {};

  elemento.addEventListener("hidden.bs.modal", () => {
    const equivalente = id && action
      ? document.querySelector(`[data-action="${action}"][data-id="${CSS.escape(id)}"]`)
      : null;
    const destino = [origem, equivalente, document.querySelector(BOTAO_PADRAO_FOCO)]
      .find((el) => el?.isConnected && !el.disabled && el.offsetParent !== null);
    destino?.focus();
  }, { once: true });

  window.bootstrap.Modal.getOrCreateInstance(elemento).show();
}

export function fecharModal(elemento) {
  window.bootstrap.Modal.getOrCreateInstance(elemento).hide();
}

// Depois de redesenhar a lista, devolve o foco ao botão equivalente do card.
// `acoes` em ordem de preferência (ex.: "+" chegou a 5 e ficou desabilitado → "−").
export function focarBotaoDoCard(id, acoes) {
  for (const acao of acoes) {
    const botao = document.querySelector(`[data-action="${acao}"][data-id="${CSS.escape(String(id))}"]`);
    if (botao && !botao.disabled) {
      botao.focus();
      return;
    }
  }
}

// ---------- Erros de formulário ----------

// Marca (ou desmarca, se `mensagem` for vazia) um campo como inválido.
export function marcarCampo(campo, mensagem) {
  const feedback = document.getElementById(`${campo.id}-erro`);
  campo.classList.toggle("is-invalid", Boolean(mensagem));
  if (mensagem) {
    campo.setAttribute("aria-invalid", "true");
    if (feedback) feedback.textContent = mensagem;
  } else {
    campo.removeAttribute("aria-invalid");
  }
}

/**
 * Aplica o resultado da validação em todos os campos do formulário e
 * leva o foco ao primeiro campo com erro. Devolve true se não houver erros.
 */
export function mostrarErrosFormulario(form, erros) {
  let primeiro = null;
  for (const campo of form.elements) {
    if (!campo.name) continue;
    marcarCampo(campo, erros[campo.name]);
    if (erros[campo.name] && !primeiro) primeiro = campo;
  }
  primeiro?.focus();
  return primeiro === null;
}

export function limparErrosFormulario(form) {
  for (const campo of form.elements) {
    if (campo.name) marcarCampo(campo, null);
  }
}
