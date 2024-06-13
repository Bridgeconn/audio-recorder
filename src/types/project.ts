import { LanguageMetadataType } from './language';

export interface versification {
  name: string;
  file: string;
}

export interface AudioProjectCreationDetails {
  projectName: string;
  abbreviation: string;
  userName: string;
  projectFlavour: string;
  targetLanguage: LanguageMetadataType;
  versification: versification | undefined;
  currentScope: string;
}

export enum ExportFormats {
  WAV = 'wav',
  MP3 = 'mp3',
}
