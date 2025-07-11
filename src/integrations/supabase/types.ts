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
      admin_actions: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string | null
          id: string
          new_role: string | null
          old_role: string | null
          reason: string | null
          target_user_id: string
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string | null
          id?: string
          new_role?: string | null
          old_role?: string | null
          reason?: string | null
          target_user_id: string
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string | null
          id?: string
          new_role?: string | null
          old_role?: string | null
          reason?: string | null
          target_user_id?: string
        }
        Relationships: []
      }
      api_rate_limits: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          ip_address: unknown
          request_count: number | null
          user_id: string | null
          window_start: string | null
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          ip_address: unknown
          request_count?: number | null
          user_id?: string | null
          window_start?: string | null
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          ip_address?: unknown
          request_count?: number | null
          user_id?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      blocked_devices: {
        Row: {
          blocked_at: string | null
          blocked_by_user: boolean | null
          customer_account_id: string
          device_mac: string
          device_name: string | null
          id: string
          reason: string | null
        }
        Insert: {
          blocked_at?: string | null
          blocked_by_user?: boolean | null
          customer_account_id: string
          device_mac: string
          device_name?: string | null
          id?: string
          reason?: string | null
        }
        Update: {
          blocked_at?: string | null
          blocked_by_user?: boolean | null
          customer_account_id?: string
          device_mac?: string
          device_name?: string | null
          id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blocked_devices_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
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
      customer_accounts: {
        Row: {
          account_number: string
          bandwidth_limit: number | null
          created_at: string | null
          data_quota: number | null
          id: string
          internet_password: string
          service_status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_number: string
          bandwidth_limit?: number | null
          created_at?: string | null
          data_quota?: number | null
          id?: string
          internet_password: string
          service_status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_number?: string
          bandwidth_limit?: number | null
          created_at?: string | null
          data_quota?: number | null
          id?: string
          internet_password?: string
          service_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      data_usage: {
        Row: {
          created_at: string | null
          customer_account_id: string
          date: string
          download_mb: number | null
          id: string
          total_mb: number | null
          upload_mb: number | null
        }
        Insert: {
          created_at?: string | null
          customer_account_id: string
          date: string
          download_mb?: number | null
          id?: string
          total_mb?: number | null
          upload_mb?: number | null
        }
        Update: {
          created_at?: string | null
          customer_account_id?: string
          date?: string
          download_mb?: number | null
          id?: string
          total_mb?: number | null
          upload_mb?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "data_usage_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      failed_login_attempts: {
        Row: {
          attempt_time: string | null
          email: string
          id: string
          ip_address: unknown
          user_agent: string | null
        }
        Insert: {
          attempt_time?: string | null
          email: string
          id?: string
          ip_address: unknown
          user_agent?: string | null
        }
        Update: {
          attempt_time?: string | null
          email?: string
          id?: string
          ip_address?: unknown
          user_agent?: string | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          payment_reminders: boolean | null
          security_alerts: boolean | null
          sms_notifications: boolean | null
          updated_at: string | null
          usage_alerts: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          payment_reminders?: boolean | null
          security_alerts?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string | null
          usage_alerts?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          payment_reminders?: boolean | null
          security_alerts?: boolean | null
          sms_notifications?: boolean | null
          updated_at?: string | null
          usage_alerts?: boolean | null
          user_id?: string
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
      password_change_logs: {
        Row: {
          changed_at: string | null
          id: string
          ip_address: unknown | null
          password_type: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          changed_at?: string | null
          id?: string
          ip_address?: unknown | null
          password_type: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          changed_at?: string | null
          id?: string
          ip_address?: unknown | null
          password_type?: string
          user_agent?: string | null
          user_id?: string
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
      profiles: {
        Row: {
          address: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_active: boolean | null
          phone: number | null
          promoted_at: string | null
          promoted_by: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean | null
          phone?: number | null
          promoted_at?: string | null
          promoted_by?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          phone?: number | null
          promoted_at?: string | null
          promoted_by?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      security_events: {
        Row: {
          created_at: string | null
          description: string
          event_type: string
          id: string
          ip_address: unknown | null
          severity: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          event_type: string
          id?: string
          ip_address?: unknown | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          event_type?: string
          id?: string
          ip_address?: unknown | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      service_requests: {
        Row: {
          admin_notes: string | null
          created_at: string | null
          current_bandwidth: number | null
          current_package_id: string | null
          customer_account_id: string
          id: string
          processed_at: string | null
          processed_by: string | null
          reason: string | null
          request_type: string
          requested_bandwidth: number | null
          requested_package_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string | null
          current_bandwidth?: number | null
          current_package_id?: string | null
          customer_account_id: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          request_type: string
          requested_bandwidth?: number | null
          requested_package_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string | null
          current_bandwidth?: number | null
          current_package_id?: string | null
          customer_account_id?: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          request_type?: string
          requested_bandwidth?: number | null
          requested_package_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_requests_current_package_id_fkey"
            columns: ["current_package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_customer_account_id_fkey"
            columns: ["customer_account_id"]
            isOneToOne: false
            referencedRelation: "customer_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_requests_requested_package_id_fkey"
            columns: ["requested_package_id"]
            isOneToOne: false
            referencedRelation: "packages"
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
      user_sessions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_activity: string | null
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      change_user_role: {
        Args: { target_user_id: string; new_role: string; reason?: string }
        Returns: boolean
      }
      check_rate_limit: {
        Args: { p_email: string; p_ip_address: unknown }
        Returns: boolean
      }
      get_admin_actions_with_profiles: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          admin_id: string
          target_user_id: string
          action_type: string
          old_role: string
          new_role: string
          reason: string
          created_at: string
          admin_name: string
          admin_email: string
          target_name: string
          target_email: string
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      log_failed_login: {
        Args: { p_email: string; p_ip_address: unknown; p_user_agent?: string }
        Returns: undefined
      }
      log_security_event: {
        Args: {
          p_user_id: string
          p_event_type: string
          p_description: string
          p_ip_address?: unknown
          p_user_agent?: string
          p_severity?: string
        }
        Returns: string
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
