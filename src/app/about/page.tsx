import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4 pb-6 border-b">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              About DeepScience
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simplifying scientific research with AI-powered insights from academic papers
            </p>
          </div>

          {/* Mission Section */}
          <section className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">
                  DeepScience is designed to make scientific research more accessible and efficient. 
                  Our AI-powered platform helps researchers, students, and curious minds explore 
                  scientific papers and extract meaningful insights without spending hours reading 
                  through dense academic text.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* How It Works Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent>
                  <div className="flex flex-col">
                    <div className="rounded-full bg-muted w-10 h-10 flex items-center justify-center mb-3">
                      <span className="font-medium text-primary text-lg">1</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Search</h3>
                    <p>Our system searches for relevant scientific papers in the OpenAlex database based on your query</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent>
                  <div className="flex flex-col">
                    <div className="rounded-full bg-muted w-10 h-10 flex items-center justify-center mb-3">
                      <span className="font-medium text-primary text-lg">2</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Analyze</h3>
                    <p>The AI analyzes the content of these papers to understand the key information</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent>
                  <div className="flex flex-col">
                    <div className="rounded-full bg-muted w-10 h-10 flex items-center justify-center mb-3">
                      <span className="font-medium text-primary text-lg">3</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Synthesize</h3>
                    <p>It generates a concise, accurate response that synthesizes information from multiple sources</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent>
                  <div className="flex flex-col">
                    <div className="rounded-full bg-muted w-10 h-10 flex items-center justify-center mb-3">
                      <span className="font-medium text-primary text-lg">4</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Cite</h3>
                    <p>You receive the answer with citations to the original papers for further reading</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Use Cases Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Who Can Benefit</h2>
            <Card>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-primary/10 p-2 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                        <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">Students</h3>
                      <p className="text-sm text-muted-foreground">Researching topics for papers or projects</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-primary/10 p-2 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">Researchers</h3>
                      <p className="text-sm text-muted-foreground">Exploring new fields or staying updated</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-primary/10 p-2 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <rect width="16" height="20" x="4" y="2" rx="2"></rect>
                        <path d="M9 22v-4h6v4"></path>
                        <path d="M8 6h.01"></path>
                        <path d="M16 6h.01"></path>
                        <path d="M12 6h.01"></path>
                        <path d="M12 10h.01"></path>
                        <path d="M8 10h.01"></path>
                        <path d="M16 10h.01"></path>
                        <path d="M12 14h.01"></path>
                        <path d="M8 14h.01"></path>
                        <path d="M16 14h.01"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">Professionals</h3>
                      <p className="text-sm text-muted-foreground">Needing quick insights into scientific developments</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="rounded-full bg-primary/10 p-2 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 16v-4"></path>
                        <path d="M12 8h.01"></path>
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold">Curious Minds</h3>
                      <p className="text-sm text-muted-foreground">Understanding complex scientific concepts</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Privacy Section */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold">Privacy & Ethics</h2>
            <Card className="bg-primary/5">
              <CardContent>
                <p className="mb-4">We&apos;re committed to responsible AI use:</p>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-1">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                    <span>Only uses publicly available scientific papers</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-1">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                    <span>Provides citations to original sources</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-1">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                    <span>Aims to reduce misinformation by grounding responses in peer-reviewed research</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mt-1">
                      <path d="M20 6 9 17l-5-5"></path>
                    </svg>
                    <span>Does not store user queries for longer than necessary to provide the service</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
} 