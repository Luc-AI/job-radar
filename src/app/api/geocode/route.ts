import { NextRequest, NextResponse } from "next/server";

interface GeoapifyFeature {
  properties?: {
    city?: string;
    country?: string;
  };
}

interface GeoapifyResponse {
  features?: GeoapifyFeature[];
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q || q.trim().length < 2) {
    return NextResponse.json([]);
  }

  const apiKey = process.env.GEOAPIFY_API_KEY;
  if (!apiKey) {
    return NextResponse.json([]);
  }

  try {
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(q)}&type=city&limit=8&apiKey=${apiKey}`;
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
      return NextResponse.json([]);
    }

    const data: GeoapifyResponse = await res.json();
    const results = (data.features ?? [])
      .map((f) => {
        const city = f.properties?.city;
        const country = f.properties?.country;
        if (!city || !country) return null;
        return `${city}, ${country}`;
      })
      .filter((s): s is string => s !== null);

    // Deduplicate (API can return the same city/country pair multiple times)
    const unique = [...new Set(results)];
    return NextResponse.json(unique);
  } catch {
    return NextResponse.json([]);
  }
}
