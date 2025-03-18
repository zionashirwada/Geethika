// Type definitions for the Bible at @data/bibles/.json
export type Bible = {
    name: string;
    books: Book[];
}

export type Book = {
    id: string;
    name: string;
    verses: Verse[];
}

export type Verse = {
    Chapter: number;
    Verse: number;
    Text: string;
}