# Hafizh Rizqullah Prasetya - Personal Portfolio

Welcome to the open-source repository for my personal portfolio website. This project showcases my experience, featured projects, and skills as a **Project Management Officer (PMO)**, **UI/UX Designer**, and **Web Developer**.

## ✨ Features

- **Dynamic Content**: Powered by Supabase, allowing seamless updates to portfolio data, hero stats, and contact links without touching the codebase.
- **AI-Powered Chatbot**: An integrated, intelligent chatbot using the Gemini API to interact with visitors and answer questions about my professional background.
- **Modern UI/UX**: Built with a sleek, minimalist aesthetic featuring glassmorphism, responsive grids, and subtle animations using Framer Motion.
- **Scroll-Spy Navigation**: Smooth scrolling with an active navigation state that dynamically tracks the user's position on the landing page.
- **Dark Mode Support**: Fully integrated Next-Themes support for Light, Dark, and System preferences.

## 🛠 Tech Stack

- **Framework**: [Next.js 14/15](https://nextjs.org/) (App Router, React)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Animations**: [Motion](https://motion.dev/) (Framer Motion)
- **Icons**: [Phosphor Icons](https://phosphoricons.com/)

## 🚀 Getting Started

First, ensure you have your Supabase environment variables set up in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Then, install the dependencies and run the development server:

```bash
pnpm install
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/components`: Reusable UI components and landing page sections.
- `src/lib`: Utility functions, constants, and Supabase client configurations.
- `supabase`: Database migration and seed scripts.

## 🤝 Connect

Feel free to reach out via my portfolio's contact form, or connect with me on [LinkedIn](#) and [GitHub](https://github.com/rzqllh).

---
*Built with Next.js, Supabase, and ☕.*
