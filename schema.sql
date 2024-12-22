-- Bảng configuration: Lưu các cấu hình hệ thống
CREATE TABLE system_configurations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    config_key TEXT UNIQUE NOT NULL,
    config_value TEXT NOT NULL,
    description TEXT,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Thêm cấu hình mặc định
INSERT INTO system_configurations 
(config_key, config_value, description) 
VALUES 
('FREE_GENERATIONS_DAILY_LIMIT', '10', 'Số lượng generations miễn phí mỗi ngày'),
('HIGH_RES_IMAGE_PRICE', '9.99', 'Giá của một ảnh high-resolution'),
('GENERATION_PLAN_DEFAULT_PRICE', '5.00', 'Giá mặc định của gói generations'),
('GENERATION_PLAN_DEFAULT_COUNT', '50', 'Số lượng generations trong gói mặc định');

-- Bảng users: Lưu thông tin người dùng
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    free_generations_left INTEGER DEFAULT 10,
    purchased_generations_left INTEGER DEFAULT 0,
    last_free_generations_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng creation_plans: Các gói generation có thể mua
CREATE TABLE credits_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lemonsqueezy_product_id TEXT NOT NULL,
    lemonsqueezy_variant_id TEXT NOT NULL,
    name TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    generations_count INTEGER NOT NULL
);

-- Bảng user_generations: Lưu lịch sử generation của người dùng
CREATE TABLE user_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    is_free_generation BOOLEAN DEFAULT TRUE,
    preview_image_id TEXT,
    high_res_image_id TEXT,
    is_high_res_purchased BOOLEAN DEFAULT FALSE,
    generation_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    generation_details JSONB
);

-- Bảng transactions: Theo dõi các giao dịch mua generation và hires image
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    transaction_type TEXT CHECK (transaction_type IN ('generation_plan', 'high_res_image')),
    amount NUMERIC(10,2) NOT NULL,
    generations_purchased INTEGER,
    generation_id UUID REFERENCES user_generations(id),
    transaction_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes để tối ưu hiệu suất truy vấn
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_generations_user_id ON user_generations(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);

-- Trigger để reset free generations hàng ngày
CREATE OR REPLACE FUNCTION reset_free_generations()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users 
    SET free_generations_left = 10,
        last_free_generations_reset = NOW()
    WHERE last_free_generations_reset < NOW() - INTERVAL '24 hours';
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER daily_free_generations_reset
AFTER INSERT ON user_generations
EXECUTE FUNCTION reset_free_generations();

-- Tạo function để tự động thêm user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tạo trigger khi user mới được tạo
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed data cho generation plans
INSERT INTO credits_plans (name, price, generations_count) VALUES 
('50 Generations', 5.00, 50);