import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveAssessment(data) {
  const { data: response, error } = await supabase
    .from('ai_army_assessments')
    .insert([data])
    .select();

  if (error) {
    console.error('Error saving assessment:', error);
    throw error;
  }

  return response[0];
}

export async function getAllAssessments() {
  const { data, error } = await supabase
    .from('ai_army_assessments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching assessments:', error);
    throw error;
  }

  return data;
}

export async function getAssessmentStats() {
  const { data, error } = await supabase
    .from('ai_army_assessments')
    .select('cluster, tier, ai_appetite, readiness');

  if (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }

  return data;
}
