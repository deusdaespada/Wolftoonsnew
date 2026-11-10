-- ============================================================
-- WOLFTOON NEW - Initial Schema + RLS
-- Migration: 20241108000001
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ROLES TABLE
-- ============================================================
CREATE TABLE public.roles (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.roles (name, description) VALUES
  ('reader', 'Usuário padrão - pode ler, comentar e organizar biblioteca'),
  ('uploader', 'Pode cadastrar e publicar obras e capítulos'),
  ('moderator', 'Pode moderar comentários, denúncias e usuários'),
  ('admin', 'Acesso administrativo completo'),
  ('superadmin', 'Controle global da plataforma');

-- ============================================================
-- PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  level INTEGER NOT NULL DEFAULT 1,
  xp INTEGER NOT NULL DEFAULT 0,
  is_vip BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 30),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]+$')
);

CREATE INDEX idx_profiles_username ON public.profiles(username);

-- ============================================================
-- USER ROLES
-- ============================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_id INTEGER NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  granted_by UUID REFERENCES public.profiles(id),
  
  UNIQUE(user_id, role_id)
);

CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON public.user_roles(role_id);

-- ============================================================
-- GENRES
-- ============================================================
CREATE TABLE public.genres (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.genres (name, slug) VALUES
  ('Ação', 'acao'),
  ('Aventura', 'aventura'),
  ('Fantasia', 'fantasia'),
  ('Artes Marciais', 'artes-marciais'),
  ('Cultivo', 'cultivo'),
  ('Romance', 'romance'),
  ('Drama', 'drama'),
  ('Comédia', 'comedia'),
  ('Terror', 'terror'),
  ('Mistério', 'misterio'),
  ('Sistema', 'sistema'),
  ('Reencarnação', 'reencarnacao'),
  ('Regressão', 'regressao'),
  ('Sobrenatural', 'sobrenatural'),
  ('Escolar', 'escolar'),
  ('Ficção Científica', 'ficcao-cientifica'),
  ('Histórico', 'historico');

-- ============================================================
-- TITLES
-- ============================================================
CREATE TABLE public.titles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  alternative_titles TEXT[],
  description TEXT,
  cover_url TEXT,
  banner_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('manhwa', 'manhua', 'manga', 'webtoon', 'novel', 'light_novel', 'web_novel')),
  status TEXT NOT NULL DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed', 'hiatus', 'cancelled')),
  author TEXT,
  artist TEXT,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 10),
  rating_count INTEGER NOT NULL DEFAULT 0,
  views BIGINT NOT NULL DEFAULT 0,
  favorites_count INTEGER NOT NULL DEFAULT 0,
  chapters_count INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  last_chapter_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id)
);

CREATE INDEX idx_titles_slug ON public.titles(slug);
CREATE INDEX idx_titles_category ON public.titles(category);
CREATE INDEX idx_titles_status ON public.titles(status);
CREATE INDEX idx_titles_is_published ON public.titles(is_published);
CREATE INDEX idx_titles_views ON public.titles(views DESC);
CREATE INDEX idx_titles_rating ON public.titles(rating DESC);
CREATE INDEX idx_titles_last_chapter_at ON public.titles(last_chapter_at DESC NULLS LAST);
CREATE INDEX idx_titles_created_at ON public.titles(created_at DESC);

-- ============================================================
-- TITLE GENRES (many-to-many)
-- ============================================================
CREATE TABLE public.title_genres (
  title_id UUID NOT NULL REFERENCES public.titles(id) ON DELETE CASCADE,
  genre_id INTEGER NOT NULL REFERENCES public.genres(id) ON DELETE CASCADE,
  PRIMARY KEY (title_id, genre_id)
);

CREATE INDEX idx_title_genres_genre_id ON public.title_genres(genre_id);

