import { useState, useEffect } from "react";
import { AvailableTranslations, Translation } from "@/types/bible";

/**
 * Custom hook to fetch available Bible translations
 * @returns Available translations and loading/error state
 */
export function useBibleTranslations() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("https://bible.helloao.org/api/available_translations.json");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch Bible translations: ${response.status} ${response.statusText}`);
        }
        
        const data: AvailableTranslations = await response.json();
        setTranslations(data.translations);
      } catch (err: any) {
        console.error("Error fetching Bible translations:", err);
        setError(err.message || "Failed to load Bible translations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslations();
  }, []);

  return {
    translations,
    isLoading,
    error,
  };
}