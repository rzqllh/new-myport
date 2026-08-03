import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials in .env");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Clearing existing data...");
  // Clear tables that we are about to seed to avoid duplicates if slugs change
  await supabase.from("projects").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("blog_posts").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("experiences").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase.from("skills").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  
  console.log("Seeding verified projects...");
  
  const { error: pError } = await supabase.from("projects").upsert([
    {
      slug: "pos-system-hadzkashop",
      title: "POS System (HadzkaShop)",
      description: "A Point of Sale system built to streamline transactions and inventory management.",
      role: "Full-Stack Developer",
      category: "Web Application",
      tech_stack: ["React", "Node.js", "Tailwind CSS"], // Assuming based on typical stack, but can be updated
      status: "published",
      featured: true,
      sort_order: 1
    },
    {
      slug: "yomirra",
      title: "Yomirra",
      description: "Web application development for Yomirra.",
      role: "Frontend Developer",
      category: "Web Application",
      tech_stack: ["Next.js", "React", "Tailwind CSS"], 
      status: "published",
      featured: true,
      sort_order: 2
    },
    {
      slug: "cultural-heritage-repository",
      title: "Cultural Heritage Digital Asset Repository",
      description: "Architected a massive digital asset repository containing over 100,395 multimedia items, optimizing data retrieval for cultural heritage websites. Cataloged 30,930 registered objects, buildings, sites, structures, and areas.",
      role: "Computer Operator / IT Consultant",
      category: "System Architecture",
      tech_stack: ["SQL", "Database Management"],
      status: "published",
      featured: true,
      sort_order: 3
    }
  ], { onConflict: "slug" });
  
  if (pError) console.error("Error seeding projects:", pError);
  else console.log("Projects seeded successfully.");

  console.log("Seeding blog articles (as drafts)...");
  
  const { error: aError } = await supabase.from("blog_posts").upsert([
    {
      slug: "article-one",
      title: "The Future of Web Development",
      excerpt: "Exploring the rise of server components and the shift back to server-side rendering in modern frameworks.",
      content: "<p>Full content goes here...</p>",
      status: "draft",
      tags: ["Web", "React", "Trends"],
    },
    {
      slug: "article-two",
      title: "Designing for Accessibility",
      excerpt: "Why building accessible interfaces is not just a legal requirement, but a fundamental principle of good design.",
      content: "<p>Full content goes here...</p>",
      status: "draft",
      tags: ["Design", "Accessibility", "UI/UX"],
    },
    {
      slug: "article-three",
      title: "Optimizing Core Web Vitals",
      excerpt: "A practical guide to improving LCP, FID, and CLS scores on complex React applications.",
      content: "<p>Full content goes here...</p>",
      status: "draft",
      tags: ["Performance", "SEO", "React"],
    },
    {
      slug: "article-four",
      title: "Data-Driven Decisions in IT Strategy",
      excerpt: "How leveraging tools like Grafana for infrastructure monitoring leads to proactive issue resolution.",
      content: "<p>Full content goes here...</p>",
      status: "draft",
      tags: ["IT Strategy", "Grafana", "Data"],
    },
    {
      slug: "article-five",
      title: "Managing Large-Scale Digital Repositories",
      excerpt: "Lessons learned from architecting a repository for over 100,000 multimedia cultural heritage assets.",
      content: "<p>Full content goes here...</p>",
      status: "draft",
      tags: ["Architecture", "Database", "Case Study"],
    }
  ], { onConflict: "slug" });
  
  if (aError) console.error("Error seeding articles:", aError);
  else console.log("Articles seeded successfully.");

  console.log("Seeding skills...");
  
  const skillsToSeed = [
    // Programming & Scripting (Mapped to backend/frontend as closest categories since schema forces frontend/backend/design/tools)
    { name: "JavaScript", category: "frontend", sort_order: 1 },
    { name: "TypeScript", category: "frontend", sort_order: 2 },
    { name: "Python", category: "backend", sort_order: 3 },
    { name: "PHP", category: "backend", sort_order: 4 },
    { name: "Java (basic)", category: "backend", sort_order: 5 },
    
    // Web Development
    { name: "React", category: "frontend", sort_order: 6 },
    { name: "Next.js", category: "frontend", sort_order: 7 },
    { name: "HTML", category: "frontend", sort_order: 8 },
    { name: "CSS", category: "frontend", sort_order: 9 },
    { name: "Tailwind", category: "frontend", sort_order: 10 },
    
    // Database
    { name: "SQL", category: "backend", sort_order: 11 },
    { name: "MySQL", category: "backend", sort_order: 12 },
    { name: "Oracle", category: "backend", sort_order: 13 },
    { name: "MongoDB", category: "backend", sort_order: 14 },
    
    // Tools & Softwares
    { name: "VS Code", category: "tools", sort_order: 15 },
    { name: "Node.js", category: "backend", sort_order: 16 },
    { name: "Git", category: "tools", sort_order: 17 },
    { name: "Figma", category: "design", sort_order: 18 },
    { name: "CorelDRAW", category: "design", sort_order: 19 },
    { name: "Photoshop", category: "design", sort_order: 20 },
    { name: "UI/UX Kits", category: "design", sort_order: 21 },
  ];
  
  const { error: sError } = await supabase.from("skills").insert(skillsToSeed);
  if (sError) console.error("Error seeding skills:", sError);
  else console.log("Skills seeded successfully.");

  console.log("Seeding experiences...");
  
  const experiencesToSeed = [
    {
      company: "Telkom Indonesia",
      role: "Project Management Officer (IT & Strategy)",
      description: "I support IT project coordination and tracking across multiple teams, ensuring alignment with project timelines and deliverables. My daily responsibilities include monitoring project progress, identifying bottlenecks, and assisting in resolving workflow issues. I also facilitate communication between technical and non-technical stakeholders to maintain project clarity, assist in documentation and task tracking, and monitor daily device health and system performance utilizing Grafana to ensure optimal infrastructure reliability and proactive issue resolution.",
      start_date: "2024-03-01",
      is_current: true,
      sort_order: 1
    },
    {
      company: "Ministry of Education, Culture, Research and Technology",
      role: "Computer Operator",
      description: "During my time here, I documented and inventoried Indonesian cultural treasures across 451 museums nationwide. I managed and architected a massive digital asset repository containing over 100,395 multimedia items, optimizing data retrieval for cultural heritage websites. I oversaw the management of cultural reserves, cataloging 30,930 registered objects, buildings, sites, structures, and areas. Additionally, I directed SK (Approval/Decree) processes, tracked approved and pending items, contributed to Cultural Heritage recapitulation, and ensured 100% data accuracy on cultural heritage websites as the primary IT consultant.",
      start_date: "2023-03-01",
      end_date: "2023-04-30",
      is_current: false,
      sort_order: 2
    }
  ];
  
  const { error: eError } = await supabase.from("experiences").insert(experiencesToSeed);
  if (eError) console.error("Error seeding experiences:", eError);
  else console.log("Experiences seeded successfully.");

  console.log("Seeding about & settings...");

  const bio = `I am a results-driven IT graduate with hands-on experience building web-based systems, including dashboards, authentication flows, and data-driven applications. I am currently a Project Management Officer at Telkom Indonesia, where I contribute to IT project coordination, progress tracking, and cross-functional alignment. I hold a Bachelor of Informatics from Gunadarma University (Aug 2018 - Sept 2022) with a GPA of 3.54/4.00, where my thesis focused on the Analysis and Design of BCA Mobile Banking User Interface using User-Centered Design (UCD) and A/B Testing Methodology. I possess a solid understanding of system workflows, SQL, and version control (Git), and I pride myself on strong analytical thinking and adaptability in learning new technologies.`;

  await supabase.from("about").update({
    bio: bio,
    philosophy: "",
    hobbies: "",
    photo_url: ""
  }).neq("id", "00000000-0000-0000-0000-000000000000"); // Update all rows in single-row table
  
  await supabase.from("site_settings").update({
    value: { "site_title": "Hafizh Rizqullah Prasetya", "tagline": "IT Engineer (Web Systems) | Project Management Background" }
  }).eq("key", "general");
  
  console.log("Seed completed!");
}

seed().catch(console.error);
