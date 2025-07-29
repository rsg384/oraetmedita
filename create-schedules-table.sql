-- =====================================================
-- Tabela: schedules
-- Descrição: Agendamentos de meditação dos usuários
-- Autor: Rodrigo Silva Goes
-- Data: 2025-07-29
-- =====================================================

-- Criar tabela schedules
CREATE TABLE IF NOT EXISTS schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Informações do agendamento
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    meditation_id UUID REFERENCES meditations(id) ON DELETE SET NULL,
    personalized_meditation_id UUID REFERENCES personalized_meditations(id) ON DELETE SET NULL,
    
    -- Configuração de horário
    start_time TIME NOT NULL,
    end_time TIME,
    duration_minutes INTEGER DEFAULT 15,
    
    -- Recorrência
    is_recurring BOOLEAN DEFAULT false,
    recurrence_type VARCHAR(20) CHECK (recurrence_type IN ('daily', 'weekly', 'monthly', 'custom')),
    recurrence_days INTEGER[], -- [1,2,3,4,5,6,7] para dias da semana
    recurrence_interval INTEGER DEFAULT 1, -- A cada X dias/semanas/meses
    
    -- Datas
    start_date DATE NOT NULL,
    end_date DATE,
    active_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    active_until TIMESTAMP WITH TIME ZONE,
    
    -- Status e configurações
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'cancelled', 'completed')),
    priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 5),
    reminder_minutes INTEGER DEFAULT 15, -- Minutos antes para lembrar
    
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
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_executed TIMESTAMP WITH TIME ZONE,
    next_execution TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT valid_time_range CHECK (end_time IS NULL OR end_time > start_time),
    CONSTRAINT valid_date_range CHECK (end_date IS NULL OR end_date >= start_date),
    CONSTRAINT valid_duration CHECK (duration_minutes > 0 AND duration_minutes <= 480), -- Máximo 8 horas
    CONSTRAINT valid_reminder CHECK (reminder_minutes >= 0 AND reminder_minutes <= 1440) -- Máximo 24 horas
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_schedules_user_id ON schedules(user_id);
CREATE INDEX IF NOT EXISTS idx_schedules_category_id ON schedules(category_id);
CREATE INDEX IF NOT EXISTS idx_schedules_meditation_id ON schedules(meditation_id);
CREATE INDEX IF NOT EXISTS idx_schedules_personalized_id ON schedules(personalized_meditation_id);
CREATE INDEX IF NOT EXISTS idx_schedules_status ON schedules(status);
CREATE INDEX IF NOT EXISTS idx_schedules_start_date ON schedules(start_date);
CREATE INDEX IF NOT EXISTS idx_schedules_next_execution ON schedules(next_execution);
CREATE INDEX IF NOT EXISTS idx_schedules_user_status ON schedules(user_id, status);
CREATE INDEX IF NOT EXISTS idx_schedules_recurring ON schedules(is_recurring, recurrence_type);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_schedules_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_schedules_updated_at
    BEFORE UPDATE ON schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_schedules_updated_at();

-- Função para calcular próximo agendamento
CREATE OR REPLACE FUNCTION calculate_next_schedule(schedule_uuid UUID)
RETURNS TIMESTAMP WITH TIME ZONE AS $$
DECLARE
    schedule_record RECORD;
    next_date DATE;
    next_time TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT * INTO schedule_record FROM schedules WHERE id = schedule_uuid;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    -- Se não é recorrente, retorna NULL
    IF NOT schedule_record.is_recurring THEN
        RETURN NULL;
    END IF;
    
    -- Calcular próxima data baseada no tipo de recorrência
    CASE schedule_record.recurrence_type
        WHEN 'daily' THEN
            next_date := COALESCE(schedule_record.last_executed::DATE, schedule_record.start_date) + 
                        (schedule_record.recurrence_interval || ' days')::INTERVAL;
        WHEN 'weekly' THEN
            next_date := COALESCE(schedule_record.last_executed::DATE, schedule_record.start_date) + 
                        (schedule_record.recurrence_interval || ' weeks')::INTERVAL;
        WHEN 'monthly' THEN
            next_date := COALESCE(schedule_record.last_executed::DATE, schedule_record.start_date) + 
                        (schedule_record.recurrence_interval || ' months')::INTERVAL;
        ELSE
            RETURN NULL;
    END CASE;
    
    -- Verificar se não passou da data final
    IF schedule_record.end_date IS NOT NULL AND next_date > schedule_record.end_date THEN
        RETURN NULL;
    END IF;
    
    -- Combinar data com horário
    next_time := (next_date || ' ' || schedule_record.start_time::TEXT)::TIMESTAMP WITH TIME ZONE;
    
    RETURN next_time;
END;
$$ LANGUAGE plpgsql;

