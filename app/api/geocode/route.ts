export const dynamic = "force-dynamic";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter required" },
        { status: 400 },
      );
    }

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: query,
          format: "json",
          limit: 5,
          addressdetails: 1,
        },
        headers: {
          "User-Agent": "TripNest/1.0",
        },
      },
    );

    const results = response.data.map((item) => ({
      place_id: item.place_id,
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      address: item.address,
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error("Geocode error:", error);
    return NextResponse.json(
      { error: "Geocoding failed" },
      { status: 500 },
    );
  }
}

