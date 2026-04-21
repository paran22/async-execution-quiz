const quizzes = [
  // ─── 워밍업 (setTimeout) ───
  {
    id: 1,
    category: 'warmup',
    categoryLabel: '워밍업',
    question: 'setTimeout의 0ms는 정말 "0초 후"일까요? 출력 순서를 예측해보세요.',
    code:
`console.log('1');
setTimeout(() => console.log('2'), 0);
console.log('3');

// 예상 출력 순서
// 1번째: <blank>
// 2번째: <blank>
// 3번째: <blank>`,
    blanks: ['1', '3', '2'],
    explanation: {
      title: 'setTimeout(0)은 "지금"이 아니다',
      points: [
        '<code>setTimeout(fn, 0)</code>은 "0ms 후"가 아니라 <strong>"현재 동기 코드가 전부 끝난 뒤"</strong>에 실행',
        '동기 코드 <code>1</code>, <code>3</code>은 바로 순서대로 실행',
        '<code>setTimeout</code> 콜백은 대기줄에 들어갔다가 동기 코드가 끝나면 실행',
        '<strong>결과: 1 → 3 → 2</strong>',
      ],
    },
  },
  {
    id: 2,
    category: 'warmup',
    categoryLabel: '워밍업',
    question: 'setTimeout이 여러 개면? 긴 지연이 먼저 등록되어도 짧은 게 먼저 실행돼요.',
    code:
`console.log('1');

setTimeout(() => console.log('2'), 1000);
setTimeout(() => console.log('3'), 0);

console.log('4');

// 예상 출력 순서
// 1번째: <blank>
// 2번째: <blank>
// 3번째: <blank>
// 4번째: <blank>`,
    blanks: ['1', '4', '3', '2'],
    explanation: {
      title: '지연 시간은 "최소 대기"일 뿐',
      points: [
        '동기 코드 <code>1</code>, <code>4</code> 먼저 실행',
        '지연 시간이 짧은 <code>setTimeout(..., 0)</code> 콜백이 먼저 실행 → <code>3</code>',
        '그 다음 1초 뒤 <code>2</code> 실행',
        '<code>setTimeout</code>의 숫자는 "정확히 그 시간 뒤"가 아니라 <strong>"최소 그만큼은 기다린 뒤"</strong>라는 의미',
        '<strong>결과: 1 → 4 → 3 → 2</strong>',
      ],
    },
  },

  // ─── Promise ───
  {
    id: 3,
    category: 'promise',
    categoryLabel: 'Promise',
    question: 'Promise의 .then은 언제 실행될까요?',
    code:
`console.log('1');
Promise.resolve().then(() => console.log('2'));
console.log('3');

// 예상 출력 순서
// 1번째: <blank>
// 2번째: <blank>
// 3번째: <blank>`,
    blanks: ['1', '3', '2'],
    explanation: {
      title: 'Promise.then도 "나중에" 실행된다',
      points: [
        '<code>.then</code>에 넘긴 콜백은 <strong>동기 코드가 전부 끝난 뒤</strong>에 실행',
        '동기 코드 <code>1</code>, <code>3</code> 먼저',
        '그 다음 Promise 대기줄에 있던 <code>2</code> 실행',
        '<strong>결과: 1 → 3 → 2</strong>',
      ],
    },
  },
  {
    id: 4,
    category: 'promise',
    categoryLabel: 'Promise',
    question: '.then을 여러 번 체이닝하면 어떻게 될까요?',
    code:
`console.log('1');

Promise.resolve()
  .then(() => console.log('2'))
  .then(() => console.log('3'));

console.log('4');

// 예상 출력 순서
// 1번째: <blank>
// 2번째: <blank>
// 3번째: <blank>
// 4번째: <blank>`,
    blanks: ['1', '4', '2', '3'],
    explanation: {
      title: '.then 체이닝은 앞에서부터 차례로',
      points: [
        '동기 코드 먼저: <code>1</code>, <code>4</code>',
        '동기가 끝나면 첫 번째 <code>.then</code> 실행 → <code>2</code>',
        '첫 <code>.then</code>이 끝나야 두 번째 <code>.then</code>이 실행됨 → <code>3</code>',
        '<strong>결과: 1 → 4 → 2 → 3</strong>',
      ],
    },
  },
  {
    id: 5,
    category: 'promise',
    categoryLabel: 'Promise',
    question: '.then 콜백에서 return한 값은 다음 .then으로 전달돼요.',
    code:
`console.log('1');

Promise.resolve(10)
  .then(n => n + 5)
  .then(n => n * 2)
  .then(n => console.log(n));

console.log('2');

// 예상 출력 순서
// 1번째: <blank>
// 2번째: <blank>
// 3번째: <blank>`,
    blanks: ['1', '2', '30'],
    explanation: {
      title: '.then은 값을 릴레이하듯 전달한다',
      points: [
        '<code>Promise.resolve(10)</code> → 첫 <code>.then</code>에 <code>10</code>이 전달됨',
        '첫 <code>.then</code>이 <code>10 + 5 = 15</code>를 <strong>return</strong> → 다음 <code>.then</code>에 전달',
        '둘째 <code>.then</code>이 <code>15 * 2 = 30</code>을 return → 마지막 <code>.then</code>에 전달',
        '동기 코드(<code>1</code>, <code>2</code>)가 먼저 실행되고 나서 비동기로 <code>30</code> 출력',
        '<strong>결과: 1 → 2 → 30</strong>',
        '실무에선 <code>fetch</code> → <code>.then(res => res.json())</code> → <code>.then(data => ...)</code>처럼 데이터를 다음 단계로 넘길 때 자주 써요',
      ],
    },
  },
  {
    id: 6,
    category: 'promise',
    categoryLabel: 'Promise',
    question: 'Promise가 실패(reject)하면 어떻게 될까요? .then과 .catch 중 누가 실행될까요?',
    code:
`console.log('1');

Promise.reject('에러 발생')
  .then(() => console.log('2'))
  .catch(() => console.log('3'));

console.log('4');

// 예상 출력 순서
// 1번째: <blank>
// 2번째: <blank>
// 3번째: <blank>`,
    blanks: ['1', '4', '3'],
    explanation: {
      title: 'reject되면 .then은 건너뛰고 .catch로',
      points: [
        '<code>Promise.reject(...)</code>는 "실패한 Promise"를 만든다',
        '실패한 Promise는 <code>.then</code>을 <strong>전부 건너뛰고</strong> 가장 가까운 <code>.catch</code>로 간다',
        '그래서 <code>2</code>는 찍히지 않고, <code>3</code>만 찍힘',
        '<code>.catch</code>도 비동기라서 동기 코드(<code>1</code>, <code>4</code>)가 먼저 실행',
        '<strong>결과: 1 → 4 → 3</strong>',
        '실무에선 <code>fetch()</code>가 네트워크 오류로 실패했을 때 <code>.catch</code>에서 에러 화면을 보여주는 식으로 자주 씁니다.',
      ],
    },
  },
  {
    id: 7,
    category: 'promise',
    categoryLabel: 'Promise',
    question: '.finally는 성공/실패 상관없이 항상 실행돼요.',
    code:
`console.log('1');

Promise.resolve()
  .then(() => console.log('2'))
  .catch(() => console.log('3'))
  .finally(() => console.log('4'));

console.log('5');

// 예상 출력 순서
// 1번째: <blank>
// 2번째: <blank>
// 3번째: <blank>
// 4번째: <blank>`,
    blanks: ['1', '5', '2', '4'],
    explanation: {
      title: '.finally는 "마무리" 전용 메서드',
      points: [
        'Promise가 <strong>성공</strong>했으므로 <code>.then</code> → <code>2</code>',
        '<code>.catch</code>는 건너뜀 (실패했을 때만 실행)',
        '<code>.finally</code>는 성공이든 실패든 <strong>항상 실행</strong> → <code>4</code>',
        '<strong>결과: 1 → 5 → 2 → 4</strong>',
        '만약 첫 Promise가 실패했다면? → <code>.then</code> 건너뛰고 <code>.catch</code> → <code>3</code>, 그 다음 <code>.finally</code> → <code>4</code>',
        '실무에선 로딩 스피너 숨기기, 모달 닫기처럼 <strong>성공/실패와 무관한 마무리 작업</strong>에 사용',
      ],
    },
  },
  {
    id: 8,
    category: 'promise',
    categoryLabel: 'Promise',
    question: 'Promise와 setTimeout이 같이 있으면 누가 먼저 실행될까요?',
    code:
`console.log('1');

setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));

console.log('4');

// 예상 출력 순서
// 1번째: <blank>
// 2번째: <blank>
// 3번째: <blank>
// 4번째: <blank>`,
    blanks: ['1', '4', '3', '2'],
    explanation: {
      title: 'Promise가 setTimeout보다 먼저',
      points: [
        '동기 코드 먼저: <code>1</code>, <code>4</code>',
        '동기가 끝나면 <strong>Promise가 setTimeout보다 먼저</strong> 실행 → <code>3</code>',
        '마지막으로 setTimeout → <code>2</code>',
        '<strong>결과: 1 → 4 → 3 → 2</strong>',
        '외우기: <strong>"Promise는 급행줄, setTimeout은 일반줄"</strong>',
        '<code>setTimeout(..., 0)</code>로 "0초"를 줘도 Promise보다 먼저 실행되진 않아요',
        '<br><strong>📚 심화 — 정식 용어로 알고 싶다면?</strong>',
        '&nbsp;&nbsp;• "급행줄"의 정식 이름 = <strong>마이크로태스크 큐 (Microtask Queue)</strong> → <code>Promise.then</code>, <code>await</code> 이후 코드, <code>queueMicrotask</code>',
        '&nbsp;&nbsp;• "일반줄"의 정식 이름 = <strong>매크로태스크 큐 (Macrotask Queue / Task Queue)</strong> → <code>setTimeout</code>, <code>setInterval</code>, DOM 이벤트',
        '&nbsp;&nbsp;• 자바스크립트 엔진의 <strong>이벤트 루프</strong>가 이런 순서로 일을 처리해요:',
        '&nbsp;&nbsp;&nbsp;&nbsp;① 동기 코드(콜 스택) 전부 실행 → ② 마이크로태스크 큐를 <strong>전부</strong> 비움 → ③ 매크로태스크 큐에서 <strong>하나</strong> 꺼내 실행 → 다시 ②로',
        '&nbsp;&nbsp;• 그래서 마이크로태스크가 아무리 많아도 다 처리한 뒤에야 setTimeout 차례가 오는 거예요',
        '&nbsp;&nbsp;• 면접에서 "이벤트 루프 설명해보세요" 물으면 이 내용!',
      ],
    },
  },
  {
    id: 9,
    category: 'promise',
    categoryLabel: 'Promise',
    question: 'Promise.all — 여러 Promise를 동시에 보내고 전부 기다리려면?',
    code:
`function fetchUser() {
  return Promise.resolve('Alice');
}
function fetchPosts() {
  return Promise.resolve(3);
}

console.log('1');

Promise.all([fetchUser(), fetchPosts()])
  .then(([user, posts]) => {
    console.log(user);
    console.log(posts);
  });

console.log('2');

// 예상 출력 순서
// 1번째: <blank>
// 2번째: <blank>
// 3번째: <blank>
// 4번째: <blank>`,
    blanks: ['1', '2', 'Alice', '3'],
    explanation: {
      title: 'Promise.all — 여러 요청을 병렬로',
      points: [
        '<code>Promise.all([p1, p2, ...])</code>은 <strong>모든 Promise가 완료되면</strong> 결과들의 배열을 <code>.then</code>으로 넘김',
        '<code>.then(([user, posts]) => ...)</code>처럼 <strong>배열 구조분해</strong>로 결과를 꺼냄',
        '동기 코드(<code>1</code>, <code>2</code>) 먼저 → 그 다음 비동기로 결과 출력',
        '<strong>결과: 1 → 2 → Alice → 3</strong>',
        '<strong>왜 Promise.all을 쓸까?</strong> → 여러 요청을 <strong>동시에</strong> 보내서 시간을 줄이기 위해',
        '&nbsp;&nbsp;• 순차로 하면: 유저 1초 + 게시글 1초 = 2초',
        '&nbsp;&nbsp;• Promise.all로 하면: 둘 다 동시에 = 1초',
        '하나라도 실패하면 <code>.catch</code>로 감 (실패한 에러만 전달됨, 나머지 성공 결과는 버려짐)',
        'async/await에서도 그대로 써요: <code>const [u, p] = await Promise.all([...])</code> — 다음 async 섹션에서 확인!',
      ],
    },
  },

  // ─── async/await ───
  {
    id: 10,
    category: 'async',
    categoryLabel: 'async/await',
    question: 'async 함수인데 await가 없으면? 일반 함수랑 뭐가 다를까요?',
    code:
`async function greet() {
  console.log('A');
  console.log('B');
}

console.log('1');
greet();
console.log('2');

// 예상 출력 순서
// 1번째: <blank>
// 2번째: <blank>
// 3번째: <blank>
// 4번째: <blank>`,
    blanks: ['1', 'A', 'B', '2'],
    explanation: {
      title: 'async 함수도 기본은 그냥 동기 실행',
      points: [
        '함수 앞에 <code>async</code>를 붙여도 <strong>await가 없으면 일반 함수처럼</strong> 호출 시점에 바로 실행',
        '<code>greet()</code> 호출 → 함수 내부의 <code>A</code>, <code>B</code>가 순서대로 바로 찍힘',
        '그 다음에 <code>console.log(\'2\')</code> 실행',
        '<strong>결과: 1 → A → B → 2</strong>',
        '<code>async</code>는 혼자서는 아무 일도 안 해요 — <code>await</code>와 만나야 "일시정지" 기능이 작동합니다',
      ],
    },
  },
  {
    id: 11,
    category: 'async',
    categoryLabel: 'async/await',
    question: '이제 await를 넣어볼게요. async 함수는 어디까지 실행될까요?',
    code:
`// fetchUser: 유저 정보를 가져오는 비동기 함수 (Promise 반환)
function fetchUser() {
  return Promise.resolve({ name: 'Alice' });
}

async function run() {
  console.log('A');
  await fetchUser();
  console.log('B');
}

console.log('1');
run();
console.log('2');

// 예상 출력 순서
// 1번째: <blank>
// 2번째: <blank>
// 3번째: <blank>
// 4번째: <blank>`,
    blanks: ['1', 'A', '2', 'B'],
    explanation: {
      title: 'await 전까지는 동기, await 만나면 일시정지',
      points: [
        '<code>run()</code> 호출 → <code>A</code>까지는 동기처럼 실행',
        '<code>await fetchUser()</code>를 만나는 순간 <strong>함수가 일시정지</strong>',
        '정지된 함수의 <strong>나머지 부분(<code>B</code>)은 대기줄</strong>로 밀린다',
        '그래서 <code>2</code>가 먼저 실행, <code>B</code>는 동기 코드가 전부 끝난 뒤',
        '<strong>결과: 1 → A → 2 → B</strong>',
        '<strong>🤔 await와 Promise 관계가 헷갈린다면?</strong>',
        '&nbsp;&nbsp;• <code>Promise</code> = "나중에 도착할 값"을 나타내는 <strong>객체</strong>',
        '&nbsp;&nbsp;• <code>await</code> = 그 Promise가 완료될 때까지 <strong>기다리는 문법</strong>',
        '&nbsp;&nbsp;• 그래서 <code>await</code> 뒤에는 Promise를 반환하는 함수가 와요 (여기선 <code>fetchUser</code>)',
        '&nbsp;&nbsp;• 실무에선 <code>fetchUser</code> 자리에 진짜 <code>fetch(\'/api/users\')</code>나 <code>axios.get(...)</code>이 들어갑니다',
      ],
    },
  },
  {
    id: 12,
    category: 'async',
    categoryLabel: 'async/await',
    question: 'await가 여러 개 있으면 어떻게 될까요?',
    code:
`function fetchUser() {
  return Promise.resolve({ name: 'Alice' });
}

async function run() {
  console.log('A');
  await fetchUser();
  console.log('B');
  await fetchUser();
  console.log('C');
}

console.log('1');
run();
console.log('2');

// 예상 출력 순서
// 1번째: <blank>
// 2번째: <blank>
// 3번째: <blank>
// 4번째: <blank>
// 5번째: <blank>`,
    blanks: ['1', 'A', '2', 'B', 'C'],
    explanation: {
      title: 'await마다 일시정지한다',
      points: [
        '<code>A</code>까지 동기처럼 실행 → 첫 <code>await</code>에서 일시정지',
        '나머지(<code>B</code> 이후)는 대기줄로 밀림 → 동기 코드 <code>2</code> 먼저 실행',
        '대기줄에서 <code>B</code> 실행 → 다음 <code>await</code>에서 또 일시정지',
        '나머지(<code>C</code>)가 대기줄로 → 실행',
        '<strong>결과: 1 → A → 2 → B → C</strong>',
        '실무에선 각 <code>await</code> 자리에 API 호출, 파일 읽기 등 서로 다른 비동기 작업이 순차적으로 들어갑니다.',
        '<strong>⚠️ 하지만 이건 "순차" 실행 — 느려요!</strong> 두 요청이 서로 의존하지 않는다면 다음 문제처럼 병렬로 보내는 게 좋아요',
      ],
    },
  },
  {
    id: 13,
    category: 'async',
    categoryLabel: 'async/await',
    question: '앞 문제를 Promise.all로 바꿔서 병렬로 처리해볼게요.',
    code:
`function fetchUser() {
  return Promise.resolve('Alice');
}
function fetchPosts() {
  return Promise.resolve(3);
}

async function run() {
  console.log('A');
  const [user, posts] = await Promise.all([fetchUser(), fetchPosts()]);
  console.log(user);
  console.log(posts);
}

run();
console.log('1');

// 예상 출력 순서
// 1번째: <blank>
// 2번째: <blank>
// 3번째: <blank>
// 4번째: <blank>`,
    blanks: ['A', '1', 'Alice', '3'],
    explanation: {
      title: 'await + Promise.all — async/await에서도 병렬 처리',
      points: [
        '<code>A</code> 찍힘 → <code>await Promise.all([...])</code>에서 일시정지 → 동기 코드 <code>1</code> 먼저',
        '두 Promise가 모두 완료되면 결과 배열을 <strong>구조분해</strong>로 받음',
        '<code>Alice</code> → <code>3</code> 순서로 출력',
        '<strong>결과: A → 1 → Alice → 3</strong>',
        '<strong>🎯 핵심: async/await 쓰더라도 Promise.all은 계속 씀!</strong>',
        '<strong>순차 vs 병렬 비교 (앞 문제와의 차이)</strong>',
        '&nbsp;&nbsp;• 순차: <code>await fetchUser(); await fetchPosts();</code> → 하나 끝나야 다음 시작 → 느림',
        '&nbsp;&nbsp;• 병렬: <code>await Promise.all([fetchUser(), fetchPosts()])</code> → <strong>둘 다 동시에 시작</strong> → 빠름',
        '실무 팁: 서로 의존하지 않는 요청은 Promise.all로 묶어서 총 대기 시간 절반으로!',
      ],
    },
  },
  {
    id: 14,
    category: 'async',
    categoryLabel: 'async/await',
    question: 'async 함수의 리턴값은 어떻게 꺼낼까요?',
    code:
`async function getNumber() {
  console.log('A');
  return 42;
}

getNumber().then(n => console.log(n));
console.log('1');

// 예상 출력 순서
// 1번째: <blank>
// 2번째: <blank>
// 3번째: <blank>`,
    blanks: ['A', '1', '42'],
    explanation: {
      title: 'async 함수는 항상 Promise를 반환한다',
      points: [
        'async 함수 안에서 <code>return 42</code>를 해도 <strong>그냥 42가 나오는 게 아니라 Promise로 감싸져서 반환</strong>됨',
        '<code>getNumber()</code> 호출 → 함수 내부가 실행되면서 <code>A</code>가 찍힘 → <code>Promise.resolve(42)</code> 반환',
        '그래서 <code>.then(n => ...)</code>으로 값을 꺼낼 수 있음',
        '<code>.then</code>은 비동기라서 동기 코드 <code>1</code>이 먼저 찍힘',
        '<strong>결과: A → 1 → 42</strong>',
      ],
    },
  },
  {
    id: 15,
    category: 'async',
    categoryLabel: 'async/await',
    question: '같은 예제를 .then 말고 await로 꺼내면 어떻게 될까요?',
    code:
`async function getNumber() {
  console.log('A');
  return 42;
}

async function run() {
  const n = await getNumber();
  console.log(n);
}

run();
console.log('1');

// 예상 출력 순서
// 1번째: <blank>
// 2번째: <blank>
// 3번째: <blank>`,
    blanks: ['A', '1', '42'],
    explanation: {
      title: 'await로도 값을 꺼낼 수 있다 (결과는 앞 문제와 동일!)',
      points: [
        '<strong>앞 문제와 완전히 같은 결과</strong>: <code>A → 1 → 42</code>. 값을 꺼내는 방법만 다를 뿐',
        '<code>run()</code> 호출 → 함수 내부의 <code>getNumber()</code> 실행 → <code>A</code> 찍힘',
        '<code>await</code>가 Promise를 <strong>풀어서</strong> 실제 값(<code>42</code>)을 <code>n</code>에 넣어줌',
        '하지만 await는 일시정지하므로 <code>console.log(n)</code>은 대기줄로 → 동기 코드 <code>1</code> 먼저',
        '대기줄에서 꺼내져 <code>42</code> 출력',
        '<strong>두 방법 비교</strong>',
        '&nbsp;&nbsp;• <code>getNumber().then(n => console.log(n))</code> — 콜백 안에서 사용',
        '&nbsp;&nbsp;• <code>const n = await getNumber()</code> — 변수에 바로 담아 사용',
        '단, <code>await</code>는 <strong>async 함수 안에서만</strong> 쓸 수 있어요 (그래서 <code>run</code>으로 감쌌죠)',
      ],
    },
  },
  {
    id: 16,
    category: 'compare',
    categoryLabel: '비교',
    question: '에러 처리를 두 가지 문법으로 써봅시다. 빈칸에 알맞은 키워드를 넣어보세요.',
    executable: false,
    code:
`// 방법 1 — Promise의 .then / .catch 문법 (이미 아는 방법!)
function fetchWithThen() {
  fetchUser()
    .then((user) => console.log('성공:', user))
    .catch((err) => console.log('실패:', err));
}

// 방법 2 — async / await 문법 (위 코드와 완전히 같은 동작)
async function fetchWithAsync() {
  <blank> {
    const user = <blank> fetchUser();
    console.log('성공:', user);
  } <blank> (err) {
    console.log('실패:', err);
  }
}`,
    blanks: ['try', 'await', 'catch'],
    explanation: {
      title: '.then / .catch ↔ async / await + try / catch',
      points: [
        '<strong>두 코드는 완전히 같은 일을 합니다.</strong> 문법만 다를 뿐',
        '<code>.then(콜백)</code> → <code>const 값 = await 함수()</code>로 <strong>변수에 바로 담을 수 있어서</strong> 코드가 평평해진다',
        '<code>.catch(콜백)</code> → <code>try { ... } catch { ... }</code>로 <strong>동기 코드처럼</strong> 에러 처리',
        '<strong>어떤 걸 써야 할까?</strong> 최근엔 async/await가 대세예요. 읽기 쉽고 디버깅도 편함',
        '다만 <strong>여러 요청을 동시에 보낼 땐</strong> <code>Promise.all([...])</code>처럼 Promise 문법이 필요합니다',
        '두 문법을 섞어 써도 괜찮아요: <code>const users = await fetchAll().catch(err => [])</code> 같은 식',
        '다음 문제에서 실제 실행 순서를 예측해볼게요!',
      ],
    },
  },
  {
    id: 17,
    category: 'async',
    categoryLabel: 'async/await',
    question: '이제 try/catch의 실행 순서를 예측해봅시다.',
    code:
`// 네트워크가 불안정해서 fetchUser가 실패하는 상황
function fetchUser() {
  return Promise.reject('네트워크 오류');
}

async function run() {
  try {
    console.log('A');
    await fetchUser();
    console.log('B');
  } catch {
    console.log('C');
  }
}

console.log('1');
run();
console.log('2');

// 예상 출력 순서
// 1번째: <blank>
// 2번째: <blank>
// 3번째: <blank>
// 4번째: <blank>`,
    blanks: ['1', 'A', '2', 'C'],
    explanation: {
      title: 'await가 실패하면 catch 블록으로',
      points: [
        '<code>A</code>까지 동기처럼 실행 → <code>await fetchUser()</code>에서 일시정지',
        '동기 코드 <code>2</code> 먼저 실행',
        'fetchUser가 실패(reject)했으므로 <code>B</code>는 <strong>건너뛰고</strong> <code>catch</code> 블록으로 → <code>C</code>',
        '<strong>결과: 1 → A → 2 → C</strong>',
        'Promise의 <code>.catch</code>와 <strong>같은 역할</strong>이에요 (앞 문제에서 본 것처럼). async 함수에선 try/catch 문법으로 쓸 뿐',
        '실무에선 <code>await fetch(...)</code>가 네트워크 오류로 실패했을 때 try/catch로 잡아서 에러 메시지를 보여줍니다.',
      ],
    },
  },
];
