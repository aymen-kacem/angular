import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseListComponent } from './course-list/course-list.component';
import { CourseFormComponent } from './course-form/course-form.component';
import { CourseDetailComponent } from './course-detail/course-detail.component';

const routes: Routes = [
  { path: '', component: CourseListComponent },
  { path: 'new', component: CourseFormComponent, data: { roles: ['admin', 'teacher'] } },
  { path: ':id/edit', component: CourseFormComponent, data: { roles: ['admin', 'teacher'] } },
  { path: ':id', component: CourseDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoursesRoutingModule { }
