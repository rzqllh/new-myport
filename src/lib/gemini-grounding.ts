import { unstable_cache } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

export const getCachedGroundingData = unstable_cache(
  async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const [projects, experiences, skills] = await Promise.all([
      supabase.from('projects').select('title, description, tech_stack, role').eq('status', 'published').order('sort_order'),
      supabase.from('experiences').select('company, role, description, start_date, end_date').order('sort_order'),
      supabase.from('skills').select('name, category, proficiency').order('sort_order')
    ]);

    const formatProjects = projects.data?.map(p => `- ${p.title} (${p.role}): ${p.description}. Tech: ${p.tech_stack?.join(', ')}`).join('\n') || 'None listed.';
    const formatExp = experiences.data?.map(e => `- ${e.role} at ${e.company} (${e.start_date} to ${e.end_date || 'Present'}): ${e.description}`).join('\n') || 'None listed.';
    const formatSkills = skills.data?.map(s => `- ${s.name} (${s.category}, ${s.proficiency}%)`).join('\n') || 'None listed.';

    return `Experience:\n${formatExp}\n\nProjects:\n${formatProjects}\n\nSkills:\n${formatSkills}`;
  },
  ['gemini-grounding-data'],
  { revalidate: 3600 }
);
