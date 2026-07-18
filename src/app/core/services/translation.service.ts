import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export type Language = 'en' | 'ar';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  currentLang = signal<Language>('en');
  private translations = signal<Record<string, any>>({});

  constructor(private http: HttpClient) {
    this.loadLanguage('en');
  }

  loadLanguage(lang: Language): void {
    this.http.get<Record<string, any>>(`/assets/i18n/${lang}.json`).subscribe({
      next: (data) => {
        this.translations.set(data);
        this.currentLang.set(lang);
        this.applyDocumentDirection(lang);
      },
    });
  }

  toggleLanguage(): void {
    const next: Language = this.currentLang() === 'en' ? 'ar' : 'en';
    this.loadLanguage(next);
  }

  translate(key: string): string {
    const keys = key.split('.');
    let value: any = this.translations();
    for (const k of keys) {
      value = value?.[k];
    }
    return value ?? key;
  }

  private applyDocumentDirection(lang: Language): void {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
}
