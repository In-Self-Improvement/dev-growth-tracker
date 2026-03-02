import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { GitHubLoginButton } from '@/screens/auth/login/_components/github-login-button';

export default async function LoginPage() {
  const supabase = await createClient();

  // Check if user is already logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Dev Growth Tracker
          </h1>
          <p className="text-slate-300 text-lg">
            Level up your development journey
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-semibold text-white">
                Welcome Back
              </h2>
              <p className="text-slate-300">
                Sign in to track your progress
              </p>
            </div>

            <GitHubLoginButton />

            <div className="pt-4 border-t border-white/10">
              <div className="text-sm text-slate-400 text-center space-y-1">
                <p>🎮 Gamified task tracking</p>
                <p>📊 GitHub integration</p>
                <p>🔥 Daily streaks</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-slate-400">
          By signing in, you agree to our terms and privacy policy
        </p>
      </div>
    </div>
  );
}
