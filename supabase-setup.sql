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

-- Helper used by teacher policies. SECURITY DEFINER avoids recursive RLS checks
-- when the function reads the profiles table to inspect the current user's role.
CREATE OR REPLACE FUNCTION public.is_guru()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'guru'
  );
$$;

REVOKE ALL ON FUNCTION public.is_guru() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_guru() TO authenticated;

-- Create a student profile inside the database. This works even when email
-- confirmation is enabled because the trigger runs with controlled privileges.
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nama, kelas, role)
  VALUES (
    NEW.id,
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'nama', ''), 'Siswa'),
    COALESCE(NEW.raw_user_meta_data->>'kelas', ''),
    'siswa'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user_profile() FROM PUBLIC;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user_profile();

-- 4. RLS Policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Teachers can view all profiles" ON public.profiles;
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
  USING (public.is_guru());

-- 5. RLS Policies for progress
DROP POLICY IF EXISTS "Users can view own progress" ON public.progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.progress;
DROP POLICY IF EXISTS "Teachers can view all progress" ON public.progress;
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
  USING (public.is_guru());

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

-- Return student monitoring data through one guarded function. This avoids
-- nested PostgREST joins being filtered by separate RLS policies.
CREATE OR REPLACE FUNCTION public.get_teacher_students()
RETURNS TABLE (
  id UUID,
  nama TEXT,
  kelas TEXT,
  role TEXT,
  updated_at TIMESTAMPTZ,
  progress_data JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_guru() THEN
    RAISE EXCEPTION 'Akses hanya untuk guru';
  END IF;

  RETURN QUERY
  SELECT p.id, p.nama, p.kelas, p.role, p.updated_at, pr.data
  FROM public.profiles AS p
  LEFT JOIN public.progress AS pr ON pr.user_id = p.id
  WHERE p.role = 'siswa'
  ORDER BY p.nama;
END;
$$;

REVOKE ALL ON FUNCTION public.get_teacher_students() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_teacher_students() TO authenticated;

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
-- Repair existing Auth users that were created before the profile trigger:
-- INSERT INTO public.profiles (id, nama, kelas, role)
-- SELECT id,
--        COALESCE(NULLIF(raw_user_meta_data->>'nama', ''), 'Siswa'),
--        COALESCE(raw_user_meta_data->>'kelas', ''),
--        'siswa'
-- FROM auth.users
-- WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.users.id);
--
-- First register the account via Supabase Auth, then create its profile:
-- INSERT INTO public.profiles (id, nama, kelas, role)
-- SELECT id, 'Nama Guru', '', 'guru'
-- FROM auth.users
-- WHERE email = 'email-guru@example.com'
-- ON CONFLICT (id) DO UPDATE SET role = 'guru';
--
-- Or, if the profile already exists:
-- UPDATE public.profiles SET role = 'guru' WHERE id = 'YOUR_TEACHER_USER_ID';
