# DevTrack — Acompanhamento de Aprendizado Dev

Aplicação web (SPA simples) para acompanhar o que estou estudando: linguagens, frameworks e ferramentas, com o nível, o status e as sessões de estudo de cada um.

> **Princípio do projeto:** simples, mas tudo funcionando. Melhor ter poucas telas completas (com loading, erro, validação e acessibilidade) do que muitas pela metade.

---

## 1. Stack

| Camada | Escolha |
|---|---|
| Estrutura | HTML5 semântico (`header`, `nav`, `main`, `section`, `article`, `dialog`, `footer`) |
| Estilo | Bootstrap 5 (via CDN) + `css/style.css` para ajustes |
| Comportamento | JavaScript puro (ES Modules), **Fetch API** |
| Back-end em desenvolvimento | **json-server** local (mesmas rotas do MockAPI) |
| Back-end final | **MockAPI.io** (plano free: 1 projeto, 2 recursos) |

Sem jQuery, sem frameworks JS e sem build. Basta abrir com o Live Server.

---

## 2. Recursos da API (exatamente 2)

### `/tecnologias`
```json
{
  "id": "1",
  "nome": "JavaScript",
  "categoria": "linguagem",
  "nivel": 3,
  "status": "estudando",
  "meta": "Dominar async/await e Fetch",
  "criadoEm": "2026-11-06T18:00:00.000Z"
}
```
| Campo | Tipo | Regras |
|---|---|---|
| `nome` | string | obrigatório, 2–40 caracteres |
| `categoria` | string | `linguagem` \| `framework` \| `ferramenta` \| `conceito` |
| `nivel` | number | inteiro de 1 a 5 |
| `status` | string | `quero-aprender` \| `estudando` \| `domino` |
| `meta` | string | opcional, até 120 caracteres |
| `criadoEm` | string ISO | preenchido automaticamente no POST |

### `/sessoes`
```json
{
  "id": "1",
  "tecnologiaId": "1",
  "data": "2026-11-06",
  "minutos": 45,
  "anotacao": "Estudei Promise.all"
}
```
| Campo | Tipo | Regras |
|---|---|---|
| `tecnologiaId` | string | obrigatório (vem da tecnologia selecionada) |
| `data` | string `YYYY-MM-DD` | obrigatória, não pode ser no futuro |
| `minutos` | number | inteiro de 5 a 600 |
| `anotacao` | string | opcional, até 200 caracteres |

> As sessões de uma tecnologia são filtradas com `GET /sessoes?tecnologiaId=1`. Isso funciona tanto no json-server quanto no MockAPI.

---

## 3. Mapa dos verbos HTTP (o que o professor vai procurar)

| Verbo | Onde aparece na interface | Requisição |
|---|---|---|
| **GET** (lista) | Carregar o painel de tecnologias | `GET /tecnologias` |
| **GET** (único) | Abrir os detalhes de uma tecnologia | `GET /tecnologias/:id` |
| **GET** (filtrado) | Sessões da tecnologia aberta | `GET /sessoes?tecnologiaId=:id` |
| **POST** | Botão "Nova tecnologia" / "Registrar sessão" | `POST /tecnologias`, `POST /sessoes` |
| **PUT** | Formulário "Editar tecnologia" (envia o objeto completo) | `PUT /tecnologias/:id` |
| **PATCH** | Botões **+ / −** de nível e o seletor rápido de status no card | `PATCH /tecnologias/:id` com `{ "nivel": 4 }` |
| **DELETE** | Excluir tecnologia / excluir sessão | `DELETE /tecnologias/:id`, `DELETE /sessoes/:id` |

---

## 4. Telas e funcionalidades

Tudo acontece em **uma página só**. As trocas de conteúdo são feitas pelo DOM, sem recarregar a página.

### 4.1 Cabeçalho + resumo (dashboard)
- Título do app e o botão **"+ Nova tecnologia"**.
- Quatro cards de resumo, calculados no front a partir dos dados já carregados:
  - total de tecnologias;
  - quantas estão em "estudando";
  - horas estudadas no mês atual;
  - tecnologia mais estudada (a que tem mais minutos).

### 4.2 Painel de tecnologias
- Grade de cards (1 coluna no celular, 2 no tablet, 3 no desktop).
- Cada card mostra:
  - nome, badge da categoria e badge do status (com cor);
  - nível em estrelas (★★★☆☆) com `aria-label="Nível 3 de 5"`;
  - botões **−** e **+** para mudar o nível (**PATCH**);
  - `select` de status rápido (**PATCH**);
  - botões "Detalhes", "Editar" e "Excluir".
- **Filtros** no topo: categoria, status e busca por nome. São aplicados no front, sem nova requisição.
- **Ordenação:** nome, nível ou mais recentes.
- **Estado vazio:** "Você ainda não cadastrou nenhuma tecnologia", com um botão para cadastrar.

