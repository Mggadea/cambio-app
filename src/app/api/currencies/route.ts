import { NextResponse } from "next/server";
import { getSupportedCurrencies } from "@/lib/vatcomply";

export async function GET() {
  try {
    const currencies = await getSupportedCurrencies();

    return NextResponse.json({ currencies });
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to load supported currencies.",
      },
      { status: 502 }
    );
  }
}