"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquareText } from "lucide-react";
import { useRouter } from "next/navigation";

interface FollowUpQuestionsProps {
  questions: string[];
  isLoading: boolean;
}

export function FollowUpQuestions({ questions, isLoading }: FollowUpQuestionsProps) {
  const router = useRouter();
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  // Handle clicking on a question
  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(question);
    // Navigate to search page with the selected question
    router.push(`/search?q=${encodeURIComponent(question)}`);
  };

  if (isLoading) {
    return (
      <Card className="p-4">
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
    );
  }

  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-medium mb-3 flex items-center">
        <MessageSquareText className="mr-2 h-5 w-5" />
        You may also ask
      </h3>
      <div className="space-y-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start text-left h-auto py-2 px-3 font-normal cursor-pointer"
            onClick={() => handleQuestionClick(question)}
            disabled={selectedQuestion === question}
          >
            {question}
          </Button>
        ))}
      </div>
    </Card>
  );
} 