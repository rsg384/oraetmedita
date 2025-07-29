-- =====================================================
-- Tabela: schedules (CORRIGIDA)
-- Descrição: Agendamentos de meditação dos usuários
-- Autor: Rodrigo Silva Goes
-- Data: 2025-07-29
-- Baseado no backup: oraetmedita_schedules_2025-07-29.json
-- =====================================================

-- Criar tabela schedules
CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Informações do agendamento (baseado no backup)
    title VARCHAR(255) NOT NULL,
    description TEXT,
    schedule_time TIME NOT NULL, -- Horário no formato HH:MM (renomeado para evitar conflito)
    duration INTEGER DEFAULT 15,
    
    -- Categoria e dias
    category VARCHAR(255), -- Nome da categoria
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    days TEXT[], -- Array de dias da semana: ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom']
    
    -- Status e configurações
    status VARCHAR(20) DEFAULT 'agendado' CHECK (status IN ('agendado', 'ativo', 'pausado', 'cancelado', 'concluído')),
    notifications BOOLEAN DEFAULT true,
    
    -- Datas
    schedule_date DATE NOT NULL, -- Data de início (renomeado para evitar conflito)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Informações do usuário
    user_name VARCHAR(255),
    
    -- Campos opcionais para funcionalidades avançadas
    meditation_id UUID REFERENCES meditations(id) ON DELETE SET NULL,
    personalized_meditation_id UUID REFERENCES personalized_meditations(id) ON DELETE SET NULL,
    
    -- Configurações avançadas (opcionais)
    priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
    reminder_minutes INTEGER DEFAULT 15,
    
    -- Configurações de notificação
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    
    -- Configurações de meditação
    auto_start BOOLEAN DEFAULT false,
    background_music BOOLEAN DEFAULT false,
    guided_meditation BOOLEAN DEFAULT true,
    
    -- Metadados
    tags TEXT[], -- Array de tags
    location VARCHAR(255), -- Local preferido
    notes TEXT,
    
    -- Timestamps adicionais
    last_executed TIMESTAMP WITH TIME ZONE,
    next_execution TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT valid_duration CHECK (duration > 0 AND duration <= 480), -- Máximo 8 horas
    CONSTRAINT valid_reminder CHECK (reminder_minutes >= 0 AND reminder_minutes <= 1440) -- Máximo 24 horas
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_category_id ON schedules(category_id);
CREATE INDEX IF NOT EXISTS idx_schedules_meditation_id ON schedules(meditation_id);
CREATE INDEX IF NOT EXISTS idx_schedules_personalized_id ON schedules(personalized_meditation_id);
CREATE INDEX IF NOT EXISTS idx_schedules_status ON schedules(status);
CREATE INDEX IF NOT EXISTS idx_schedules_date ON schedules(schedule_date);
CREATE INDEX IF NOT EXISTS idx_schedules_time ON schedules(schedule_time);
CREATE INDEX IF NOT EXISTS idx_schedules_user_status ON schedules(user_id, status);
CREATE INDEX IF NOT EXISTS idx_schedules_category ON schedules(category);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_schedules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_schedules_updated_at
    BEFORE UPDATE ON schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_schedules_updated_at();

