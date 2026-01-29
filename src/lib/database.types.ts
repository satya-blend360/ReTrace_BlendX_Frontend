export interface Database {
  public: {
    Tables: {
      jobs: {
        Row: {
          id: string;
          title: string;
          company: string;
          location: string;
          type: string;
          salary_range: string | null;
          description: string;
          requirements: string | null;
          posted_date: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['jobs']['Row'], 'id' | 'created_at' | 'updated_at' | 'posted_date'>;
        Update: Partial<Database['public']['Tables']['jobs']['Insert']>;
      };
      applicants: {
        Row: {
          id: string;
          job_id: string;
          name: string;
          email: string;
          phone: string | null;
          resume_url: string | null;
          cover_letter: string | null;
          status: string;
          applied_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['applicants']['Row'], 'id' | 'created_at' | 'updated_at' | 'applied_date'>;
        Update: Partial<Database['public']['Tables']['applicants']['Insert']>;
      };
    };
  };
}
