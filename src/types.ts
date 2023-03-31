export interface IOptions {
  locales: string[] | string;
  directory: string;
}

export interface IFixedOptions {
  locales: string[];
  defaultLocale: string;
  directory: string;
}
