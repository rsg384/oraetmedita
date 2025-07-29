# 🔄 Reset da Tabela Users - Supabase

## **Problema Identificado:**
- A tabela `users` existe mas tem políticas RLS causando recursão infinita
- Erro: `infinite recursion detected in policy for relation "users"`

## **Solução:**
Execute o SQL `reset-users-table.sql` no Supabase para recriar a tabela corretamente.

---

## **📋 Passos para Executar:**

### 1. **Acesse o Supabase Dashboard**
- Vá para: https://supabase.com/dashboard
- Faça login na sua conta
- Selecione o projeto: `pmqxibhulaybvpjvdvyp`

### 2. **Abra o SQL Editor**
- No menu lateral, clique em **"SQL Editor"**
- Clique em **"New query"** para criar uma nova consulta

### 3. **Cole o SQL de Reset**
Copie e cole o conteúdo do arquivo `reset-users-table.sql`:

```sql
-- SQL para recriar completamente a tabela users
-- Execute este código no SQL Editor do Supabase

-- Desabilitar RLS temporariamente
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas existentes
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Allow anonymous access" ON users;

-- Recriar a tabela users do zero
DROP TABLE IF EXISTS users CASCADE;

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

-- Criar função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir usuário de teste
INSERT INTO users (email, name, password_hash, is_active) 
VALUES ('test@example.com', 'Usuário Teste', 'test-hash', true);

-- Verificar se a tabela foi criada corretamente
SELECT 'Tabela users recriada com sucesso!' as status;
```

### 4. **Execute o SQL**
- Clique no botão **"Run"** (ou pressione Ctrl+Enter)
- Aguarde a execução completar

### 5. **Verifique o Resultado**
- Você deve ver a mensagem: `"Tabela users recriada com sucesso!"`
- Se houver algum erro, ele será exibido na tela

---

## **✅ Após a Execução:**

### 6. **Teste a Conexão**
- Acesse: `http://localhost:3173/test-supabase-connection.html`
- Clique em **"Testar Conexão"**
- Deve mostrar: **"Conectado"** ✅

### 7. **Teste as Operações**
- Clique em **"Testar GET Users"**
- Deve retornar: **1 registro** (o usuário de teste)

---

## **🚨 Se Houver Erro:**

### **Erro: "relation does not exist"**
- A tabela não existe ainda, execute o SQL novamente

### **Erro: "permission denied"**
- Verifique se você tem permissões de administrador no projeto

### **Erro: "syntax error"**
- Verifique se copiou todo o SQL corretamente

---

## **📞 Suporte:**
Se continuar com problemas, me informe qual erro específico apareceu e posso ajudar a resolver! 