const container = document.getElementById('quizContainer');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const resetBtn = document.getElementById('resetBtn');
const categoryBtns = document.querySelectorAll('.category-btn');

let revealedSet = new Set();

// ── Render ──

function renderQuizzes() {
  container.innerHTML = quizzes.map(buildCard).join('');
  bindEvents();
  updateProgress();
}

function buildCard(quiz) {
  const isRevealed = revealedSet.has(quiz.id);
  const revealedClass = isRevealed ? ' revealed' : '';
  const isExecutable = quiz.executable !== false;

  const codeHtml = renderCode(quiz, isRevealed);

  const runBtnHtml = isExecutable && !isRevealed
    ? `<button class="run-btn" data-id="${quiz.id}">실행하기</button>`
    : '';

  const revealBtnLabel = isRevealed ? '정답 확인 완료' : '정답 보기';
  const revealBtnClass = isRevealed ? ' revealed' : '';
  const retryBtnHtml = isRevealed
    ? `<button class="retry-btn" data-id="${quiz.id}">다시 풀기</button>`
    : '';

  const explanationHtml = isRevealed
    ? `<div class="explanation show">
        <h4>${quiz.explanation.title}</h4>
        <ul>${quiz.explanation.points.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>`
    : '';

  return `
    <div class="quiz-card${revealedClass}" data-id="${quiz.id}">
      <span class="quiz-number">${quiz.categoryLabel} #${quiz.id}</span>
      <p class="quiz-question">${quiz.question}</p>
      <div class="code-block"><code>${codeHtml}</code></div>
      <div class="console-output" id="console-${quiz.id}"></div>
      <div class="btn-group">
        ${runBtnHtml}
        <button class="reveal-btn${revealBtnClass}" data-id="${quiz.id}">${revealBtnLabel}</button>
        ${retryBtnHtml}
      </div>
      ${explanationHtml}
    </div>`;
}

function renderCode(quiz, isRevealed) {
  let blankIdx = 0;
  // 한 퀴즈 안의 모든 빈칸은 동일한 너비로 (답 길이로 힌트 주지 않기)
  const maxAnswerLen = Math.max(...quiz.blanks.map(a => a.length));
  const uniformWidth = Math.max(maxAnswerLen * 0.75 + 1.5, 3);
  return escapeHtml(quiz.code).replace(/&lt;blank&gt;/g, () => {
    const answer = quiz.blanks[blankIdx];
    const idx = blankIdx++;
    if (isRevealed) {
      return `<span class="blank-filled">${escapeHtml(answer)}</span>`;
    }
    return `<input type="text" class="blank-input" data-quiz="${quiz.id}" data-idx="${idx}" placeholder="?" autocomplete="off" spellcheck="false" style="width:${uniformWidth}em">`;
  });
}

// ── Events ──

function bindEvents() {
  document.querySelectorAll('.run-btn').forEach(btn => {
    btn.addEventListener('click', () => runQuiz(Number(btn.dataset.id)));
  });

  document.querySelectorAll('.reveal-btn:not(.revealed)').forEach(btn => {
    btn.addEventListener('click', () => revealQuiz(Number(btn.dataset.id)));
  });

  document.querySelectorAll('.retry-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const quizId = Number(btn.dataset.id);
      revealedSet.delete(quizId);
      renderQuizzes();
    });
  });

  document.querySelectorAll('.blank-input').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        runQuiz(Number(input.dataset.quiz));
      }
    });
  });
}

// ── Run Code ──

async function runQuiz(quizId) {
  const quiz = quizzes.find(q => q.id === quizId);
  if (!quiz) return;

  const inputs = document.querySelectorAll(`input[data-quiz="${quizId}"]`);
  const values = Array.from(inputs).map(inp => inp.value.trim());

  // 빈칸 체크
  if (values.some(v => v === '')) {
    showConsole(quizId, '빈칸을 모두 채워주세요!', 'warn');
    return;
  }

  // 정답 체크 표시
  let allCorrect = true;
  inputs.forEach((inp, i) => {
    const correct = values[i] === quiz.blanks[i];
    inp.classList.remove('correct', 'incorrect');
    inp.classList.add(correct ? 'correct' : 'incorrect');
    if (!correct) allCorrect = false;
  });

  // 실행 불가능한 퀴즈(비교용): 정답 체크만
  if (quiz.executable === false) {
    if (allCorrect) {
      showConsole(quizId, '✓ 정답입니다!', 'success');
      setTimeout(() => revealQuiz(quizId, true), 800);
    } else {
      showConsole(quizId, '틀린 빈칸이 있어요. 다시 확인해보세요.', 'error');
    }
    return;
  }

  // 코드 실행 — 빈칸은 주석 안에 있어서 실행에 영향 없음
  const assembled = quiz.code.replace(/<blank>/g, '_');
  showConsole(quizId, '실행 중...', 'warn');
  const result = await executeCode(assembled);

  if (result.success) {
    const prefix = allCorrect ? '✓ 정답!\n\n실제 출력:\n' : '실제 출력:\n';
    showConsole(quizId, prefix + (result.output || '(출력 없음)'), allCorrect ? 'success' : 'error');
  } else {
    showConsole(quizId, result.output, 'error');
  }

  // 전부 정답이면 reveal 모드로 전환
  if (allCorrect) {
    setTimeout(() => revealQuiz(quizId, true), 800);
  }
}

