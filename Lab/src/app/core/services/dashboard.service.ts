import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';
import { EventService } from './event.service';
import { RegistrationService } from './registration.service';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private userService: UserService,
    private eventService: EventService,
    private registrationService: RegistrationService,
    private categoryService: CategoryService
  ) {}

  getAdminStats(): Observable<{
    rolesDistribution: { name: string; count: number }[];
    eventsByCategory: { category: string; count: number }[];
    eventsByTeacher: { teacher: string; count: number }[];
  }> {
    return forkJoin({
      users: this.userService.getAll(),
      events: this.eventService.getAll(),
      regs: this.registrationService.getAll(),
      categories: this.categoryService.getAll()
    }).pipe(
      map(({ users, events, regs, categories }) => {
        const roles = ['admin', 'teacher', 'student'];
        const rolesDistribution = roles.map(role => ({
          name: role === 'admin' ? 'Administrateur' : role === 'teacher' ? 'Enseignant' : 'Étudiant',
          count: users.filter(u => u.role === role).length
        }));

        const categoryMap: Record<string, number> = {};
        categories.forEach(c => {
          categoryMap[c.name] = 0;
        });
        events.forEach(e => {
          if (categoryMap[e.category] !== undefined) {
            categoryMap[e.category]++;
          } else {
            categoryMap[e.category] = 1;
          }
        });
        const eventsByCategory = Object.keys(categoryMap).map(cat => ({
          category: cat,
          count: categoryMap[cat]
        }));

        const teacherEventMap: Record<string, number> = {};
        const teachers = users.filter(u => u.role === 'teacher');
        teachers.forEach(t => {
          teacherEventMap[t.fullName] = 0;
        });
        events.forEach(e => {
          const teacher = teachers.find(t => Number(t.id) === Number(e.teacherId));
          if (teacher) {
            teacherEventMap[teacher.fullName]++;
          }
        });
        const eventsByTeacher = Object.keys(teacherEventMap).map(name => ({
          teacher: name,
          count: teacherEventMap[name]
        }));

        return { rolesDistribution, eventsByCategory, eventsByTeacher };
      })
    );
  }

  getTeacherStats(teacherId: number): Observable<{
    eventsWithParticipantCount: { title: string; count: number }[];
    upcomingEvents: any[];
  }> {
    return forkJoin({
      events: this.eventService.getByTeacher(teacherId),
      regs: this.registrationService.getAll()
    }).pipe(
      map(({ events, regs }) => {
        const eventsWithParticipantCount = events.map(e => {
          const count = regs.filter(r => r.eventId === e.id && r.status === 'confirmed').length;
          return { title: e.title, count };
        });

        const todayStr = new Date().toISOString().substring(0, 10);
        const upcomingEvents = events
          .filter(e => e.date >= todayStr)
          .sort((a, b) => a.date.localeCompare(b.date));

        return { eventsWithParticipantCount, upcomingEvents };
      })
    );
  }

  getStudentStats(userId: number): Observable<{
    myRegistrations: any[];
    registrationsByCategory: { category: string; count: number }[];
  }> {
    return this.registrationService.getByUser(userId).pipe(
      map(regs => {
        const categoryMap: Record<string, number> = {};
        regs.forEach(r => {
          if (r.event) {
            const cat = r.event.category || 'Autre';
            categoryMap[cat] = (categoryMap[cat] || 0) + 1;
          }
        });

        const registrationsByCategory = Object.keys(categoryMap).map(cat => ({
          category: cat,
          count: categoryMap[cat]
        }));

        return {
          myRegistrations: regs,
          registrationsByCategory
        };
      })
    );
  }
}
