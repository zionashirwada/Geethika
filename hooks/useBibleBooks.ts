import { useState, useEffect } from "react";
import { TranslationBooks, TranslationBook } from "@/types/bibleApi";

/**
 * Custom hook to fetch Bible books for a specific translation
 * @param translationId The ID of the translation to fetch books for
 * @returns Books and loading/error state
 */
export function useBibleBooks(translationId: string | null) {
  const [books, setBooks] = useState<TranslationBook[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset books if translation ID changes
    setBooks([]);

    if (!translationId) {
      return;
    }

    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`https://bible.helloao.org/api/${translationId}/books.json`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch books: ${response.status} ${response.statusText}`);
        }
        
        const data: TranslationBooks = await response.json();
        // Sort books by their order in the Bible
        const sortedBooks = [...data.books].sort((a, b) => a.order - b.order);
        setBooks(sortedBooks);
      } catch (err: any) {
        console.error(`Error fetching books for ${translationId}:`, err);
        setError(err.message || "Failed to load Bible books");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [translationId]);

  return {
    books,
    isLoading,
    error,
  };
}