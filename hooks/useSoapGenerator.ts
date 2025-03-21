import { useState } from 'react';
import { 
  SoapResult, 
  ApiError, 
  GroqApiResponse, 
  ParsedSoapSections 
} from '@/types/soaper';

// The pre-prompt that will be sent as the system message
const SOAP_PRE_PROMPT = `You are a spiritual mentor and expert in Biblical study. You are deeply familiar with various translations, hermeneutics, and devotional practices. You also have knowledge of ancient languages (Hebrew and Greek), Christian counseling, and modern spiritual formation practices.

I'm building a tool that processes Bible verses to generate SOAP reflections for daily devotional use.

I will provide a Bible verse. I want you to return a structured SOAP reflection based on the verse with additional detail in each section, as described below.

Please format the result in **Markdown**, using the following structure:
- Each section must be wrapped in XML-style tags: \`<observation>\`, \`<application>\`, \`<prayer>\`
- Within each section, include the following sub-sections:

---

### Observation  
Wrap all of this inside \`<observation>\`  
- **What the Passage Says**: Summarize the key points, themes, and any repeated ideas.  
- **Noteworthy Words or Phrases**: Highlight words or phrases that stand out.  
- **Contextual Insights**: Consider the historical or cultural background that might illuminate the meaning.  
- **Literary Style**: Reflect on the structure, style, or any literary devices used.

---

### Application  
Wrap all of this inside \`<application>\`  
- **Personal Reflection**: Describe how the verse speaks to your current life, experiences, or struggles.  
- **Life Changes**: Identify any changes in perspective or behavior the passage inspires.  
- **Practical Steps**: List specific actions or attitudes you might adopt in response to the verse.  
- **Relevance Today**: Explore how the timeless message of the scripture applies to modern life.

---

### Prayer  
Wrap all of this inside \`<prayer>\`  
- **Response to the Verse**: A prayer that reflects your feelings or gratitude.  
- **Petition and Intercession**: Include requests, needs, or ways to serve others.  
- **Commitment**: End with a commitment or affirmation based on the verse.

# IMPORTANT!
Only return the structured SOAP reflection. Do not explain or introduce the output.`;


/**
 * Hook for generating SOAP content via the Groq API
 */
export function useSoapGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [result, setResult] = useState<SoapResult | null>(null);

  /**
   * Parse the LLM response to extract the SOAP sections
   */
  const parseSoapSections = (text: string): ParsedSoapSections => {
    // Extract content between XML-style tags
    const observationMatch = text.match(/<observation>([\s\S]*?)<\/observation>/i);
    const applicationMatch = text.match(/<application>([\s\S]*?)<\/application>/i);
    const prayerMatch = text.match(/<prayer>([\s\S]*?)<\/prayer>/i);

    return {
      observation: observationMatch ? observationMatch[1].trim() : null,
      application: applicationMatch ? applicationMatch[1].trim() : null,
      prayer: prayerMatch ? prayerMatch[1].trim() : null,
    };
  };

  /**
   * Validate that the LLM response contains all required sections
   */
  const validateSoapResponse = (sections: ParsedSoapSections): boolean => {
    return !!(sections.observation && sections.application && sections.prayer);
  };

  /**
   * Generate SOAP content for the given scripture
   */
  const generateSoap = async (scripture: string, scriptureRef: string): Promise<SoapResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the Groq API via our API route
      const response = await fetch('/api/generate-soap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scripture,
          prePrompt: SOAP_PRE_PROMPT,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw {
          message: 'Failed to generate SOAP content',
          status: response.status,
          details: errorData.message || 'Unknown error',
        };
      }

      const data: GroqApiResponse = await response.json();
      
      // Parse the response to extract SOAP sections
      const sections = parseSoapSections(data.text);
      
      // Validate that all sections are present
      if (!validateSoapResponse(sections)) {
        throw {
          message: 'Invalid SOAP format in response',
          details: 'The AI response did not contain all required SOAP sections',
        };
      }

      // Create the SOAP result object
      const soapResult: SoapResult = {
        scripture: scriptureRef,
        observation: sections.observation!,
        application: sections.application!,
        prayer: sections.prayer!,
      };

      setResult(soapResult);
      return soapResult;
    } catch (err) {
      const apiError: ApiError = {
        message: err instanceof Error ? err.message : 'An unknown error occurred',
        details: err instanceof Error ? err.stack : undefined,
      };
      
      setError(apiError);
      throw apiError;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateSoap,
    isLoading,
    error,
    result,
  };
}