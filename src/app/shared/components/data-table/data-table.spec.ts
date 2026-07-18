import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DataTableComponent } from './data-table';
import { TranslationService } from '../../../core/services/translation.service';

describe('DataTableComponent', () => {
  let component: DataTableComponent<{ id: number; name: string }>;
  let fixture: ComponentFixture<DataTableComponent<{ id: number; name: string }>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTableComponent],
      providers: [
        provideAnimations(),
        {
          provide: TranslationService,
          useValue: {
            translate: (key: string) => key,
            currentLang: () => 'en',
            loadLanguage: () => undefined,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DataTableComponent<{ id: number; name: string }>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('columns', [
      { key: 'name', headerKey: 'coursesList.colName' },
    ]);
    fixture.componentRef.setInput('rows', [{ id: 1, name: 'Angular' }]);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should expose Material displayed columns', () => {
    expect(component.displayedColumns).toContain('name');
  });

  it('should resolve cell values from row keys', () => {
    const value = component.getCellValue(
      { id: 1, name: 'Angular' },
      { key: 'name', headerKey: 'coursesList.colName' },
    );
    expect(value).toBe('Angular');
  });

  it('should use valueFn when provided', () => {
    const value = component.getCellValue(
      { id: 1, name: 'Angular' },
      {
        key: 'name',
        headerKey: 'coursesList.colName',
        valueFn: (row) => row.name.toUpperCase(),
      },
    );
    expect(value).toBe('ANGULAR');
  });
});
