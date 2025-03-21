import { useState, useEffect } from "react";
import { TranslationBookChapter, ChapterVerse, ChapterContent } from "@/types/bible";

/**
 * Custom hook to fetch a Bible chapter and extract its verses
 * @param translationId The ID of the translation
 * @param bookId The ID of the book
 * @param chapter The chapter number
 * @returns Chapter data, verses, and loading/error state
 */
export function useBibleChapter(
  translationId: string | null,
  bookId: string | null,
  chapter: number | null
) {
  const [chapterData, setChapterData] = useState<TranslationBookChapter | null>(null);
  const [verses, setVerses] = useState<ChapterVerse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Reset data when inputs change
    setChapterData(null);
    setVerses([]);

    if (!translationId || !bookId || !chapter) {
      return;
    }

    const fetchChapter = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://bible.helloao.org/api/${translationId}/${bookId}/${chapter}.json`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch chapter: ${response.status} ${response.statusText}`);
        }

        const data: TranslationBookChapter = await response.json();
        setChapterData(data);

        // Extract verses from chapter content
        const extractedVerses = data.chapter.content.filter(
          (item): item is ChapterVerse => item.type === "verse"
        );
        setVerses(extractedVerses);
      } catch (err: any) {
        console.error(`Error fetching chapter for ${bookId} ${chapter}:`, err);
        setError(err.message || "Failed to load Bible chapter");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChapter();
  }, [translationId, bookId, chapter]);

  /**
   * Get text content from a verse
   * @param verse The verse object
   * @returns The text content of the verse
   */
  const getVerseText = (verse: ChapterVerse): string => {
    return verse.content
      .map((content) => {
        if (typeof content === "string") return content;
        if ("text" in content) return content.text;
        return "";
      })
      .join("");
  };

  /**
   * Get text for a range of verses
   * @param fromVerse Start verse number
   * @param toVerse End verse number
   * @returns The combined text of the specified verse range
   */
  const getVerseRange = (fromVerse: number, toVerse: number): string => {
    let scriptureText = "";
    
    for (let i = fromVerse; i <= toVerse; i++) {
      const verse = verses.find(v => v.number === i);
      if (verse) {
        scriptureText += `${verse.number} ${getVerseText(verse)} `;
      }
    }
    
    return scriptureText.trim();
  };

  return {
    chapterData,
    verses,
    isLoading,
    error,
    getVerseText,
    getVerseRange,
  };
}