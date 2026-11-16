# DevTrack

Aplicação web para acompanhar o aprendizado de linguagens, frameworks e ferramentas, com nível, status e sessões de estudo. O plano completo está em [`devtrack-plano.md`](devtrack-plano.md).

## Como rodar (desenvolvimento)

1. Na pasta do projeto, instale as dependências (uma vez só): `npm install`
2. Suba a API com os dados de exemplo: `npm run api`
   - Isso usa o **json-server 0.17.4** fixado no `package.json`. Não use a versão 1 (a que vem com `npm install -g json-server`): ela converte `?tecnologiaId=1` em número e o filtro de sessões nunca encontra nada, porque os ids são strings.
   - Confira se `http://127.0.0.1:3000/tecnologias` mostra uma lista em JSON. Usamos `127.0.0.1` em vez de `localhost` porque algumas redes bloqueiam `localhost` pelo proxy. Se aparecer uma página HTML, a rede ou outro programa na porta 3000 está respondendo no lugar do json-server.
   - O comando não usa `--watch`: nessa versão, o `--watch` reinicia o servidor a cada gravação no `db.json` e derruba as requisições seguintes. Se editar o `db.json` à mão, reinicie o `npm run api`.
3. Abra o `index.html` com o Live Server do VS Code. O `.vscode/settings.json` faz o Live Server ignorar o `db.json`, para a página não recarregar a cada gravação da API.

A URL da API fica em `js/config.js` (`BASE_URL`).

## Andamento

- [x] Fase 1: estrutura (HTML e dados de exemplo). O tema Hacker em `css/style.css` ainda está pendente.
- [x] Fase 2: leitura (GET), filtros, ordenação e resumo
- [x] Fase 3: escrita (POST, PUT, PATCH, DELETE)
- [ ] Fase 4: sessões
- [ ] Fase 5: acabamento
- [ ] Fase 6: MockAPI
