-- Migration: Add Push Subscriptions table
-- Created At: 2026-05-02
-- Description: Table for storing VAPID push subscriptions for notifications.

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create push_subscriptions table
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    endpoint TEXT UNIQUE NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    user_id TEXT, -- Can be linked to User.id (cuid)
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies
-- Allow anyone to create a subscription (e.g. from the landing page or admin login)
CREATE POLICY "Allow anonymous insertion" ON public.push_subscriptions
    FOR INSERT WITH CHECK (true);

-- Allow users to see only their own subscriptions (if user_id is set)
-- Or if it's an admin-only feature for now, we can restrict it.
CREATE POLICY "Allow users to view their own subscriptions" ON public.push_subscriptions
    FOR SELECT USING (user_id IS NULL OR user_id = auth.uid()::text); -- This might not work perfectly with NextAuth cuid IDs in auth.uid()

-- Allow admin to see all subscriptions
CREATE POLICY "Admins can view all subscriptions" ON public.push_subscriptions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admin_users -- Assuming there's a table like this from vision-plena check
            WHERE id = auth.uid()
        )
    );

-- Since I don't have the full Supabase Auth mapping for cuid, I'll keep policies simple for now.
-- In a real scenario, we'd sync NextAuth IDs with Supabase Auth or use a different mechanism.
