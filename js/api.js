// funções de fetch (uma por operação)
import { BASE_URL } from "./config.js";

const MENSAGEM_SEM_CONEXAO = "Não foi possível conectar ao servidor. Tente novamente.";
const MENSAGEM_RESPOSTA_INVALIDA =
  "O servidor respondeu em um formato inesperado. Confira se o endereço da API está correto.";

function mensagemPorStatus(status) {
  if (status === 404) return "O item não foi encontrado. Ele pode ter sido excluído.";
  if (status >= 500) return "O servidor encontrou um problema. Tente novamente mais tarde.";
  return `Não foi possível concluir a operação (erro ${status}).`;
}

/**
 * Base de todas as chamadas: faz o fetch, confere response.ok,
 * converte a resposta para JSON e lança um Error com mensagem amigável.
 * `body`, se informado, é convertido para JSON aqui.
 */
async function request(path, { method = "GET", body } = {}) {
  const opcoes = { method };
  if (body !== undefined) {
    opcoes.headers = { "Content-Type": "application/json" };
    opcoes.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, opcoes);
  } catch {
    throw new Error(MENSAGEM_SEM_CONEXAO);
  }

  if (!response.ok) {
    throw new Error(mensagemPorStatus(response.status));
  }

  const texto = await response.text();
  if (!texto) return null;

  try {
    return JSON.parse(texto);
  } catch {
    // Respondeu, mas não com JSON (ex.: BASE_URL errado devolvendo uma página HTML).
    throw new Error(MENSAGEM_RESPOSTA_INVALIDA);
  }
}

// ---------- Tecnologias ----------

export function getTecnologias() {
  return request("/tecnologias");
}

export function createTecnologia(dados) {
  return request("/tecnologias", { method: "POST", body: dados });
}

export function updateTecnologia(id, dados) {
  return request(`/tecnologias/${encodeURIComponent(id)}`, { method: "PUT", body: dados });
}

export function deleteTecnologia(id) {
  return request(`/tecnologias/${encodeURIComponent(id)}`, { method: "DELETE" });
}
