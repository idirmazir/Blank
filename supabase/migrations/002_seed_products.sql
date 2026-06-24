-- Dev seed products for Blank storefront

insert into public.products (
  slug,
  name,
  description,
  price_cents,
  category,
  image_urls,
  stock
) values
  (
    'linen-tee',
    'Linen Tee',
    'Breathable everyday tee in washed linen. Relaxed fit, natural texture.',
    4900,
    'apparel',
    array['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80'],
    24
  ),
  (
    'canvas-tote',
    'Canvas Tote',
    'Heavyweight cotton tote with interior pocket. Built for market runs.',
    3500,
    'accessories',
    array['https://images.unsplash.com/photo-1594221708779-94832f4320d1?w=800&q=80'],
    40
  ),
  (
    'ceramic-mug',
    'Ceramic Mug',
    '350ml stoneware mug with matte glaze. Dishwasher safe.',
    2800,
    'home',
    array['https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80'],
    55
  ),
  (
    'wool-cap',
    'Wool Cap',
    'Unstructured six-panel cap in merino wool blend.',
    3200,
    'apparel',
    array['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80'],
    18
  ),
  (
    'desk-lamp',
    'Desk Lamp',
    'Adjustable aluminum desk lamp with warm LED bulb included.',
    8900,
    'home',
    array['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80'],
    12
  ),
  (
    'leather-wallet',
    'Leather Wallet',
    'Slim bifold wallet in vegetable-tanned leather. Four card slots.',
    6500,
    'accessories',
    array['https://images.unsplash.com/photo-1627123427294-91b683a4d17d?w=800&q=80'],
    15
  ),
  (
    'organic-soap',
    'Organic Soap',
    'Cold-process soap bar with cedar and citrus. Pack of two.',
    1800,
    'home',
    array['https://images.unsplash.com/photo-1600850303085-4be8544d9a9a?w=800&q=80'],
    80
  ),
  (
    'running-shorts',
    'Running Shorts',
    'Lightweight shorts with zip pocket and inner brief. Quick dry.',
    5400,
    'apparel',
    array['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&q=80'],
    22
  );
