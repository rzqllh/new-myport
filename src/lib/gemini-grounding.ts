import { unstable_cache } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { FALLBACK_PROJECTS } from '@/lib/project-content';

const DEFAULT_GROUNDING_EXPERIENCE = `- Project Management Officer (IT & Strategy) at Telkom Indonesia (2024-03-01 to Present): Supported IT project coordination and tracking across multiple teams, ensuring alignment with project timelines and deliverables. Monitored project progress, identified bottlenecks, and monitored daily device health and system performance with Grafana.
- Computer Operator at Ministry of Education, Culture, Research and Technology (2023-03-01 to 2023-04-30): Documented and inventoried Indonesian cultural treasures across 451 museums nationwide. Managed a digital asset repository containing over 100,395 multimedia items. Cataloged 30,930 registered objects, buildings, sites, and structures.
- Bachelor of Informatics at Gunadarma University (2018 to 2022): Focused on software engineering, database systems, and human-computer interaction. Thesis Research: Focused on user interface analysis and design for mobile banking using User-Centered Design (UCD) and A/B Testing methodology. Graduated with GPA 3.54 / 4.00.`;

export const getCachedGroundingData = unstable_cache(
  async () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        const formatProjects = FALLBACK_PROJECTS.map(p => `- ${p.title} (${p.role}): ${p.description}. Tech: ${p.tech_stack?.join(', ')}`).join('\n');
        return `Experience:\n${DEFAULT_GROUNDING_EXPERIENCE}\n\nProjects:\n${formatProjects}`;
      }

      const supabase = createClient(supabaseUrl, supabaseKey);
      const [projects, experiences, skills] = await Promise.all([
        supabase.from('projects').select('title, description, tech_stack, role').eq('status', 'published').order('sort_order'),
        supabase.from('experiences').select('company, role, description, start_date, end_date').order('sort_order'),
        supabase.from('skills').select('name, category, proficiency').order('sort_order')
      ]);

      const formatProjects = (projects.data && projects.data.length > 0)
        ? projects.data.map(p => `- ${p.title} (${p.role}): ${p.description}. Tech: ${p.tech_stack?.join(', ')}`).join('\n')
        : FALLBACK_PROJECTS.map(p => `- ${p.title} (${p.role}): ${p.description}. Tech: ${p.tech_stack?.join(', ')}`).join('\n');

      const formatExp = (experiences.data && experiences.data.length > 0)
        ? experiences.data.map(e => `- ${e.role} at ${e.company} (${e.start_date} to ${e.end_date || 'Present'}): ${e.description}`).join('\n')
        : DEFAULT_GROUNDING_EXPERIENCE;

      const formatSkills = skills.data?.map(s => `- ${s.name} (${s.category}, ${s.proficiency}%)`).join('\n') || 'Web Engineering (React, Next.js, TypeScript, Python, SQL), UI/UX Design (Figma, UCD, A/B Testing), Project Management (IT Strategy, Jira, Grafana).';

      return `Experience:\n${formatExp}\n\nProjects:\n${formatProjects}\n\nSkills:\n${formatSkills}`;
    } catch {
      const formatProjects = FALLBACK_PROJECTS.map(p => `- ${p.title} (${p.role}): ${p.description}. Tech: ${p.tech_stack?.join(', ')}`).join('\n');
      return `Experience:\n${DEFAULT_GROUNDING_EXPERIENCE}\n\nProjects:\n${formatProjects}`;
    }
  },
  ['gemini-grounding-data'],
  { revalidate: 3600 }
);
