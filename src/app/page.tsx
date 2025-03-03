"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SearchForm } from "@/components/search-form";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-14rem)] space-y-8 text-center">
          <div className="space-y-4 max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              DeepScience
            </h1>
            <p className="text-xl text-muted-foreground md:text-2xl/relaxed">
              AI-powered research assistant with access to 250M+ scientific papers
            </p>
          </div>
          <div className="w-full max-w-3xl mx-auto">
            <SearchForm onSearch={handleSearch} size="large" />
          </div>
          <div className="flex flex-wrap justify-center gap-6 w-full max-w-4xl mt-8">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m16 10-4 4-4-4" />
              </svg>
              <span className="text-muted-foreground">Simplified Research</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="text-muted-foreground">Cited Sources</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <path d="M16 16h5v5" />
              </svg>
              <span className="text-muted-foreground">Latest Research</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
