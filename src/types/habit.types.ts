export interface HabitData {
  id: string;
  name: string;
  studyId: string;
  createdAt: Date;
}

export interface CompletedHabitData {
  id: string;
  habitId: string;
  studyId: string;
  completedAt: Date;
}
