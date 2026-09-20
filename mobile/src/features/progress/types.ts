export type ProgressPeriod = "WEEK" | "MONTH";

export interface ProgressDailyData {
  date: string;

  calories: number;
  targetCalories: number;

  proteinG: number;
  targetProteinG: number;

  carbohydratesG: number;
  targetCarbohydratesG: number;

  fatG: number;
  targetFatG: number;
}

export interface ProgressMacroAverages {
  proteinG: number;
  targetProteinG: number;

  carbohydratesG: number;
  targetCarbohydratesG: number;

  fatG: number;
  targetFatG: number;
}

export interface ProgressResponse {
  period: ProgressPeriod;

  startDate: string;
  endDate: string;

  calorieAverage: number;

  goalAdherenceDays: number;
  totalDays: number;
  adherencePercentage: number;

  currentWeightKg: number;
  weightChangeKg: number | null;

  dailyData: ProgressDailyData[];

  macroAverages: ProgressMacroAverages;
}
