export interface Event {
  id: string | number;
  title: string;
  description: string;
  category: string;
  date: string;       // format: YYYY-MM-DD
  startTime: string;  // format: HH:MM
  endTime: string;    // format: HH:MM
  location: string;
  capacity: number;
  imageUrl?: string;
  teacherId: string | number;  // refers to User.id
  createdAt: string;
}
