export type AfterShipTracking = {
  id: string;
  tracking_number: string;
  slug: string;
  tracking_status:
    | "pending"
    | "info_received"
    | "in_transit"
    | "out_for_delivery"
    | "delivered"
    | "delivery_failed"
    | "exception";
  shipped_at: string | null;
  delivered_at: string | null;
  estimated_delivery: string | null;
  tag: string;
};

export type AfterShipTrackingResponse = {
  tracking: AfterShipTracking;
};

export type AfterShipWebhookPayload = {
  event: string;
  msg: {
    tracking: AfterShipTracking;
  };
};