### 4.3 Modal de tecnologia (criar e editar)
- O mesmo formulário serve para **POST** (novo) e **PUT** (editar).
- Campos com `<label for>` corretos, mensagens de erro abaixo de cada campo (`aria-describedby`) e o botão "Salvar" desabilitado enquanto a requisição está em andamento.

### 4.4 Painel de detalhes
Pode ser um modal ou uma seção que expande.
- Dados da tecnologia e o total de horas estudadas nela.
- Lista das sessões, da mais recente para a mais antiga.
- Formulário inline **"Registrar sessão"** (data, minutos, anotação), que faz **POST** em `/sessoes`.
- Botão de excluir em cada sessão (**DELETE**).
- O total de horas e o dashboard são atualizados na hora após cada ação.

### 4.5 Exclusão
- Pedir confirmação com um modal do Bootstrap (não usar `confirm()`).
- Ao excluir uma tecnologia, **excluir também as sessões dela**: buscar as sessões e fazer um DELETE para cada uma (`Promise.all`). Só depois excluir a tecnologia.
  - O MockAPI não faz exclusão em cascata, então o front precisa cuidar disso.

### 4.6 Feedback (toasts)
- Toast de sucesso: "Tecnologia salva", "Sessão registrada" etc.
- Toast de erro com mensagem amigável, por exemplo: "Não foi possível conectar ao servidor. Tente novamente."

---

## 5. Estados da comunicação (requisito obrigatório)

Toda chamada à API precisa tratar estes três estados:

1. **Carregando:** mostrar um spinner com `role="status"` e texto visualmente oculto ("Carregando…"), além de desabilitar o botão que disparou a ação.
2. **Sucesso:** atualizar o DOM e mostrar um toast.
3. **Erro:**
   - testar `response.ok`; se for falso, lançar um erro com o `status`;
   - envolver as chamadas em `try/catch` para pegar falhas de rede;
   - mostrar a mensagem e manter os dados do formulário (não perder o que o usuário digitou);
   - no carregamento inicial, mostrar um bloco de erro com o botão **"Tentar novamente"**.

**Atualização otimista no PATCH (opcional, mas fica muito bom):** atualizar as estrelas na hora; se a requisição falhar, voltar ao valor anterior e mostrar o erro.

---

## 6. Validação client-side

- Usar os atributos HTML (`required`, `minlength`, `maxlength`, `min`, `max`) **e** uma validação em JS, para controlar as mensagens.
- Validar no `submit` e também no `blur` de cada campo.
- Marcar os campos com erro usando a classe `is-invalid` do Bootstrap e `aria-invalid="true"`.
- Levar o foco para o primeiro campo com erro.
- Regras extras:
  - não permitir nome de tecnologia duplicado (comparar sem diferenciar maiúsculas e minúsculas, usando a lista já carregada);
  - não permitir data no futuro;
  - minutos precisam ser um número inteiro.

---

## 7. Estrutura de arquivos

```
devtrack/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── config.js        # BASE_URL (troca local ↔ MockAPI aqui)
│   ├── api.js           # funções de fetch (uma por operação)
│   ├── state.js         # dados em memória + filtros atuais
│   ├── render.js        # funções que montam/atualizam o DOM
│   ├── validation.js    # regras de validação dos formulários
│   ├── ui.js            # toasts, spinners, modais de confirmação
│   └── main.js          # inicialização e listeners de eventos
├── db.json              # dados de exemplo para o json-server
└── README.md
```

### Responsabilidades (qualidade de código)
- **`api.js`** tem uma função genérica `request(path, options)`. Ela faz o `fetch`, checa `response.ok`, converte para JSON e lança erros. As funções específicas usam essa base: `getTecnologias()`, `getTecnologia(id)`, `createTecnologia(dados)`, `updateTecnologia(id, dados)`, `patchTecnologia(id, campos)`, `deleteTecnologia(id)`, `getSessoes(tecnologiaId)`, `createSessao(dados)`, `deleteSessao(id)`.
- **`render.js`** não faz fetch. Ele só recebe dados e desenha.
- **`main.js`** liga os eventos: chama a API, atualiza o `state` e chama o `render`.
- Nenhum `onclick` no HTML. Usar `addEventListener` com **delegação de eventos** no container dos cards (`data-id` e `data-action` nos botões).
- Montar os elementos com `textContent` ou `createElement`. Evitar `innerHTML` com dados do usuário, para não abrir brecha de XSS.

---

## 8. Back-end: desenvolvimento local → MockAPI no final

### Durante o desenvolvimento
1. `npm install -g json-server`
2. Criar um `db.json` com `"tecnologias": [...]` e `"sessoes": [...]`, usando ids **em string** (como o MockAPI).
3. `json-server --watch db.json --port 3000`
4. Em `config.js`: `export const BASE_URL = "http://localhost:3000";`

