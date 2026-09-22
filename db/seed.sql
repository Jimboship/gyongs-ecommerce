-- GYONGS seed products (uses YOUR existing photo files in project root)
-- Run: psql -U postgres -d gyongs_db -f db/seed.sql

INSERT INTO products (name, description, category, price, image) VALUES
-- TROUSERS
('GYONGS Black Cargo Trousers', 'Everyday black cargo trousers with roomy pockets and a relaxed street fit.', 'trousers', 749.99, 'gyongs_trousers_01.png'),
('GYONGS Classic Blue Jeans', 'Classic blue denim jeans with a clean modern cut. Easy to dress up or down.', 'trousers', 699.99, 'gyongs_trousers_02.png'),
('GYONGS Beige Street Trousers', 'Beige street-style trousers. Light, comfortable and sharp for daily wear.', 'trousers', 649.99, 'gyongs_trousers_03.png'),

-- SHOES
('GYONGS Urban Sneakers', 'Bold urban sneakers built for comfort and street style.', 'shoes', 1299.99, 'gyongs_shoes_02.png'),
('GYONGS Classic Black Sneakers', 'Classic black sneakers that go with everything.', 'shoes', 1199.99, 'gyongs_shoes_03.png'),
('GYONGS White Street Sneakers', 'Clean white street sneakers with a fresh everyday look.', 'shoes', 1249.99, 'gyongs_shoes_05.png'),

-- ACCESSORIES
('GYONGS Signature Cap', 'Signature GYONGS cap. Simple, stylish finishing touch.', 'accessories', 299.99, 'gyongs_acc_03.png'),
('GYONGS Crossbody Bag', 'Practical crossbody bag for phone, wallet and daily essentials.', 'accessories', 549.99, 'gyongs_acc_04.png'),
('GYONGS Sunglasses', 'Classic GYONGS sunglasses with UV protection and street attitude.', 'accessories', 399.99, 'gyongs_acc_01.png'),
('GYONGS Watch', 'Minimal GYONGS watch. Clean face, comfortable strap, everyday wear.', 'accessories', 899.99, 'gyongs_watch_01.png'),

-- WOMEN COLLECTION
('GYONGS Women Street Set', 'Women street set. Comfortable, confident everyday fashion.', 'women', 999.99, 'gyongs_active_04.png'),
('GYONGS Women Casual Look', 'Casual women look for everyday wear and weekend plans.', 'women', 849.99, 'gyongs_active_02.png'),
('GYONGS Women Urban Fit', 'Urban fit for women. Modern cut with soft breathable fabric.', 'women', 949.99, 'gyongs_active_03.png'),

ON CONFLICT DO NOTHING;
