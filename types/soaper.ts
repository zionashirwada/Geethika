/**
 * SOAPer application types
 */

/**
 * Result of SOAP analysis
 */
export interface SoapResult {
    /**
     * The Bible scripture text
     */
    scripture: string;
    
    /**
     * Observations about the scripture
     */
    observation: string;
    
    /**
     * Applications of the scripture
     */
    application: string;
    
    /**
     * Prayer based on the scripture
     */
    prayer: string;
}

/**
 * Loading states for API operations
 */
export interface LoadingStates {
    books: boolean;
    chapters: boolean;
    verses: boolean;
}

/**
 * Information about a selected verse
 */
export interface VerseSelection {
    bookId: string;
    bookName: string;
    chapter: number;
    fromVerse: number;
    toVerse: number;
}

/**
 * API request for the SOAP generation
 */
export interface SoapApiRequest {
    /**
     * Bible passage text
     */
    scripture: string;
    
    /**
     * The pre-prompt for the LLM
     */
    prePrompt: string;
}

/**
 * API response from the Groq LLM 
 */
export interface GroqApiResponse {
    /**
     * Generated text from the model
     */
    text: string;
    
    /**
     * Model used for generation
     */
    model: string;
    
    /**
     * Completion tokens used
     */
    completionTokens?: number;
    
    /**
     * Prompt tokens used
     */
    promptTokens?: number;
    
    /**
     * Total tokens used
     */
    totalTokens?: number;
}

/**
 * Error response from the API
 */
export interface ApiError {
    message: string;
    status?: number;
    details?: string;
}

/**
 * Parsed SOAP sections to validate response format
 */
export interface ParsedSoapSections {
    observation: string | null;
    application: string | null;
    prayer: string | null;
}