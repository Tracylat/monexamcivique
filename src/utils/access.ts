import { TitleType } from "../data/plans";
import type { User } from "@supabase/supabase-js";

const AUTH_KEY = "auth_user";
const AUTH_CHANGED_EVENT = "auth-changed";
const SELECTED_TITLE_KEY = "selected_title";
const PURCHASED_PLANS_KEY = "purchased_plans";

const safeJsonParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const isLoggedIn = (): boolean => Boolean(localStorage.getItem(AUTH_KEY));

export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};

export const setAuthUserFromSupabaseUser = (user: User | null): void => {
  if (!user) {
    localStorage.removeItem(AUTH_KEY);
    window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
    return;
  }

  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Utilisateur",
    }),
  );
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
};

export const getSelectedPlan = (): TitleType | null => {
  const value = localStorage.getItem(SELECTED_TITLE_KEY);
  if (value === "CSP" || value === "Résident" || value === "Naturalisation") {
    return value;
  }
  return null;
};

export const setSelectedPlan = (plan: TitleType): void => {
  localStorage.setItem(SELECTED_TITLE_KEY, plan);
};

export const getPurchasedPlans = (): TitleType[] => {
  const values = safeJsonParse<string[]>(localStorage.getItem(PURCHASED_PLANS_KEY), []);
  return values.filter((item): item is TitleType => item === "CSP" || item === "Résident" || item === "Naturalisation");
};

export const hasPurchasedPlan = (plan: TitleType): boolean => getPurchasedPlans().includes(plan);

export const addPurchasedPlan = (plan: TitleType): void => {
  const current = getPurchasedPlans();
  if (!current.includes(plan)) {
    localStorage.setItem(PURCHASED_PLANS_KEY, JSON.stringify([...current, plan]));
  }
};

export const hasAnyPurchasedPlan = (): boolean => getPurchasedPlans().length > 0;

export type PlanProgress = {
  masteredCardsCount: number;
  examsPassedCount: number;
  lastQuizScore: number;
  lastExamScore: number;
  updatedAt: string;
};

export type AllProgress = Partial<Record<TitleType, PlanProgress>>;

const PROGRESS_KEY = "plan_progress";

export const defaultPlanProgress = (): PlanProgress => ({
  masteredCardsCount: 0,
  examsPassedCount: 0,
  lastQuizScore: 0,
  lastExamScore: 0,
  updatedAt: new Date().toISOString(),
});

export const getAllProgress = (): AllProgress => safeJsonParse<AllProgress>(localStorage.getItem(PROGRESS_KEY), {});

export const getPlanProgress = (plan: TitleType): PlanProgress => {
  const all = getAllProgress();
  return all[plan] || defaultPlanProgress();
};

export const savePlanProgress = (plan: TitleType, partial: Partial<PlanProgress>): void => {
  const all = getAllProgress();
  const existing = all[plan] || defaultPlanProgress();
  const next: PlanProgress = {
    ...existing,
    ...partial,
    updatedAt: new Date().toISOString(),
  };
  all[plan] = next;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(all));
};

export type UserProfile = {
  displayName: string;
  avatarEmoji: string;
  avatarColor: string;
  weeklyGoalMinutes: number;
};

const PROFILE_KEY = "user_profile";
const SESSIONS_KEY = "study_sessions";

const PROFILE_DEFAULT: UserProfile = {
  displayName: "Mon profil",
  avatarEmoji: "🎯",
  avatarColor: "#1a4d8f",
  weeklyGoalMinutes: 120,
};

export const getUserProfile = (): UserProfile => {
  return { ...PROFILE_DEFAULT, ...safeJsonParse<Partial<UserProfile>>(localStorage.getItem(PROFILE_KEY), {}) };
};

export const saveUserProfile = (partial: Partial<UserProfile>): void => {
  const current = getUserProfile();
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...current, ...partial }));
};

export type StudySession = {
  plan: TitleType;
  minutes: number;
  dateISO: string;
  source: "quiz" | "exam" | "manual";
};

export const getStudySessions = (): StudySession[] => {
  return safeJsonParse<StudySession[]>(localStorage.getItem(SESSIONS_KEY), []);
};

export const addStudySession = (session: StudySession): void => {
  const current = getStudySessions();
  const next = [session, ...current].slice(0, 120);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(next));
};
