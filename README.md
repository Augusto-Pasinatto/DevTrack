# DevTrack

Aplicação web para acompanhar o aprendizado de linguagens, frameworks e ferramentas, com nível, status e sessões de estudo. O plano completo está em [`devtrack-plano.md`](devtrack-plano.md).

## Como rodar (desenvolvimento)

1. Instale o json-server: `npm install -g json-server`
2. Na pasta do projeto, suba a API com os dados de exemplo: `json-server db.json --port 3000`
   - Confira se `http://127.0.0.1:3000/tecnologias` mostra uma lista em JSON. Usamos `127.0.0.1` em vez de `localhost` porque algumas redes bloqueiam `localhost` pelo proxy. Se aparecer uma página HTML, a rede ou outro programa na porta 3000 está respondendo no lugar do json-server.
3. Abra o `index.html` com o Live Server do VS Code.

A URL da API fica em `js/config.js` (`BASE_URL`).

## Andamento

- [x] Fase 1: estrutura (HTML e dados de exemplo). O tema Hacker em `css/style.css` ainda está pendente.
- [x] Fase 2: leitura (GET), filtros, ordenação e resumo
- [ ] Fase 3: escrita (POST, PUT, PATCH, DELETE)
- [ ] Fase 4: sessões
- [ ] Fase 5: acabamento
- [ ] Fase 6: MockAPI
