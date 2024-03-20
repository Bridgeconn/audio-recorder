export type LanguageMetadataType = {
  tag: string;
  refName: string;
  scope: string;
  type: string;
  iso1?: string;
  iso2t?: string;
  iso2b?: string;
  comment?: string | null | undefined;
  name?: {
    [key: string]: string;
  };
};
