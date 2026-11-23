// funções que montam/atualizam o DOM
// Não faz fetch: só recebe dados e desenha. Usa textContent/createElement
// (nunca innerHTML com dados do usuário).
import { CATEGORIAS, STATUS, NIVEL_MAX } from "./config.js";

const listaTecnologias = document.getElementById("lista-tecnologias");
const contagemTecnologias = document.getElementById("contagem-tecnologias");

// Cria um elemento com classes, texto e atributos.
function el(tag, { classe, texto, attrs } = {}, ...filhos) {
  const elemento = document.createElement(tag);
  if (classe) elemento.className = classe;
  if (texto !== undefined) elemento.textContent = texto;
  for (const [nome, valor] of Object.entries(attrs ?? {})) elemento.setAttribute(nome, valor);
  elemento.append(...filhos);
  return elemento;
}

// ---------- Formatação ----------

function barraNivel(nivel) {
  return `[${"■".repeat(nivel)}${"□".repeat(NIVEL_MAX - nivel)}]`;
}

// ---------- Peças reaproveitáveis ----------

function criarBadgeStatus(status) {
  const info = STATUS[status] ?? { rotulo: status, cor: "secondary" };
  return el("span", {
    classe: `badge border border-${info.cor} text-${info.cor}`,
    texto: `[${info.rotulo.toUpperCase()}]`,
  });
}

function criarNivel(nivel) {
  return el("span", {
    texto: barraNivel(nivel),
    attrs: { role: "img", "aria-label": `Nível ${nivel} de ${NIVEL_MAX}` },
  });
}

function criarBotao(texto, classe, tec, acao, rotulo) {
  return el("button", {
    classe: `btn ${classe}`,
    texto,
    attrs: { type: "button", "data-id": tec.id, "data-action": acao, "aria-label": rotulo },
  });
}

// ---------- Card de tecnologia ----------

function criarCard(tec) {
  const nome = tec.nome;

  const cabecalho = el("div", { classe: "d-flex justify-content-between align-items-start gap-2" },
    el("h3", { classe: "card-title h5 mb-0 text-break", texto: nome }),
    criarBadgeStatus(tec.status),
  );

  const categoria = el("div", {},
    el("span", {
      classe: "badge border border-secondary text-body-secondary",
      texto: (CATEGORIAS[tec.categoria] ?? tec.categoria).toUpperCase(),
    }),
  );

  const corpo = el("div", { classe: "card-body d-flex flex-column gap-3" }, cabecalho, categoria);

  if (tec.meta) {
    corpo.append(el("p", { classe: "card-text small text-body-secondary mb-0", texto: `Meta: ${tec.meta}` }));
  }

  // O nível só é alterado no modal de edição; aqui ele é apenas exibido.
  corpo.append(el("div", {}, criarNivel(tec.nivel)));

  const idSelect = `status-${tec.id}`;
  const select = el("select", {
    classe: "form-select form-select-sm",
    attrs: { id: idSelect, "data-id": tec.id, "data-action": "mudar-status" },
  });
  for (const [valor, info] of Object.entries(STATUS)) {
    const opcao = el("option", { texto: info.rotulo, attrs: { value: valor } });
    opcao.selected = valor === tec.status;
    select.append(opcao);
  }
  corpo.append(el("div", {},
    el("label", { classe: "form-label small mb-1", texto: "Status", attrs: { for: idSelect } }),
    select,
  ));

  const rodape = el("div", { classe: "card-footer d-flex flex-wrap gap-2" },
    criarBotao("Editar", "btn-outline-light btn-sm", tec, "editar", `Editar ${nome}`),
    criarBotao("Excluir", "btn-outline-danger btn-sm ms-auto", tec, "excluir", `Excluir ${nome}`),
  );

  return el("div", { classe: "col" }, el("article", { classe: "card h-100" }, corpo, rodape));
}

// ---------- Renderizações principais ----------

export function renderTecnologias(lista, totalCadastradas) {
  if (lista.length === 0) {
    listaTecnologias.replaceChildren(el("div", { classe: "col-12" },
      el("p", { classe: "text-body-secondary mb-0", texto: "Nenhuma tecnologia encontrada com esses filtros." }),
    ));
  } else {
    listaTecnologias.replaceChildren(...lista.map(criarCard));
  }

  contagemTecnologias.textContent = lista.length === totalCadastradas
    ? `Mostrando ${totalCadastradas} tecnologia(s).`
    : `Mostrando ${lista.length} de ${totalCadastradas} tecnologia(s).`;
}

export function limparTecnologias() {
  listaTecnologias.replaceChildren();
  contagemTecnologias.textContent = "";
}
