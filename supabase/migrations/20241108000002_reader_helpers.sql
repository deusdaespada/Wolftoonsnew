-- ============================================================
-- WOLFTOON NEW - Reader helpers
-- Migration: 20241108000002
-- ============================================================

-- Atomic chapter view increment
CREATE OR REPLACE FUNCTION public.increment_chapter_views(chapter_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.chapters
  SET views = views + 1
  WHERE id = chapter_id;
END;
$$;

-- Also bump title views when chapter is read (optional helper)
CREATE OR REPLACE FUNCTION public.increment_title_views(title_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.titles
  SET views = views + 1
  WHERE id = title_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_chapter_views(UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.increment_title_views(UUID) TO authenticated, anon;
