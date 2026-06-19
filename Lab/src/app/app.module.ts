import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { firebaseConfig } from './env';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TemplateComponent } from './template/template.component';
import { SharedModule } from './shared/shared.module';

import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

// Added Angular Material Modules from features
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatRadioModule } from '@angular/material/radio';

import { NgChartsModule } from 'ng2-charts';

// Feature Components
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AdminDashboardComponent } from './features/dashboard/admin-dashboard/admin-dashboard.component';
import { TeacherDashboardComponent } from './features/dashboard/teacher-dashboard/teacher-dashboard.component';
import { StudentDashboardComponent } from './features/dashboard/student-dashboard/student-dashboard.component';
import { EventListComponent } from './features/events/event-list/event-list.component';
import { EventDetailComponent } from './features/events/event-detail/event-detail.component';
import { EventFormComponent } from './features/events/event-form/event-form.component';
import { MyEventsComponent } from './features/events/my-events/my-events.component';
import { UserListComponent } from './features/users/user-list/user-list.component';
import { UserFormComponent } from './features/users/user-form/user-form.component';
import { CategoryListComponent } from './features/categories/category-list/category-list.component';
import { CategoryFormComponent } from './features/categories/category-form/category-form.component';
import { CourseListComponent } from './features/courses/course-list/course-list.component';
import { CourseFormComponent } from './features/courses/course-form/course-form.component';
import { CourseDetailComponent } from './features/courses/course-detail/course-detail.component';
import { ProfileViewComponent } from './features/profile/profile-view/profile-view.component';
import { ProfileEditComponent } from './features/profile/profile-edit/profile-edit.component';

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    TemplateComponent,
    
    // Auth
    LoginComponent,
    RegisterComponent,
    
    // Dashboard
    DashboardComponent,
    AdminDashboardComponent,
    TeacherDashboardComponent,
    StudentDashboardComponent,
    
    // Events
    EventListComponent,
    EventDetailComponent,
    EventFormComponent,
    MyEventsComponent,
    
    // Users
    UserListComponent,
    UserFormComponent,
    
    // Categories
    CategoryListComponent,
    CategoryFormComponent,
    
    // Courses
    CourseListComponent,
    CourseFormComponent,
    CourseDetailComponent,
    
    // Profile
    ProfileViewComponent,
    ProfileEditComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    SharedModule,

    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,

    NgChartsModule,

    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule,
    
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatTooltipModule,
    MatChipsModule,
    MatDividerModule,
    MatRadioModule
  ],

  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'fr' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
