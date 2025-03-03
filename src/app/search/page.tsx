"use client";

import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SearchResults } from "@/components/search-results";
import { SearchForm } from "@/components/search-form";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-8">
          <div className="w-full max-w-3xl mx-auto">
            <SearchForm initialQuery={initialQuery} onSearch={handleSearch} size="large" />
          </div>
        </div>

        {initialQuery && <SearchResults query={initialQuery} />}
      </main>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
} 