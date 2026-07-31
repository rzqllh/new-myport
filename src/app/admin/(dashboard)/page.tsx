import { createClient } from "@/lib/supabase/server";
import { 
  FolderOpen, 
  Article, 
  Envelope,
  CheckCircle,
  Clock
} from "@phosphor-icons/react/dist/ssr";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch quick stats
  const [
    { count: totalProjects },
    { count: publishedProjects },
    { count: totalPosts },
    { count: unreadMessages }
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
    supabase.from('messages').select('*', { count: 'exact', head: true }).eq('is_read', false),
  ]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Projects Stat */}
        <div className="bg-background rounded-xl border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm text-muted-foreground">Projects</h3>
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <FolderOpen weight="duotone" className="size-4" />
            </div>
          </div>
          <p className="text-3xl font-display font-bold">{totalProjects || 0}</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle weight="fill" className="text-emerald-500" />
            <span>{publishedProjects || 0} published</span>
          </div>
        </div>

        {/* Blog Stat */}
        <div className="bg-background rounded-xl border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm text-muted-foreground">Articles</h3>
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Article weight="duotone" className="size-4" />
            </div>
          </div>
          <p className="text-3xl font-display font-bold">{totalPosts || 0}</p>
          <div className="mt-2 text-sm text-muted-foreground">
            Total posts in CMS
          </div>
        </div>

        {/* Messages Stat */}
        <div className="bg-background rounded-xl border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-sm text-muted-foreground">Messages</h3>
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Envelope weight="duotone" className="size-4" />
            </div>
          </div>
          <p className="text-3xl font-display font-bold">{unreadMessages || 0}</p>
          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            {unreadMessages && unreadMessages > 0 ? (
              <>
                <Clock weight="bold" className="text-amber-500" />
                <span className="text-amber-600">Needs attention</span>
              </>
            ) : (
              <span>All caught up</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-background rounded-xl border overflow-hidden">
        <div className="border-b p-6">
          <h2 className="font-display font-semibold text-lg">Quick Actions</h2>
        </div>
        <div className="p-6">
          <p className="text-muted-foreground">More features coming soon...</p>
        </div>
      </div>
    </div>
  );
}
