import * as vscode from 'vscode';

export interface IAudioData {
  default: string;
  take1?: string | vscode.Uri;
  take2?: string | vscode.Uri;
  take3?: string | vscode.Uri;
}

export interface IVerseData {
  verseNumber: number;
  verseText: string;
  audio: IAudioData | undefined;
}

export interface IChapterdata {
  chapterNumber: number;
  contents: IVerseData[];
}

// Message Types from Ext to UI
export enum ExttoEditorWebMsgTypes {
  ChapterData = 'Chapter Data of IChapterdata',
}

type ExtToEditorMsgDataType = ExttoEditorWebMsgTypes.ChapterData;

export type ExtToNavMsg = {
  type: ExtToEditorMsgDataType;
  data: IChapterdata;
};

// Message Type From UI to Extension
export enum EditorToExtMSgType {
  startRecord = 'trigger to start the record',
  stopRecord = 'trigger to stop the record',
  deleteAudio = 'trigger to delete the audio',
}

// type EditorUItoExtMsgDataType = EditorToExtMSgType;

export type RecordTriggerData = {
  verse: number;
};

export type EditorUItoExtMsg = {
  type: EditorToExtMSgType;
  data: IChapterdata | RecordTriggerData;
};
