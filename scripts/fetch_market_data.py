#!/usr/bin/env python3
"""Build a public, daily OHLC snapshot for the static GitHub Pages dashboard."""

from __future__ import annotations

import argparse
import concurrent.futures
import json
import re
import time
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
USER_AGENT = "Mozilla/5.0 (compatible; bolsa-de-valores-market-cache/1.0)"


def load_assets() -> list[dict[str, str]]:
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    match = re.search(r"const ASSETS = (\[.*\]);", html)
    if not match:
        raise RuntimeError("Could not find the ASSETS list in index.html")
    assets = json.loads(match.group(1))
    if not assets or any(not item.get("ticker") for item in assets):
        raise RuntimeError("The ASSETS list is empty or contains an invalid ticker")
    return assets


def fetch_asset(asset: dict[str, str], period: str) -> dict[str, Any]:
    symbol = urllib.parse.quote(f'{asset["ticker"]}.SA')
    query = urllib.parse.urlencode({"range": period, "interval": "1d", "events": "div,splits"})
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}?{query}"
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    last_error: Exception | None = None

    for attempt in range(3):
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                payload = json.load(response)
            chart = payload.get("chart", {})
            result = (chart.get("result") or [None])[0]
            if result is None:
                description = (chart.get("error") or {}).get("description", "No history returned")
                raise RuntimeError(f'{asset["ticker"]}: {description}')

            timestamps = result.get("timestamp") or []
            quote = (result.get("indicators", {}).get("quote") or [{}])[0]
            adjusted = (result.get("indicators", {}).get("adjclose") or [{}])[0].get("adjclose") or []
            bars = []
            for index, timestamp in enumerate(timestamps):
                raw_close = quote.get("close", [])[index] if index < len(quote.get("close", [])) else None
                adjusted_close = adjusted[index] if index < len(adjusted) else None
                close = adjusted_close if adjusted_close is not None else raw_close
                if close is None or raw_close in (None, 0):
                    continue
                factor = close / raw_close

                def adjusted_ohlc(field: str) -> float | None:
                    values = quote.get(field, [])
                    value = values[index] if index < len(values) else None
                    return value * factor if value is not None else None

                open_price = adjusted_ohlc("open")
                high = adjusted_ohlc("high")
                low = adjusted_ohlc("low")
                if open_price is None or high is None or low is None:
                    continue
                bars.append(
                    {
                        "date": timestamp,
                        "open": open_price,
                        "high": high,
                        "low": low,
                        "close": close,
                        "volume": (quote.get("volume") or [None] * len(timestamps))[index] or 0,
                    }
                )

            if len(bars) < 35:
                raise RuntimeError(f'{asset["ticker"]}: only {len(bars)} valid daily bars')

            previous_close = bars[-2]["close"]
            return {
                "symbol": asset["ticker"],
                "shortName": result.get("meta", {}).get("longName")
                or result.get("meta", {}).get("shortName")
                or asset["name"],
                "regularMarketChangePercent": (bars[-1]["close"] / previous_close - 1) * 100,
                "historicalDataPrice": bars,
            }
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, RuntimeError) as error:
            last_error = error
            if attempt < 2:
                time.sleep(2**attempt)

    raise RuntimeError(f'{asset["ticker"]}: {last_error}')


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--range", default="5y", choices=("1y", "2y", "5y"))
    parser.add_argument("--output", type=Path, default=ROOT / "market-data.json")
    args = parser.parse_args()

    assets = load_assets()
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as executor:
        quotes = list(executor.map(lambda asset: fetch_asset(asset, args.range), assets))

    snapshot = {
        "schemaVersion": 1,
        "source": "Yahoo Finance chart API",
        "range": args.range,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "assetCount": len(quotes),
        "assets": quotes,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(snapshot, separators=(",", ":")) + "\n", encoding="utf-8")
    print(f'Wrote {len(quotes)} assets ({sum(len(item["historicalDataPrice"]) for item in quotes)} daily bars) to {args.output}')


if __name__ == "__main__":
    main()
