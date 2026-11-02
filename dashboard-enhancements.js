(() => {
  const style = document.createElement("style");
  style.textContent = `
    .chart-controls{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:0 0 12px}
    .chart-controls span{font-size:.8rem;color:#66758b;font-weight:600}
    .chart-controls button{width:auto;margin:0;padding:7px 12px}
    .chart-controls button[aria-pressed="true"]{background:#1d4f91;color:#fff}
    .chart-controls button[aria-pressed="false"]{background:#edf3fb;color:#244365;border:1px solid #cad8e9}
    @media(max-width:1100px){.split{grid-template-columns:1fr}}
  `;
  document.head.append(style);

  const radarLink = [...document.querySelectorAll(".nav a")].find((link) =>
    link.textContent.includes("Radar de projeções e sinais"),
  );
  if (radarLink) radarLink.href = "brapi-radar-de-ativos-projecoes-e-sinais.html";

  let candleMode = false;
  const chartBox = document.querySelector(".chartbox");
  if (!chartBox || typeof drawChart !== "function") return;

  const controls = document.createElement("div");
  controls.className = "chart-controls";
  controls.setAttribute("role", "group");
  controls.setAttribute("aria-label", "Tipo de gráfico");
  controls.innerHTML = `
    <span>Visualização:</span>
    <button type="button" aria-pressed="true">Linha</button>
    <button type="button" aria-pressed="false">Candles</button>
  `;
  chartBox.after(controls);
  const [lineButton, candleButton] = controls.querySelectorAll("button");

  const candlePlugin = {
    id: "swingCandles",
    afterDatasetsDraw(chart) {
      if (!candleMode || !chart.$candleBars) return;
      const { ctx, chartArea, scales } = chart;
      const xScale = scales.x;
      const yScale = scales.y;
      const bars = chart.$candleBars;
      ctx.save();
      ctx.beginPath();
      ctx.rect(chartArea.left, chartArea.top, chartArea.width, chartArea.height);
      ctx.clip();

      for (let i = 0; i < bars.length; i++) {
        const bar = bars[i];
        if (![bar.open, bar.high, bar.low, bar.close].every(Number.isFinite)) continue;
        const x = xScale.getPixelForValue(i);
        const spacing = i + 1 < bars.length
          ? Math.abs(xScale.getPixelForValue(i + 1) - x)
          : chartArea.width / Math.max(chart.data.labels.length, 1);
        const width = Math.max(2, Math.min(12, spacing * 0.62));
        const up = bar.close >= bar.open;
        const color = up ? "#087f5b" : "#bd3345";
        const high = yScale.getPixelForValue(bar.high);
        const low = yScale.getPixelForValue(bar.low);
        const open = yScale.getPixelForValue(bar.open);
        const close = yScale.getPixelForValue(bar.close);

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, high);
        ctx.lineTo(x, low);
        ctx.stroke();
        const top = Math.min(open, close);
        const bodyHeight = Math.max(1, Math.abs(close - open));
        ctx.fillRect(x - width / 2, top, width, bodyHeight);
      }
      ctx.restore();
    },
  };
  Chart.register(candlePlugin);

  const originalDrawChart = drawChart;
  drawChart = function (asset) {
    originalDrawChart(asset);
    const chart = state.chart;
    const visibleBars = asset.analysis.bars.slice(-90);
    chart.$candleBars = visibleBars;

    const projectionValues = chart.data.datasets
      .filter((dataset) => ["P95", "Faixa P5–P95", "Mediana projetada"].includes(dataset.label))
      .flatMap((dataset) => dataset.data)
      .filter(Number.isFinite);
    const values = visibleBars
      .flatMap((bar) => [bar.high, bar.low])
      .filter(Number.isFinite)
      .concat(projectionValues);
    if (values.length) {
      const min = Math.min(...values);
      const max = Math.max(...values);
      const padding = (max - min) * 0.04 || max * 0.01;
      chart.options.scales.y.min = min - padding;
      chart.options.scales.y.max = max + padding;
    }

    chart.getDatasetMeta(0).hidden = candleMode;
    chart.update("none");
  };

  function setChartMode(useCandles) {
    candleMode = useCandles;
    lineButton.setAttribute("aria-pressed", String(!useCandles));
    candleButton.setAttribute("aria-pressed", String(useCandles));
    if (state.chart) {
      state.chart.getDatasetMeta(0).hidden = useCandles;
      state.chart.update("none");
    }
  }

  lineButton.addEventListener("click", () => setChartMode(false));
  candleButton.addEventListener("click", () => setChartMode(true));
})();
