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
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          level: number
          xp: number
          is_vip: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          level?: number
          xp?: number
          is_vip?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          level?: number
          xp?: number
          is_vip?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          id: number
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role_id: number
          granted_at: string
          granted_by: string | null
        }
        Insert: {
          id?: string
          user_id: string
          role_id: number
          granted_at?: string
          granted_by?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          role_id?: number
          granted_by?: string | null
        }
        Relationships: []
      }
      genres: {
        Row: {
          id: number
          name: string
          slug: string
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          slug: string
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          slug?: string
        }
        Relationships: []
      }
      titles: {
        Row: {
          id: string
          slug: string
          title: string
          alternative_titles: string[] | null
          description: string | null
          cover_url: string | null
          banner_url: string | null
          category: 'manhwa' | 'manhua' | 'manga' | 'webtoon' | 'novel' | 'light_novel' | 'web_novel'
          status: 'ongoing' | 'completed' | 'hiatus' | 'cancelled'
          author: string | null
          artist: string | null
          rating: number
          rating_count: number
          views: number
          favorites_count: number
          chapters_count: number
          is_published: boolean
          published_at: string | null
          last_chapter_at: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          slug: string
          title: string
          alternative_titles?: string[] | null
          description?: string | null
          cover_url?: string | null
          banner_url?: string | null
          category: 'manhwa' | 'manhua' | 'manga' | 'webtoon' | 'novel' | 'light_novel' | 'web_novel'
          status?: 'ongoing' | 'completed' | 'hiatus' | 'cancelled'
          author?: string | null
          artist?: string | null
          rating?: number
          rating_count?: number
          views?: number
          favorites_count?: number
          chapters_count?: number
          is_published?: boolean
          published_at?: string | null
          last_chapter_at?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          alternative_titles?: string[] | null
          description?: string | null
          cover_url?: string | null
          banner_url?: string | null
          category?: 'manhwa' | 'manhua' | 'manga' | 'webtoon' | 'novel' | 'light_novel' | 'web_novel'
          status?: 'ongoing' | 'completed' | 'hiatus' | 'cancelled'
          author?: string | null
          artist?: string | null
          rating?: number
          rating_count?: number
          views?: number
          favorites_count?: number
          chapters_count?: number
          is_published?: boolean
          published_at?: string | null
          last_chapter_at?: string | null
          updated_at?: string
          created_by?: string | null
        }
        Relationships: []
      }
      title_genres: {
        Row: {
          title_id: string
          genre_id: number
        }
        Insert: {
          title_id: string
          genre_id: number
        }
        Update: {
          title_id?: string
          genre_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "title_genres_title_id_fkey"
            columns: ["title_id"]
            isOneToOne: false
            referencedRelation: "titles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "title_genres_genre_id_fkey"
            columns: ["genre_id"]
            isOneToOne: false
            referencedRelation: "genres"
            referencedColumns: ["id"]
          }
        ]
      }
      chapters: {
        Row: {
          id: string
          title_id: string
          number: number
          title: string | null
          slug: string
          content_type: 'images' | 'text'
          text_content: string | null
          pages_count: number
          views: number
          is_published: boolean
          published_at: string | null
          scheduled_at: string | null
          created_at: string
          updated_at: string
          created_by: string | null
        }
        Insert: {
          id?: string
          title_id: string
          number: number
          title?: string | null
          slug: string
          content_type?: 'images' | 'text'
          text_content?: string | null
          pages_count?: number
          views?: number
          is_published?: boolean
          published_at?: string | null
          scheduled_at?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
        }
        Update: {
          id?: string
          title_id?: string
          number?: number
          title?: string | null
          slug?: string
          content_type?: 'images' | 'text'
          text_content?: string | null
          pages_count?: number
          views?: number
          is_published?: boolean
          published_at?: string | null
          scheduled_at?: string | null
          updated_at?: string
          created_by?: string | null
        }
        Relationships: []
      }
      chapter_pages: {
        Row: {
          id: string
          chapter_id: string
          page_number: number
          image_url: string
          width: number | null
          height: number | null
          created_at: string
        }
        Insert: {
          id?: string
          chapter_id: string
          page_number: number
          image_url: string
          width?: number | null
          height?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          chapter_id?: string
          page_number?: number
          image_url?: string
          width?: number | null
          height?: number | null
        }
        Relationships: []
      }
      user_library: {
        Row: {
          id: string
          user_id: string
          title_id: string
          status: 'reading' | 'plan_to_read' | 'completed' | 'on_hold' | 'dropped'
          progress_chapter: number | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title_id: string
          status: 'reading' | 'plan_to_read' | 'completed' | 'on_hold' | 'dropped'
          progress_chapter?: number | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title_id?: string
          status?: 'reading' | 'plan_to_read' | 'completed' | 'on_hold' | 'dropped'
          progress_chapter?: number | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          title_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title_id?: string
        }
        Relationships: []
      }
      reading_history: {
        Row: {
          id: string
          user_id: string
          title_id: string
          chapter_id: string
          last_page: number
          progress_percent: number
          last_read_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title_id: string
          chapter_id: string
          last_page?: number
          progress_percent?: number
          last_read_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title_id?: string
          chapter_id?: string
          last_page?: number
          progress_percent?: number
          last_read_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          id: string
          user_id: string
          target_type: 'title' | 'chapter'
          target_id: string
          parent_id: string | null
          content: string
          likes_count: number
          is_spoiler: boolean
          is_hidden: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          target_type: 'title' | 'chapter'
          target_id: string
          parent_id?: string | null
          content: string
          likes_count?: number
          is_spoiler?: boolean
          is_hidden?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          target_type?: 'title' | 'chapter'
          target_id?: string
          parent_id?: string | null
          content?: string
          likes_count?: number
          is_spoiler?: boolean
          is_hidden?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      comment_likes: {
        Row: {
          id: string
          comment_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          comment_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          comment_id?: string
          user_id?: string
        }
        Relationships: []
      }
      follows: {
        Row: {
          id: string
          follower_id: string
          following_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          following_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          following_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string | null
          link: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message?: string | null
          link?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string | null
          link?: string | null
          is_read?: boolean
        }
        Relationships: []
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          target_type: string
          target_id: string
          reason: string
          description: string | null
          status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
          reviewed_by: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          target_type: string
          target_id: string
          reason: string
          description?: string | null
          status?: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
          reviewed_by?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          reporter_id?: string
          target_type?: string
          target_id?: string
          reason?: string
          description?: string | null
          status?: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
          reviewed_by?: string | null
          reviewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reports_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      platform_settings: {
        Row: {
          key: string
          value: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          key: string
          value: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          key?: string
          value?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      admin_logs: {
        Row: {
          id: string
          admin_id: string
          action: string
          target_type: string | null
          target_id: string | null
          details: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          action: string
          target_type?: string | null
          target_id?: string | null
          details?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          admin_id?: string
          action?: string
          target_type?: string | null
          target_id?: string | null
          details?: Json | null
          ip_address?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: string
          status: 'active' | 'cancelled' | 'expired' | 'pending'
          starts_at: string
          ends_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan: string
          status?: 'active' | 'cancelled' | 'expired' | 'pending'
          starts_at?: string
          ends_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan?: string
          status?: 'active' | 'cancelled' | 'expired' | 'pending'
          starts_at?: string
          ends_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: { _user_id: string; _role_name: string }
        Returns: boolean
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: string[]
      }
      is_staff: {
        Args: { _user_id: string }
        Returns: boolean
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
      increment_chapter_views: {
        Args: { chapter_id: string }
        Returns: undefined
      }
      increment_title_views: {
        Args: { title_id: string }
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

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Title = Database['public']['Tables']['titles']['Row']
export type Chapter = Database['public']['Tables']['chapters']['Row']
export type ChapterPage = Database['public']['Tables']['chapter_pages']['Row']
export type Genre = Database['public']['Tables']['genres']['Row']
export type UserLibrary = Database['public']['Tables']['user_library']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type Report = Database['public']['Tables']['reports']['Row']

export type TitleCategory = Title['category']
export type TitleStatus = Title['status']
export type LibraryStatus = UserLibrary['status']
export type RoleName = 'reader' | 'uploader' | 'moderator' | 'admin' | 'superadmin'
