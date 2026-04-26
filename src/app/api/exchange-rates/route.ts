import { NextRequest, NextResponse } from "next/server";
import { getLatestRates } from "@/lib/vatcomply";

export async function GET(request: NextRequest) {
  const baseCurrency = request.nextUrl.searchParams.get("base")?.toUpperCase();
  const symbolsParam = request.nextUrl.searchParams.get("symbols");

  if (!baseCurrency) {
    return NextResponse.json(
      { message: "The 'base' query parameter is required." },
      { status: 400 }
    );
  }

  const symbols = symbolsParam
    ? symbolsParam
        .split(",")
        .map((symbol) => symbol.trim().toUpperCase())
        .filter(Boolean)
    : undefined;

  try {
    const exchangeRates = await getLatestRates(baseCurrency, symbols);

    return NextResponse.json(exchangeRates);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to load exchange rates.",
      },
      { status: 502 }
    );
  }
}