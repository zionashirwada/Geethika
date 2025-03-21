
// Types for Bible API (bible.helloao.org)

export interface AvailableTranslations {
    /**
     * The list of translations.
     */
    translations: Translation[];
}

export interface Translation {
    /**
     * The ID of the translation.
     */
    id: string;

    /**
     * The name of the translation.
     * This is usually the name of the translation in the translation's language.
     */
    name: string;

    /**
     * The English name of the translation.
     */
    englishName: string;

    /**
     * The website for the translation.
     */
    website: string;

    /**
     * The URL that the license for the translation can be found.
     */
    licenseUrl: string;

    /**
     * The short name for the translation.
     */
    shortName?: string;

    /**
     * The ISO 639  3-letter language tag that the translation is primarily in.
     */
    language: string;

    /**
     * Gets the name of the language that the translation is in.
     * Null or undefined if the name of the language is not known.
     */
    languageName?: string;

    /**
     * Gets the name of the language in English.
     * Null or undefined if the language doesn't have an english name.
     */
    languageEnglishName?: string;

    /**
     * The direction that the language is written in.
     * "ltr" indicates that the text is written from the left side of the page to the right.
     * "rtl" indicates that the text is written from the right side of the page to the left.
     */
    textDirection: 'ltr' | 'rtl';

    /**
     * The available list of formats.
     */
    availableFormats: ('json' | 'usfm')[];

    /**
     * The API link for the list of available books for this translation.
     */
    listOfBooksApiLink: string;

    /**
     * The number of books that are contained in this translation.
     *
     * Complete translations should have the same number of books as the Bible (66).
     */
    numberOfBooks: number;

    /**
     * The total number of chapters that are contained in this translation.
     *
     * Complete translations should have the same number of chapters as the Bible (1,189).
     */
    totalNumberOfChapters: number;

    /**
     * The total number of verses that are contained in this translation.
     *
     * Complete translations should have the same number of verses as the Bible (around 31,102 - some translations exclude verses based on the aparent likelyhood of existing in the original source texts).
     */
    totalNumberOfVerses: number;
}

export interface TranslationBooks {
    /**
     * The translation information for the books.
     */
    translation: Translation;

    /**
     * The list of books that are available for the translation.
     */
    books: TranslationBook[];
}

export interface TranslationBook {
    /**
     * The ID of the book.
     */
    id: string;

    /**
     * The translation ID that the book belongs to.
     */
    translationId: string;

    /**
     * The name that the translation provided for the book.
     */
    name: string;

    /**
     * The common name for the book.
     */
    commonName: string;
    
    /**
     * The title of the book.
     */
    title: string;

    /**
     * The order of the book in the Bible.
     */
    order: number;

    /**
     * The number of chapters that the book contains.
     */
    numberOfChapters: number;

    /**
     * The link to the first chapter of the book.
     */
    firstChapterApiLink: string;

    /**
     * The link to the last chapter of the book.
     */
    lastChapterApiLink: string;

    /**
     * The number of verses that the book contains.
     */
    totalNumberOfVerses: number;
}

export interface TranslationBookChapter {
    /**
     * The translation information for the book chapter.
     */
    translation: Translation;

    /**
     * The book information for the book chapter.
     */
    book: TranslationBook;

    /**
     * The link to the current chapter.
     */
    thisChapterLink: string;

    /**
     * The links to different audio versions for the chapter.
     */
    thisChapterAudioLinks: TranslationBookChapterAudioLinks;

    /**
     * The link to the next chapter.
     * Null if this is the last chapter in the translation.
     */
    nextChapterApiLink: string | null;

    /**
     * The link to the previous chapter.
     * Null if this is the first chapter in the translation.
     */
    previousChapterApiLink: string | null;

    /**
     * The number of verses that the chapter contains.
     */
    numberOfVerses: number;

    /**
     * The information for the chapter.
     */
    chapter: ChapterData;
}

export interface ChapterData {
    /**
     * The number of the chapter.
     */
    number: number;

    /**
     * The content of the chapter.
     */
    content: ChapterContent[];

    /**
     * The list of footnotes for the chapter.
     */
    footnotes: ChapterFootnote[];
}

/**
 * A union type that represents a single piece of chapter content.
 */
export type ChapterContent = ChapterHeading | ChapterLineBreak | ChapterVerse | ChapterHebrewSubtitle;

/**
 * A heading in a chapter.
 */
export interface ChapterHeading {
    /**
     * Indicates that the content represents a heading.
     */
    type: 'heading';

    /**
     * The content for the heading.
     * If multiple strings are included in the array, they should be concatenated with a space.
     */
    content: string[];
}

/**
 * A line break in a chapter.
 */
export interface ChapterLineBreak {
    /**
     * Indicates that the content represents a line break.
     */
    type: 'line_break';
}

/**
 * A Hebrew Subtitle in a chapter.
 */
export interface ChapterHebrewSubtitle {
    /**
     * Indicates that the content represents a Hebrew Subtitle.
     */
    type: 'hebrew_subtitle';

    /**
     * The list of content that is contained in the subtitle.
     */
    content: (string | FormattedText | VerseFootnoteReference)[];
}

/**
 * A verse in a chapter.
 */
export interface ChapterVerse {
    /**
     * Indicates that the content is a verse.
     */
    type: 'verse';

    /**
     * The number of the verse.
     */
    number: number;

    /**
     * The list of content for the verse.
     */
    content: (string | FormattedText | InlineHeading | InlineLineBreak | VerseFootnoteReference)[];
}

/**
 * Formatted text. That is, text that is formated in a particular manner.
 */
export interface FormattedText {
    /**
     * The text that is formatted.
     */
    text: string;

    /**
     * Whether the text represents a poem.
     * The number indicates the level of indent.
     */
    poem?: number;

    /**
     * Whether the text represents the Words of Jesus.
     */
    wordsOfJesus?: boolean;
}

/**
 * Defines an interface that represents a heading that is embedded in a verse.
 */
export interface InlineHeading {
    /**
     * The text of the heading.
     */
    heading: string;
}

/**
 * Defines an interface that represents a line break that is embedded in a verse.
 */
export interface InlineLineBreak {
    lineBreak: true;
}

/**
 * A footnote reference in a verse or a Hebrew Subtitle.
 */
export interface VerseFootnoteReference {
    /**
     * The ID of the note.
     */
    noteId: number;
}

/**
 * Information about a footnote.
 */
export interface ChapterFootnote {
    /**
     * The ID of the note that is referenced.
     */
    noteId: number;

    /**
     * The text of the footnote.
     */
    text: string;

    /**
     * The verse reference for the footnote.
     */
    reference?: {
        chapter: number;
        verse: number;
    };

    /**
     * The caller that should be used for the footnote.
     */
    caller: '+' | string | null;
}

/**
 * The audio links for a book chapter.
 */
export interface TranslationBookChapterAudioLinks {
    /**
     * The reader for the chapter and the URL link to the audio file.
     */
    [reader: string]: string;
}