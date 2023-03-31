import { IFixedOptions, IOptions } from './types';
import { log } from './debug';

import { FluentBundle, FluentResource } from '@fluent/bundle';
import { Context, MiddlewareFn } from 'telegraf';

import path from 'path';
import fs from 'fs';

export class I18n<T extends Context> {
  options: IFixedOptions;
  locales: FluentBundle[] = [];

  constructor(options: IOptions) {
    const locales = typeof options.locales === 'string' ? [options.locales] : options.locales;
    const directory = options.directory;
    const defaultLocale = locales[0];

    this.options = { locales, defaultLocale, directory };
    this.options.locales.forEach((name) => this.loadLocale(name));
  }

  loadLocale(name: string) {
    const source = fs.readFileSync(path.resolve(this.options.directory, `${name}.ftl`), 'utf-8');
    if (!source) return;

    const resource = new FluentResource(source);
    const bundle = new FluentBundle(name);

    const errors = bundle.addResource(resource);
    if (errors.length) return log('Fluent error on bundle creating', errors);

    this.locales.push(bundle);
  }

  translate(name: string, pattern?: any, locale?: string): string {
    log(`Translating locale "${name}"`, pattern);
    locale ??= this.options.defaultLocale;

    const bundle = this.locales.find((bundle) => bundle.locales.includes(locale!));
    if (!bundle) {
      log('Fluent translate locale not found', locale, name, pattern);
      return '{error}';
    }

    const msg = bundle.getMessage(name);
    if (!msg || !msg.value) return `{${name}}`;

    const formatted = bundle.formatPattern(msg.value, pattern) || `{${name}}`;
    return formatted.replace(/\u2068/g, '').replace(/\u2069/g, '');
  }

  middleware(): MiddlewareFn<T> {
    return (ctx: T, next: Function) => {
      (ctx as any).t = (name: string, pattern?: any) =>
        this.translate(name, pattern, (ctx as any).i18nLocale);
      next();
    };
  }
}
