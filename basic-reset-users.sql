-- SQL básico para recriar a tabela users
-- Execute este código no SQL Editor do Supabase

-- Remover tabela se existir
DROP TABLE IF EXISTS users CASCADE;

-- Criar tabela users básica
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  profile_image_url TEXT,
  preferences JSONB DEFAULT '{}',
  last_login TIMESTAMP WITH TIME ZONE,
  email_verified BOOLEAN DEFAULT false,
  verification_token VARCHAR(255),
  reset_password_token VARCHAR(255),
  reset_password_expires TIMESTAMP WITH TIME ZONE
);

-- Criar índices básicos
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Inserir usuário de teste
INSERT INTO users (email, name, password_hash, is_active) 
VALUES ('test@example.com', 'Usuário Teste', 'test-hash', true);

-- Verificar se funcionou
SELECT 'Tabela users criada com sucesso!' as status; 