-- ============================================================
-- CHAPTERS
-- ============================================================
CREATE TABLE public.chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_id UUID NOT NULL REFERENCES public.titles(id) ON DELETE CASCADE,
  number NUMERIC(10,2) NOT NULL,
  title TEXT,
  slug TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'images' CHECK (content_type IN ('images', 'text')),
  text_content TEXT,
  pages_count INTEGER NOT NULL DEFAULT 0,
  views BIGINT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES public.profiles(id),
  
  UNIQUE(title_id, number),
  UNIQUE(title_id, slug)
);

CREATE INDEX idx_chapters_title_id ON public.chapters(title_id);
CREATE INDEX idx_chapters_title_number ON public.chapters(title_id, number);
CREATE INDEX idx_chapters_is_published ON public.chapters(is_published);
CREATE INDEX idx_chapters_published_at ON public.chapters(published_at DESC NULLS LAST);

-- ============================================================
-- CHAPTER PAGES
-- ============================================================
CREATE TABLE public.chapter_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  page_number INTEGER NOT NULL,
  image_url TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(chapter_id, page_number)
);

CREATE INDEX idx_chapter_pages_chapter_id ON public.chapter_pages(chapter_id);

-- ============================================================
-- USER LIBRARY
-- ============================================================
CREATE TABLE public.user_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title_id UUID NOT NULL REFERENCES public.titles(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('reading', 'plan_to_read', 'completed', 'on_hold', 'dropped')),
  progress_chapter NUMERIC(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, title_id)
);

CREATE INDEX idx_user_library_user_id ON public.user_library(user_id);
CREATE INDEX idx_user_library_status ON public.user_library(user_id, status);

-- ============================================================
-- FAVORITES
-- ============================================================
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title_id UUID NOT NULL REFERENCES public.titles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, title_id)
);

CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_title_id ON public.favorites(title_id);

-- ============================================================
-- READING HISTORY
-- ============================================================
CREATE TABLE public.reading_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title_id UUID NOT NULL REFERENCES public.titles(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
  last_page INTEGER NOT NULL DEFAULT 1,
  progress_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(user_id, chapter_id)
);

CREATE INDEX idx_reading_history_user_id ON public.reading_history(user_id);
CREATE INDEX idx_reading_history_user_title ON public.reading_history(user_id, title_id);
CREATE INDEX idx_reading_history_last_read ON public.reading_history(user_id, last_read_at DESC);

-- ============================================================
-- COMMENTS
-- ============================================================
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('title', 'chapter')),
  target_id UUID NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER NOT NULL DEFAULT 0,
  is_spoiler BOOLEAN NOT NULL DEFAULT FALSE,
  is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT content_length CHECK (char_length(content) >= 1 AND char_length(content) <= 2000)
);

CREATE INDEX idx_comments_target ON public.comments(target_type, target_id);
CREATE INDEX idx_comments_user_id ON public.comments(user_id);
CREATE INDEX idx_comments_parent_id ON public.comments(parent_id);
CREATE INDEX idx_comments_created_at ON public.comments(created_at DESC);

-- ============================================================
-- COMMENT LIKES
-- ============================================================
CREATE TABLE public.comment_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(comment_id, user_id)
);

CREATE INDEX idx_comment_likes_comment_id ON public.comment_likes(comment_id);

-- ============================================================
-- FOLLOWS
-- ============================================================
CREATE TABLE public.follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower ON public.follows(follower_id);
CREATE INDEX idx_follows_following ON public.follows(following_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- ============================================================
-- REPORTS
-- ============================================================
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL,
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES public.profiles(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_target ON public.reports(target_type, target_id);

-- ============================================================
-- PLATFORM SETTINGS
-- ============================================================
CREATE TABLE public.platform_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES public.profiles(id)
);

INSERT INTO public.platform_settings (key, value) VALUES
  ('maintenance_mode', 'false'::jsonb),
  ('site_name', '"WOLFTOON NEW"'::jsonb),
  ('allow_registration', 'true'::jsonb);

-- ============================================================
-- ADMIN LOGS
-- ============================================================
CREATE TABLE public.admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_logs_admin_id ON public.admin_logs(admin_id);
CREATE INDEX idx_admin_logs_created_at ON public.admin_logs(created_at DESC);

-- ============================================================
-- SUBSCRIPTIONS (VIP structure - ready for future)
-- ============================================================
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON public.subscriptions(status);

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role_name TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = _user_id
      AND r.name = _role_name
  );
