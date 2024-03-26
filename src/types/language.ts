export type LanguageMetadataType = {
  tag: string;
  refName: string;
  altNames: string[];
  direction: 'ltr' | 'rtl';
  region: string;
  gateway: boolean;
};
