import { Routes } from '@angular/router';
import { CoursesListComponent } from './pages/courses-list/courses-list';
import { CourseForm } from './pages/course-form/course-form';
import { CourseDetails } from './pages/course-details/course-details';
import { unsavedChangesGuard } from '../../core/guards/unsaved-changes.guard';
import { courseExistsGuard } from './guards/course-exists.guard';
import { courseResolver } from './resolvers/course.resolver';

export const COURSES_ROUTES: Routes = [
  { path: '', component: CoursesListComponent },
  {
    path: 'add',
    component: CourseForm,
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: 'edit/:id',
    component: CourseForm,
    canActivate: [courseExistsGuard],
    canDeactivate: [unsavedChangesGuard],
    resolve: { course: courseResolver },
  },
  {
    path: 'details/:id',
    component: CourseDetails,
    canActivate: [courseExistsGuard],
    resolve: { course: courseResolver },
  },
];