$$;

-- Get all roles of a user
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id UUID)
RETURNS TEXT[]
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    array_agg(r.name ORDER BY r.id),
    ARRAY[]::TEXT[]
  )
  FROM public.user_roles ur
  JOIN public.roles r ON r.id = ur.role_id
  WHERE ur.user_id = _user_id;
$$;

-- Check if user is staff (moderator+)
CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = _user_id
      AND r.name IN ('moderator', 'admin', 'superadmin')
  );
$$;

-- Check if user is admin+
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN public.roles r ON r.id = ur.role_id
    WHERE ur.user_id = _user_id
      AND r.name IN ('admin', 'superadmin')
  );
$$;

-- ============================================================
-- TRIGGER: Create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INTEGER := 0;
BEGIN
  -- Generate username from email or metadata
  base_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    split_part(NEW.email, '@', 1)
  );
  
  -- Sanitize
  base_username := lower(regexp_replace(base_username, '[^a-zA-Z0-9_]', '', 'g'));
  IF char_length(base_username) < 3 THEN
    base_username := 'user' || substr(NEW.id::text, 1, 8);
  END IF;
  
  final_username := base_username;
  
  -- Ensure uniqueness
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || counter::text;
  END LOOP;
  
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    final_username,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', final_username),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Assign default role: reader
  INSERT INTO public.user_roles (user_id, role_id)
  VALUES (NEW.id, (SELECT id FROM public.roles WHERE name = 'reader'));
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- TRIGGER: Update updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER titles_updated_at
  BEFORE UPDATE ON public.titles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER chapters_updated_at
  BEFORE UPDATE ON public.chapters
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER user_library_updated_at
  BEFORE UPDATE ON public.user_library
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.title_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapter_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ROLES policies
CREATE POLICY "Roles are viewable by everyone"
  ON public.roles FOR SELECT
  USING (true);

-- USER_ROLES policies
CREATE POLICY "User roles are viewable by everyone"
  ON public.user_roles FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage user roles"
  ON public.user_roles FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- GENRES policies
CREATE POLICY "Genres are viewable by everyone"
  ON public.genres FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage genres"
  ON public.genres FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- TITLES policies
CREATE POLICY "Published titles are viewable by everyone"
  ON public.titles FOR SELECT
  USING (is_published = true OR public.is_staff(auth.uid()) OR created_by = auth.uid());

CREATE POLICY "Uploaders and above can insert titles"
  ON public.titles FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'uploader') OR
    public.has_role(auth.uid(), 'moderator') OR
    public.is_admin(auth.uid())
  );

CREATE POLICY "Creators and staff can update titles"
  ON public.titles FOR UPDATE
  USING (
    created_by = auth.uid() OR
    public.is_staff(auth.uid())
  )
  WITH CHECK (
    created_by = auth.uid() OR
    public.is_staff(auth.uid())
  );

CREATE POLICY "Admins can delete titles"
  ON public.titles FOR DELETE
  USING (public.is_admin(auth.uid()));

-- TITLE_GENRES policies
CREATE POLICY "Title genres are viewable by everyone"
  ON public.title_genres FOR SELECT
  USING (true);

CREATE POLICY "Staff can manage title genres"
  ON public.title_genres FOR ALL
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- CHAPTERS policies
CREATE POLICY "Published chapters are viewable by everyone"
  ON public.chapters FOR SELECT
  USING (is_published = true OR public.is_staff(auth.uid()) OR created_by = auth.uid());

CREATE POLICY "Uploaders and above can insert chapters"
  ON public.chapters FOR INSERT
  WITH CHECK (
    public.has_role(auth.uid(), 'uploader') OR
    public.has_role(auth.uid(), 'moderator') OR
    public.is_admin(auth.uid())
  );

