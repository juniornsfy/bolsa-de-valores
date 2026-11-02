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
- Análise avançada do ativo selecionado: Bandas de Bollinger, ADX/DI, volume relativo, VaR/CVaR, Sharpe/Sortino, rebaixamento e força relativa frente à cesta.
- Pontuação multifator (tendência, momentum, fluxo e risco) e detecção de setups recentes (cruzamentos, rompimentos, compressão, volume anormal).
- Cenários de swing trade por simulação: probabilidade de alvo antes do stop e expectativa em R.
- Laboratório com cinco estratégias comparadas a comprar e manter, com curvas de patrimônio e métricas.
- Correlações, resumo por setor e scanner filtrável da cesta, com exportação em CSV.
- Histórico configurável (6 meses a 5 anos), sujeito ao plano do provedor.
- Exportação de dados da análise em CSV.

## Uso e limitações

Abra [index.html](./index.html) em um navegador e carregue os dados usando um provedor disponível. Cobertura, atraso e período histórico dependem do provedor e do plano. Watchlist, carteira e alertas ficam armazenados localmente no navegador; os alertas são verificados quando os dados são atualizados e a página está aberta. O backtest usa o histórico fornecido, com premissas simplificadas, e não representa desempenho futuro.