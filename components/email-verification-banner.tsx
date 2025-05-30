import { useEffect, useState } from "react";
import { Mail, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSupabaseBrowserClient } from "@/lib/supabase";

export default function EmailVerificationBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    const checkEmailVerification = async () => {
      const supabase = getSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && !user.email_confirmed_at) {
        setShowBanner(true);
        setEmail(user.email || "");
      }
    };

    checkEmailVerification();
  }, []);

  if (!showBanner) return null;

  return (
    <div className="relative bg-gradient-to-r from-emerald-500 to-emerald-600 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      <div className="relative max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2 rounded-lg bg-emerald-700">
              <Mail className="h-6 w-6" />
            </span>
            <p className="ml-3 font-medium text-white truncate">
              <span className="md:hidden">Please verify your email!</span>
              <span className="hidden md:inline">
                Please verify your email address ({email}) to ensure
                uninterrupted access to your account.
              </span>
            </p>
          </div>
          <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
            <Button
              variant="outline"
              className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-emerald-600 bg-white hover:bg-emerald-50"
              onClick={() => {
                const supabase = getSupabaseBrowserClient();
                supabase.auth.resend({
                  type: "signup",
                  email: email,
                });
              }}
            >
              Resend verification email
            </Button>
          </div>
          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <Button
              type="button"
              variant="ghost"
              className="flex p-2 rounded-md hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-white"
              onClick={() => setShowBanner(false)}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
