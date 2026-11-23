// regras de validação dos formulários
// Funções puras: recebem os dados e devolvem { campo: "mensagem" }.
// Objeto vazio = tudo certo. Quem marca os campos na tela é o ui.js.
import { CATEGORIAS, STATUS, NIVEL_MIN, NIVEL_MAX } from "./config.js";

const LIMITES = {
  nomeMin: 2,
  nomeMax: 40,
  metaMax: 120,
};

const mesmoNome = (a, b) => a.trim().toLocaleLowerCase("pt-BR") === b.trim().toLocaleLowerCase("pt-BR");

/**
 * Valida os dados do formulário de tecnologia.
 * `tecnologias` é a lista já carregada (para impedir nome duplicado) e
 * `idAtual` é o id da tecnologia em edição (ela não conta como duplicada).
 */
export function validarTecnologia(dados, { tecnologias = [], idAtual = null } = {}) {
  const erros = {};
  const nome = dados.nome.trim();

  if (nome.length < LIMITES.nomeMin || nome.length > LIMITES.nomeMax) {
    erros.nome = `Informe um nome entre ${LIMITES.nomeMin} e ${LIMITES.nomeMax} caracteres.`;
  } else if (tecnologias.some((tec) => String(tec.id) !== String(idAtual) && mesmoNome(tec.nome, nome))) {
    erros.nome = "Já existe uma tecnologia com esse nome.";
  }

  if (!Object.hasOwn(CATEGORIAS, dados.categoria)) {
    erros.categoria = "Escolha uma categoria.";
  }

  if (!Number.isInteger(dados.nivel) || dados.nivel < NIVEL_MIN || dados.nivel > NIVEL_MAX) {
    erros.nivel = `O nível deve ser um número inteiro de ${NIVEL_MIN} a ${NIVEL_MAX}.`;
  }

  if (!Object.hasOwn(STATUS, dados.status)) {
    erros.status = "Escolha um status.";
  }

  if (dados.meta.trim().length > LIMITES.metaMax) {
    erros.meta = `A meta pode ter no máximo ${LIMITES.metaMax} caracteres.`;
  }

  return erros;
}
