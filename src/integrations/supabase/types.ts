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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          event_name: string
          id: string
          ip_address: unknown | null
          page_url: string | null
          properties: Json | null
          referrer: string | null
          session_id: string | null
          timestamp: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          event_name: string
          id?: string
          ip_address?: unknown | null
          page_url?: string | null
          properties?: Json | null
          referrer?: string | null
          session_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          event_name?: string
          id?: string
          ip_address?: unknown | null
          page_url?: string | null
          properties?: Json | null
          referrer?: string | null
          session_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_subscriptions: {
        Row: {
          assigned_technician_id: string | null
          auto_renewal: boolean | null
          bandwidth_usage_gb: number | null
          created_at: string
          customer_id: string | null
          end_date: string | null
          id: string
          installation_address: string | null
          installation_notes: string | null
          package_id: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_technician_id?: string | null
          auto_renewal?: boolean | null
          bandwidth_usage_gb?: number | null
          created_at?: string
          customer_id?: string | null
          end_date?: string | null
          id?: string
          installation_address?: string | null
          installation_notes?: string | null
          package_id?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_technician_id?: string | null
          auto_renewal?: boolean | null
          bandwidth_usage_gb?: number | null
          created_at?: string
          customer_id?: string | null
          end_date?: string | null
          id?: string
          installation_address?: string | null
          installation_notes?: string | null
          package_id?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_subscriptions_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_subscriptions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_subscriptions_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "internet_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      internet_packages: {
        Row: {
          created_at: string
          data_limit_gb: number | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          is_promotional: boolean | null
          name: string
          price_monthly: number
          price_setup: number | null
          promotional_end_date: string | null
          promotional_price: number | null
          speed_mbps: number
          terms_conditions: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_limit_gb?: number | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_promotional?: boolean | null
          name: string
          price_monthly: number
          price_setup?: number | null
          promotional_end_date?: string | null
          promotional_price?: number | null
          speed_mbps: number
          terms_conditions?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_limit_gb?: number | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          is_promotional?: boolean | null
          name?: string
          price_monthly?: number
          price_setup?: number | null
          promotional_end_date?: string | null
          promotional_price?: number | null
          speed_mbps?: number
          terms_conditions?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          billing_period_end: string | null
          billing_period_start: string | null
          created_at: string
          customer_id: string | null
          due_date: string
          id: string
          invoice_number: string
          payment_method: string | null
          status: string
          subscription_id: string | null
          tax_amount: number | null
          total_amount: number
          usage_details: Json | null
        }
        Insert: {
          amount: number
          billing_period_end?: string | null
          billing_period_start?: string | null
          created_at?: string
          customer_id?: string | null
          due_date: string
          id?: string
          invoice_number: string
          payment_method?: string | null
          status?: string
          subscription_id?: string | null
          tax_amount?: number | null
          total_amount: number
          usage_details?: Json | null
        }
        Update: {
          amount?: number
          billing_period_end?: string | null
          billing_period_start?: string | null
          created_at?: string
          customer_id?: string | null
          due_date?: string
          id?: string
          invoice_number?: string
          payment_method?: string | null
          status?: string
          subscription_id?: string | null
          tax_amount?: number | null
          total_amount?: number
          usage_details?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "customer_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      network_logs: {
        Row: {
          created_at: string
          error_message: string | null
          event_type: string
          id: string
          node_id: string | null
          response_time_ms: number | null
          status: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_type: string
          id?: string
          node_id?: string | null
          response_time_ms?: number | null
          status: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_type?: string
          id?: string
          node_id?: string | null
          response_time_ms?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "network_logs_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "network_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      network_nodes: {
        Row: {
          coordinates: unknown | null
          created_at: string
          id: string
          ip_address: unknown
          last_ping: string | null
          location: string
          name: string
          node_type: string
          response_time_ms: number | null
          status: string
          uptime_percentage: number | null
        }
        Insert: {
          coordinates?: unknown | null
          created_at?: string
          id?: string
          ip_address: unknown
          last_ping?: string | null
          location: string
          name: string
          node_type: string
          response_time_ms?: number | null
          status?: string
          uptime_percentage?: number | null
        }
        Update: {
          coordinates?: unknown | null
          created_at?: string
          id?: string
          ip_address?: unknown
          last_ping?: string | null
          location?: string
          name?: string
          node_type?: string
          response_time_ms?: number | null
          status?: string
          uptime_percentage?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          priority: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          priority?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          priority?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          account_number: string | null
          created_at: string
          customer_id: string
          id: string
          is_active: boolean | null
          is_default: boolean | null
          metadata: Json | null
          method_type: string
          provider: string
          updated_at: string
        }
        Insert: {
          account_number?: string | null
          created_at?: string
          customer_id: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          metadata?: Json | null
          method_type: string
          provider: string
          updated_at?: string
        }
        Update: {
          account_number?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          metadata?: Json | null
          method_type?: string
          provider?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          customer_id: string
          failure_reason: string | null
          gateway_reference: string | null
          gateway_response: Json | null
          id: string
          invoice_id: string | null
          payment_method_id: string | null
          processed_at: string | null
          status: string
          transaction_type: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          customer_id: string
          failure_reason?: string | null
          gateway_reference?: string | null
          gateway_response?: Json | null
          id?: string
          invoice_id?: string | null
          payment_method_id?: string | null
          processed_at?: string | null
          status: string
          transaction_type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          customer_id?: string
          failure_reason?: string | null
          gateway_reference?: string | null
          gateway_response?: Json | null
          id?: string
          invoice_id?: string | null
          payment_method_id?: string | null
          processed_at?: string | null
          status?: string
          transaction_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          customer_id: string | null
          gateway_response: Json | null
          id: string
          invoice_id: string | null
          payment_method: string
          processed_at: string | null
          status: string
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          gateway_response?: Json | null
          id?: string
          invoice_id?: string | null
          payment_method: string
          processed_at?: string | null
          status?: string
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          customer_id?: string | null
          gateway_response?: Json | null
          id?: string
          invoice_id?: string | null
          payment_method?: string
          processed_at?: string | null
          status?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_status: Database["public"]["Enums"]["account_status"]
          address: string | null
          created_at: string
          email: string
          email_verified: boolean | null
          full_name: string
          id: string
          last_login: string | null
          onboarding_completed: boolean | null
          phone: string | null
          phone_verified: boolean | null
          preferred_payment_method: string | null
          role: Database["public"]["Enums"]["user_role"]
          two_factor_enabled: boolean | null
          updated_at: string
        }
        Insert: {
          account_status?: Database["public"]["Enums"]["account_status"]
          address?: string | null
          created_at?: string
          email: string
          email_verified?: boolean | null
          full_name: string
          id: string
          last_login?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          phone_verified?: boolean | null
          preferred_payment_method?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          two_factor_enabled?: boolean | null
          updated_at?: string
        }
        Update: {
          account_status?: Database["public"]["Enums"]["account_status"]
          address?: string | null
          created_at?: string
          email?: string
          email_verified?: boolean | null
          full_name?: string
          id?: string
          last_login?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          phone_verified?: boolean | null
          preferred_payment_method?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          two_factor_enabled?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      real_time_notifications: {
        Row: {
          channel: string
          created_at: string
          data: Json | null
          event_type: string
          expires_at: string | null
          id: string
          is_broadcast: boolean | null
          is_read: boolean | null
          message: string
          priority: string | null
          title: string
          user_id: string | null
        }
        Insert: {
          channel: string
          created_at?: string
          data?: Json | null
          event_type: string
          expires_at?: string | null
          id?: string
          is_broadcast?: boolean | null
          is_read?: boolean | null
          message: string
          priority?: string | null
          title: string
          user_id?: string | null
        }
        Update: {
          channel?: string
          created_at?: string
          data?: Json | null
          event_type?: string
          expires_at?: string | null
          id?: string
          is_broadcast?: boolean | null
          is_read?: boolean | null
          message?: string
          priority?: string | null
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: Database["public"]["Enums"]["ticket_category"]
          created_at: string
          customer_id: string | null
          customer_satisfaction_rating: number | null
          description: string
          escalated_at: string | null
          id: string
          priority: Database["public"]["Enums"]["ticket_priority"]
          resolution: string | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          ticket_number: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category: Database["public"]["Enums"]["ticket_category"]
          created_at?: string
          customer_id?: string | null
          customer_satisfaction_rating?: number | null
          description: string
          escalated_at?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          resolution?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          ticket_number: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: Database["public"]["Enums"]["ticket_category"]
          created_at?: string
          customer_id?: string | null
          customer_satisfaction_rating?: number | null
          description?: string
          escalated_at?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["ticket_priority"]
          resolution?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          ticket_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_metrics: {
        Row: {
          id: string
          metric_name: string
          metric_type: string
          recorded_at: string
          tags: Json | null
          unit: string | null
          value: number
        }
        Insert: {
          id?: string
          metric_name: string
          metric_type: string
          recorded_at?: string
          tags?: Json | null
          unit?: string | null
          value: number
        }
        Update: {
          id?: string
          metric_name?: string
          metric_type?: string
          recorded_at?: string
          tags?: Json | null
          unit?: string | null
          value?: number
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          attachments: Json | null
          created_at: string
          id: string
          is_internal_note: boolean | null
          message: string
          sender_id: string | null
          ticket_id: string | null
        }
        Insert: {
          attachments?: Json | null
          created_at?: string
          id?: string
          is_internal_note?: boolean | null
          message: string
          sender_id?: string | null
          ticket_id?: string | null
        }
        Update: {
          attachments?: Json | null
          created_at?: string
          id?: string
          is_internal_note?: boolean | null
          message?: string
          sender_id?: string | null
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_metrics: {
        Row: {
          average_speed_mbps: number | null
          created_at: string
          customer_id: string | null
          date: string
          download_mb: number | null
          id: string
          peak_speed_mbps: number | null
          session_duration_minutes: number | null
          subscription_id: string | null
          upload_mb: number | null
        }
        Insert: {
          average_speed_mbps?: number | null
          created_at?: string
          customer_id?: string | null
          date: string
          download_mb?: number | null
          id?: string
          peak_speed_mbps?: number | null
          session_duration_minutes?: number | null
          subscription_id?: string | null
          upload_mb?: number | null
        }
        Update: {
          average_speed_mbps?: number | null
          created_at?: string
          customer_id?: string | null
          date?: string
          download_mb?: number | null
          id?: string
          peak_speed_mbps?: number | null
          session_duration_minutes?: number | null
          subscription_id?: string | null
          upload_mb?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "usage_metrics_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usage_metrics_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "customer_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      vouchers: {
        Row: {
          applicable_packages: string[] | null
          code: string
          created_at: string
          created_by: string | null
          current_uses: number | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          type: string
          valid_from: string
          valid_until: string
          value: number
        }
        Insert: {
          applicable_packages?: string[] | null
          code: string
          created_at?: string
          created_by?: string | null
          current_uses?: number | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          type: string
          valid_from?: string
          valid_until: string
          value: number
        }
        Update: {
          applicable_packages?: string[] | null
          code?: string
          created_at?: string
          created_by?: string | null
          current_uses?: number | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          type?: string
          valid_from?: string
          valid_until?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "vouchers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_invoice_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_ticket_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin_or_support: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      account_status: "active" | "suspended" | "terminated" | "pending"
      ticket_category:
        | "network_issue"
        | "payment"
        | "billing"
        | "technical_support"
        | "installation"
        | "equipment"
      ticket_priority: "low" | "medium" | "high" | "critical"
      ticket_status:
        | "open"
        | "in_progress"
        | "waiting_customer"
        | "resolved"
        | "closed"
      user_role: "customer" | "admin" | "support" | "technician" | "superadmin"
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
    Enums: {
      account_status: ["active", "suspended", "terminated", "pending"],
      ticket_category: [
        "network_issue",
        "payment",
        "billing",
        "technical_support",
        "installation",
        "equipment",
      ],
      ticket_priority: ["low", "medium", "high", "critical"],
      ticket_status: [
        "open",
        "in_progress",
        "waiting_customer",
        "resolved",
        "closed",
      ],
      user_role: ["customer", "admin", "support", "technician", "superadmin"],
    },
  },
} as const
