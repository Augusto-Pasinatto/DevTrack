# DevTrack

Aplicação web para acompanhar o aprendizado de linguagens, frameworks, ferramentas e conceitos: cada tecnologia tem categoria, nível de 1 a 5, status e uma meta opcional.

Feita com HTML, Bootstrap e JavaScript (ES Modules + Fetch API), sem build e sem dependências instaladas. Os dados ficam no **MockAPI.io**.

## Funcionalidades

- Lista de tecnologias em cards (1, 2 ou 3 colunas conforme a largura da tela)
- Busca por nome, filtros por categoria e status e ordenação por nome ou nível, sem nova requisição
- Criar e editar no mesmo modal, com validação (inclusive nome duplicado)
- Mudar o status direto no card, com atualização otimista
- Excluir com modal de confirmação
- Estados de carregando, lista vazia e erro (com "Tentar novamente")
