import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { MyEventsComponent } from './my-events/my-events.component';

const routes: Routes = [
  { path: '', component: EventListComponent },
  { path: 'my-events', component: MyEventsComponent },
  { path: ':id', component: EventDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
