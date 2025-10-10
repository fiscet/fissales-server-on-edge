"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function TermsError({
  error,
  reset,
}: {
  error: Error & { digest?: string; };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Terms of Service page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Something went wrong
            </h1>
            <p className="text-muted-foreground">
              We encountered an error while loading the Terms of Service page.
              This might be a temporary issue.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try again
            </button>

            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="w-4 h-4" />
                Return to homepage
              </Link>
            </div>
          </div>

          <div className="mt-8 space-y-3 rounded-lg border bg-muted/30 p-4 text-left">
            <p className="text-sm text-muted-foreground">
              If this problem keeps happening, send us the reference ID above using the contact form.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Home className="h-4 w-4" />
              Go to contact form
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
