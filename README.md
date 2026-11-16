# DevTrack

Aplicação web para acompanhar o aprendizado de linguagens, frameworks e ferramentas, com nível, status e sessões de estudo. O plano completo está em [`devtrack-plano.md`](devtrack-plano.md).

## Como rodar (desenvolvimento)

1. Instale o json-server: `npm install -g json-server`
2. Suba a API com os dados de exemplo: `json-server --watch db.json --port 3000`
3. Abra o `index.html` com o Live Server (ou qualquer servidor estático, por exemplo `python3 -m http.server 5500`).

A URL da API fica em `js/config.js` (`BASE_URL`).

## Andamento

- [x] Fase 1: estrutura (HTML e dados de exemplo). O tema Hacker em `css/style.css` ainda está pendente.
- [x] Fase 2: leitura (GET), filtros, ordenação e resumo
- [ ] Fase 3: escrita (POST, PUT, PATCH, DELETE)
- [ ] Fase 4: sessões
- [ ] Fase 5: acabamento
- [ ] Fase 6: MockAPI
