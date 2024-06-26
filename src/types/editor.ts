import * as vscode from 'vscode';
import { NavWebToExtMsgTypes, bookIdChapterType } from './navigationView';

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

export interface IRecordingFlag {
  recordingFlag: string;
}

// Message Types from Ext to UI
export enum ExttoEditorWebMsgTypes {
  ChapterData = 'Chapter Data of IChapterdata',
  RecordingFlag = 'Recording URL for displaying waveform',
}

type ExtToEditorMsgDataType =
  | ExttoEditorWebMsgTypes.ChapterData
  | ExttoEditorWebMsgTypes.RecordingFlag;

export type ExtToNavMsg = {
  type: ExtToEditorMsgDataType;
  data: IChapterdata | IRecordingFlag;
};

// Message Type From UI to Extension
export enum EditorToExtMSgType {
  startRecord = 'trigger to start the record',
  stopRecord = 'trigger to stop the record',
  deleteAudio = 'trigger to delete the audio',
  defaultChange = 'triggers to change the default audio',
}

// type EditorUItoExtMsgDataType = EditorToExtMSgType;

export type RecordTriggerData = {
  verse: number;
  take: string;
  defaultAudio?: string;
};

export type EditorUItoExtMsg = {
  type: EditorToExtMSgType | NavWebToExtMsgTypes;
  data: IChapterdata | RecordTriggerData | null;
};

export interface IAudioMeta {
  duration: number;
  length: number;
  numberOfChannels: number;
}
