import { query, getClient } from '../config/database.js';

const migrations = [
  `-- Enable UUID extension
  CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,

  `-- Users table (synced with Firebase Auth)
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    firebase_uid VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    phone VARCHAR(50),
    country_code VARCHAR(10) DEFAULT '+976',
    username VARCHAR(100) UNIQUE,
    first_name VARCHAR(100) NOT NULL DEFAULT '',
    last_name VARCHAR(100) NOT NULL DEFAULT '',
    display_name VARCHAR(255),
    avatar_url TEXT,
    role VARCHAR(20) NOT NULL DEFAULT 'Owner',
    email_verified BOOLEAN DEFAULT false,
    phone_verified BOOLEAN DEFAULT false,
    auth_method VARCHAR(20) DEFAULT 'email',
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid);
  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);`,

  `-- Family trees table
  CREATE TABLE IF NOT EXISTS family_trees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT,
    clan_name VARCHAR(100),
    privacy_setting VARCHAR(20) DEFAULT 'invite_only',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_family_trees_owner UNIQUE (owner_id)
  );

  CREATE INDEX IF NOT EXISTS idx_family_trees_code ON family_trees(code);
  CREATE INDEX IF NOT EXISTS idx_family_trees_owner ON family_trees(owner_id);`,

  `-- Add unique owner constraint if not present (safe migration for existing tables)
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'uq_family_trees_owner'
    ) THEN
      ALTER TABLE family_trees ADD CONSTRAINT uq_family_trees_owner UNIQUE (owner_id);
    END IF;
  END $$;`,

  `-- Tree members (users who joined a tree)
  CREATE TABLE IF NOT EXISTS tree_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id UUID NOT NULL REFERENCES family_trees(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL DEFAULT 'Viewer',
    invite_code VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Active',
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(tree_id, user_id)
  );

  CREATE INDEX IF NOT EXISTS idx_tree_members_tree ON tree_members(tree_id);
  CREATE INDEX IF NOT EXISTS idx_tree_members_user ON tree_members(user_id);`,

  `-- People (family tree nodes)
  CREATE TABLE IF NOT EXISTS people (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id UUID NOT NULL REFERENCES family_trees(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    surname VARCHAR(100),
    clan_name VARCHAR(100) NOT NULL DEFAULT '',
    birth_place VARCHAR(255) DEFAULT '',
    residence VARCHAR(255) DEFAULT '',
    citizenship VARCHAR(100) DEFAULT '',
    phone VARCHAR(50) DEFAULT '',
    email VARCHAR(255) DEFAULT '',
    title VARCHAR(255) DEFAULT '',
    employment VARCHAR(255) DEFAULT '',
    biography TEXT,
    zodiac_sign VARCHAR(50),
    birth_year INTEGER CHECK (birth_year >= 1800 AND birth_year <= 2100),
    birth_date VARCHAR(20),
    death_date VARCHAR(20),
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    occupation VARCHAR(255),
    education VARCHAR(255),
    awards TEXT[] DEFAULT '{}',
    avatar_url TEXT DEFAULT '',
    notes TEXT,
    custom_fields JSONB,
    relationship_label VARCHAR(30) DEFAULT 'RELATIVE',
    verified BOOLEAN DEFAULT false,
    pending_oral_history BOOLEAN DEFAULT false,
    father_id UUID REFERENCES people(id) ON DELETE SET NULL,
    mother_id UUID REFERENCES people(id) ON DELETE SET NULL,
    spouse_id UUID REFERENCES people(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_people_tree ON people(tree_id);
  CREATE INDEX IF NOT EXISTS idx_people_father ON people(father_id);
  CREATE INDEX IF NOT EXISTS idx_people_mother ON people(mother_id);
  CREATE INDEX IF NOT EXISTS idx_people_spouse ON people(spouse_id);
  CREATE INDEX IF NOT EXISTS idx_people_clan ON people(clan_name);
  CREATE INDEX IF NOT EXISTS idx_people_name ON people(last_name, first_name);
  CREATE INDEX IF NOT EXISTS idx_people_birth_year ON people(birth_year);`,

  `-- Add missing columns to existing people table (safe ALTER)
  DO $$
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'people' AND column_name = 'residence') THEN
      ALTER TABLE people ADD COLUMN residence VARCHAR(255) DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'people' AND column_name = 'citizenship') THEN
      ALTER TABLE people ADD COLUMN citizenship VARCHAR(100) DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'people' AND column_name = 'phone') THEN
      ALTER TABLE people ADD COLUMN phone VARCHAR(50) DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'people' AND column_name = 'email') THEN
      ALTER TABLE people ADD COLUMN email VARCHAR(255) DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'people' AND column_name = 'title') THEN
      ALTER TABLE people ADD COLUMN title VARCHAR(255) DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'people' AND column_name = 'employment') THEN
      ALTER TABLE people ADD COLUMN employment VARCHAR(255) DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'people' AND column_name = 'avatar_url') THEN
      ALTER TABLE people ADD COLUMN avatar_url TEXT DEFAULT '';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'people' AND column_name = 'custom_fields') THEN
      ALTER TABLE people ADD COLUMN custom_fields JSONB;
    END IF;
  END $$;`,

  `-- Media items (photos, documents, certificates)
  CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
    tree_id UUID NOT NULL REFERENCES family_trees(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    type VARCHAR(20) NOT NULL CHECK (type IN ('photo', 'document', 'certificate')),
    url TEXT NOT NULL,
    file_key VARCHAR(500),
    file_size INTEGER,
    mime_type VARCHAR(100),
    version INTEGER DEFAULT 1,
    uploaded_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_media_person ON media(person_id);
  CREATE INDEX IF NOT EXISTS idx_media_tree ON media(tree_id);
  CREATE INDEX IF NOT EXISTS idx_media_type ON media(type);`,

  `-- Notifications
  CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warn')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    reference_type VARCHAR(50),
    reference_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
  CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
  CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);`,

  `-- Activity logs
  CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id UUID NOT NULL REFERENCES family_trees(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK (type IN ('add', 'edit', 'delete', 'media_add', 'media_delete', 'role_update', 'person_created', 'person_updated', 'person_deleted', 'tree_created', 'tree_updated', 'tree_deleted', 'member_joined', 'member_approved', 'member_rejected', 'member_removed', 'photo_uploaded', 'photo_deleted', 'document_uploaded', 'document_deleted', 'relationship_created', 'relationship_updated', 'relationship_deleted')),
    description TEXT NOT NULL,
    person_id UUID REFERENCES people(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id),
    user_name VARCHAR(255) NOT NULL DEFAULT 'System',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_activity_tree ON activity_logs(tree_id);
  CREATE INDEX IF NOT EXISTS idx_activity_person ON activity_logs(person_id);
  CREATE INDEX IF NOT EXISTS idx_activity_type ON activity_logs(type);
  CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_logs(created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_logs(user_id);

  -- Expand CHECK constraint to support new activity types
  ALTER TABLE activity_logs DROP CONSTRAINT IF EXISTS activity_logs_type_check;
  ALTER TABLE activity_logs ADD CONSTRAINT activity_logs_type_check CHECK (type IN ('add', 'edit', 'delete', 'media_add', 'media_delete', 'role_update', 'person_created', 'person_updated', 'person_deleted', 'tree_created', 'tree_updated', 'tree_deleted', 'member_joined', 'member_approved', 'member_rejected', 'member_removed', 'photo_uploaded', 'photo_deleted', 'document_uploaded', 'document_deleted', 'relationship_created', 'relationship_updated', 'relationship_deleted'));`,

  `-- Invites
  CREATE TABLE IF NOT EXISTS invites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tree_id UUID NOT NULL REFERENCES family_trees(id) ON DELETE CASCADE,
    email VARCHAR(255),
    phone VARCHAR(50),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'Editor' CHECK (role IN ('Editor', 'Viewer')),
    code VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Accepted', 'Declined')),
    invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (tree_id, user_id)
  );

  CREATE INDEX IF NOT EXISTS idx_invites_tree ON invites(tree_id);
  CREATE INDEX IF NOT EXISTS idx_invites_code ON invites(code);
  CREATE INDEX IF NOT EXISTS idx_invites_email ON invites(email);
  CREATE INDEX IF NOT EXISTS idx_invites_user_id ON invites(user_id);`,

  `-- Add user_id to existing invites table (safe migration)
  DO $$
  DECLARE
    constraint_name text;
  BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invites' AND column_name = 'user_id') THEN
      ALTER TABLE invites ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'invites_tree_id_user_id_key') THEN
      ALTER TABLE invites ADD CONSTRAINT invites_tree_id_user_id_key UNIQUE (tree_id, user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE tablename = 'invites' AND indexname = 'idx_invites_user_id') THEN
      CREATE INDEX idx_invites_user_id ON invites(user_id);
    END IF;

    -- Drop old status CHECK (allowed only 'Pending', 'Active')
    SELECT c.conname INTO constraint_name
      FROM pg_constraint c
      JOIN pg_class t ON c.conrelid = t.oid
      WHERE t.relname = 'invites'
        AND c.contype = 'c'
        AND c.conname LIKE '%status%';
    IF constraint_name IS NOT NULL THEN
      EXECUTE 'ALTER TABLE invites DROP CONSTRAINT ' || constraint_name;
    END IF;

    -- Migrate any 'Active' rows to 'Accepted'
    UPDATE invites SET status = 'Accepted' WHERE status = 'Active';

    -- Add new status CHECK with all valid values
    EXECUTE 'ALTER TABLE invites ADD CONSTRAINT invites_status_check CHECK (status IN (''Pending'', ''Accepted'', ''Declined''))';
  END $$;`,

  `-- Password reset tokens
  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    otp VARCHAR(10),
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_reset_tokens_token ON password_reset_tokens(token);
  CREATE INDEX IF NOT EXISTS idx_reset_tokens_email ON password_reset_tokens(email);`,

  `-- Subscriptions
  CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan VARCHAR(50) NOT NULL DEFAULT 'free',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    amount NUMERIC(10,2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'MNT',
    billing_period VARCHAR(20) DEFAULT 'monthly',
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    canceled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
  CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);`,
];

async function runMigrations() {
  console.log('Running database migrations...');
  for (let i = 0; i < migrations.length; i++) {
    try {
      await query(migrations[i]);
      console.log(`Migration ${i + 1}/${migrations.length} completed`);
    } catch (err) {
      console.error(`Migration ${i + 1} failed:`, err.message);
      throw err;
    }
  }
  console.log('All migrations completed successfully');
}

runMigrations()
  .then(() => {
    console.log('Migration process finished');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Migration process failed:', err);
    process.exit(1);
  });
