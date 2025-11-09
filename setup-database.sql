-- ============================================
-- SCRIPT SQL PARA CONFIGURAÇÃO DO BANCO DE DADOS SUPABASE
-- Sistema de Agendamento de Barbearia
-- ============================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: barbershop_settings
-- Configurações gerais da barbearia
-- ============================================
CREATE TABLE IF NOT EXISTS barbershop_settings (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL DEFAULT 'Barbearia Premium',
  logo_url TEXT,
  background_type TEXT NOT NULL DEFAULT 'image',
  background_color TEXT DEFAULT '#000000',
  background_image_url TEXT,
  address TEXT NOT NULL DEFAULT 'Rua dos Barbeiros, 123 - Centro - São Paulo, SP',
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================
-- TABELA: barbers
-- Barbeiros cadastrados pelo administrador
-- ============================================
CREATE TABLE IF NOT EXISTS barbers (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  profile_photo_url TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================
-- TABELA: services
-- Serviços oferecidos pela barbearia
-- ============================================
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================
-- TABELA: appointments
-- Agendamentos de clientes
-- ============================================
CREATE TABLE IF NOT EXISTS appointments (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  client_name TEXT NOT NULL,
  client_whatsapp TEXT NOT NULL,
  barber_id VARCHAR NOT NULL REFERENCES barbers(id) ON DELETE CASCADE,
  service_id VARCHAR NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================
-- TABELA: operating_hours
-- Horários de funcionamento da barbearia
-- ============================================
CREATE TABLE IF NOT EXISTS operating_hours (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  day_of_week INTEGER NOT NULL,
  open_time TIME NOT NULL DEFAULT '09:00',
  close_time TIME NOT NULL DEFAULT '21:00',
  is_closed BOOLEAN NOT NULL DEFAULT FALSE
);

-- ============================================
-- ÍNDICES PARA MELHOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_appointments_barber ON appointments(barber_id);
CREATE INDEX IF NOT EXISTS idx_appointments_service ON appointments(service_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_barbers_email ON barbers(email);

-- ============================================
-- DADOS INICIAIS (SEED)
-- ============================================

-- Inserir configurações iniciais da barbearia
INSERT INTO barbershop_settings (name, address, background_type)
VALUES ('Barbearia Premium', 'Rua dos Barbeiros, 123 - Centro - São Paulo, SP', 'image')
ON CONFLICT (id) DO NOTHING;

-- Inserir horários de funcionamento padrão (segunda a domingo)
INSERT INTO operating_hours (day_of_week, open_time, close_time, is_closed) VALUES
  (0, '09:00', '18:00', FALSE),  -- Domingo
  (1, '09:00', '21:00', FALSE),  -- Segunda
  (2, '09:00', '21:00', FALSE),  -- Terça
  (3, '09:00', '21:00', FALSE),  -- Quarta
  (4, '09:00', '21:00', FALSE),  -- Quinta
  (5, '09:00', '21:00', FALSE),  -- Sexta
  (6, '09:00', '20:00', FALSE)   -- Sábado
ON CONFLICT DO NOTHING;

-- Inserir alguns serviços exemplo
INSERT INTO services (name, price) VALUES
  ('Corte de Cabelo', 45.00),
  ('Barba', 35.00),
  ('Corte + Barba', 70.00),
  ('Hidratação Capilar', 80.00)
ON CONFLICT DO NOTHING;

-- ============================================
-- COMENTÁRIOS
-- ============================================
COMMENT ON TABLE barbershop_settings IS 'Configurações gerais da barbearia (nome, logo, endereço)';
COMMENT ON TABLE barbers IS 'Barbeiros cadastrados pelo administrador com login próprio';
COMMENT ON TABLE services IS 'Serviços oferecidos pela barbearia com preços';
COMMENT ON TABLE appointments IS 'Agendamentos realizados pelos clientes';
COMMENT ON TABLE operating_hours IS 'Horários de funcionamento por dia da semana';

-- ============================================
-- CONFIGURAÇÃO DE STORAGE (Para upload de imagens)
-- ============================================
-- Execute este comando no Supabase Dashboard > Storage
-- Crie um bucket chamado 'barbershop' com as seguintes configurações:
-- - Public bucket: true
-- - Allowed MIME types: image/png, image/jpeg, image/jpg, image/webp
-- ============================================