import { IVersification } from './versification';

// msg types from navigation webview to nav provider
export enum NavWebToExtMsgTypes {
  FetchVersification = 'Fetch Versification Data',
  BCSelection = 'Book Chapter Seelction',
  createProject = 'Start Project Creation click',
  openProject = 'open popup to select project folder',
}
export type bookIdChapterType = {
  bookId: string;
  chapter: number;
};

export type NavUItoExtMsg = {
  type: NavWebToExtMsgTypes;
  data: bookIdChapterType | null;
};

// ---------------- Ext to WebVie ------------------

// msg types from nav provider to web view navigation
export enum ExttoNavWebMsgTypes {
  VersificationData = 'Versification Data',
}

type ExtToNavMsgDataType = Partial<IVersification>;

export type ExtToNavMsg = {
  type: ExttoNavWebMsgTypes;
  data: ExtToNavMsgDataType;
};
