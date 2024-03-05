export interface IChapterdata {
	chapterNumber: number;
	contents: {
		verseNumber: number;
		verseText: string;
		audio: any;
	}[];
}
