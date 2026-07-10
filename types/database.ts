export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      factories: {
        Row: {
          active: boolean
          contact_name: string | null
          country: string
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          payment_details: Json
          payment_method: string
          phone: string | null
          qc_requirements: Json
          shipping_origin_address: Json
          wechat_id: string | null
        }
        Insert: {
          active?: boolean
          contact_name?: string | null
          country?: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          payment_details?: Json
          payment_method?: string
          phone?: string | null
          qc_requirements?: Json
          shipping_origin_address?: Json
          wechat_id?: string | null
        }
        Update: {
          active?: boolean
          contact_name?: string | null
          country?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          payment_details?: Json
          payment_method?: string
          phone?: string | null
          qc_requirements?: Json
          shipping_origin_address?: Json
          wechat_id?: string | null
        }
        Relationships: []
      }
      order_factory_handoffs: {
        Row: {
          confirmed_at: string | null
          created_at: string
          factory_id: string
          factory_reference: string | null
          id: string
          notes: string | null
          notified_at: string | null
          order_id: string
          paid_at: string | null
          payment_amount_cents: number | null
          payment_currency: string
          payment_id: string | null
          payment_status: string | null
          status: string
        }
        Insert: {
          confirmed_at?: string | null
          created_at?: string
          factory_id: string
          factory_reference?: string | null
          id?: string
          notes?: string | null
          notified_at?: string | null
          order_id: string
          paid_at?: string | null
          payment_amount_cents?: number | null
          payment_currency?: string
          payment_id?: string | null
          payment_status?: string | null
          status?: string
        }
        Update: {
          confirmed_at?: string | null
          created_at?: string
          factory_id?: string
          factory_reference?: string | null
          id?: string
          notes?: string | null
          notified_at?: string | null
          order_id?: string
          paid_at?: string | null
          payment_amount_cents?: number | null
          payment_currency?: string
          payment_id?: string | null
          payment_status?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_factory_handoffs_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_factory_handoffs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
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
      order_returns: {
        Row: {
          created_at: string
          factory_reference: string | null
          id: string
          notes: string | null
          order_id: string
          order_item_id: string | null
          reason: string | null
          refund_amount_cents: number | null
          refund_id: string | null
          return_carrier: string | null
          return_tracking_number: string | null
          status: string
        }
        Insert: {
          created_at?: string
          factory_reference?: string | null
          id?: string
          notes?: string | null
          order_id: string
          order_item_id?: string | null
          reason?: string | null
          refund_amount_cents?: number | null
          refund_id?: string | null
          return_carrier?: string | null
          return_tracking_number?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          factory_reference?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          order_item_id?: string | null
          reason?: string | null
          refund_amount_cents?: number | null
          refund_id?: string | null
          return_carrier?: string | null
          return_tracking_number?: string | null
          status?: string
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
      order_shipments: {
        Row: {
          aftership_id: string | null
          carrier: string | null
          created_at: string
          delivered_at: string | null
          estimated_delivery: string | null
          id: string
          order_id: string
          shipped_at: string | null
          status: string
          tracking_number: string | null
        }
        Insert: {
          aftership_id?: string | null
          carrier?: string | null
          created_at?: string
          delivered_at?: string | null
          estimated_delivery?: string | null
          id?: string
          order_id: string
          shipped_at?: string | null
          status?: string
          tracking_number?: string | null
        }
        Update: {
          aftership_id?: string | null
          carrier?: string | null
          created_at?: string
          delivered_at?: string | null
          estimated_delivery?: string | null
          id?: string
          order_id?: string
          shipped_at?: string | null
          status?: string
          tracking_number?: string | null
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
      order_status_history: {
        Row: {
          created_at: string
          from_status: string | null
          id: string
          metadata: Json | null
          order_id: string
          reason: string | null
          to_status: string
        }
        Insert: {
          created_at?: string
          from_status?: string | null
          id?: string
          metadata?: Json | null
          order_id: string
          reason?: string | null
          to_status: string
        }
        Update: {
          created_at?: string
          from_status?: string | null
          id?: string
          metadata?: Json | null
          order_id?: string
          reason?: string | null
          to_status?: string
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
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          category: string
          compare_at_cents: number | null
          created_at: string
          currency: string
          description: string
          factory_cost_cents: number
          factory_id: string | null
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
          compare_at_cents?: number | null
          created_at?: string
          currency?: string
          description?: string
          factory_cost_cents?: number
          factory_id?: string | null
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
          compare_at_cents?: number | null
          created_at?: string
          currency?: string
          description?: string
          factory_cost_cents?: number
          factory_id?: string | null
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
      qc_records: {
        Row: {
          checklist: Json | null
          created_at: string
          factory_id: string
          id: string
          inspected_at: string | null
          inspector: string | null
          notes: string | null
          order_id: string
          photos: string[] | null
          qc_type: string
          status: string
        }
        Insert: {
          checklist?: Json | null
          created_at?: string
          factory_id: string
          id?: string
          inspected_at?: string | null
          inspector?: string | null
          notes?: string | null
          order_id: string
          photos?: string[] | null
          qc_type?: string
          status?: string
        }
        Update: {
          checklist?: Json | null
          created_at?: string
          factory_id?: string
          id?: string
          inspected_at?: string | null
          inspector?: string | null
          notes?: string | null
          order_id?: string
          photos?: string[] | null
          qc_type?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "qc_records_factory_id_fkey"
            columns: ["factory_id"]
            isOneToOne: false
            referencedRelation: "factories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qc_records_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist: {
        Row: {
          converted: boolean
          created_at: string
          email: string
          id: string
          name: string | null
          notified: boolean
          referral_code: string | null
          referral_count: number | null
          referred_by: string | null
          source: string | null
        }
        Insert: {
          converted?: boolean
          created_at?: string
          email: string
          id?: string
          name?: string | null
          notified?: boolean
          referral_code?: string | null
          referral_count?: number | null
          referred_by?: string | null
          source?: string | null
        }
        Update: {
          converted?: boolean
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          notified?: boolean
          referral_code?: string | null
          referral_count?: number | null
          referred_by?: string | null
          source?: string | null
        }
        Relationships: []
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
      increment_referral_count: {
        Args: { ref_code: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      log_order_status: {
        Args: {
          p_metadata?: Json
          p_order_id: string
          p_reason?: string
          p_to_status: string
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
