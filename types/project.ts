import { LanguageMetadataType } from "./language";

export interface AudioProjectCreationDetails {
    projectName: string;
    abbreviation: string;
    userName: string;
    projectFlavour: string;
    sourceLanguage: LanguageMetadataType;
    targetLanguage: LanguageMetadataType;
}
