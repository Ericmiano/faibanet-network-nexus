export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      connectivity_logs: {
        Row: {
          checked_at: string
          customer_id: string | null
          id: string
          notes: string | null
          response_time: number | null
          status: string
        }
        Insert: {
          checked_at?: string
          customer_id?: string | null
          id?: string
          notes?: string | null
          response_time?: number | null
          status: string
        }
        Update: {
          checked_at?: string
          customer_id?: string | null
          id?: string
          notes?: string | null
          response_time?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "connectivity_logs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_packages: {
        Row: {
          created_at: string
          customer_id: string | null
          end_date: string | null
          id: string
          is_active: boolean
          package_id: string | null
          start_date: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          package_id?: string | null
          start_date?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean
          package_id?: string | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_packages_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_packages_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          gps_location: string | null
          id: string
          installation_date: string
          name: string
          phone: string
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          gps_location?: string | null
          id?: string
          installation_date?: string
          name: string
          phone: string
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          gps_location?: string | null
          id?: string
          installation_date?: string
          name?: string
          phone?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      packages: {
        Row: {
          bandwidth_cap: number | null
          created_at: string
          features: string[] | null
          id: string
          name: string
          price: number
          speed: string
          status: string
          updated_at: string
        }
        Insert: {
          bandwidth_cap?: number | null
          created_at?: string
          features?: string[] | null
          id?: string
          name: string
          price: number
          speed: string
          status?: string
          updated_at?: string
        }
        Update: {
          bandwidth_cap?: number | null
          created_at?: string
          features?: string[] | null
          id?: string
          name?: string
          price?: number
          speed?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_notifications: {
        Row: {
          created_at: string
          customer_id: string | null
          error_message: string | null
          id: string
          message: string
          payment_id: string | null
          phone_number: string
          sent_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          error_message?: string | null
          id?: string
          message: string
          payment_id?: string | null
          phone_number: string
          sent_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          error_message?: string | null
          id?: string
          message?: string
          payment_id?: string | null
          phone_number?: string
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_notifications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_notifications_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_queue: {
        Row: {
          account_reference: string | null
          amount: number
          created_at: string
          error_message: string | null
          id: string
          payment_source: string
          phone_number: string
          processed_at: string | null
          raw_data: Json | null
          status: string
          transaction_id: string
        }
        Insert: {
          account_reference?: string | null
          amount: number
          created_at?: string
          error_message?: string | null
          id?: string
          payment_source: string
          phone_number: string
          processed_at?: string | null
          raw_data?: Json | null
          status?: string
          transaction_id: string
        }
        Update: {
          account_reference?: string | null
          amount?: number
          created_at?: string
          error_message?: string | null
          id?: string
          payment_source?: string
          phone_number?: string
          processed_at?: string | null
          raw_data?: Json | null
          status?: string
          transaction_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          account_reference: string | null
          amount: number
          created_at: string
          customer_id: string | null
          id: string
          mpesa_receipt_number: string | null
          payment_date: string
          payment_method: string
          payment_source: string | null
          phone_number: string | null
          processed_at: string | null
          reconciliation_status: string | null
          status: string
          transaction_id: string | null
        }
        Insert: {
          account_reference?: string | null
          amount: number
          created_at?: string
          customer_id?: string | null
          id?: string
          mpesa_receipt_number?: string | null
          payment_date?: string
          payment_method: string
          payment_source?: string | null
          phone_number?: string | null
          processed_at?: string | null
          reconciliation_status?: string | null
          status?: string
          transaction_id?: string | null
        }
        Update: {
          account_reference?: string | null
          amount?: number
          created_at?: string
          customer_id?: string | null
          id?: string
          mpesa_receipt_number?: string | null
          payment_date?: string
          payment_method?: string
          payment_source?: string | null
          phone_number?: string | null
          processed_at?: string | null
          reconciliation_status?: string | null
          status?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_notifications: {
        Row: {
          created_at: string
          customer_id: string | null
          id: string
          message: string
          phone_number: string
          sent_at: string | null
          status: string
          type: string
        }
        Insert: {
          created_at?: string
          customer_id?: string | null
          id?: string
          message: string
          phone_number: string
          sent_at?: string | null
          status?: string
          type: string
        }
        Update: {
          created_at?: string
          customer_id?: string | null
          id?: string
          message?: string
          phone_number?: string
          sent_at?: string | null
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "sms_notifications_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          created_at: string
          customer_id: string | null
          description: string | null
          id: string
          priority: string
          resolved_at: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          customer_id?: string | null
          description?: string | null
          id?: string
          priority?: string
          resolved_at?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          customer_id?: string | null
          description?: string | null
          id?: string
          priority?: string
          resolved_at?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
