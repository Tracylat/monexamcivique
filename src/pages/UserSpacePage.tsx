import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import { plans } from "../data/plans";
import { addStudySession, getAllProgress, getPurchasedPlans, getStudySessions, getUserProfile, saveUserProfile, setSelectedPlan } from "../utils/access";

const UserSpacePage: React.FC = () => {
  const purchasedPlans = getPurchasedPlans();
  const progress = getAllProgress();
  const [profile, setProfile] = useState(getUserProfile());
  const [sessions, setSessions] = useState(getStudySessions());
  const unlockedCount = purchasedPlans.length;
  const totalCards = purchasedPlans.reduce((sum, plan) => sum + (progress[plan]?.masteredCardsCount || 0), 0);
  const totalExams = purchasedPlans.reduce((sum, plan) => sum + (progress[plan]?.examsPassedCount || 0), 0);
  const weeklyMinutes = useMemo(() => {
    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    return sessions
      .filter((s) => new Date(s.dateISO).getTime() >= sevenDaysAgo)
      .reduce((sum, s) => sum + s.minutes, 0);
  }, [sessions]);
  const goalProgress = Math.min(100, Math.round((weeklyMinutes / Math.max(1, profile.weeklyGoalMinutes)) * 100));
  const lastSevenDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const label = date.toLocaleDateString("fr-FR", { weekday: "short" });
      const dayKey = date.toISOString().slice(0, 10);
      const minutes = sessions
        .filter((s) => s.dateISO.slice(0, 10) === dayKey)
        .reduce((sum, s) => sum + s.minutes, 0);
      return { label, minutes };
    });
  }, [sessions]);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-blue-100 to-white px-4 py-8 sm:py-12">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-8 overflow-hidden rounded-3xl border border-[#d9e6fa] bg-white shadow-lg">
            <div className="grid grid-cols-1 gap-6 bg-[radial-gradient(circle_at_top_right,_rgba(26,77,143,0.12),_transparent_45%)] p-6 sm:p-8 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <p className="mb-3 inline-flex items-center rounded-full bg-[#edf4ff] px-3 py-1 text-xs font-semibold text-[#1a4d8f]">
                  Votre espace personnel
                </p>
                <h1 className="font-heading text-3xl font-extrabold text-[#0f3466] sm:text-4xl">Tableau de bord client</h1>
                <p className="mt-2 max-w-xl text-gray-600">
                  Un seul endroit pour gérer vos 3 parcours, voir votre progression réelle et reprendre la bonne formation immédiatement.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link to="/choice" className="btn btn-primary">Acheter une autre formation</Link>
                  <Link to="/app/free" className="btn border border-[#d7e3f4] bg-white text-[#1a4d8f] hover:bg-[#eef4fb]">Refaire le test gratuit</Link>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-2xl border border-[#e6eef8] bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Formations débloquées</p>
                  <p className="font-heading text-3xl font-bold text-[#1a4d8f]">{unlockedCount}/3</p>
                </div>
                <div className="rounded-2xl border border-[#e6eef8] bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Cartes maîtrisées</p>
                  <p className="font-heading text-3xl font-bold text-[#1a4d8f]">{totalCards}</p>
                </div>
                <div className="rounded-2xl border border-[#e6eef8] bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">Examens validés</p>
                  <p className="font-heading text-3xl font-bold text-[#1a4d8f]">{totalExams}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded-2xl border border-[#e6eef8] bg-white p-6 shadow-lg">
              <h2 className="font-heading text-2xl font-bold text-[#1a4d8f] mb-4">Profil</h2>
              <div className="mb-4 flex items-center gap-4">
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full text-2xl text-white"
                  style={{ backgroundColor: profile.avatarColor }}
                >
                  {profile.avatarEmoji}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nom affiché</p>
                  <p className="font-semibold text-gray-800">{profile.displayName}</p>
                </div>
              </div>
              <div className="space-y-3">
                <input
                  value={profile.displayName}
                  onChange={(e) => setProfile((prev) => ({ ...prev, displayName: e.target.value }))}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Votre nom"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={profile.avatarEmoji}
                    onChange={(e) => setProfile((prev) => ({ ...prev, avatarEmoji: e.target.value || "🎯" }))}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="🎯"
                  />
                  <input
                    type="color"
                    value={profile.avatarColor}
                    onChange={(e) => setProfile((prev) => ({ ...prev, avatarColor: e.target.value }))}
                    className="h-10 w-full rounded-lg border border-gray-300"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => saveUserProfile(profile)}
                  className="btn w-full bg-[#1a4d8f] text-white hover:bg-[#0f3466]"
                >
                  Enregistrer le profil
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-[#e6eef8] bg-white p-6 shadow-lg">
              <h2 className="font-heading text-2xl font-bold text-[#1a4d8f] mb-4">Objectif hebdomadaire</h2>
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-gray-600">{weeklyMinutes} min réalisés</span>
                <span className="font-semibold text-[#1a4d8f]">{profile.weeklyGoalMinutes} min objectif</span>
              </div>
              <div className="mb-5 h-3 rounded-full bg-slate-200">
                <div className="h-3 rounded-full bg-[#d72638]" style={{ width: `${goalProgress}%` }} />
              </div>
              <div className="mb-4 grid grid-cols-7 gap-2">
                {lastSevenDays.map((day) => (
                  <div key={day.label} className="rounded-lg bg-slate-50 p-2 text-center">
                    <p className="text-[11px] uppercase text-gray-500">{day.label.replace(".", "")}</p>
                    <p className="font-semibold text-[#1a4d8f] text-sm">{day.minutes}m</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto_auto]">
                <input
                  type="number"
                  min={30}
                  step={30}
                  value={profile.weeklyGoalMinutes}
                  onChange={(e) => setProfile((prev) => ({ ...prev, weeklyGoalMinutes: Number(e.target.value) || 120 }))}
                  className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => saveUserProfile(profile)}
                  className="btn border border-[#d7e3f4] bg-white text-[#1a4d8f] hover:bg-[#eef4fb]"
                >
                  Sauver
                </button>
                <button
                  type="button"
                  onClick={() => {
                    addStudySession({
                      plan: purchasedPlans[0] || "CSP",
                      minutes: 15,
                      dateISO: new Date().toISOString(),
                      source: "manual",
                    });
                    setSessions(getStudySessions());
                  }}
                  className="btn border border-[#d7e3f4] bg-white text-[#1a4d8f] hover:bg-[#eef4fb]"
                >
                  +15 min
                </button>
              </div>
            </div>
          </div>

          {purchasedPlans.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 shadow-lg text-center">
              <p className="text-lg text-gray-700 mb-4">Aucune formation active pour le moment.</p>
              <p className="text-sm text-gray-500 mb-6">Débloquez un parcours pour voir votre progression détaillée ici.</p>
              <Link to="/choice" className="btn btn-primary">Choisir et payer une formation</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {plans.map((plan) => {
                const isUnlocked = purchasedPlans.includes(plan.id);
                const planProgress = progress[plan.id];
                const cards = planProgress?.masteredCardsCount || 0;
                const exams = planProgress?.examsPassedCount || 0;
                const quiz = planProgress?.lastQuizScore || 0;
                const examScore = planProgress?.lastExamScore || 0;
                const cardsPercent = Math.min(100, Math.round((cards / 100) * 100));
                const examsPercent = Math.min(100, Math.round((exams / 3) * 100));
                return (
                  <div key={plan.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-3xl">{plan.icon}</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${isUnlocked ? "bg-blue-100 text-[#1a4d8f]" : "bg-slate-100 text-slate-500"}`}>
                        {isUnlocked ? "Débloqué" : "Verrouillé"}
                      </span>
                    </div>
                    <h2 className="font-heading text-2xl font-bold text-[#1a4d8f] mb-1">{plan.id}</h2>
                    <p className="text-sm text-gray-600 mb-4">{plan.labelFr}</p>

                    {isUnlocked ? (
                      <>
                        <div className="space-y-3 rounded-lg bg-slate-50 p-3 text-sm text-gray-700 mb-4">
                          <div>
                            <div className="mb-1 flex items-center justify-between">
                              <span>Cartes maîtrisées</span>
                              <strong>{cards}/100</strong>
                            </div>
                            <div className="h-2 rounded-full bg-slate-200">
                              <div className="h-2 rounded-full bg-[#1a4d8f]" style={{ width: `${cardsPercent}%` }} />
                            </div>
                          </div>
                          <div>
                            <div className="mb-1 flex items-center justify-between">
                              <span>Examens validés</span>
                              <strong>{exams}/3</strong>
                            </div>
                            <div className="h-2 rounded-full bg-slate-200">
                              <div className="h-2 rounded-full bg-[#d72638]" style={{ width: `${examsPercent}%` }} />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <div className="rounded-lg bg-white p-2 text-center">
                              <p className="text-xs text-gray-500">Quiz</p>
                              <p className="font-bold text-[#1a4d8f]">{quiz}/10</p>
                            </div>
                            <div className="rounded-lg bg-white p-2 text-center">
                              <p className="text-xs text-gray-500">Examen</p>
                              <p className="font-bold text-[#1a4d8f]">{examScore}/40</p>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          <Link
                            to="/app"
                            onClick={() => setSelectedPlan(plan.id)}
                            className="btn btn-primary w-full"
                          >
                            Reprendre cette formation
                          </Link>
                          <Link
                            to="/app/free"
                            className="btn w-full border border-[#d7e3f4] bg-white text-[#1a4d8f] hover:bg-[#eef4fb]"
                          >
                            Révision rapide
                          </Link>
                        </div>
                      </>
                    ) : (
                      <Link to={`/checkout?plan=${encodeURIComponent(plan.id)}`} className="btn w-full bg-slate-100 text-slate-700 hover:bg-slate-200">
                        Payer pour débloquer
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-8 rounded-2xl border border-[#e6eef8] bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-2xl font-bold text-[#1a4d8f]">Historique des sessions</h2>
              <span className="text-sm text-gray-500">{sessions.length} session(s)</span>
            </div>
            {sessions.length === 0 ? (
              <p className="text-sm text-gray-500">Aucune session enregistrée pour l’instant.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-gray-500">
                      <th className="py-2">Date</th>
                      <th className="py-2">Formation</th>
                      <th className="py-2">Type</th>
                      <th className="py-2">Durée</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.slice(0, 12).map((s, idx) => (
                      <tr key={`${s.dateISO}-${idx}`} className="border-b border-slate-100">
                        <td className="py-2 text-gray-700">{new Date(s.dateISO).toLocaleString("fr-FR")}</td>
                        <td className="py-2 font-semibold text-[#1a4d8f]">{s.plan}</td>
                        <td className="py-2 capitalize text-gray-600">{s.source}</td>
                        <td className="py-2 text-gray-700">{s.minutes} min</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSpacePage;
