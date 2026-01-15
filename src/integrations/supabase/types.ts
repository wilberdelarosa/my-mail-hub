export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          address: string | null
          city: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          rnc: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
          rnc?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          rnc?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          address: string | null
          authorized_by: string | null
          authorized_phone: string | null
          authorized_title: string | null
          bank_account_dop: string | null
          bank_account_usd: string | null
          bank_name: string | null
          cell: string | null
          city: string | null
          created_at: string | null
          email: string | null
          id: string
          itbis_rate: number | null
          logo_url: string | null
          name: string
          phone: string | null
          rnc: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          authorized_by?: string | null
          authorized_phone?: string | null
          authorized_title?: string | null
          bank_account_dop?: string | null
          bank_account_usd?: string | null
          bank_name?: string | null
          cell?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          itbis_rate?: number | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          rnc?: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          authorized_by?: string | null
          authorized_phone?: string | null
          authorized_title?: string | null
          bank_account_dop?: string | null
          bank_account_usd?: string | null
          bank_name?: string | null
          cell?: string | null
          city?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          itbis_rate?: number | null
          logo_url?: string | null
          name?: string
          phone?: string | null
          rnc?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      document_items: {
        Row: {
          control_number: string | null
          created_at: string | null
          description: string | null
          document_id: string
          equipment_id: string | null
          equipment_name: string
          execution_date: string | null
          id: string
          is_taxable: boolean | null
          quantity: number
          sort_order: number | null
          total: number
          unit: Database["public"]["Enums"]["unit_type"] | null
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          control_number?: string | null
          created_at?: string | null
          description?: string | null
          document_id: string
          equipment_id?: string | null
          equipment_name: string
          execution_date?: string | null
          id?: string
          is_taxable?: boolean | null
          quantity?: number
          sort_order?: number | null
          total?: number
          unit?: Database["public"]["Enums"]["unit_type"] | null
          unit_price?: number
          updated_at?: string | null
        }
        Update: {
          control_number?: string | null
          created_at?: string | null
          description?: string | null
          document_id?: string
          equipment_id?: string | null
          equipment_name?: string
          execution_date?: string | null
          id?: string
          is_taxable?: boolean | null
          quantity?: number
          sort_order?: number | null
          total?: number
          unit?: Database["public"]["Enums"]["unit_type"] | null
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_items_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_items_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          client_id: string | null
          created_at: string | null
          created_by: string | null
          document_number: string
          document_type: Database["public"]["Enums"]["document_type"]
          id: string
          issue_date: string
          itbis_amount: number | null
          location: string | null
          ncf: string | null
          ncf_expiry: string | null
          notes: string | null
          payment_terms: string | null
          prepared_by: string | null
          prepared_by_phone: string | null
          prepared_by_title: string | null
          received_by: string | null
          status: Database["public"]["Enums"]["document_status"] | null
          subtotal: number | null
          subtotal_exempt: number | null
          subtotal_taxable: number | null
          total: number | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          document_number: string
          document_type: Database["public"]["Enums"]["document_type"]
          id?: string
          issue_date?: string
          itbis_amount?: number | null
          location?: string | null
          ncf?: string | null
          ncf_expiry?: string | null
          notes?: string | null
          payment_terms?: string | null
          prepared_by?: string | null
          prepared_by_phone?: string | null
          prepared_by_title?: string | null
          received_by?: string | null
          status?: Database["public"]["Enums"]["document_status"] | null
          subtotal?: number | null
          subtotal_exempt?: number | null
          subtotal_taxable?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          created_by?: string | null
          document_number?: string
          document_type?: Database["public"]["Enums"]["document_type"]
          id?: string
          issue_date?: string
          itbis_amount?: number | null
          location?: string | null
          ncf?: string | null
          ncf_expiry?: string | null
          notes?: string | null
          payment_terms?: string | null
          prepared_by?: string | null
          prepared_by_phone?: string | null
          prepared_by_title?: string | null
          received_by?: string | null
          status?: Database["public"]["Enums"]["document_status"] | null
          subtotal?: number | null
          subtotal_exempt?: number | null
          subtotal_taxable?: number | null
          total?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      equipment: {
        Row: {
          category: string | null
          code: string | null
          created_at: string | null
          default_price: number | null
          default_unit: Database["public"]["Enums"]["unit_type"] | null
          description: string | null
          id: string
          is_active: boolean | null
          is_taxable: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          code?: string | null
          created_at?: string | null
          default_price?: number | null
          default_unit?: Database["public"]["Enums"]["unit_type"] | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_taxable?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          code?: string | null
          created_at?: string | null
          default_price?: number | null
          default_unit?: Database["public"]["Enums"]["unit_type"] | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_taxable?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_next_document_number: {
        Args: { doc_type: Database["public"]["Enums"]["document_type"] }
        Returns: string
      }
    }
    Enums: {
      document_status:
        | "borrador"
        | "enviado"
        | "aprobado"
        | "rechazado"
        | "pagado"
        | "cancelado"
      document_type: "cotizacion" | "proforma" | "factura"
      unit_type: "PA" | "VJ" | "DIA" | "M3" | "UN" | "HR" | "KG" | "LT"
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
      document_status: [
        "borrador",
        "enviado",
        "aprobado",
        "rechazado",
        "pagado",
        "cancelado",
      ],
      document_type: ["cotizacion", "proforma", "factura"],
      unit_type: ["PA", "VJ", "DIA", "M3", "UN", "HR", "KG", "LT"],
    },
  },
} as const
