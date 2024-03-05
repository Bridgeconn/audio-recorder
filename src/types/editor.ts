export interface IVerseData {
  verseNumber: number;
  verseText: string;
  audio: any;
}

export interface IChapterdata {
  chapterNumber: number;
  contents: IVerseData[];
}

// Message Types from Ext to UI
export enum ExttoEditorWebMsgTypes {
  ChapterData = "Chapter Data of IChapterdata",
}

type ExtToEditorMsgDataType = ExttoEditorWebMsgTypes.ChapterData;

export type ExtToNavMsg = {
  type : ExtToEditorMsgDataType;
  data :IChapterdata
}


// Message Type From UI to Extension
