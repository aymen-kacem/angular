import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { EventListComponent } from './features/events/event-list/event-list.component';
import { EventDetailComponent } from './features/events/event-detail/event-detail.component';
import { MyEventsComponent } from './features/events/my-events/my-events.component';
import { UserListComponent } from './features/users/user-list/user-list.component';
import { CategoryListComponent } from './features/categories/category-list/category-list.component';
import { CourseListComponent } from './features/courses/course-list/course-list.component';
import { CourseFormComponent } from './features/courses/course-form/course-form.component';
import { CourseDetailComponent } from './features/courses/course-detail/course-detail.component';
import { ProfileViewComponent } from './features/profile/profile-view/profile-view.component';
import { ProfileEditComponent } from './features/profile/profile-edit/profile-edit.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'events',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: EventListComponent },
      { path: 'my-events', component: MyEventsComponent },
      { path: ':id', component: EventDetailComponent }
    ]
  },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'categories',
    component: CategoryListComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'courses',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: CourseListComponent },
      { path: 'new', component: CourseFormComponent, data: { roles: ['admin', 'teacher'] } },
      { path: ':id/edit', component: CourseFormComponent, data: { roles: ['admin', 'teacher'] } },
      { path: ':id', component: CourseDetailComponent }
    ]
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ProfileViewComponent },
      { path: 'edit', component: ProfileEditComponent }
    ]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
