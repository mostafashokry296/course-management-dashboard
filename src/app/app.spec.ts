import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { signal } from '@angular/core';
import { App } from './app';
import { TranslationService } from './core/services/translation.service';
import { ThemeService } from './core/services/theme.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideAnimations(),
        {
          provide: TranslationService,
          useValue: {
            currentLang: signal('en'),
            translate: (key: string) => key,
            toggleLanguage: () => undefined,
            loadLanguage: () => undefined,
          },
        },
        {
          provide: ThemeService,
          useValue: {
            theme: signal('light'),
            isDark: () => false,
            toggleTheme: () => undefined,
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render header and router outlet', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
