export interface HabitData {
  id: string;
  name: string;
  studyId: string;
}

export interface CompletedHabitData {
  id: string;
  habitId: string;
  studyId: string;
  completedAt: Date;
}
