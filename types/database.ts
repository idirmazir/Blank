export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      factories: {
        Row: {
          id: string
          name: string
          contact_name: string | null
          email: string | null
          phone: string | null
          wechat_id: string | null
          country: string
          payment_method: "wise" | "stripe_connect" | "paypal" | "wire" | "alipay"
          payment_details: Json
          shipping_origin_address: Json
          qc_requirements: Json
          active: boolean
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          contact_name?: string | null
          email?: string | null
          phone?: string | null
          wechat_id?: string | null
          country?: string
          payment_method?: "wise" | "stripe_connect" | "paypal" | "wire" | "alipay"
          payment_details?: Json
          shipping_origin_address?: Json
          qc_requirements?: Json
          active?: boolean
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          contact_name?: string | null
          email?: string | null
          phone?: string | null
          wechat_id?: string | null
          country?: string
          payment_method?: "wise" | "stripe_connect" | "paypal" | "wire" | "alipay"
          payment_details?: Json
          shipping_origin_address?: Json
          qc_requirements?: Json
          active?: boolean
          notes?: string | null
          created_at?: string
        }
        Relationships: []
      }
      order_factory_handoffs: {
        Row: {
          id: string
          order_id: string
          factory_id: string
          status: "pending" | "notified" | "paid" | "confirmed" | "rejected"
          payment_id: string | null
          payment_amount_cents: number | null
          payment_currency: string
          payment_status: string | null
          factory_reference: string | null
          notified_at: string | null
          paid_at: string | null
          confirmed_at: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          factory_id: string
          status?: "pending" | "notified" | "paid" | "confirmed" | "rejected"
          payment_id?: string | null
          payment_amount_cents?: number | null
          payment_currency?: string
          payment_status?: string | null
          factory_reference?: string | null
          notified_at?: string | null
          paid_at?: string | null
          confirmed_at?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          factory_id?: string
          status?: "pending" | "notified" | "paid" | "confirmed" | "rejected"
          payment_id?: string | null
          payment_amount_cents?: number | null
          payment_currency?: string
          payment_status?: string | null
          factory_reference?: string | null
          notified_at?: string | null
          paid_at?: string | null
          confirmed_at?: string | null
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_factory_handoffs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_factory_handoffs_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
        ]
      }
      order_shipments: {
        Row: {
          id: string
          order_id: string
          tracking_number: string | null
          carrier: string | null
          aftership_id: string | null
          status: "pending" | "info_received" | "in_transit" | "out_for_delivery" | "delivered" | "delivery_failed" | "exception"
          shipped_at: string | null
          delivered_at: string | null
          estimated_delivery: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          tracking_number?: string | null
          carrier?: string | null
          aftership_id?: string | null
          status?: "pending" | "info_received" | "in_transit" | "out_for_delivery" | "delivered" | "delivery_failed" | "exception"
          shipped_at?: string | null
          delivered_at?: string | null
          estimated_delivery?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          tracking_number?: string | null
          carrier?: string | null
          aftership_id?: string | null
          status?: "pending" | "info_received" | "in_transit" | "out_for_delivery" | "delivered" | "delivery_failed" | "exception"
          shipped_at?: string | null
          delivered_at?: string | null
          estimated_delivery?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_shipments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_returns: {
        Row: {
          id: string
          order_id: string
          order_item_id: string | null
          reason: string | null
          status: "requested" | "approved" | "rejected" | "shipped_to_factory" | "received_by_factory" | "refunded" | "closed"
          return_tracking_number: string | null
          return_carrier: string | null
          refund_amount_cents: number | null
          refund_id: string | null
          factory_reference: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          order_item_id?: string | null
          reason?: string | null
          status?: "requested" | "approved" | "rejected" | "shipped_to_factory" | "received_by_factory" | "refunded" | "closed"
          return_tracking_number?: string | null
          return_carrier?: string | null
          refund_amount_cents?: number | null
          refund_id?: string | null
          factory_reference?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          order_item_id?: string | null
          reason?: string | null
          status?: "requested" | "approved" | "rejected" | "shipped_to_factory" | "received_by_factory" | "refunded" | "closed"
          return_tracking_number?: string | null
          return_carrier?: string | null
          refund_amount_cents?: number | null
          refund_id?: string | null
          factory_reference?: string | null
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_returns_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_returns_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      qc_records: {
        Row: {
          id: string
          order_id: string
          factory_id: string
          qc_type: "pre_ship" | "post_delivery" | "return_inspection"
          status: "pending" | "passed" | "failed" | "conditional"
          inspector: string | null
          notes: string | null
          photos: string[]
          checklist: Json
          inspected_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          factory_id: string
          qc_type?: "pre_ship" | "post_delivery" | "return_inspection"
          status?: "pending" | "passed" | "failed" | "conditional"
          inspector?: string | null
          notes?: string | null
          photos?: string[]
          checklist?: Json
          inspected_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          factory_id?: string
          qc_type?: "pre_ship" | "post_delivery" | "return_inspection"
          status?: "pending" | "passed" | "failed" | "conditional"
          inspector?: string | null
          notes?: string | null
          photos?: string[]
          checklist?: Json
          inspected_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "qc_records_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qc_records_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          id: string
          order_id: string
          from_status: string | null
          to_status: string
          reason: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          from_status?: string | null
          to_status: string
          reason?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          from_status?: string | null
          to_status?: string
          reason?: string | null
          metadata?: Json | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          id: string
          email: string
          name: string | null
          source: string | null
          notified: boolean
          converted: boolean
          referral_code: string | null
          referral_count: number | null
          referred_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          source?: string | null
          notified?: boolean
          converted?: boolean
          referral_code?: string | null
          referral_count?: number | null
          referred_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          source?: string | null
          notified?: boolean
          converted?: boolean
          referral_code?: string | null
          referral_count?: number | null
          referred_by?: string | null
          created_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          price_cents: number
          product_id: string
          quantity: number
        }
        Insert: {
          id?: string
          order_id: string
          price_cents: number
          product_id: string
          quantity: number
        }
        Update: {
          id?: string
          order_id?: string
          price_cents?: number
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          email: string
          id: string
          shipping_address: Json | null
          status: string
          stripe_session_id: string | null
          total_cents: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          shipping_address?: Json | null
          status?: string
          stripe_session_id?: string | null
          total_cents: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          shipping_address?: Json | null
          status?: string
          stripe_session_id?: string | null
          total_cents?: number
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          category: string
          created_at: string
          currency: string
          description: string
          factory_id: string | null
          factory_cost_cents: number
          id: string
          image_urls: string[]
          lead_time_days: number
          name: string
          price_cents: number
          slug: string
          stock: number
        }
        Insert: {
          active?: boolean
          category?: string
          created_at?: string
          currency?: string
          description?: string
          factory_id?: string | null
          factory_cost_cents?: number
          id?: string
          image_urls?: string[]
          lead_time_days?: number
          name: string
          price_cents: number
          slug: string
          stock?: number
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          currency?: string
          description?: string
          factory_id?: string | null
          factory_cost_cents?: number
          id?: string
          image_urls?: string[]
          lead_time_days?: number
          name?: string
          price_cents?: number
          slug?: string
          stock?: number
        }
        Relationships: [
          {
            foreignKeyName: "products_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_product_stock: {
        Args: { p_product_id: string; p_quantity: number }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      increment_referral_count: {
        Args: { ref_code: string }
        Returns: undefined
      }
      log_order_status: {
        Args: {
          p_order_id: string
          p_to_status: string
          p_reason?: string | null
          p_metadata?: Json | null
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type OrderStatus = "pending" | "paid" | "factory_notified" | "factory_paid" | "shipped" | "delivered" | "returned" | "cancelled"

export type Product = Tables<"products">
export type Order = Tables<"orders">
export type OrderItem = Tables<"order_items">
export type Factory = Tables<"factories">
export type OrderFactoryHandoff = Tables<"order_factory_handoffs">
export type OrderShipment = Tables<"order_shipments">
export type OrderReturn = Tables<"order_returns">
export type QcRecord = Tables<"qc_records">
export type OrderStatusHistory = Tables<"order_status_history">
