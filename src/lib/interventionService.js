import { supabase, isSupabaseConfigured } from './supabase.js';
import { INITIAL_INTERVENTIONS } from '../data/demoStudents.js';

const STORAGE_KEY_INTERVENTIONS = 'edupulse_interventions_data_v1';

export const INTERVENTION_TYPES = [
  'Schedule a mentoring session',
  'Recommend subject tutoring',
  'Review attendance barriers',
  'Assign a coding-practice plan',
  'Recommend aptitude preparation',
  'Schedule a mock interview',
  'Arrange a follow-up discussion',
];

export const INTERVENTION_STATUSES = ['Pending', 'In Progress', 'Completed'];

/**
 * Get all interventions from Supabase or localStorage / demo list
 */
export async function getInterventions() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('interventions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        return { interventions: data, source: 'supabase' };
      }
    } catch (err) {
      console.warn('Supabase interventions fetch failed, falling back to local demo:', err.message);
    }
  }

  let stored = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_INTERVENTIONS);
    if (raw) stored = JSON.parse(raw);
  } catch (e) {
    console.warn('Could not read interventions from localStorage', e);
  }

  const list = stored && stored.length > 0 ? stored : INITIAL_INTERVENTIONS;
  return { interventions: list, source: 'demo' };
}

/**
 * Creates a new intervention
 * @param {Object} item 
 */
export async function createIntervention(item) {
  const newIntervention = {
    id: `INT-${Date.now().toString().slice(-4)}`,
    student_id: item.student_id,
    student_name: item.student_name || 'Student',
    department: item.department || 'General',
    intervention_type: item.intervention_type,
    description: item.description,
    assigned_faculty: item.assigned_faculty || 'Faculty Advisor',
    due_date: item.due_date || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    status: item.status || 'Pending',
    follow_up_notes: item.follow_up_notes || '',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Try Supabase first
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('interventions')
        .insert([{
          student_id: newIntervention.student_id,
          intervention_type: newIntervention.intervention_type,
          description: newIntervention.description,
          assigned_faculty: newIntervention.assigned_faculty,
          due_date: newIntervention.due_date,
          status: newIntervention.status,
          follow_up_notes: newIntervention.follow_up_notes,
        }])
        .select()
        .single();

      if (!error && data) {
        newIntervention.id = data.id;
      }
    } catch (err) {
      console.warn('Could not save intervention to Supabase:', err.message);
    }
  }

  // Persist locally
  try {
    const { interventions } = await getInterventions();
    const updated = [newIntervention, ...interventions];
    localStorage.setItem(STORAGE_KEY_INTERVENTIONS, JSON.stringify(updated));
    return newIntervention;
  } catch (err) {
    console.error('Failed to save intervention:', err);
    return newIntervention;
  }
}

/**
 * Updates an intervention's status and follow-up notes
 * @param {string} id 
 * @param {Object} updates 
 */
export async function updateIntervention(id, updates) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('interventions')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
    } catch (err) {
      console.warn('Could not update intervention in Supabase:', err.message);
    }
  }

  try {
    const { interventions } = await getInterventions();
    const updated = interventions.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          ...updates,
          updated_at: new Date().toISOString(),
        };
      }
      return item;
    });
    localStorage.setItem(STORAGE_KEY_INTERVENTIONS, JSON.stringify(updated));
    return updated.find((i) => i.id === id);
  } catch (err) {
    console.error('Failed to update intervention locally:', err);
    return null;
  }
}
