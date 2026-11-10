-- ============================================================
-- WOLFTOON NEW - Development Seed (OPTIONAL)
-- Use only in development to test the UI with sample data.
-- DO NOT run in production.
-- ============================================================

-- Sample titles (covers are placeholder Unsplash images)
INSERT INTO public.titles (
  slug, title, description, cover_url, category, status, author, artist,
  rating, rating_count, views, favorites_count, chapters_count,
  is_published, published_at, last_chapter_at
) VALUES
(
  'solo-leveling',
  'Solo Leveling',
  'Em um mundo onde caçadores com poderes especiais enfrentam monstros de portais dimensionais, Sung Jin-Woo, o caçador mais fraco, descobre um sistema misterioso que o permite subir de nível.',
  'https://images.unsplash.com/photo-1613376026476-ae8eb5a9e6f4?w=400&h=600&fit=crop',
  'manhwa',
  'completed',
  'Chugong',
  'DUBU',
  9.5, 12500, 2500000, 89000, 179,
  true, NOW() - INTERVAL '400 days', NOW() - INTERVAL '30 days'
),
(
  'tower-of-god',
  'Tower of God',
  'Bam, um menino que viveu toda a vida trancado sob a Torre, entra nela para encontrar sua amiga Rachel. Dentro da Torre, ele enfrenta testes mortais e descobre um mundo complexo de poder e traição.',
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=600&fit=crop',
  'webtoon',
  'ongoing',
  'SIU',
  'SIU',
  9.2, 9800, 1800000, 72000, 550,
  true, NOW() - INTERVAL '2000 days', NOW() - INTERVAL '3 days'
),
(
  'omniscient-reader',
  'Omniscient Reader''s Viewpoint',
  'Kim Dokja é o único leitor de uma webnovel obscura que se torna realidade. Com o conhecimento da história, ele tenta sobreviver e mudar o destino do mundo.',
  'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=400&h=600&fit=crop',
  'manhwa',
  'ongoing',
  'sing Nsong',
  'Sleepy-C',
  9.7, 15600, 3200000, 110000, 210,
  true, NOW() - INTERVAL '500 days', NOW() - INTERVAL '1 day'
),
(
  'the-beginning-after-the-end',
  'The Beginning After The End',
  'O rei Grey renasce em um novo mundo como Arthur Leywin. Com as memórias de sua vida anterior, ele busca poder e respostas em um continente repleto de magia.',
  'https://images.unsplash.com/photo-1620336655055-ae0e8c2c1c8e?w=400&h=600&fit=crop',
  'manhwa',
  'ongoing',
  'TurtleMe',
  'Fuyuki23',
  9.4, 11200, 2100000, 95000, 180,
  true, NOW() - INTERVAL '600 days', NOW() - INTERVAL '5 days'
),
(
  'noblesse',
  'Noblesse',
  'Rai, um nobre vampiro que dormiu por 820 anos, desperta em um mundo moderno e se matricula em uma escola junto com seu servo loyal Frankenstein.',
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&h=600&fit=crop',
  'webtoon',
  'completed',
  'Son Jeho',
  'Lee Gwangsu',
  8.9, 7500, 950000, 45000, 544,
  true, NOW() - INTERVAL '3000 days', NOW() - INTERVAL '400 days'
),
(
  'reincarnation-of-the-strongest-sword-god',
  'Reincarnation of the Strongest Sword God',
  'Shi Feng retorna 10 anos no passado e usa seu conhecimento do jogo God''s Domain para se tornar o mais forte novamente.',
  'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=600&fit=crop',
  'web_novel',
  'ongoing',
  'Tian Can Tu Dou',
  NULL,
  8.5, 3200, 450000, 18000, 2800,
  true, NOW() - INTERVAL '800 days', NOW() - INTERVAL '2 days'
),
(
  'martial-peak',
  'Martial Peak',
  'Yang Kai, um discípulo sem talento aparente, descobre um tesouro misterioso que o coloca no caminho para se tornar o mais forte do continente.',
  'https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=400&h=600&fit=crop',
  'manhua',
  'ongoing',
  'Momo',
  'Jiong Jiong You Yao',
  8.7, 8900, 1500000, 62000, 3500,
  true, NOW() - INTERVAL '1500 days', NOW() - INTERVAL '1 day'
),
(
  'overgeared',
  'Overgeared',
  'Shin Youngwoo é um jogador azarado que encontra o lendário item do lendário blacksmith Pagma. Sua vida no jogo Satisfy muda completamente.',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=600&fit=crop',
  'manhwa',
  'ongoing',
  'Park Saenal',
  'Team Argo',
  9.0, 6700, 1200000, 55000, 200,
  true, NOW() - INTERVAL '700 days', NOW() - INTERVAL '4 days'
);

-- Link some genres (using genre ids from the seed in migration)
-- Assuming: 1=Ação, 2=Aventura, 3=Fantasia, 6=Romance, 11=Sistema, 12=Reencarnação, etc.

INSERT INTO public.title_genres (title_id, genre_id)
SELECT t.id, g.id
FROM public.titles t
CROSS JOIN public.genres g
WHERE t.slug = 'solo-leveling' AND g.slug IN ('acao', 'fantasia', 'sistema', 'aventura')
ON CONFLICT DO NOTHING;

