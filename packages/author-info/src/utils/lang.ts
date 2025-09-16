import { supportedLanguages } from '../constants';

export function isSupportedLanguage(lang: string): lang is (typeof supportedLanguages)[number] {
  return (supportedLanguages as readonly string[]).includes(lang);
}
