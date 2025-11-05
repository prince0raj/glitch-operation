import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server"; // Use the server client instead of client

export default async function Home() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (user) {
    redirect("/ui/dashboard/home");
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to GlitchOps</h1>
        <p className="text-emerald-400 mb-8">
          Please log in to access the dashboard
        </p>
        <a
          href="/login"
          className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Login
        </a>
      </div>
    </div>
  );
}