INSERT INTO public.title_genres (title_id, genre_id)
SELECT t.id, g.id
FROM public.titles t
CROSS JOIN public.genres g
WHERE t.slug = 'tower-of-god' AND g.slug IN ('acao', 'aventura', 'fantasia', 'misterio')
ON CONFLICT DO NOTHING;

INSERT INTO public.title_genres (title_id, genre_id)
SELECT t.id, g.id
FROM public.titles t
CROSS JOIN public.genres g
WHERE t.slug = 'omniscient-reader' AND g.slug IN ('acao', 'fantasia', 'sistema', 'drama')
ON CONFLICT DO NOTHING;

INSERT INTO public.title_genres (title_id, genre_id)
SELECT t.id, g.id
FROM public.titles t
CROSS JOIN public.genres g
WHERE t.slug = 'the-beginning-after-the-end' AND g.slug IN ('acao', 'fantasia', 'reencarnacao', 'aventura')
ON CONFLICT DO NOTHING;

INSERT INTO public.title_genres (title_id, genre_id)
SELECT t.id, g.id
FROM public.titles t
CROSS JOIN public.genres g
WHERE t.slug = 'martial-peak' AND g.slug IN ('acao', 'artes-marciais', 'cultivo', 'fantasia')
ON CONFLICT DO NOTHING;

-- Sample chapters for one title (Solo Leveling)
INSERT INTO public.chapters (title_id, number, title, slug, content_type, pages_count, views, is_published, published_at)
SELECT t.id, n, 'Chapter ' || n, 'chapter-' || n, 'images', 20 + (n % 10), 10000 - n * 50, true, NOW() - ((180 - n) || ' days')::INTERVAL
FROM public.titles t
CROSS JOIN generate_series(1, 20) AS n
WHERE t.slug = 'solo-leveling'
ON CONFLICT DO NOTHING;

INSERT INTO public.chapters (title_id, number, title, slug, content_type, pages_count, views, is_published, published_at)
SELECT t.id, n, 'Episode ' || n, 'episode-' || n, 'images', 15 + (n % 8), 8000 - n * 30, true, NOW() - ((100 - n) || ' days')::INTERVAL
FROM public.titles t
CROSS JOIN generate_series(1, 15) AS n
WHERE t.slug = 'omniscient-reader'
ON CONFLICT DO NOTHING;


-- Sample chapter pages for Solo Leveling chapter 1 (placeholder images)
-- Using picsum for consistent placeholder manga-like aspect ratios
INSERT INTO public.chapter_pages (chapter_id, page_number, image_url, width, height)
SELECT c.id, n, 
  'https://picsum.photos/seed/sl' || c.number || 'p' || n || '/800/1200',
  800, 1200
FROM public.chapters c
CROSS JOIN generate_series(1, 8) AS n
WHERE c.slug LIKE 'chapter-%'
  AND c.title_id = (SELECT id FROM public.titles WHERE slug = 'solo-leveling')
  AND c.number <= 5
ON CONFLICT DO NOTHING;

-- Sample text chapter for the web novel
INSERT INTO public.chapters (
  title_id, number, title, slug, content_type, text_content, pages_count, views, is_published, published_at
)
SELECT 
  t.id,
  1,
  'O Retorno',
  'capitulo-1',
  'text',
  E'O sol se punha no horizonte quando Shi Feng abriu os olhos.\n\nEle estava de volta. Dez anos no passado. O corpo jovem, a mente carregada com todas as memórias de uma vida de fracassos e arrependimentos.\n\nGod''s Domain ainda não havia sido lançado. Os guilds poderosas ainda não existiam. O item lendário de Pagma ainda estava escondido, esperando por alguém digno.\n\nDesta vez, seria diferente.\n\nShi Feng se levantou da cama estreita do pequeno apartamento. O cheiro familiar de mofo e a janela rachada o fizeram sorrir. Era o mesmo lugar de onde havia partido, mas agora ele tinha algo que ninguém mais possuía: conhecimento.\n\n— Sistema — murmurou, por hábito. Nada respondeu. Claro. O jogo ainda não existia.\n\nEle caminhou até a mesa e abriu o velho notebook. A tela piscando mostrou a data: exatamente três meses antes do lançamento oficial de God''s Domain.\n\nTrês meses. Tempo suficiente para se preparar. Tempo suficiente para mudar tudo.\n\nA primeira coisa que precisava fazer era conseguir dinheiro. Na vida anterior, ele havia perdido a chance de comprar a primeira geração de capacetes de imersão. Dessa vez, não cometeria o mesmo erro.\n\nShi Feng abriu o histórico de busca e digitou o nome de uma empresa que ele sabia que explodiria em valor nas próximas semanas. As ações ainda estavam baratas. Ridiculamente baratas.\n\n— Desta vez — disse em voz baixa, os olhos brilhando com determinação —, eu serei o mais forte.',
  0,
  1200,
  true,
  NOW() - INTERVAL '10 days'
FROM public.titles t
WHERE t.slug = 'reincarnation-of-the-strongest-sword-god'
ON CONFLICT DO NOTHING;

