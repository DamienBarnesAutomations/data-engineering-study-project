export interface Question {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
  chapterId: string;
}

export type ChapterKind = 'chapter' | 'module' | 'preface' | 'appendix';

export interface ChapterQuestions {
  id: string;
  kind: ChapterKind;
  number: number | null;
  label: string | null;
  title: string;
  questions: Question[];
}

export interface SubjectBank {
  id: string;
  book: string;
  chapters: ChapterQuestions[];
  terms: ChapterQuestions[];
}

export interface QuestionBank {
  subjects: SubjectBank[];
}

/** A quiz scope is either one chapter's id, or "mixed" for the full cross-chapter pool. */
export type ScopeKey = string;

/** Which question bank to quiz from: practice questions or key-terms questions. */
export type QuizMode = 'practice' | 'terms';

export interface ScopeProgress {
  best: number | null;
  attempts: number;
}

export interface QuizAttempt {
  id: string;
  subjectId: string;
  mode: QuizMode;
  scope: ScopeKey;
  correct: number;
  total: number;
  pct: number;
  takenAt: number;
}
