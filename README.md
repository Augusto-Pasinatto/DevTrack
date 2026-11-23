# DevTrack (versão light)

Aplicação web para acompanhar o aprendizado de linguagens, frameworks, ferramentas e conceitos: cada tecnologia tem categoria, nível de 1 a 5, status e uma meta opcional.

Feita com HTML semântico, Bootstrap 5.3 (via CDN) e JavaScript puro (ES Modules + Fetch API), sem build e sem dependências instaladas. Os dados ficam no **MockAPI.io**.

- Plano desta versão: [`light-devtrack-plano.md`](light-devtrack-plano.md)
- Plano original (versão completa, com sessões e resumo): [`devtrack-plano.md`](devtrack-plano.md)
- Classes do Bootstrap usadas na página: [`bootstrap-explicacao.txt`](bootstrap-explicacao.txt)

## Como rodar

1. Abra o `index.html` com o **Live Server** do VS Code (ou qualquer servidor estático).
   - Abrir o arquivo direto (`file://`) não funciona, porque o navegador bloqueia ES Modules fora de um servidor.
2. A lista é carregada do MockAPI. O endereço fica em `js/config.js` (`BASE_URL`, sem barra no final).

Os avisos de sucesso e de erro das operações aparecem no **console do navegador** (F12), com os prefixos `[OK]` e `[ERRO]`.

## Funcionalidades

- Lista de tecnologias em cards (1, 2 ou 3 colunas conforme a largura da tela)
- Busca por nome, filtros por categoria e status e ordenação por nome ou nível, sem nova requisição
- Criar e editar no mesmo modal, com validação (inclusive nome duplicado)
- Mudar o status direto no card, com atualização otimista
- Excluir com modal de confirmação
- Estados de carregando, lista vazia e erro (com "Tentar novamente")

## Requisições

| Verbo | Onde | Rota |
|---|---|---|
| GET | Carregar a lista | `/tecnologias` |
| POST | "+ Nova tecnologia" | `/tecnologias` |
| PUT | Modal "Editar" e status rápido no card | `/tecnologias/:id` |
| DELETE | "Excluir" | `/tecnologias/:id` |

O MockAPI não aceita PATCH (o CORS dele só libera GET, PUT, POST e DELETE). Por isso o status rápido usa PUT com o objeto completo.

## Estrutura

```
├── index.html
├── js/
│   ├── config.js       # BASE_URL, categorias, status e limites do nível
│   ├── api.js          # request() + uma função por operação
│   ├── state.js        # tecnologias em memória, filtros e ordenação
│   ├── render.js       # monta os cards (não faz fetch)
│   ├── validation.js   # regras do formulário de tecnologia
│   ├── ui.js           # estados da tela, spinners, modais e erros de formulário
│   └── main.js         # inicialização e eventos
├── bootstrap-explicacao.txt
├── devtrack-plano.md
└── light-devtrack-plano.md
```

## Andamento

- [x] Estrutura, leitura (GET) e escrita (POST, PUT, DELETE)
- [x] Migração para o MockAPI
- [x] Revisão de acessibilidade e responsividade
- [ ] Tema Hacker (`css/style.css`)
