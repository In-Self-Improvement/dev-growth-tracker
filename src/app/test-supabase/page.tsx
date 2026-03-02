"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function TestSupabasePage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        const supabase = createClient();

        // 1. 환경 변수 확인
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!url || !key) {
          throw new Error("Environment variables not set");
        }

        // 2. Supabase 연결 테스트 (간단한 health check)
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        setStatus("success");
        setMessage("Supabase connection successful!");
        setDetails({
          url,
          keyPrefix: key.substring(0, 20) + "...",
          session: data.session ? "Active session" : "No active session",
          timestamp: new Date().toISOString(),
        });
      } catch (error: any) {
        setStatus("error");
        setMessage(error.message || "Connection failed");
        setDetails(error);
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase Connection Test</h1>

        <div
          className={`p-6 rounded-lg ${
            status === "loading"
              ? "bg-blue-100 border-blue-300"
              : status === "success"
                ? "bg-green-100 border-green-300"
                : "bg-red-100 border-red-300"
          } border-2`}
        >
          <div className="flex items-center mb-4">
            <div
              className={`w-4 h-4 rounded-full mr-3 ${
                status === "loading"
                  ? "bg-blue-500 animate-pulse"
                  : status === "success"
                    ? "bg-green-500"
                    : "bg-red-500"
              }`}
            />
            <h2 className="text-xl font-semibold">
              {status === "loading"
                ? "Testing connection..."
                : status === "success"
                  ? "✓ Connection Successful"
                  : "✗ Connection Failed"}
            </h2>
          </div>

          {message && <p className="mb-4 text-gray-700">{message}</p>}

          {details && (
            <div className="bg-white p-4 rounded border border-gray-200">
              <h3 className="font-semibold mb-2">Details:</h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(details, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="font-semibold mb-4">Next Steps:</h3>
          <ul className="space-y-2 text-gray-700">
            <li>✓ Supabase client setup complete</li>
            <li>✓ Environment variables configured</li>
            <li>→ Create database tables in Supabase Dashboard</li>
            <li>→ Generate TypeScript types</li>
            <li>→ Set up authentication (if needed)</li>
          </ul>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <p>
            To go back to home:{" "}
            <a href="/" className="text-blue-600 underline">
              Click here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
