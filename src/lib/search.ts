import { Paper } from "@/types";
import { searchPapers as openAlexSearch, formatPaperData } from "./openalex";

export async function searchPapers(query: string): Promise<Paper[]> {
  try {
    // Search OpenAlex API
    const response = await openAlexSearch(query);
    
    // Format and return the papers
    return response.results.map(formatPaperData);
  } catch (error) {
    console.error("Error searching papers:", error);
    return [];
  }
} 