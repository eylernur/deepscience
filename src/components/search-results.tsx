"use client";

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronDown, ChevronUp, MessageSquareText } from 'lucide-react';
import { TypingEffect } from './typing-effect';
import { FollowUpQuestions } from './follow-up-questions';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip } from '@/components/ui/tooltip';

interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  journal?: string;
  abstract?: string;
  url: string;
}

interface SearchResultsProps {
  query: string;
}

export function SearchResults({ query }: SearchResultsProps) {
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStreamComplete, setIsStreamComplete] = useState(false);
  const [followUpQuestions, setFollowUpQuestions] = useState<string[]>([]);
  const [isLoadingFollowUp, setIsLoadingFollowUp] = useState(false);
  const [highlightedPaperId, setHighlightedPaperId] = useState<string | null>(null);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [showFullPapers, setShowFullPapers] = useState(false);
  const papersContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const chunkCountRef = useRef(0);
  const typingResetKeyRef = useRef(0);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Fetch follow-up questions when streaming is complete
  useEffect(() => {
    const fetchFollowUpQuestions = async () => {
      // Only fetch follow-up questions when streaming is complete
      if (!isStreamComplete || !aiResponse || !query || followUpQuestions.length > 0) return;
      
      setIsLoadingFollowUp(true);
      
      try {
        const response = await fetch('/api/follow-up', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            query,
            aiResponse
          })
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setFollowUpQuestions(data.questions || []);
      } catch (err) {
        console.error('Failed to fetch follow-up questions:', err);
        setFollowUpQuestions([]);
      } finally {
        setIsLoadingFollowUp(false);
      }
    };

    fetchFollowUpQuestions();
  }, [aiResponse, query, followUpQuestions.length, isStreamComplete]);

  // Scroll to highlighted paper
  useEffect(() => {
    if (highlightedPaperId && papersContainerRef.current) {
      const paperElement = document.getElementById(`paper-${highlightedPaperId}`);
      if (paperElement) {
        paperElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedPaperId]);

  // Scroll results container
  useEffect(() => {
    if (resultsContainerRef.current && (aiResponse || isStreamComplete || isLoading || error || isLoadingFollowUp)) {
      resultsContainerRef.current.scrollTop = resultsContainerRef.current.scrollHeight;
    }
  }, [aiResponse, isLoading, error, isLoadingFollowUp, isStreamComplete]);

  // Fetch results when query changes
  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      
      setIsLoading(true);
      setError(null);
      setAiResponse("");
      setIsStreamComplete(false);
      setFollowUpQuestions([]);
      setHighlightedPaperId(null);
      setPapers([]);
      typingResetKeyRef.current += 1;
      
      // Cancel any ongoing requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Create a new AbortController
      abortControllerRef.current = new AbortController();
      
      try {
        const response = await fetch('/api/search/stream', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
          signal: abortControllerRef.current.signal
        });
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Response body is not readable");
        }
        
        // Start loading state but allow content to show
        setIsLoading(false);
        
        // Process the stream
        const decoder = new TextDecoder();
        let buffer = '';
        
        while (true) {
          const { value, done } = await reader.read();
          
          if (done) {
            // Process any remaining buffer
            if (buffer.trim()) {
              try {
                const data = JSON.parse(buffer);
                processStreamData(data);
              } catch (e) {
                console.error('[Client] Error parsing final JSON:', e, buffer);
              }
            }
            break;
          }
          
          // Decode the chunk and add to buffer
          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;
          
          // Process complete lines from the buffer
          const lines = buffer.split('\n');
          
          // Keep the last potentially incomplete line in the buffer
          buffer = lines.pop() || '';
          
          // Process all complete lines
          for (const line of lines) {
            if (line.trim()) {
              try {
                const data = JSON.parse(line);
                processStreamData(data);
              } catch (e) {
                console.error('[Client] Error parsing JSON:', e, line);
              }
            }
          }
        }
        
        // Ensure stream completion is set
        setIsStreamComplete(true);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError("Failed to fetch search results. Please try again.");
          setIsLoading(false);
        }
      }
    };
    
    // Helper function to process stream data
    const processStreamData = (data: any) => {
      if (data.type === 'papers') {
        setPapers(data.content);
      } else if (data.type === 'aiResponse') {
        if (data.done) {
          setIsStreamComplete(true);
        } else if (data.content) {
          setAiResponse(prev => prev + data.content);
        }
      } else if (data.type === 'error') {
        setError(data.content);
      }
    };

    fetchResults();
    
    // Cleanup function
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query]);

  // Function to handle clicks on citations in the AI response
  const handleCitationClick = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    
    // Check if the clicked element is a citation link or its parent
    const citationElement = target.closest('[data-citation-id]');
    if (citationElement) {
      event.preventDefault();
      const citationId = citationElement.getAttribute('data-citation-id');
      
      if (citationId) {
        console.log(`Citation clicked via handler for ID: ${citationId}`);
        // Toggle highlight if clicking the same paper again
        setHighlightedPaperId(prevId => {
          const newId = prevId === citationId ? null : citationId;
          console.log(`Setting highlighted paper ID to: ${newId}`);
          return newId;
        });
        
        // Scroll to the highlighted paper
        setTimeout(() => {
          const paperElement = document.getElementById(`paper-${citationId}`);
          if (paperElement) {
            console.log(`Scrolling to paper element: paper-${citationId}`);
            paperElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          } else {
            console.log(`Paper element not found: paper-${citationId}`);
          }
        }, 100);
      }
    }
  };

  // Custom components for ReactMarkdown
  const components: Components = {
    // Custom link component to handle citations
    a: ({ node, children, href, ...props }: any) => {
      // Check if this is a citation link
      const isCitationLink = href?.startsWith('paper-');
      
      if (isCitationLink) {
        const paperId = href.replace('paper-', '');
        return (
          <button
            type="button"
            data-citation-id={paperId}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const citationClickEvent = new CustomEvent('citationClick', {
                detail: { citationId: paperId }
              });
              document.dispatchEvent(citationClickEvent);
              setHighlightedPaperId(paperId);
            }}
          >
            {children}
          </button>
        );
      }
      
      // Regular link
      return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>;
    },
    
    // Custom paragraph component to handle citations in text
    p: (props: any) => {
      return <p className="mb-4 last:mb-0">{props.children}</p>;
    },
    
    // Handle other common elements to ensure citations work everywhere
    li: (props: any) => {
      return <li>{props.children}</li>;
    },
    
    h1: (props: any) => {
      return <h1>{props.children}</h1>;
    },
    
    h2: (props: any) => {
      return <h2>{props.children}</h2>;
    },
    
    h3: (props: any) => {
      return <h3>{props.children}</h3>;
    },
    
    strong: (props: any) => {
      return <strong>{props.children}</strong>;
    },
    
    em: (props: any) => {
      return <em>{props.children}</em>;
    },
    
    blockquote: (props: any) => {
      return <blockquote>{props.children}</blockquote>;
    }
  };

  if (isLoading && !aiResponse && papers.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Answer Column - 70% */}
          <div className="w-full lg:w-[70%] space-y-4">
            <Card className="p-4">
              <Skeleton className="h-6 w-40 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </Card>
          </div>
          
          {/* Papers Column - 30% */}
          <div className="w-full lg:w-[30%]">
            <div className="sticky top-4">
              <div className="flex items-center justify-between mb-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <div className="space-y-2">
                <Card className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </Card>
                <Card className="p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !aiResponse && papers.length === 0) {
    return (
      <Card className="p-6 w-full max-w-4xl mx-auto">
        <div className="text-center text-red-500">
          <p>{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Answer Column - 70% */}
        <div className="w-full lg:w-[70%] space-y-4">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-1 flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-5 h-5 mr-2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              Answer
            </h2>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {isStreamComplete ? (
                <div className="prose-container">
                  <pre className="hidden">{aiResponse}</pre>
                  <div className="citation-container prose prose-sm dark:prose-invert">
                    {aiResponse.split('\n\n').map((paragraph, pIndex) => {
                      // Process citations in the paragraph
                      const parts = paragraph.split(/(\[\d+\])/g);
                      const processedParts = parts.map((part, index) => {
                        // Handle citations
                        const citationMatch = part.match(/\[(\d+)\]/);
                        if (citationMatch) {
                          const paperIndex = parseInt(citationMatch[1], 10);
                          if (paperIndex > 0 && paperIndex <= papers.length) {
                            const paper = papers[paperIndex - 1];
                            return (
                              <button
                                key={`citation-${pIndex}-${index}`}
                                type="button"
                                data-citation-id={paper.id}
                                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-2 py-0.5 mx-0.5 text-xs font-medium transition-colors bg-blue-100 hover:bg-secondary text-secondary-foreground border border-secondary hover:border-secondary cursor-pointer"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setHighlightedPaperId(paper.id);
                                }}
                              >
                                {paperIndex}
                              </button>
                            );
                          }
                        }

                        // Process markdown in non-citation text
                        let content = part;
                        
                        // Headers (h1-h3)
                        content = content.replace(/^### (.*$)/gm, '<h3>$1</h3>');
                        content = content.replace(/^## (.*$)/gm, '<h2>$1</h2>');
                        content = content.replace(/^# (.*$)/gm, '<h1>$1</h1>');
                        
                        // Bold
                        content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                        content = content.replace(/__(.*?)__/g, '<strong>$1</strong>');
                        
                        // Italic
                        content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
                        content = content.replace(/_(.*?)_/g, '<em>$1</em>');
                        
                        // Lists
                        content = content.replace(/^\* (.*$)/gm, '<li>$1</li>');
                        content = content.replace(/^- (.*$)/gm, '<li>$1</li>');
                        
                        // Links
                        content = content.replace(
                          /\[([^\]]+)\]\(([^)]+)\)/g,
                          '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
                        );

                        return (
                          <span 
                            key={`text-${pIndex}-${index}`}
                            dangerouslySetInnerHTML={{ __html: content }}
                          />
                        );
                      });

                      // Wrap lists in ul tags
                      const html = processedParts
                        .map(part => React.isValidElement(part) ? part : part.props.dangerouslySetInnerHTML.__html)
                        .join('');
                      const wrappedHtml = html.replace(
                        /(<li>.*<\/li>)\s*(<li>.*<\/li>)+/g,
                        '<ul>$&</ul>'
                      );

                      return (
                        <p key={`p-${pIndex}`} className="mb-4 last:mb-0">
                          {processedParts.map((part, idx) => 
                            React.isValidElement(part) ? part : (
                              <span 
                                key={`wrapped-${idx}`}
                                dangerouslySetInnerHTML={{ __html: wrappedHtml }}
                              />
                            )
                          )}
                        </p>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <TypingEffect 
                  key={`typing-${typingResetKeyRef.current}`}
                  text={aiResponse} 
                  speed={20}
                  showDirectly={true}
                  className="prose prose-sm dark:prose-invert max-w-none"
                />
              )}
            </div>
          </Card>
          
          {/* Follow-up Questions Section - Only show when streaming is complete */}
          {isStreamComplete && followUpQuestions.length > 0 && (
            <FollowUpQuestions 
              questions={followUpQuestions} 
              isLoading={isLoadingFollowUp} 
            />
          )}
          
          {/* Show loading state for follow-up questions only when streaming is complete */}
          {isStreamComplete && isLoadingFollowUp && followUpQuestions.length === 0 && (
            <Card className="p-4 mt-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <MessageSquareText className="mr-2 h-5 w-5" />
                You may also ask
              </h3>
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </Card>
          )}
        </div>

        {/* Papers Column - 30% */}
        <div className="w-full lg:w-[30%]">
          <div className="sticky top-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">Referenced Papers</h3>
              <Tooltip 
                content={showFullPapers ? "Collapse details" : "Expand details"}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowFullPapers(!showFullPapers)}
                >
                  {showFullPapers ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Button>
              </Tooltip>
            </div>
            
            {papers.length > 0 ? (
              <div 
                ref={papersContainerRef}
                className="space-y-3 max-h-[calc(100vh-10rem)] overflow-y-auto px-2 py-2"
              >
                {papers.map((paper, index) => (
                  <Card 
                    key={paper.id} 
                    id={`paper-${paper.id}`}
                    className={`p-4 transition-all duration-300 ${
                      highlightedPaperId === paper.id 
                        ? 'ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/20' 
                        : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold border border-primary/20">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium leading-tight">
                          <a 
                            href={paper.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="hover:underline text-blue-600 dark:text-blue-400 break-words"
                          >
                            {paper.title}
                          </a>
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {paper.authors.slice(0, 3).join(", ")}
                          {paper.authors.length > 3 ? ", et al." : ""} ({paper.year})
                          {paper.journal && ` • ${paper.journal}`}
                        </p>
                        {(showFullPapers || highlightedPaperId === paper.id) && paper.abstract && (
                          <p className="mt-2 text-sm">{paper.abstract}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-4 text-center text-muted-foreground">
                No papers found for this query.
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 