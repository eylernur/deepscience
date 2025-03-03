import axios from "axios";

const OPENALEX_API_URL = process.env.OPENALEX_API_URL || "https://api.openalex.org";

export interface Author {
  id: string;
  display_name: string;
}

export interface Work {
  id: string;
  doi?: string;
  title: string;
  publication_year: number;
  publication_date?: string;
  primary_location?: {
    source?: {
      display_name?: string;
    };
    landing_page_url?: string;
  };
  authorships?: {
    author: Author;
    position?: string;
  }[];
  abstract_inverted_index?: Record<string, number[]>;
  cited_by_count?: number;
}

export interface OpenAlexSearchResponse {
  meta: {
    count: number;
    db_response_time_ms: number;
    page: number;
    per_page: number;
  };
  results: Work[];
}

/**
 * Reconstructs the abstract from the inverted index format provided by OpenAlex
 */
export function reconstructAbstract(abstractInvertedIndex: Record<string, number[]>): string {
  if (!abstractInvertedIndex) return "";
  
  // Create an array to hold all words with their positions
  const words: { word: string; positions: number[] }[] = Object.entries(abstractInvertedIndex).map(
    ([word, positions]) => ({
      word,
      positions,
    })
  );
  
  // Flatten and sort by position
  const sortedWords = words
    .flatMap(({ word, positions }) => positions.map(position => ({ word, position })))
    .sort((a, b) => a.position - b.position);
  
  // Join words to form the abstract
  return sortedWords.map(item => item.word).join(" ");
}

/**
 * Search for papers in OpenAlex
 */
export async function searchPapers(query: string, page = 1, perPage = 10): Promise<OpenAlexSearchResponse> {
  try {
    const url = `${OPENALEX_API_URL}/works`;
    const params = {
      search: query,
      page,
      per_page: perPage,
      sort: "relevance_score:desc",
      filter: "has_doi:true",
    };
    
    const response = await axios.get(url, { params });
    
    if (!response.data || !Array.isArray(response.data.results)) {
      console.error("[OpenAlex] Invalid response format:", response.data);
      throw new Error("Invalid response format from OpenAlex API");
    }
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("[OpenAlex] API error:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
    } else {
      console.error("[OpenAlex] Non-API error:", error);
    }
    throw new Error("Failed to search papers");
  }
}

/**
 * Get paper details by DOI
 */
export async function getPaperByDOI(doi: string): Promise<Work | null> {
  try {
    const response = await axios.get(`${OPENALEX_API_URL}/works/doi:${encodeURIComponent(doi)}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching paper with DOI ${doi}:`, error);
    return null;
  }
}

/**
 * Format paper data for the frontend
 */
export function formatPaperData(paper: Work) {
  const abstract = paper.abstract_inverted_index 
    ? reconstructAbstract(paper.abstract_inverted_index)
    : "";
    
  const authors = paper.authorships
    ? paper.authorships.map(authorship => authorship.author.display_name)
    : [];
    
  const journal = paper.primary_location?.source?.display_name || "";
  
  const url = paper.primary_location?.landing_page_url || 
    (paper.doi ? `https://doi.org/${paper.doi.replace('https://doi.org/', '')}` : "");
  
  return {
    id: paper.id,
    title: paper.title,
    authors,
    year: paper.publication_year,
    journal,
    url,
    abstract,
    citedByCount: paper.cited_by_count || 0,
  };
} 