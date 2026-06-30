import type { AfterShipTracking, AfterShipTrackingResponse } from "./types";

const BASE_URL = "https://api.aftership.com/v4";

function getHeaders(): HeadersInit {
  const apiKey = process.env.AFTERSHIP_API_KEY;
  if (!apiKey) {
    throw new Error("AFTERSHIP_API_KEY is not set");
  }
  return {
    "aftership-api-key": apiKey,
    "Content-Type": "application/json",
  };
}

async function aftershipRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { ...getHeaders(), ...options.headers },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`AfterShip API error ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

// Register a tracking number with AfterShip
export async function createTracking(
  trackingNumber: string,
  slug: string,
  orderId: string,
): Promise<AfterShipTracking> {
  const body = {
    tracking: {
      tracking_number: trackingNumber,
      slug,
      order_id: orderId,
      title: `Order ${orderId.slice(0, 8)}`,
    },
  };

  const data = await aftershipRequest<AfterShipTrackingResponse>(
    "/trackings",
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );

  return data.tracking;
}

// Get tracking status by AfterShip ID
export async function getTracking(trackingId: string): Promise<AfterShipTracking> {
  const data = await aftershipRequest<AfterShipTrackingResponse>(
    `/trackings/${trackingId}`,
  );
  return data.tracking;
}

// Get tracking by number + slug
export async function getTrackingByNumber(
  trackingNumber: string,
  slug: string,
): Promise<AfterShipTracking> {
  const data = await aftershipRequest<AfterShipTrackingResponse>(
    `/trackings/${slug}/${trackingNumber}`,
  );
  return data.tracking;
}
