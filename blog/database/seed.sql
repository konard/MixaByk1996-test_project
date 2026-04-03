USE `blog`;

INSERT INTO `categories` (`name`, `slug`, `description`) VALUES
('Technology', 'technology', 'Articles about the latest in technology, programming, and software development.'),
('Science', 'science', 'Explore the wonders of science — from physics to biology.'),
('Travel', 'travel', 'Discover amazing destinations and travel tips from around the world.'),
('Food & Cooking', 'food-cooking', 'Delicious recipes, cooking techniques, and culinary adventures.'),
('Health & Wellness', 'health-wellness', 'Tips and insights for a healthier, happier life.');

INSERT INTO `articles` (`title`, `slug`, `description`, `content`, `image`, `views`, `published_at`) VALUES
(
    'Getting Started with PHP 8.2',
    'getting-started-with-php-82',
    'A comprehensive guide to the new features and improvements in PHP 8.2.',
    '<p>PHP 8.2 brings many exciting new features to the language. In this article, we will explore some of the most important changes.</p><h2>Read-only Classes</h2><p>One of the most anticipated features is the ability to declare entire classes as read-only. This means all properties will automatically be read-only.</p><pre><code>readonly class Point {\n    public function __construct(\n        public float $x,\n        public float $y,\n    ) {}\n}</code></pre><h2>Intersection Types</h2><p>PHP 8.2 also introduces intersection types, which allow you to specify that a value must satisfy multiple type constraints.</p><p>These features make PHP more expressive and help write cleaner, more maintainable code.</p>',
    '/assets/images/php-82.jpg',
    1542,
    '2026-01-15 10:00:00'
),
(
    'Docker for PHP Developers',
    'docker-for-php-developers',
    'Learn how to set up a complete PHP development environment using Docker.',
    '<p>Docker has revolutionized how developers build and deploy applications. This guide will show you how to create a solid PHP development environment with Docker.</p><h2>Why Docker?</h2><p>Docker provides consistent environments across development, staging, and production. No more "it works on my machine" problems!</p><h2>Setting Up Your Environment</h2><p>We will create a docker-compose.yml file that orchestrates PHP-FPM, Nginx, and MySQL containers.</p><p>By the end of this tutorial, you will have a fully functional PHP development environment running in Docker.</p>',
    '/assets/images/docker-php.jpg',
    2891,
    '2026-01-20 14:30:00'
),
(
    'Understanding Black Holes',
    'understanding-black-holes',
    'A deep dive into the fascinating science of black holes and their role in the universe.',
    '<p>Black holes are among the most mysterious and fascinating objects in the universe. In this article, we explore what they are and how they form.</p><h2>What is a Black Hole?</h2><p>A black hole is a region of spacetime where gravity is so strong that nothing — not even light — can escape from it. The boundary of no escape is called the event horizon.</p><h2>How Do Black Holes Form?</h2><p>Most black holes form when a massive star collapses at the end of its life. The core collapses under its own gravity, creating an incredibly dense object.</p><p>Recent observations with the Event Horizon Telescope have given us our first actual images of black holes, confirming many theoretical predictions.</p>',
    '/assets/images/black-holes.jpg',
    3204,
    '2026-01-25 09:00:00'
),
(
    'Top 10 Destinations for 2026',
    'top-10-destinations-2026',
    'Discover the most exciting travel destinations to visit in 2026.',
    '<p>2026 is shaping up to be a fantastic year for travel. Here are our top 10 destinations you should consider visiting this year.</p><h2>1. Kyoto, Japan</h2><p>With its stunning temples, traditional culture, and incredible food scene, Kyoto remains one of the world''s top travel destinations.</p><h2>2. Patagonia, Argentina</h2><p>For adventure seekers, Patagonia offers breathtaking landscapes, world-class trekking, and unforgettable wildlife encounters.</p><h2>3. Marrakech, Morocco</h2><p>Lose yourself in the vibrant souks, stunning riads, and incredible cuisine of this magical city.</p><p>Whether you prefer beaches, mountains, or cities, 2026 has something for every type of traveler.</p>',
    '/assets/images/travel-2026.jpg',
    4521,
    '2026-02-01 11:00:00'
),
(
    'The Art of Sourdough Bread',
    'art-of-sourdough-bread',
    'Master the ancient craft of sourdough bread making with our complete guide.',
    '<p>Sourdough bread has been experiencing a renaissance in recent years. This guide will walk you through everything you need to know to make your first perfect loaf.</p><h2>Creating Your Starter</h2><p>The foundation of sourdough is the starter — a fermented mixture of flour and water containing wild yeast and bacteria. You will need to feed it daily for 5-7 days before it''s ready to use.</p><h2>The Baking Process</h2><p>Once your starter is active and bubbly, you can begin the bread-making process. Mix the ingredients, perform stretch-and-fold techniques, and allow the dough to ferment properly.</p><p>The result is a crusty, flavorful loaf with a beautiful open crumb that will impress everyone.</p>',
    '/assets/images/sourdough.jpg',
    1876,
    '2026-02-10 08:00:00'
),
(
    'Mediterranean Diet: A Complete Guide',
    'mediterranean-diet-complete-guide',
    'Discover the health benefits and principles of the Mediterranean diet.',
    '<p>The Mediterranean diet has been consistently ranked as one of the healthiest diets in the world. Let''s explore why it is so beneficial and how to adopt it.</p><h2>Core Principles</h2><p>The Mediterranean diet emphasizes fruits, vegetables, whole grains, legumes, nuts, and olive oil. Fish and seafood are consumed regularly, while red meat is eaten only occasionally.</p><h2>Health Benefits</h2><p>Research has shown that following a Mediterranean diet can reduce the risk of heart disease, stroke, type 2 diabetes, and certain cancers.</p><p>By making gradual changes to your eating habits, you can adopt this healthy lifestyle and reap its many benefits.</p>',
    '/assets/images/mediterranean-diet.jpg',
    2340,
    '2026-02-15 12:00:00'
),
(
    'Machine Learning with Python',
    'machine-learning-with-python',
    'An introduction to machine learning concepts and practical implementation with Python.',
    '<p>Machine learning is transforming every industry. This article introduces you to the core concepts and shows you how to get started with Python.</p><h2>What is Machine Learning?</h2><p>Machine learning is a subset of artificial intelligence where algorithms learn from data to make predictions or decisions without being explicitly programmed.</p><h2>Getting Started</h2><p>Python has become the go-to language for machine learning, thanks to powerful libraries like scikit-learn, TensorFlow, and PyTorch. We will build a simple classifier using scikit-learn.</p><p>With consistent practice and exploration, you will be building sophisticated ML models in no time.</p>',
    '/assets/images/machine-learning.jpg',
    5672,
    '2026-02-20 15:00:00'
),
(
    'Hiking in the Swiss Alps',
    'hiking-swiss-alps',
    'A guide to the best hiking trails in the Swiss Alps for all skill levels.',
    '<p>The Swiss Alps offer some of the most spectacular hiking in the world. Whether you are a beginner or an experienced mountaineer, there is a trail for you.</p><h2>Best Trails for Beginners</h2><p>The Grindelwald First Cliff Walk is a stunning easy hike with incredible views of the Eiger. The path is well-marked and accessible to most fitness levels.</p><h2>Advanced Routes</h2><p>For experienced hikers, the Alta Via 1 connects the Zermatt and Saas-Fee valleys through high Alpine terrain, offering unforgettable scenery.</p><p>Always check weather conditions and prepare properly before heading into the mountains.</p>',
    '/assets/images/swiss-alps.jpg',
    3109,
    '2026-03-01 09:30:00'
),
(
    'The Science of Sleep',
    'science-of-sleep',
    'Understand the science behind sleep and how to improve your sleep quality.',
    '<p>Sleep is one of the most important things we do for our health, yet many of us don''t get enough of it. Let''s explore the science of sleep and learn how to sleep better.</p><h2>Why We Sleep</h2><p>During sleep, our bodies repair tissues, consolidate memories, and release important hormones. REM sleep, in particular, is crucial for cognitive function and emotional regulation.</p><h2>Tips for Better Sleep</h2><p>Maintain a consistent sleep schedule, create a dark and cool bedroom environment, limit screen time before bed, and avoid caffeine in the afternoon.</p><p>By understanding and respecting your sleep needs, you can dramatically improve your health and wellbeing.</p>',
    '/assets/images/sleep-science.jpg',
    4187,
    '2026-03-05 10:00:00'
),
(
    'Fermentation: Beyond Sourdough',
    'fermentation-beyond-sourdough',
    'Explore the world of fermentation and learn to make kimchi, kombucha, and more.',
    '<p>Fermentation is one of humanity''s oldest food preservation techniques, and it is experiencing a huge revival. From kimchi to kombucha, let''s explore this fascinating world.</p><h2>The Science of Fermentation</h2><p>Fermentation is the metabolic process where microorganisms like bacteria and yeast convert sugars into acids, gases, or alcohol. This preserves food and creates complex flavors.</p><h2>Getting Started</h2><p>Start with something simple like sauerkraut — just cabbage and salt. Once you master the basics, move on to more complex ferments like kimchi or kefir.</p><p>Fermented foods are also excellent for gut health, providing beneficial probiotics.</p>',
    '/assets/images/fermentation.jpg',
    1654,
    '2026-03-10 11:00:00'
);

-- Article-Category relationships
INSERT INTO `article_category` (`article_id`, `category_id`) VALUES
-- Technology articles
(1, 1), -- PHP 8.2 -> Technology
(2, 1), -- Docker -> Technology
(7, 1), -- Machine Learning -> Technology

-- Science articles
(3, 2), -- Black Holes -> Science
(9, 2), -- Science of Sleep -> Health & Wellness / Science

-- Travel articles
(4, 3), -- Top 10 Destinations -> Travel
(8, 3), -- Swiss Alps -> Travel

-- Food articles
(5, 4), -- Sourdough -> Food & Cooking
(10, 4), -- Fermentation -> Food & Cooking
(6, 4), -- Mediterranean Diet -> Food & Cooking

-- Health articles
(6, 5), -- Mediterranean Diet -> Health & Wellness
(9, 5), -- Science of Sleep -> Health & Wellness
(10, 5); -- Fermentation -> Health & Wellness
