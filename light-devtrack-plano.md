# DevTrack Light — Plano da versão simplificada

Esta é a versão **light** do DevTrack (branch `light-devtrack`). Ela parte do que já estava pronto em [`devtrack-plano.md`](devtrack-plano.md) até a Fase 3, mas com um escopo menor: só **tecnologias**, sem sessões de estudo, sem tempo estudado e sem data de criação.

O objetivo é ter uma base mais simples e estável antes de continuar o projeto.

---

## 1. O que mudou em relação ao plano original

| # | Mudança | O que foi removido ou alterado |
|---|---|---|
| 1 | **Fim da aba Resumo** | Seção `#resumo` do HTML; `getResumo()` (state.js); `renderResumo()` e `formatarHoras()` (render.js). |
| 1 | **Fim do tempo estudado** | Recurso `/sessoes` inteiro: `getSessoes()`, `createSessao()` e `deleteSessao()` (api.js); `state.sessoes`, `setSessoes()` e `contarSessoes()` (state.js); exclusão em cascata das sessões; `sessoes` do `db.json`. |
| 1 | **Fim da data de criação** | Campo `criadoEm` (POST, PUT e `db.json`) e a ordenação "Mais recentes". |
| 2 | **Fim do botão Detalhes** | Botão no rodapé do card e o modal `#modal-detalhes` (que também tinha o formulário de sessões). |
| 3 | **Nível só no modal de editar** | Botões **−** e **+** do card e a função `mudarNivel()`. O card só **exibe** a barra `[■■■□□]`. |
| 4 | **Sem notificações (toasts)** | Área `#area-toasts`, `<template id="template-toast">` e `mostrarToast()` (ui.js). Sucesso e erro agora vão para o `console.log`, com os prefixos `[OK]` e `[ERRO]`. |
| 5 | **Novo cabeçalho** | `<h1>DevTrack</h1>` à esquerda e o botão **"+ Nova tecnologia"** à direita (`d-flex justify-content-between`). |

O que **continua igual**: filtros (busca, categoria e status), ordenação por nome e por nível, estados de carregando/vazio/erro (com "Tentar novamente"), validação client-side, modal de confirmação de exclusão e a atualização otimista do status no card.

---

## 2. Recurso da API (agora só 1)

### `/tecnologias`
```json
{
  "id": "1",
  "nome": "JavaScript",
  "categoria": "linguagem",
  "nivel": 3,
  "status": "estudando",
  "meta": "Dominar async/await e Fetch"
}
```
| Campo | Tipo | Regras |
|---|---|---|
| `nome` | string | obrigatório, 2–40 caracteres, sem duplicar |
| `categoria` | string | `linguagem` \| `framework` \| `ferramenta` \| `conceito` |
| `nivel` | number | inteiro de 1 a 5 (alterado só no modal de editar) |
| `status` | string | `quero-aprender` \| `estudando` \| `domino` |
| `meta` | string | opcional, até 120 caracteres |

---

## 3. Mapa dos verbos HTTP

| Verbo | Onde aparece na interface | Requisição |
|---|---|---|
| **GET** | Carregar o painel de tecnologias | `GET /tecnologias` |
| **POST** | Botão "+ Nova tecnologia" | `POST /tecnologias` |
| **PUT** | Modal "Editar" (objeto completo, inclusive o nível) | `PUT /tecnologias/:id` |
| **PUT** | Seletor rápido de status no card (objeto completo com o novo status) | `PUT /tecnologias/:id` |
| **DELETE** | Botão "Excluir" (com confirmação) | `DELETE /tecnologias/:id` |

> `getTecnologia(id)` (GET único) continua no `api.js`, mas hoje nenhuma tela usa. Ver a seção 6.

> **Sem PATCH: o MockAPI não aceita esse verbo.** O preflight de CORS dele responde `Access-Control-Allow-Methods: GET,PUT,POST,DELETE,OPTIONS`, e o navegador bloqueava o PATCH do status rápido (testado em 23/11/2026). Por isso o status rápido passou a usar **PUT** com o objeto completo, e `patchTecnologia()` saiu do `api.js`. Consequência: o projeto **não usa mais o verbo PATCH**, que aparece na lista de verbos do enunciado. Se isso for cobrado na avaliação, vale explicar essa limitação do MockAPI na apresentação.