-- Função para obter agendamentos do usuário
CREATE OR REPLACE FUNCTION get_user_schedules(user_uuid UUID, date_from DATE DEFAULT CURRENT_DATE, date_to DATE DEFAULT CURRENT_DATE + INTERVAL '7 days')
RETURNS TABLE(
    id UUID,
    title VARCHAR(255),
    description TEXT,
    start_time TIME,
    end_time TIME,
    duration_minutes INTEGER,
    category_name VARCHAR(255),
    meditation_title VARCHAR(255),
    status VARCHAR(20),
    priority INTEGER,
    next_execution TIMESTAMP WITH TIME ZONE,
    is_recurring BOOLEAN,
    recurrence_type VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        s.title,
        s.description,
        s.start_time,
        s.end_time,
        s.duration_minutes,
        c.name as category_name,
        COALESCE(m.title, pm.title) as meditation_title,
        s.status,
        s.priority,
        s.next_execution,
        s.is_recurring,
        s.recurrence_type
    FROM schedules s
    LEFT JOIN categories c ON s.category_id = c.id
    LEFT JOIN meditations m ON s.meditation_id = m.id
    LEFT JOIN personalized_meditations pm ON s.personalized_meditation_id = pm.id
    WHERE s.user_id = user_uuid
    AND s.status = 'active'
    AND (
        (s.is_recurring = false AND s.start_date BETWEEN date_from AND date_to) OR
        (s.is_recurring = true AND s.active_until IS NULL OR s.active_until >= date_from)
    )
    ORDER BY s.priority DESC, s.start_time ASC;
END;
$$ LANGUAGE plpgsql;

-- Inserir dados de exemplo
INSERT INTO schedules (
    user_id,
    title,
    description,
    category_id,
    meditation_id,
    start_time,
    duration_minutes,
    is_recurring,
    recurrence_type,
    recurrence_days,
    start_date,
    status,
    priority,
    reminder_minutes,
    notes
) VALUES 
-- Agendamento diário - Manhã
(
    (SELECT id FROM users WHERE email = 'wanessa.rwg@gmail.com' LIMIT 1),
    'Meditação Matinal',
    'Meditação diária para começar o dia com paz e gratidão',
    (SELECT id FROM categories WHERE name = 'Gratidão' LIMIT 1),
    (SELECT id FROM meditations WHERE title LIKE '%Gratidão%' LIMIT 1),
    '07:00:00',
    15,
    true,
    'daily',
    ARRAY[1,2,3,4,5,6,7],
    CURRENT_DATE,
    'active',
    1,
    10,
    'Meditação matinal para cultivar gratidão'
),
-- Agendamento semanal - Noite
(
    (SELECT id FROM users WHERE email = 'wanessa.rwg@gmail.com' LIMIT 1),
    'Reflexão Semanal',
    'Momento de reflexão e oração no final da semana',
    (SELECT id FROM categories WHERE name = 'Oração' LIMIT 1),
    (SELECT id FROM meditations WHERE title LIKE '%Oração%' LIMIT 1),
    '20:00:00',
    30,
    true,
    'weekly',
    ARRAY[7], -- Domingo
    CURRENT_DATE,
    'active',
    2,
    15,
    'Reflexão semanal sobre a vida espiritual'
),
-- Agendamento único - Evento especial
(
    (SELECT id FROM users WHERE email = 'wanessa.rwg@gmail.com' LIMIT 1),
    'Meditação Especial - Aniversário',
    'Meditação especial para celebrar o aniversário',
    (SELECT id FROM categories WHERE name = 'Celebração' LIMIT 1),
    NULL,
    '18:00:00',
    45,
    false,
    NULL,
    NULL,
    CURRENT_DATE + INTERVAL '3 days',
    'active',
    3,
    30,
    'Meditação especial para celebrar a vida'
),
-- Agendamento do admin
(
    (SELECT id FROM users WHERE email = 'admin@oraetmedita.com' LIMIT 1),
    'Meditação Administrativa',
    'Meditação para administradores do sistema',
    (SELECT id FROM categories WHERE name = 'Administração' LIMIT 1),
    (SELECT id FROM meditations WHERE title LIKE '%Administração%' LIMIT 1),
    '09:00:00',
    20,
    true,
    'daily',
    ARRAY[1,2,3,4,5], -- Segunda a sexta
    CURRENT_DATE,
    'active',
    1,
    5,
    'Meditação para manter o foco administrativo'
);

-- Comentários da tabela
COMMENT ON TABLE schedules IS 'Agendamentos de meditação dos usuários';
COMMENT ON COLUMN schedules.id IS 'Identificador único do agendamento';
COMMENT ON COLUMN schedules.user_id IS 'ID do usuário';
COMMENT ON COLUMN schedules.title IS 'Título do agendamento';
COMMENT ON COLUMN schedules.description IS 'Descrição do agendamento';
COMMENT ON COLUMN schedules.category_id IS 'ID da categoria (opcional)';
COMMENT ON COLUMN schedules.meditation_id IS 'ID da meditação específica (opcional)';
COMMENT ON COLUMN schedules.personalized_meditation_id IS 'ID da meditação personalizada (opcional)';
COMMENT ON COLUMN schedules.start_time IS 'Horário de início';
COMMENT ON COLUMN schedules.end_time IS 'Horário de fim (opcional)';
COMMENT ON COLUMN schedules.duration_minutes IS 'Duração em minutos';
COMMENT ON COLUMN schedules.is_recurring IS 'Se é um agendamento recorrente';
COMMENT ON COLUMN schedules.recurrence_type IS 'Tipo de recorrência: daily, weekly, monthly, custom';
COMMENT ON COLUMN schedules.recurrence_days IS 'Dias da semana para recorrência semanal';
COMMENT ON COLUMN schedules.start_date IS 'Data de início do agendamento';
COMMENT ON COLUMN schedules.end_date IS 'Data de fim do agendamento (opcional)';
COMMENT ON COLUMN schedules.status IS 'Status: active, paused, cancelled, completed';
COMMENT ON COLUMN schedules.priority IS 'Prioridade (1-5)';
COMMENT ON COLUMN schedules.reminder_minutes IS 'Minutos antes para lembrar';
COMMENT ON COLUMN schedules.next_execution IS 'Próxima execução calculada';

-- Verificar se a tabela foi criada
SELECT 
    'Tabela schedules criada com sucesso!' as status,
    COUNT(*) as total_schedules
FROM schedules; 