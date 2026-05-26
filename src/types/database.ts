// Auto-generate with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts
// Placeholder types until Supabase project is connected

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar_url: string | null;
          is_admin: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      posts: {
        Row: {
          id: string;
          author_id: string | null;
          title: string;
          content: string;
          category: string | null;
          is_pinned: boolean;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["posts"]["Row"], "id" | "is_pinned" | "is_verified" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["posts"]["Insert"]>;
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          parent_id: string | null;
          author_id: string | null;
          content: string;
          is_verified: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["comments"]["Row"], "id" | "is_verified" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["comments"]["Insert"]>;
      };
      votes: {
        Row: {
          id: string;
          user_id: string;
          target_id: string;
          target_type: "post" | "comment";
          value: 1 | -1;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["votes"]["Row"], "id" | "created_at">;
        Update: never;
      };
      resources: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: string;
          type: "pdf" | "link" | "video";
          url: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["resources"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["resources"]["Insert"]>;
      };
      roadmap_topics: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: string;
          order_index: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["roadmap_topics"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["roadmap_topics"]["Insert"]>;
      };
      topic_completions: {
        Row: {
          id: string;
          user_id: string;
          topic_id: string;
          completed_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["topic_completions"]["Row"], "id" | "completed_at">;
        Update: never;
      };
    };
  };
}