-- Função para obter agendamentos do usuário
CREATE OR REPLACE FUNCTION get_user_schedules(user_uuid UUID, date_from DATE DEFAULT CURRENT_DATE, date_to DATE DEFAULT CURRENT_DATE + INTERVAL '7 days')
RETURNS TABLE(
    id UUID,
    title VARCHAR(255),
    description TEXT,
    schedule_time TIME,
    duration INTEGER,
    category VARCHAR(255),
    days TEXT[],
    status VARCHAR(20),
    schedule_date DATE,
    user_name VARCHAR(255)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.title,
        s.description,
        s.schedule_time,
        s.duration,
        s.category,
        s.days,
        s.status,
        s.schedule_date,
        s.user_name
    FROM schedules s
    WHERE s.user_id = user_uuid
    AND s.status = 'agendado'
    AND s.schedule_date BETWEEN date_from AND date_to
    ORDER BY s.schedule_date ASC, s.schedule_time ASC;
END;
$$ LANGUAGE plpgsql;

-- Inserir dados de exemplo baseados no backup
INSERT INTO schedules (
    user_id,
    title,
    description,
    schedule_time,
    duration,
    category,
    days,
    status,
    schedule_date,
    user_name,
    notifications,
    created_at,
    last_updated
) VALUES 
-- Agendamento 1: Jaculatórias
(
    (SELECT id FROM users WHERE email = 'wanessa.rwg@gmail.com' LIMIT 1),
    'Meditação Jaculatórias',
    'Agendamento para Jaculatórias às 23:55',
    '23:55:00',
    15,
    'Jaculatórias',
    ARRAY['sab'],
    'agendado',
    '2025-07-28',
    'rodrigo silva goes',
    true,
    '2025-07-28T00:53:38.126Z'::TIMESTAMP WITH TIME ZONE,
    '2025-07-28T00:53:38.128Z'::TIMESTAMP WITH TIME ZONE
),
-- Agendamento 2: Os Fundamentos da Vida Espiritual
(
    (SELECT id FROM users WHERE email = 'wanessa.rwg@gmail.com' LIMIT 1),
    'Meditação Os Fundamentos da Vida Espiritual',
    'Agendamento para Os Fundamentos da Vida Espiritual às 00:56',
    '00:56:00',
    15,
    'Os Fundamentos da Vida Espiritual',
    ARRAY['sab', 'dom'],
    'agendado',
    '2025-07-28',
    'rodrigo silva goes',
    true,
    '2025-07-28T00:53:47.629Z'::TIMESTAMP WITH TIME ZONE,
    '2025-07-28T00:53:47.630Z'::TIMESTAMP WITH TIME ZONE
),
-- Agendamento 3: Evangelho do dia
(
    (SELECT id FROM users WHERE email = 'wanessa.rwg@gmail.com' LIMIT 1),
    'Meditação Evangelho do dia',
    'Agendamento para Evangelho do dia às 23:01',
    '23:01:00',
    15,
    'Evangelho do dia',
    ARRAY['qua', 'dom'],
    'agendado',
    '2025-07-28',
    'rodrigo silva goes',
    true,
    '2025-07-28T00:59:05.365Z'::TIMESTAMP WITH TIME ZONE,
    '2025-07-28T00:59:05.367Z'::TIMESTAMP WITH TIME ZONE
),
-- Agendamento 4: Imitação de Cristo
(
    (SELECT id FROM users WHERE email = 'wanessa.rwg@gmail.com' LIMIT 1),
    'Meditação Imitação de Cristo',
    'Agendamento para Imitação de Cristo às 19:25',
    '19:25:00',
    15,
    'Imitação de Cristo',
    ARRAY['seg'],
    'agendado',
    '2025-07-28',
    'rodrigo silva goes',
    true,
    '2025-07-28T22:19:00.386Z'::TIMESTAMP WITH TIME ZONE,
    '2025-07-28T22:19:00.387Z'::TIMESTAMP WITH TIME ZONE
);

-- Comentários da tabela
COMMENT ON TABLE schedules IS 'Agendamentos de meditação dos usuários';
COMMENT ON COLUMN schedules.id IS 'Identificador único do agendamento';
COMMENT ON COLUMN schedules.user_id IS 'ID do usuário';
COMMENT ON COLUMN schedules.title IS 'Título do agendamento';
COMMENT ON COLUMN schedules.description IS 'Descrição do agendamento';
COMMENT ON COLUMN schedules.schedule_time IS 'Horário no formato HH:MM';
COMMENT ON COLUMN schedules.duration IS 'Duração em minutos';
COMMENT ON COLUMN schedules.category IS 'Nome da categoria';
COMMENT ON COLUMN schedules.days IS 'Array de dias da semana: [seg, ter, qua, qui, sex, sab, dom]';
COMMENT ON COLUMN schedules.status IS 'Status: agendado, ativo, pausado, cancelado, concluído';
COMMENT ON COLUMN schedules.schedule_date IS 'Data de início do agendamento';
COMMENT ON COLUMN schedules.user_name IS 'Nome do usuário';
COMMENT ON COLUMN schedules.notifications IS 'Se deve enviar notificações';

-- Verificar se a tabela foi criada
SELECT 
    'Tabela schedules criada com sucesso!' as status,
    COUNT(*) as total_schedules
FROM schedules; 