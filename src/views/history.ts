import { chapterLabel, chaptersForMode, clearAttempts, getAttempts, getSubject, MIXED_SCOPE } from '../lib/data';
import { el, clear } from '../lib/dom';
import type { QuestionBank, QuizAttempt } from '../types';

function formatDate(ts: number): string {
  return new Date(ts).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

function scopeLabelFor(bank: QuestionBank, a: QuizAttempt): string {
  const subject = getSubject(bank, a.subjectId);
  if (a.scope === MIXED_SCOPE) return a.mode === 'terms' ? 'Mixed key terms' : 'Mixed review';
  const chapter = chaptersForMode(subject, a.mode).find((c) => c.id === a.scope);
  return chapter ? chapterLabel(chapter) : a.scope;
}

export function renderHistory(root: HTMLElement, bank: QuestionBank, setTopic: (text: string) => void, onBack: () => void): void {
  clear(root);
  setTopic('📊 Your results');

  const page = el('div', 'quiz-session');

  const top = el('div', 'session-top');
  top.appendChild(el('span', 'session-counter', 'Quiz history'));
  const backBtn = el('button', 'btn btn-secondary', '← Back');
  backBtn.addEventListener('click', onBack);
  top.appendChild(backBtn);
  page.appendChild(top);

  const attempts = getAttempts();

  if (attempts.length === 0) {
    const empty = el('div', 'qbox');
    empty.appendChild(el('p', 'hint', '🗒️ No quizzes taken yet — finish a quiz and it’ll show up here.'));
    page.appendChild(empty);
    root.appendChild(page);
    return;
  }

  const list = el('ul', 'history-list');
  for (const a of attempts) {
    const li = el('li', 'history-item');
    const tier = a.pct >= 80 ? 'great' : a.pct >= 50 ? 'ok' : 'low';
    li.appendChild(el('span', `history-score history-score-${tier}`, `${a.pct}%`));
    const info = el('div', 'history-info');
    info.appendChild(el('div', 'history-title', getSubject(bank, a.subjectId).book));
    info.appendChild(
      el(
        'div',
        'history-meta',
        `${a.mode === 'terms' ? '🔑 Key terms' : '🧠 Practice'} · ${scopeLabelFor(bank, a)} · ${a.correct}/${a.total} correct`,
      ),
    );
    info.appendChild(el('div', 'history-date', formatDate(a.takenAt)));
    li.appendChild(info);
    list.appendChild(li);
  }
  const scroller = el('div', 'history-scroll');
  scroller.appendChild(list);
  page.appendChild(scroller);

  const clearBtn = el('button', 'btn btn-secondary', 'Clear history');
  clearBtn.addEventListener('click', () => {
    if (!confirm('Clear all quiz history? This cannot be undone.')) return;
    clearAttempts();
    renderHistory(root, bank, setTopic, onBack);
  });
  page.appendChild(clearBtn);

  root.appendChild(page);
}
