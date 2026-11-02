# Plano de swing trade — agentes de IA, projeções e datas

> Material educacional. Não é recomendação personalizada de investimento, não garante resultado e não substitui um profissional habilitado. Swing trade em ações pode gerar perdas superiores ao esperado, inclusive em gaps de abertura que ultrapassam o stop.

## Sobre as datas e dicas específicas por ativo

As datas e os preços de compra/venda de cada ticker **dependem de cotações do dia**. Nesta sessão não consegui consultar cotações ao vivo, então não escrevi aqui datas fixas para PETR4, VALE3 etc. Elas ficariam desatualizadas ou inventadas.

Em vez disso, o painel (`index.html` e `radar-de-ativos-projecoes-e-sinais.html`) calcula tudo com os dados reais quando você clica em **Atualizar dados**, e o botão **Exportar plano (.md)** gera a versão datada deste documento (tabela por ativo com entrada, alvo, stop e saída por tempo).

## Os "agentes"

São módulos quantitativos determinísticos, não um modelo de linguagem. Cada um vota de −1 (vendedor) a +1 (comprador):

| Agente | O que avalia | Peso |
|---|---|---|
| Tendência | Preço vs MM20/MM50/MM200 e cruzamento MM20/MM50 | 25% |
| Momentum | Retorno 20d, histograma do MACD, RSI vs 50 | 20% |
| Monte Carlo | Chance de o preço terminar o horizonte acima do atual | 20% |
| Fluxo/volume | Volume relativo com candle de alta/baixa e +DI vs −DI | 10% |
| Reversão | RSI e %B das Bandas de Bollinger (sobrecompra/sobrevenda) | 10% |
| Risco/regime | Volatilidade anualizada | 15% |

**Consenso** = média ponderada. Classificação: ≥ 0,30 COMPRA FORTE · ≥ 0,12 COMPRA · entre −0,12 e 0,12 AGUARDAR · ≤ −0,12 REDUZIR · ≤ −0,30 VENDER. A **concordância** mostra quantos agentes apontam no mesmo sentido; consenso alto com concordância baixa merece cautela.

## Como o painel define níveis e datas

- **Entrada:** com consenso comprador, é o próximo pregão. Se RSI > 68 ou preço acima da banda superior, espera recuo até a MM20. Sem consenso comprador, mostra uma entrada condicional em recuo (banda inferior ou −1,5 ATR).
- **Stop:** maior valor entre 2×ATR e 0,35×volatilidade diária×√(horizonte).
- **Alvo:** 2R (o dobro da distância até o stop).
- **Datas de entrada e de alvo:** mediana do dia de ocorrência em 700 a 1.500 trajetórias simuladas por reamostragem dos últimos 250 retornos diários. A data é um ponto central, não uma promessa; veja também a probabilidade exibida ao lado.
- **Saída por tempo:** último pregão do horizonte (1 semana = 5 pregões; 1 mês ≈ 20; 3 meses ≈ 60; 6 meses ≈ 120). Se nem alvo nem stop forem atingidos, encerrar a posição.
- **Venda/redução:** com consenso vendedor, o painel indica o próximo pregão ou um repique até a MM20 (prazo de 5 pregões).
- Datas pulam fins de semana, mas **não** consideram feriados da B3.

## Piores cenários (estresse)

Para cada ativo e horizonte, o painel mostra:

1. **Base** — mediana das trajetórias.
2. **Adverso** — percentil 25.
3. **Severo** — percentil 5 (1 em cada 20 trajetórias termina pior).
4. **Estresse histórico** — a pior janela do mesmo tamanho no histórico carregado aplicada ao preço atual.
5. **Chance de queda superior a 10%** no horizonte.

Para análises de meses, prefira histórico de 2 a 5 anos, para que o estresse inclua períodos de crise.

## Regras práticas de gestão

- Risco por operação entre 0,5% e 1% do capital; o painel calcula a quantidade de ações a partir do stop.
- Só considere entradas com esperança positiva (em R), concordância ≥ 66% e relação retorno/risco ≥ 2.
- Evite concentrar vários ativos muito correlacionados (mesmo setor, como bancos ou mineração).
- Revise o plano a cada 5 pregões. Se o consenso virar para REDUZIR/VENDER antes do alvo, reavalie a saída.
- Antes de resultados trimestrais, dividendos ou eventos macro (Copom, fiscal), considere reduzir o tamanho: gaps ignoram o stop.
- Confira preços ajustados, liquidez e custos (corretagem, emolumentos, IR sobre ganho de capital) antes de operar.

## Limitações

- Monte Carlo por reamostragem repete o passado; não antecipa mudanças de regime, notícias ou eventos raros.
- A regressão e as médias descrevem tendência já ocorrida.
- A probabilidade de alvo/stop usa fechamentos diários, não máximas e mínimas intradiárias.
- Qualidade e atraso dos dados dependem do provedor (Yahoo Finance/TradingView).
