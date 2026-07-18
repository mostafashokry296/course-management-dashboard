import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    TestBed.configureTestingModule({});
  });

  it('should default to a valid theme and apply it on the document', () => {
    const service = TestBed.inject(ThemeService);
    expect(['light', 'dark']).toContain(service.theme());
    expect(document.documentElement.getAttribute('data-theme')).toBe(service.theme());
  });

  it('should toggle between light and dark', () => {
    const service = TestBed.inject(ThemeService);
    service.setTheme('light');
    service.toggleTheme();
    expect(service.theme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('course-manager-theme')).toBe('dark');
  });
});