async function executeCode(code) {
  const logs = [];
  const mockConsole = {
    log: (...args) => logs.push(args.map(formatVal).join(' ')),
    dir: (...args) => logs.push(args.map(formatVal).join(' ')),
    warn: (...args) => logs.push(args.map(formatVal).join(' ')),
    error: (...args) => logs.push(args.map(formatVal).join(' ')),
  };

  // 퀴즈 코드의 setTimeout을 세어서, 예약된 타이머가 모두 끝날 때까지 기다린다
  let pendingTimers = 0;
  let notifyDone;
  const allDone = new Promise(resolve => { notifyDone = resolve; });

  // 0ms 타이머로 확인해서, 그사이 마이크로태스크가 새로 예약한 타이머도 놓치지 않는다
  const checkDone = () => {
    setTimeout(() => {
      if (pendingTimers === 0) notifyDone();
    }, 0);
  };

  const trackedSetTimeout = (callback, delay, ...args) => {
    pendingTimers++;
    return setTimeout(() => {
      try {
        callback(...args);
      } finally {
        pendingTimers--;
        checkDone();
      }
    }, delay);
  };

  try {
    const fn = new Function('console', 'setTimeout', code);
    fn(mockConsole, trackedSetTimeout);
    checkDone();
    // 타이머가 끝나지 않는 코드라도 5초 뒤에는 결과를 보여준다
    await Promise.race([allDone, new Promise(resolve => setTimeout(resolve, 5000))]);
    return { success: true, output: logs.join('\n') };
  } catch (err) {
    return { success: false, output: `${err.name}: ${err.message}` };
  }
}

function formatVal(val) {
  if (val === undefined) return 'undefined';
  if (val === null) return 'null';
  if (typeof val === 'boolean') return String(val);
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') return val;
  try {
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
}

// ── Reveal ──

async function revealQuiz(quizId, skipRun = false) {
  revealedSet.add(quizId);

  const quiz = quizzes.find(q => q.id === quizId);
  if (!quiz) return;

  renderQuizzes();

  if (skipRun) return;

  // 정답 그대로 두고 코드 실행 (빈칸은 주석 안이라 실행엔 영향 없음)
  const assembled = quiz.code.replace(/<blank>/g, '_');
  const result = await executeCode(assembled);
  if (result.success && result.output) {
    showConsole(quizId, '실제 출력:\n' + result.output, 'success');
  }
}

// ── Console Output ──

function showConsole(quizId, text, type) {
  const el = document.getElementById(`console-${quizId}`);
  if (!el) return;

  el.className = `console-output show ${type}`;
  el.textContent = text.split('\n').map(line => line ? '> ' + line : '').join('\n');
}

// ── Progress ──

function updateProgress() {
  const total = quizzes.length;
  const done = revealedSet.size;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  progressFill.style.width = `${pct}%`;
  progressText.textContent = `${done} / ${total} 완료`;
}

// ── Utils ──

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ── Category Scroll ──

categoryBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;

    if (category === 'all') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const firstQuiz = quizzes.find(q => q.category === category);
    if (!firstQuiz) return;

    const card = document.querySelector(`.quiz-card[data-id="${firstQuiz.id}"]`);
    if (!card) return;

    const offset = 80;
    const top = card.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Scroll-to-Top ──

const scrollTopBtn = document.getElementById('scrollTopBtn');

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('show', window.scrollY > 300);
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Reset ──

resetBtn.addEventListener('click', () => {
  if (revealedSet.size === 0) return;
  revealedSet.clear();
  renderQuizzes();
});

// ── Init ──

renderQuizzes();
