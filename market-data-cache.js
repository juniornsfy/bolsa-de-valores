async function fetchCachedMarket(assets) {
  if (location.protocol === "file:") {
    throw new Error("Cache diário indisponível ao abrir o HTML como arquivo local.");
  }

  const response = await fetch(`market-data.json?v=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Cache diário HTTP ${response.status}`);

  const snapshot = await response.json();
  if (snapshot.schemaVersion !== 1 || !Array.isArray(snapshot.assets) ||
      snapshot.assetCount !== snapshot.assets.length) {
    throw new Error("Cache diário inválido ou incompleto.");
  }

  const expected = new Set(assets.map((asset) => asset.ticker));
  const barLimits = { "6mo": 130, "1y": 260, "2y": 520, "5y": 1300 };
  const quotes = snapshot.assets
    .filter((quote) => expected.has(quote.symbol))
    .map((quote) => ({
      ...quote,
      historicalDataPrice: quote.historicalDataPrice.slice(-(barLimits[$("range").value] || 260)),
    }));

  if (quotes.length !== assets.length) {
    throw new Error(`Cache contém ${quotes.length} de ${assets.length} ativos.`);
  }

  const generatedAt = new Date(snapshot.generatedAt);
  if (!Number.isFinite(generatedAt.getTime())) throw new Error("Data do cache diário inválida.");
  return { quotes, generatedAt };
}

fetchMarket = async function () {
  const selected = $("provider").value;
  const sources = selected === "auto"
    ? ["cache", "brapi", "yahoo", ...($("tvUrl").value.trim() ? ["tradingview"] : [])]
    : [selected];
  const byTicker = new Map();
  const failures = [];
  let cacheGeneratedAt = null;

  for (const source of sources) {
    const missing = ASSETS.filter((asset) => !byTicker.has(asset.ticker));
    if (!missing.length) break;

    try {
      if (source === "cache") {
        const snapshot = await fetchCachedMarket(missing);
        cacheGeneratedAt = snapshot.generatedAt;
        for (const row of buildRows(snapshot.quotes, source)) {
          if (!byTicker.has(row.ticker)) byTicker.set(row.ticker, row);
        }
        continue;
      }

      const quotes = source === "brapi"
        ? await fetchBrapi(missing)
        : source === "yahoo"
          ? await fetchYahoo(missing)
          : await fetchTradingView(missing);
      for (const row of buildRows(quotes, source)) {
        if (!byTicker.has(row.ticker)) byTicker.set(row.ticker, row);
      }
    } catch (error) {
      const message = source === "yahoo" && error.message === "Failed to fetch"
        ? "bloqueado pelo navegador (CORS ou rede)"
        : error.message;
      failures.push(`${source.toUpperCase()}: ${message}`);
      if (selected !== "auto") throw error;
    }
  }

  const rows = ASSETS.map((asset) => byTicker.get(asset.ticker)).filter(Boolean);
  const unavailable = ASSETS.filter((asset) => !byTicker.has(asset.ticker));
  if (!rows.length) {
    throw new Error(
      "Nenhuma fonte conseguiu carregar os dados. " +
      failures.join(" | ") +
      " O cache completo será publicado após a próxima execução do GitHub Actions.",
    );
  }

  const loadedSources = [...new Set(rows.map((row) => row.provider.toUpperCase()))];
  if (unavailable.length && loadedSources.includes("BRAPI")) {
    failures.push(
      `A brapi.dev sem autenticação cobre apenas alguns tickers de demonstração; ` +
      `${unavailable.length} ativos não carregaram.`,
    );
  } else if (unavailable.length) {
    failures.push(`${unavailable.length} ativos não têm histórico nas fontes consultadas.`);
  }

  if (cacheGeneratedAt && Date.now() - cacheGeneratedAt.getTime() > 36 * 60 * 60 * 1000) {
    failures.push(`Cache diário desatualizado desde ${cacheGeneratedAt.toLocaleString("pt-BR")}.`);
  }

  state.dataSource = loadedSources.join(" + ");
  state.dataWarnings = failures;
  return rows;
};
