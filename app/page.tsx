
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function Home() {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  // If user is logged in, redirect to home page
  if (user) {
    redirect('/ui/dashboard/home');
  }

  return (
    <div>
      {/* Landing page content for non-authenticated users */}
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to GlitchOps</h1>
          <p className="text-emerald-400 mb-8">Please log in to access the dashboard</p>
          <a 
            href="/login" 
            className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
}
