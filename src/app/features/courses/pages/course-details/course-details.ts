import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Course, CourseStatus } from '../../models/course.model';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../../core/services/translation.service';

@Component({
  selector: 'app-course-details',
  imports: [
    TranslatePipe,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './course-details.html',
  styleUrl: './course-details.scss',
})
export class CourseDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  translationService = inject(TranslationService);

  course = signal<Course | null>(null);
  loading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    const resolved = this.route.snapshot.data['course'] as Course | null;

    if (!resolved) {
      this.errorMessage.set(this.translationService.translate('courseDetails.notFound'));
      this.loading.set(false);
      return;
    }

    this.course.set(resolved);
    this.loading.set(false);
  }

  goBack(): void {
    this.router.navigate(['/courses']);
  }

  getStatusChipClass(status: CourseStatus): string {
    const map: Record<CourseStatus, string> = {
      Active: 'status-active',
      Draft: 'status-draft',
      Archived: 'status-archived',
    };
    return map[status] ?? 'status-default';
  }
}
