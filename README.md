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

Abra [index.html](./index.html) em um navegador e carregue os dados usando um provedor disponível. Cobertura, atraso e período histórico dependem do provedor e do plano. Watchlist, carteira e alertas ficam armazenados localmente no navegador; os alertas são verificados quando os dados são atualizados e a página está aberta. O backtest usa o histórico fornecido, com premissas simplificadas, e não representa desempenho futuro.