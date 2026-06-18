import { User } from './user.model';
import { Event } from './event.model';

export interface Registration {
  id: number;
  userId: number;      // refers to User.id
  eventId: number;     // refers to Event.id
  status: 'confirmed' | 'pending' | 'cancelled';
  registeredAt: string;
  user?: User;         // optionally expanded by json-server or joined in memory
  event?: Event;       // optionally expanded by json-server or joined in memory
}
