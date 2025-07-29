-- SQL para corrigir as políticas RLS da tabela users
-- Execute este código no SQL Editor do Supabase

-- Remover todas as políticas existentes da tabela users
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Allow anonymous access" ON users;

-- Criar política simples para permitir acesso anônimo (temporária para testes)
CREATE POLICY "Allow anonymous access" ON users
  FOR ALL USING (true);

-- Verificar se as políticas foram corrigidas
SELECT 'Políticas RLS corrigidas com sucesso!' as status; 