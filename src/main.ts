import { getQuestionBank } from './lib/data';
import { el, clear } from './lib/dom';
import { load, save } from './lib/storage';
import { renderSetup } from './views/setup';
import { runQuiz } from './views/quiz';
import { renderHistory } from './views/history';
import type { QuestionBank, QuizMode, ScopeKey } from './types';
import './styles.css';

const THEME_KEY = 'theme';

function effectiveTheme(): 'light' | 'dark' {
  const stored = load<string | null>(THEME_KEY, null);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function setupThemeToggle(): HTMLButtonElement {
  const btn = el('button', 'theme-toggle') as HTMLButtonElement;
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Toggle dark mode');

  function apply(): void {
    const stored = load<string | null>(THEME_KEY, null);
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.setAttribute('data-theme', stored);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    btn.textContent = effectiveTheme() === 'dark' ? '☀️' : '🌙';
  }

  btn.addEventListener('click', () => {
    save(THEME_KEY, effectiveTheme() === 'dark' ? 'light' : 'dark');
    apply();
  });

  apply();
  return btn;
}

function showSetup(main: HTMLElement, bank: QuestionBank, setTopic: (text: string) => void): void {
  renderSetup(main, bank, setTopic, (subjectId, mode, scope, count) =>
    showQuiz(main, bank, subjectId, mode, scope, count, setTopic),
  );
}

function showQuiz(
  main: HTMLElement,
  bank: QuestionBank,
  subjectId: string,
  mode: QuizMode,
  scope: ScopeKey,
  count: number,
  setTopic: (text: string) => void,
): void {
  runQuiz(
    main,
    bank,
    subjectId,
    mode,
    scope,
    count,
    () => showQuiz(main, bank, subjectId, mode, scope, count, setTopic),
    () => showSetup(main, bank, setTopic),
  );
}

function showHistory(main: HTMLElement, bank: QuestionBank, setTopic: (text: string) => void): void {
  renderHistory(main, bank, setTopic, () => showSetup(main, bank, setTopic));
}

function buildHeader(): { header: HTMLElement; setTopic: (text: string) => void; historyBtn: HTMLButtonElement } {
  const header = el('header', 'app-header');
  const inner = el('div', 'app-header-inner');
  const brand = el('div', 'brand');
  brand.appendChild(el('span', 'brand-mark', '🎯'));
  const topic = el('span', 'brand-name', 'DE Quiz Practice');
  brand.appendChild(topic);
  inner.appendChild(brand);

  const actions = el('div', 'header-actions');
  const historyBtn = el('button', 'theme-toggle', '📊');
  historyBtn.type = 'button';
  historyBtn.setAttribute('aria-label', 'View your quiz history');
  actions.append(historyBtn, setupThemeToggle());
  inner.appendChild(actions);

  header.appendChild(inner);
  return { header, setTopic: (text) => (topic.textContent = text), historyBtn };
}

async function boot(): Promise<void> {
  const app = document.getElementById('app')!;
  const { header, setTopic, historyBtn } = buildHeader();
  app.appendChild(header);

  const main = el('main', 'content');
  main.appendChild(el('div', 'loading', 'Loading…'));
  app.appendChild(main);

  const bank = await getQuestionBank();
  clear(main);
  historyBtn.addEventListener('click', () => showHistory(main, bank, setTopic));
  showSetup(main, bank, setTopic);
}

boot().catch((err) => {
  const app = document.getElementById('app')!;
  app.appendChild(el('p', 'error', `Failed to start: ${err instanceof Error ? err.message : String(err)}`));
});