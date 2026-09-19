import { useCallback, useEffect, useState } from "react";

import { dashboardService } from "../services/dashboardService";
import type { DashboardMeal, DailyNutritionResponse } from "../types";

interface UseDashboardResult {
  nutrition: DailyNutritionResponse | null;
  meals: DashboardMeal[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

function getTodayDate(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function useDashboard(): UseDashboardResult {
  const [nutrition, setNutrition] = useState<DailyNutritionResponse | null>(
    null,
  );

  const [meals, setMeals] = useState<DashboardMeal[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const today = getTodayDate();

      const [dailyNutrition, todayMeals] = await Promise.all([
        dashboardService.getDailyNutrition(today),
        dashboardService.getMealsByDate(today),
      ]);

      setNutrition(dailyNutrition);
      setMeals(todayMeals);
    } catch (error) {
      console.error("Dashboard loading failed:", error);

      setError(
        error instanceof Error ? error.message : "Failed to load dashboard",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    nutrition,
    meals,
    isLoading,
    error,
    refresh: loadDashboard,
  };
}
