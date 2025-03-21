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