import type { ChapterQuestions, QuestionBank, QuizAttempt, QuizMode, ScopeKey, ScopeProgress, SubjectBank } from '../types';
import { load, save } from './storage';

export const MIXED_SCOPE: ScopeKey = 'mixed';

let cache: QuestionBank | null = null;

export async function getQuestionBank(): Promise<QuestionBank> {
  if (cache) return cache;
  const res = await fetch(`${import.meta.env.BASE_URL}data/questions.json`);
  if (!res.ok) throw new Error(`Failed to load question bank: ${res.status}`);
  cache = (await res.json()) as QuestionBank;
  return cache;
}

export function getSubject(bank: QuestionBank, subjectId: string): SubjectBank {
  return bank.subjects.find((s) => s.id === subjectId) ?? bank.subjects[0];
}

/** Chapters for a given mode that actually have questions — nothing to quiz on otherwise. */
export function chaptersForMode(subject: SubjectBank, mode: QuizMode): ChapterQuestions[] {
  const chapters = mode === 'terms' ? subject.terms : subject.chapters;
  return chapters.filter((c) => c.questions.length > 0);
}

export function chapterLabel(chapter: ChapterQuestions): string {
  if (chapter.kind === 'chapter' && chapter.number) return `Chapter ${chapter.number}: ${chapter.title}`;
  if (chapter.kind === 'module' && chapter.number) return `Module ${chapter.number}`;
  if (chapter.kind === 'appendix' && chapter.label) return `Appendix ${chapter.label}: ${chapter.title}`;
  return chapter.title;
}

export function questionsForScope(subject: SubjectBank, mode: QuizMode, scope: ScopeKey) {
  const chapters = chaptersForMode(subject, mode);
  if (scope === MIXED_SCOPE) return chapters.flatMap((c) => c.questions);
  return chapters.find((c) => c.id === scope)?.questions ?? [];
}

type ProgressStore = Record<string, ScopeProgress>;

function progressKey(subjectId: string, mode: QuizMode, scope: ScopeKey): string {
  return `${subjectId}:${mode}:${scope}`;
}

function getProgressStore(): ProgressStore {
  return load<ProgressStore>('progress', {});
}

export function getScopeProgress(subjectId: string, mode: QuizMode, scope: ScopeKey): ScopeProgress {
  return getProgressStore()[progressKey(subjectId, mode, scope)] ?? { best: null, attempts: 0 };
}

export function recordQuizResult(subjectId: string, mode: QuizMode, scope: ScopeKey, pct: number): void {
  const store = getProgressStore();
  const key = progressKey(subjectId, mode, scope);
  const prev = store[key] ?? { best: null, attempts: 0 };
  store[key] = { best: prev.best === null ? pct : Math.max(prev.best, pct), attempts: prev.attempts + 1 };
  save('progress', store);
}

const MAX_ATTEMPTS = 200;

export function getAttempts(): QuizAttempt[] {
  return load<QuizAttempt[]>('attempts', []);
}

export function recordAttempt(attempt: Omit<QuizAttempt, 'id'>): void {
  const attempts = getAttempts();
  attempts.unshift({ id: `${attempt.takenAt}-${Math.random().toString(36).slice(2, 8)}`, ...attempt });
  save('attempts', attempts.slice(0, MAX_ATTEMPTS));
}

export function clearAttempts(): void {
  save('attempts', []);
}