import { chapterLabel, chaptersForMode, getScopeProgress, getSubject, MIXED_SCOPE } from '../lib/data';
import { el, clear } from '../lib/dom';
import type { ChapterQuestions, QuestionBank, QuizMode, ScopeKey, SubjectBank } from '../types';

const MODES: { value: QuizMode; label: string; icon: string }[] = [
  { value: 'practice', label: 'Practice questions', icon: '🧠' },
  { value: 'terms', label: 'Key terms', icon: '🔑' },
];

const SUBJECT_ICONS = ['📘', '🧩', '📙', '📕'];

const COUNT_PRESETS = [5, 10, 20, 50];

function radioChip(
  name: string,
  value: string,
  checked: boolean,
  wrapperClass: string,
  contentClass: string,
  build: (content: HTMLElement) => void,
): { wrapper: HTMLLabelElement; input: HTMLInputElement } {
  const wrapper = el('label', wrapperClass);
  const input = el('input');
  input.type = 'radio';
  input.name = name;
  input.value = value;
  input.checked = checked;
  const content = el('span', contentClass);
  build(content);
  wrapper.append(input, content);
  return { wrapper, input };
}

export function renderSetup(
  root: HTMLElement,
  bank: QuestionBank,
  setTopic: (text: string) => void,
  onStart: (subjectId: string, mode: QuizMode, scope: ScopeKey, count: number) => void,
): void {
  clear(root);

  const form = el('div', 'setup-form');

  const subjectLabel = el('div', 'field-label', '📚 Subject');
  const subjectGroup = el('div', 'card-group');
  subjectGroup.setAttribute('role', 'radiogroup');
  subjectGroup.setAttribute('aria-label', 'Subject');
  const subjectInputs: HTMLInputElement[] = [];
  bank.subjects.forEach((s, i) => {
    const { wrapper, input } = radioChip('subject', s.id, i === 0, 'card-radio', 'card-content', (content) => {
      content.appendChild(el('span', 'card-icon', SUBJECT_ICONS[i % SUBJECT_ICONS.length]));
      content.appendChild(el('span', '', s.book));
    });
    input.addEventListener('change', populateModes);
    subjectGroup.appendChild(wrapper);
    subjectInputs.push(input);
  });

  const modeLabel = el('div', 'field-label', '🎮 Quiz type');
  const modeGroup = el('div', 'segmented');
  modeGroup.setAttribute('role', 'radiogroup');
  modeGroup.setAttribute('aria-label', 'Quiz type');

  const scopeLabel = el('div', 'field-label', '🧭 Scope');
  const scopeShell = el('div', 'select-shell');
  const scopeSelect = el('select');
  scopeShell.append(scopeSelect, el('span', 'select-arrow', '▾'));

  const countLabel = el('div', 'field-label', '🔢 Number of questions');
  const presetRow = el('div', 'preset-row');
  presetRow.setAttribute('role', 'radiogroup');
  presetRow.setAttribute('aria-label', 'Number of questions');

  const progressNote = el('p', 'hint');

  let subject: SubjectBank = getSubject(bank, bank.subjects[0].id);
  let chapters: ChapterQuestions[] = [];
  let counts = new Map<ScopeKey, number>();
  let count = 10;

  function currentSubjectId(): string {
    return subjectInputs.find((i) => i.checked)?.value ?? bank.subjects[0].id;
  }

  function currentMode(): QuizMode {
    const checked = modeGroup.querySelector<HTMLInputElement>('input:checked');
    return (checked?.value as QuizMode | undefined) ?? 'practice';
  }

  function currentScope(): ScopeKey {
    return scopeSelect.value || MIXED_SCOPE;
  }

  function clampCount(n: number, available: number): number {
    if (!Number.isFinite(n)) return 1;
    return Math.max(1, Math.min(Math.round(n), Math.max(1, available)));
  }

  function syncPresetActive(): void {
    presetRow.querySelectorAll<HTMLButtonElement>('.preset-chip').forEach((chip) => {
      const active = Number(chip.dataset.value) === count;
      chip.classList.toggle('active', active);
      chip.setAttribute('aria-pressed', String(active));
    });
  }

  function renderPresets(available: number): void {
    presetRow.replaceChildren();
    count = clampCount(count, available);
    const values = [...new Set([...COUNT_PRESETS.filter((p) => p < available), available])];
    for (const n of values) {
      const chip = el('button', 'preset-chip', n === available ? `All (${n})` : String(n));
      chip.type = 'button';
      chip.dataset.value = String(n);
      chip.addEventListener('click', () => {
        count = clampCount(n, available);
        syncPresetActive();
      });
      presetRow.appendChild(chip);
    }
    syncPresetActive();
  }

  function populateModes(): void {
    subject = getSubject(bank, currentSubjectId());
    setTopic(subject.book);
    const available = MODES.filter((m) => chaptersForMode(subject, m.value).length > 0);
    modeGroup.replaceChildren();
    available.forEach((m, i) => {
      const { wrapper, input } = radioChip('mode', m.value, i === 0, 'segmented-option', 'segmented-content', (content) => {
        content.append(`${m.icon} ${m.label}`);
      });
      input.addEventListener('change', populateScopes);
      modeGroup.appendChild(wrapper);
    });
    populateScopes();
  }

  function populateScopes(): void {
    const mode = currentMode();
    chapters = chaptersForMode(subject, mode);
    const total = chapters.reduce((n, c) => n + c.questions.length, 0);
    counts = new Map<ScopeKey, number>([[MIXED_SCOPE, total]]);
    for (const c of chapters) counts.set(c.id, c.questions.length);

    scopeSelect.replaceChildren();
    const mixedOpt = el('option', '', `🔀 Mixed — all scopes (${total} questions)`);
    mixedOpt.value = MIXED_SCOPE;
    scopeSelect.appendChild(mixedOpt);
    for (const c of chapters) {
      const opt = el('option', '', `${chapterLabel(c)} (${c.questions.length} questions)`);
      opt.value = c.id;
      scopeSelect.appendChild(opt);
    }
    applyScope();
  }

  function applyScope(): void {
    const mode = currentMode();
    const scope = currentScope();
    const available = counts.get(scope) ?? 0;
    renderPresets(available);

    const progress = getScopeProgress(subject.id, mode, scope);
    progressNote.textContent =
      progress.attempts === 0
        ? `✨ No attempts yet for this scope — ${available} questions available.`
        : `📈 Best score: ${progress.best}% over ${progress.attempts} attempt${progress.attempts === 1 ? '' : 's'} · ${available} questions available.`;
  }

  scopeSelect.addEventListener('change', applyScope);

  const subjectField = el('div', 'field');
  subjectField.append(subjectLabel, subjectGroup);
  const modeField = el('div', 'field');
  modeField.append(modeLabel, modeGroup);
  const scopeField = el('div', 'field');
  scopeField.append(scopeLabel, scopeShell);
  const countField = el('div', 'field');
  countField.append(countLabel, presetRow);
  form.append(subjectField, modeField, scopeField, countField, progressNote);

  const startBtn = el('button', 'btn btn-primary btn-block', 'Start quiz');
  startBtn.addEventListener('click', () => {
    onStart(currentSubjectId(), currentMode(), currentScope(), count);
  });
  form.appendChild(startBtn);

  root.appendChild(form);
  populateModes();
}
