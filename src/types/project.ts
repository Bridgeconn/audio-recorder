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
  sourceLanguage: LanguageMetadataType;
  targetLanguage: LanguageMetadataType;
  versification: versification | undefined;
  currentScope: string;
}
