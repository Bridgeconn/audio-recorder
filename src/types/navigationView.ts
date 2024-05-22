import { IVersification } from './versification';

// msg types from navigation webview to nav provider
export enum NavWebToExtMsgTypes {
  FetchVersification = 'Fetch Versification Data',
  BCSelection = 'Book Chapter Seelction',
  createProject = 'Start Project Creation click',
  openProject = 'open popup to select project folder',
  getDevices = 'Get the list of connected audio devices',
  selectedMic = 'This is the MIC selected by the user',
}
export type bookIdChapterType = {
  bookId: string;
  chapter: number;
};

export type NavUItoExtMsg = {
  type: NavWebToExtMsgTypes;
  data: bookIdChapterType | null | string;
};

// ---------------- Ext to WebVie ------------------

// msg types from nav provider to web view navigation
export enum ExttoNavWebMsgTypes {
  VersificationData = 'Versification Data',
  MicData = 'List of avilable audio devices',
}
export type MicData = {
  devices: string[];
  platform: string;
};
type ExtToNavMsgDataType = Partial<IVersification> | MicData;

export type ExtToNavMsg = {
  type: ExttoNavWebMsgTypes;
  data: ExtToNavMsgDataType;
};