CREATE POLICY "Creators and staff can update chapters"
  ON public.chapters FOR UPDATE
  USING (
    created_by = auth.uid() OR
    public.is_staff(auth.uid())
  )
  WITH CHECK (
    created_by = auth.uid() OR
    public.is_staff(auth.uid())
  );

CREATE POLICY "Admins can delete chapters"
  ON public.chapters FOR DELETE
  USING (public.is_admin(auth.uid()));

-- CHAPTER_PAGES policies
CREATE POLICY "Chapter pages viewable if chapter is published or staff"
  ON public.chapter_pages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.chapters c
      WHERE c.id = chapter_id
        AND (c.is_published = true OR public.is_staff(auth.uid()) OR c.created_by = auth.uid())
    )
  );

CREATE POLICY "Staff can manage chapter pages"
  ON public.chapter_pages FOR ALL
  USING (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'uploader'))
  WITH CHECK (public.is_staff(auth.uid()) OR public.has_role(auth.uid(), 'uploader'));

-- USER_LIBRARY policies
CREATE POLICY "Users can view own library"
  ON public.user_library FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own library"
  ON public.user_library FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- FAVORITES policies
CREATE POLICY "Users can view own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites"
  ON public.favorites FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- READING_HISTORY policies
CREATE POLICY "Users can view own reading history"
  ON public.reading_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own reading history"
  ON public.reading_history FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- COMMENTS policies
CREATE POLICY "Comments are viewable by everyone (except hidden)"
  ON public.comments FOR SELECT
  USING (is_hidden = false OR auth.uid() = user_id OR public.is_staff(auth.uid()));

CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON public.comments FOR UPDATE
  USING (auth.uid() = user_id OR public.is_staff(auth.uid()))
  WITH CHECK (auth.uid() = user_id OR public.is_staff(auth.uid()));

CREATE POLICY "Users can delete own comments, staff can delete any"
  ON public.comments FOR DELETE
  USING (auth.uid() = user_id OR public.is_staff(auth.uid()));

-- COMMENT_LIKES policies
CREATE POLICY "Comment likes are viewable by everyone"
  ON public.comment_likes FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own comment likes"
  ON public.comment_likes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- FOLLOWS policies
CREATE POLICY "Follows are viewable by everyone"
  ON public.follows FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own follows"
  ON public.follows FOR ALL
  USING (auth.uid() = follower_id)
  WITH CHECK (auth.uid() = follower_id);

-- NOTIFICATIONS policies
CREATE POLICY "Users can view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- REPORTS policies
CREATE POLICY "Users can create reports"
  ON public.reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view own reports, staff can view all"
  ON public.reports FOR SELECT
  USING (auth.uid() = reporter_id OR public.is_staff(auth.uid()));

CREATE POLICY "Staff can update reports"
  ON public.reports FOR UPDATE
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

-- PLATFORM_SETTINGS policies
CREATE POLICY "Settings are viewable by everyone"
  ON public.platform_settings FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage settings"
  ON public.platform_settings FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ADMIN_LOGS policies
CREATE POLICY "Only admins can view admin logs"
  ON public.admin_logs FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Only admins can insert admin logs"
  ON public.admin_logs FOR INSERT
  WITH CHECK (public.is_admin(auth.uid()));

-- SUBSCRIPTIONS policies
CREATE POLICY "Users can view own subscriptions"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

CREATE POLICY "Only system/admins can manage subscriptions"
  ON public.subscriptions FOR ALL
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

-- ============================================================
-- STORAGE BUCKETS (run these in Supabase dashboard or via API)
-- ============================================================
-- Note: Storage policies should be created in the Supabase dashboard
-- Recommended buckets:
--   - covers (public read, authenticated upload for staff)
--   - chapter-pages (public read, authenticated upload for staff)
--   - avatars (public read, authenticated upload for own avatar)

COMMENT ON TABLE public.profiles IS 'User profiles extending auth.users';
COMMENT ON TABLE public.titles IS 'Main works (manhwa, manga, novels, etc)';
COMMENT ON TABLE public.chapters IS 'Chapters of titles';
COMMENT ON TABLE public.chapter_pages IS 'Individual page images for image-based chapters';

