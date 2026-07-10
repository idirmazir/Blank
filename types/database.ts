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
