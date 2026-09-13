-- ============================================
-- KKA Learning Quest — Supabase Database Setup
-- ============================================

-- 1. Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nama TEXT NOT NULL,
  kelas TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'siswa' CHECK (role IN ('siswa', 'guru')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Progress table (stores game progress as JSON)
CREATE TABLE IF NOT EXISTS public.progress (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{"xp":0,"level":1,"combo":0,"maxCombo":0,"badges":[],"bab1":{"completed":false,"correct":0,"total":10,"scenarios":[]},"bab2":{"stack":false,"queue":false,"array":false,"linear":false,"binary":false,"bubble":false,"selection":false,"insertion":false},"bab3":{"completed":false,"levelsCompleted":[]},"bab4":{"completed":false,"correct":0,"total":6,"puzzles":[]}}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for profiles
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Teachers can view all profiles
CREATE POLICY "Teachers can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'guru'
    )
  );

-- 5. RLS Policies for progress
-- Users can read their own progress
CREATE POLICY "Users can view own progress"
  ON public.progress FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own progress
CREATE POLICY "Users can insert own progress"
  ON public.progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own progress
CREATE POLICY "Users can update own progress"
  ON public.progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Teachers can view all progress
CREATE POLICY "Teachers can view all progress"
  ON public.progress FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'guru'
    )
  );

-- 6. Trigger to auto-create progress row when profile is created
CREATE OR REPLACE FUNCTION public.handle_new_user_progress()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.progress (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_progress();

-- 7. Function to update timestamp
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_profiles_timestamp
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_timestamp();

CREATE OR REPLACE TRIGGER update_progress_timestamp
  BEFORE UPDATE ON public.progress
  FOR EACH ROW
  EXECUTE FUNCTION public.update_timestamp();

-- 8. Create a teacher account (run this manually after setup)
-- First register via Supabase Auth, then update role:
-- UPDATE public.profiles SET role = 'guru' WHERE id = 'YOUR_TEACHER_USER_ID';