---

## 4. Estado atual

### Feito
- [x] HTML semântico com cabeçalho (título + botão), filtros, grade de cards e modais de tecnologia e de confirmação
- [x] `api.js` com `request()` e tratamento de erro (`response.ok`, falha de rede, resposta que não é JSON)
- [x] Cards com estados de carregando, vazio e erro
- [x] Filtros e busca no front; ordenação por nome e por nível
- [x] Criar (POST) e editar (PUT) no mesmo modal, com validação no blur e no submit
- [x] Status rápido (PUT) com atualização otimista e volta ao valor anterior se falhar
- [x] Excluir (DELETE) com modal de confirmação
- [x] Feedback de sucesso e erro no `console.log`

### Falta fazer
- [ ] **Tema Hacker** (`css/style.css`): paleta, fonte JetBrains Mono e componentes da seção 14 do plano original. As partes sobre toasts e cards de resumo não se aplicam mais.
- [ ] **Migração para o MockAPI**
  - [ ] Tirar a barra final do `BASE_URL` em `js/config.js`: como os caminhos já começam com `/`, a URL fica `.../api/v1//tecnologias`. O MockAPI aceita, mas é melhor deixar limpo.
  - [x] No MockAPI, deixar o recurso `tecnologias` só com os campos da seção 2 (sem `criadoEm`) e apagar o recurso `sessoes`.
  - [x] Testar cada verbo contra o MockAPI: GET, POST, PUT e DELETE funcionam; PATCH é bloqueado (ver a seção 3).
  - [x] Trocar o PATCH do status rápido por PUT com o objeto completo.
  - [x] Cadastrar dados reais para a apresentação.
- [ ] **Revisar a acessibilidade** (checklist 9 do plano original, sem os itens de toast e de botões +/−)
- [ ] **Revisar a responsividade** (checklist 10 do plano original), principalmente o cabeçalho em ~375px
- [ ] **Atualizar o `README.md`**: ele ainda fala em sessões, resumo e fases do plano original
- [ ] **Atualizar o `bootstrap-explicacao.txt`**: ainda cita os cards de resumo, o modal de detalhes, as sessões e os toasts

---

## 5. Estrutura de arquivos

```
devtrack/
├── index.html
├── css/
│   └── style.css        # (a criar) tema Hacker
├── js/
│   ├── config.js        # BASE_URL, categorias, status, nível mín./máx.
│   ├── api.js           # request() + funções de /tecnologias
│   ├── state.js         # tecnologias em memória + filtros
│   ├── render.js        # monta os cards (sem fetch)
│   ├── validation.js    # regras do formulário de tecnologia
│   ├── ui.js            # estados da tela, spinners, modais, erros de formulário
│   └── main.js          # inicialização e listeners
├── db.json              # dados de exemplo para o json-server
├── devtrack-plano.md    # plano original (versão completa)
└── light-devtrack-plano.md
```

---

## 6. Possíveis alterações no futuro

Ideias para depois que a versão light estiver fechada. Nenhuma é obrigatória.

- **Feedback visível sem toast:** como o retorno agora só aparece no console, quem usa leitor de tela (ou não abre o DevTools) não fica sabendo se a ação deu certo. Uma opção leve é uma linha de status com `aria-live="polite"` perto da contagem de tecnologias, ou uma mensagem de erro dentro do próprio modal quando o salvar falhar.
- **Usar o GET único:** chamar `getTecnologia(id)` ao abrir o modal de edição, para editar sempre a versão mais nova do servidor. Isso também volta a mostrar o GET único na apresentação. Se não for usar, apagar a função do `api.js`.
- **Seletor de nível no modal:** trocar o `input type="number"` por 5 botões de rádio ou um `range`, para escolher o nível sem digitar.
- **Trazer as sessões de volta (opcional):** se o enunciado pedir 2 recursos no MockAPI, reaproveitar o plano original (seções 2, 4.4 e Fase 4), mas como uma etapa separada.
- **Ordenar por categoria ou status**, já que a ordenação "Mais recentes" saiu.
- **Remover os `console.log`** antes da entrega final, ou centralizar em uma função `log()` no `ui.js` para dar para desligar com uma linha.
- **Exportar os dados em JSON** (botão que baixa a lista atual).
