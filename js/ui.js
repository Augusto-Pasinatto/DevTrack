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
