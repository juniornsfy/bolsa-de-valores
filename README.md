# Bolsa de valores

Radar de análise de ativos da B3 para apoiar decisões de swing trade.

## Objetivo

Apoiar a busca por rentabilidade na bolsa por meio de análise técnica, gestão de risco e acompanhamento de operações. O painel é informativo: não garante ganhos, não oferece recomendação personalizada e não envia ordens.

## Recursos

- Cotações e histórico dos ativos cobertos pelos provedores disponíveis.
- Watchlist com tickers personalizados.
- Indicadores técnicos, incluindo médias móveis, RSI, MACD e ATR.
- Calculadora de tamanho de posição baseada no capital, risco e stop.
- Backtest de cruzamento de médias móveis com custos configuráveis.
- Diário de compras e vendas com custo médio e resultado estimado.
- Alertas de preço e de sinal técnico durante a atualização dos dados.
- Exportação de dados da análise em CSV.

## Uso e limitações

Abra [index.html](./index.html) em um navegador e carregue os dados usando um provedor disponível. No GitHub Pages, o workflow atualiza e publica um cache diário de até cinco anos para os ativos listados; a execução ocorre em dias úteis após o fechamento. A opção automática tenta esse cache primeiro, depois a brapi.dev pública e o Yahoo Finance. O cache usa o endpoint de gráficos do Yahoo Finance no servidor de CI para evitar bloqueios CORS no navegador; depende da disponibilidade e dos termos do provedor, não é uma cotação em tempo real e sua atualização pode atrasar. Se a atualização falhar, o workflow preserva a última publicação válida. A consulta sem chave da brapi.dev cobre apenas tickers públicos de demonstração. Watchlist, carteira e alertas ficam armazenados localmente no navegador; os alertas são verificados quando os dados são atualizados e a página está aberta. O backtest usa o histórico fornecido, com premissas simplificadas, e não representa desempenho futuro.

O workflow também pode ser iniciado manualmente em **Actions → Refresh market data and publish Pages → Run workflow**.
