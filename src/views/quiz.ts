import {
  chapterLabel,
  chaptersForMode,
  getSubject,
  MIXED_SCOPE,
  questionsForScope,
  recordAttempt,
  recordQuizResult,
} from '../lib/data';
import { el, clear } from '../lib/dom';
import type { Question, QuestionBank, QuizMode, ScopeKey, SubjectBank } from '../types';

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function labelFor(subject: SubjectBank, mode: QuizMode, chapterId: string): string {
  const ch = chaptersForMode(subject, mode).find((c) => c.id === chapterId);
  return ch ? chapterLabel(ch) : '';
}

export function runQuiz(
  root: HTMLElement,
  bank: QuestionBank,
  subjectId: string,
  mode: QuizMode,
  scope: ScopeKey,
  count: number,
  onRestart: () => void,
  onExit: () => void,
): void {
  const subject = getSubject(bank, subjectId);
  const pool = questionsForScope(subject, mode, scope);
  const questions = shuffle(pool).slice(0, Math.min(count, pool.length));
  const showSource = scope === MIXED_SCOPE;
  const heading = showSource ? (mode === 'terms' ? 'Mixed key terms' : 'Mixed review') : labelFor(subject, mode, scope);

  let index = 0;
  let score = 0;
  const missed: Question[] = [];

  const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

  const page = el('div', 'quiz-session');
  const top = el('div', 'session-top');
  const counter = el('span', 'session-counter', '');
  const endBtn = el('button', 'btn btn-secondary', 'End quiz');
  endBtn.addEventListener('click', onExit);
  top.append(counter, endBtn);
  const progress = el('div', 'progress-bar');
  const progressFill = el('div', 'progress-fill');
  progress.appendChild(progressFill);
  page.append(top, progress);

  clear(root);
  root.appendChild(page);

  function render(): void {
    if (index >= questions.length) {
      finish();
      return;
    }
    const q = questions[index];
    counter.textContent = `Question ${index + 1} of ${questions.length} · ${heading}`;
    progressFill.style.width = `${(index / questions.length) * 100}%`;

    const qbox = el('div', 'qbox');
    if (showSource) qbox.appendChild(el('div', 'q-kicker', labelFor(subject, mode, q.chapterId)));
    qbox.appendChild(el('h2', 'q-text', q.q));

    const opts = el('div', 'options');
    let answered = false;
    q.options.forEach((opt, i) => {
      const b = el('button', 'opt');
      b.appendChild(el('span', 'opt-letter', OPTION_LETTERS[i] ?? String(i + 1)));
      b.appendChild(el('span', 'opt-text', opt));
      b.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        const correct = i === q.answer;
        if (correct) score += 1;
        else missed.push(q);
        b.classList.add(correct ? 'correct' : 'wrong');
        q.options.forEach((_, j) => {
          const bt = opts.children[j] as HTMLButtonElement;
          if (j === q.answer) bt.classList.add('correct');
          if (j !== i) bt.disabled = true;
        });
        const explain = el('p', 'explain', correct ? 'Correct. ' : 'Incorrect. ');
        explain.appendChild(document.createTextNode(q.explanation));
        qbox.appendChild(explain);
        const nextBtn = el(
          'button',
          'btn btn-primary btn-block',
          index + 1 === questions.length ? 'See results' : 'Next question',
        );
        nextBtn.addEventListener('click', () => {
          index += 1;
          render();
        });
        qbox.appendChild(nextBtn);
      });
      opts.appendChild(b);
    });
    qbox.appendChild(opts);
    clear(page);
    page.append(top, progress, qbox);
  }

  function finish(): void {
    const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
    recordQuizResult(subjectId, mode, scope, pct);
    recordAttempt({ subjectId, mode, scope, correct: score, total: questions.length, pct, takenAt: Date.now() });
    clear(page);
    const tier = pct >= 80 ? 'great' : pct >= 50 ? 'ok' : 'low';
    const tierEmoji = tier === 'great' ? '🏆' : tier === 'ok' ? '👍' : '💪';
    const result = el('div', 'result-card');
    const badge = el('div', `score-badge score-badge-${tier}`);
    badge.appendChild(el('span', 'score-badge-emoji', tierEmoji));
    badge.appendChild(el('span', 'score-badge-value', `${pct}%`));
    result.appendChild(badge);
    const summary = el('div', 'result-summary');
    summary.appendChild(el('h2', '', 'Quiz complete'));
    summary.appendChild(el('div', 'quiz-score', `${score} / ${questions.length} correct`));
    result.appendChild(summary);
    page.appendChild(result);
    if (missed.length) {
      page.appendChild(el('h3', '', 'Review the questions you missed'));
      const list = el('ul', 'missed-list');
      for (const q of missed) {
        const li = el('li');
        if (showSource) li.appendChild(el('div', 'missed-source', labelFor(subject, mode, q.chapterId)));
        li.appendChild(el('div', 'missed-q', q.q));
        li.appendChild(el('div', 'missed-a', `Correct answer: ${q.options[q.answer]}`));
        list.appendChild(li);
      }
      const scroller = el('div', 'missed-scroll');
      scroller.appendChild(list);
      page.appendChild(scroller);
    }
    const links = el('div', 'quick-links');
    const again = el('button', 'btn btn-primary', 'Retry this scope');
    again.addEventListener('click', onRestart);
    const back = el('button', 'btn', 'New quiz');
    back.addEventListener('click', onExit);
    links.append(again, back);
    page.appendChild(links);
  }

  render();
}