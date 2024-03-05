export interface IVerseData {
  verseNumber: number;
  verseText: string;
  audio: any;
}

export interface IChapterdata {
  chapterNumber: number;
  contents: IVerseData[];
}
