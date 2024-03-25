export type LanguageCode = string;

export const languageCodes = ['en', 'it', 'sp', 'ru'];

export const assertLanguageCode = (name: string): LanguageCode => {
  if (languageCodes.find((code) => code === name)?.length > 0) {
    return name;
  } else {
    throw Error(`Unsupported or unknown language ${name}`);
  }
};