### Migração para o MockAPI (etapa final)
1. Criar o projeto no MockAPI e os 2 recursos, `tecnologias` e `sessoes`, com os mesmos campos da seção 2.
2. Trocar o `BASE_URL` em `config.js` pela URL do projeto (`https://<id>.mockapi.io/api/v1`).
3. **Testar cada verbo** no navegador (aba Network). Atenção especial a:
   - o **PATCH** funciona como esperado?
   - o filtro `?tecnologiaId=` funciona?
   - o formato de erro (404) é tratado corretamente?
4. Cadastrar alguns dados reais para a apresentação.

> Como tudo passa pelo `api.js` + `config.js`, a migração deve mexer em **uma linha só**. Se algo se comportar diferente no MockAPI, o ajuste fica concentrado no `api.js`.

---

## 9. Acessibilidade (checklist)

- [ ] `<html lang="pt-BR">` e `<title>` descritivo
- [ ] Um único `<h1>` e hierarquia correta de títulos
- [ ] Todo campo tem um `<label>` associado
- [ ] Botões de ícone (+, −, lixeira) com `aria-label`
- [ ] Estrelas de nível com texto alternativo ("Nível 3 de 5")
- [ ] Toasts em uma região `aria-live="polite"`
- [ ] Modais: o foco vai para dentro ao abrir e volta para o botão de origem ao fechar (o Bootstrap já ajuda), e `Esc` fecha
- [ ] Tudo usável só com teclado (Tab, Enter, Espaço), com foco visível
- [ ] Contraste das badges conferido (por exemplo, no WebAIM Contrast Checker)
- [ ] Status não indicado só por cor: a badge também tem texto

## 10. Responsividade (checklist)

- [ ] Grade de cards: 1, 2 ou 3 colunas (`row-cols-1 row-cols-md-2 row-cols-lg-3`)
- [ ] Filtros empilhados no celular e em linha no desktop
- [ ] Modais em tela cheia no celular (`modal-fullscreen-sm-down`)
- [ ] Botões com área de toque confortável (mínimo de cerca de 44px)
- [ ] Testado em cerca de 375px e cerca de 1366px de largura

---

## 11. Plano de execução (fases)

### Fase 1: Estrutura
- [ ] `index.html` semântico com cabeçalho, dashboard, filtros, grade e modais (estáticos)
- [ ] Bootstrap + `style.css` com a identidade visual básica
- [ ] `db.json` com 5–6 tecnologias e algumas sessões de exemplo

### Fase 2: Leitura (GET)
- [ ] `api.js` com `request()` e tratamento de erro
- [ ] Carregar e renderizar os cards, com estados de carregando, vazio e erro
- [ ] Filtros, busca e ordenação no front
- [ ] Dashboard calculado

### Fase 3: Escrita
- [ ] Criar tecnologia (POST) com validação
- [ ] Editar tecnologia (PUT), reaproveitando o mesmo modal
- [ ] Nível +/− e status rápido (PATCH)
- [ ] Excluir tecnologia com confirmação e cascata (DELETE)

### Fase 4: Sessões
- [ ] Painel de detalhes (GET único + GET filtrado)
- [ ] Registrar sessão (POST) com validação
- [ ] Excluir sessão (DELETE)
- [ ] Recalcular as horas e o dashboard

### Fase 5: Acabamento
- [ ] Toasts em todas as ações
- [ ] Revisar os checklists de acessibilidade e responsividade
- [ ] Revisar o código: sem duplicação, nomes claros, sem `console.log` esquecido

### Fase 6: MockAPI
- [ ] Criar os recursos e trocar o `BASE_URL`
- [ ] Testar todos os verbos no MockAPI
- [ ] Popular com dados reais
- [ ] README com descrição, como rodar, prints e link do MockAPI

---

## 12. Extras (só se sobrar tempo)

- Gráfico simples de minutos por tecnologia, feito com barras em CSS (sem biblioteca)
- Tema claro/escuro (`data-bs-theme`)
- Contador de dias seguidos estudando (streak), calculado a partir das sessões
- Exportar os dados em JSON

---

## 13. Requisitos do enunciado × onde estão atendidos

| Requisito | Onde |
|---|---|
| HTML semântico | Seção 4 + checklist 9 |
| CSS / Bootstrap | Seção 1 |
| Responsividade | Checklist 10 |
| Manipulação do DOM (adicionar, remover, editar) | Cards, sessões e dashboard (seção 4) |
| Validação client-side | Seção 6 |
| Fetch API | `api.js` (seção 7) |
| GET, POST, PUT, PATCH, DELETE | Seção 3 |
| Back-end simulado (MockAPI) | Seção 8 |
| Estados de carregamento e erro + `response.ok` | Seção 5 |
| Qualidade do código | Seção 7 |
| Acessibilidade | Checklist 9 |
