export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          first_name: string
          last_name: string
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          first_name: string
          last_name: string
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          first_name?: string
          last_name?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          role: 'player' | 'club_owner' | 'admin'
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone?: string | null
          role?: 'player' | 'club_owner' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'match_invitation' | 'match_confirmation' | 'match_cancellation' | 'reservation_confirmation' | 'reservation_cancellation' | 'player_rating' | 'system_message'
          title: string
          message: string
          related_id: string | null
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: 'match_invitation' | 'match_confirmation' | 'match_cancellation' | 'reservation_confirmation' | 'reservation_cancellation' | 'player_rating' | 'system_message'
          title: string
          message: string
          related_id?: string | null
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          role?: 'player' | 'club_owner' | 'admin'
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      players: {
        Row: {
          id: string
          position: 'drive' | 'reves' | 'ambas'
          category: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'
          average_rating: number
          total_matches: number
          wins: number
          losses: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          position?: 'drive' | 'reves' | 'ambas'
          category?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'
          average_rating?: number
          total_matches?: number
          wins?: number
          losses?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          position?: 'drive' | 'reves' | 'ambas'
          category?: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'
          average_rating?: number
          total_matches?: number
          wins?: number
          losses?: number
          created_at?: string
          updated_at?: string
        }
      }
      clubs: {
        Row: {
          id: string
          owner_id: string
          name: string
          address: string
          city: string
          phone: string | null
          email: string | null
          logo_url: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          address: string
          city: string
          phone?: string | null
          email?: string | null
          logo_url?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          address?: string
          city?: string
          phone?: string | null
          email?: string | null
          logo_url?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      courts: {
        Row: {
          id: string
          club_id: string
          name: string
          court_number: number
          is_indoor: boolean
          price_per_hour: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          club_id: string
          name: string
          court_number: number
          is_indoor?: boolean
          price_per_hour: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          club_id?: string
          name?: string
          court_number?: number
          is_indoor?: boolean
          price_per_hour?: number
          created_at?: string
          updated_at?: string
        }
      }
      court_availability: {
        Row: {
          id: string
          court_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_available: boolean
          special_price: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          court_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_available?: boolean
          special_price?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          court_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_available?: boolean
          special_price?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          creator_id: string
          court_id: string | null
          match_date: string
          start_time: string
          end_time: string
          level: 'clasico' | 'alto' | 'medio' | 'bajo'
          price_per_player: number | null
          max_players: number
          notes: string | null
          is_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          court_id?: string | null
          match_date: string
          start_time: string
          end_time: string
          level: 'clasico' | 'alto' | 'medio' | 'bajo'
          price_per_player?: number | null
          max_players?: number
          notes?: string | null
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          creator_id?: string
          court_id?: string | null
          match_date?: string
          start_time?: string
          end_time?: string
          level?: 'clasico' | 'alto' | 'medio' | 'bajo'
          price_per_player?: number | null
          max_players?: number
          notes?: string | null
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      match_players: {
        Row: {
          id: string
          match_id: string
          player_id: string
          status: 'invited' | 'confirmed' | 'rejected' | 'waitlist'
          team: 'team_a' | 'team_b' | null
          position: 'drive' | 'reves' | null
          invitation_sent_at: string
          response_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          match_id: string
          player_id: string
          status?: 'invited' | 'confirmed' | 'rejected' | 'waitlist'
          team?: 'team_a' | 'team_b' | null
          position?: 'drive' | 'reves' | null
          invitation_sent_at?: string
          response_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          player_id?: string
          status?: 'invited' | 'confirmed' | 'rejected' | 'waitlist'
          team?: 'team_a' | 'team_b' | null
          position?: 'drive' | 'reves' | null
          invitation_sent_at?: string
          response_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      match_results: {
        Row: {
          id: string
          match_id: string
          team_a_score: number
          team_b_score: number
          recorded_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          match_id: string
          team_a_score: number
          team_b_score: number
          recorded_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          team_a_score?: number
          team_b_score?: number
          recorded_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      player_ratings: {
        Row: {
          id: string
          match_id: string
          rater_id: string
          rated_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          rater_id: string
          rated_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          rater_id?: string
          rated_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
      reservations: {
        Row: {
          id: string
          court_id: string
          user_id: string
          match_id: string | null
          reservation_date: string
          start_time: string
          end_time: string
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          price: number
          is_special_offer: boolean
          payment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          court_id: string
          user_id: string
          match_id?: string | null
          reservation_date: string
          start_time: string
          end_time: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          price: number
          is_special_offer?: boolean
          payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          court_id?: string
          user_id?: string
          match_id?: string | null
          reservation_date?: string
          start_time?: string
          end_time?: string
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          price?: number
          is_special_offer?: boolean
          payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
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
  }
}

