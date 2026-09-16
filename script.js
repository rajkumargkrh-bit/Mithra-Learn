/* ============================================================
   SolluEnglish — onboarding + home flow
   All state is kept in localStorage under STORAGE_KEY so the
   app remembers the person across visits (fully client-side,
   no backend — works as-is on GitHub Pages).
   ============================================================ */

const STORAGE_KEY = 'solluenglish_profile';

const stage = document.getElementById('stage');
const progressFill = document.getElementById('progressFill');
const topbar = document.getElementById('topbar');
const backBtn = document.getElementById('backBtn');

// Onboarding steps, in order. Each has a render function below.
const ONBOARDING_STEPS = ['welcome', 'value1', 'value2', 'q_partner', 'q_level', 'q_goal', 'ready'];

let state = {
  stepIndex: 0,
  screen: 'welcome',
  answers: { partner: null, level: null, goal: null },
};

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Could not read saved profile', e);
    return null;
  }
}

function saveProfile(profile) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Could not save profile', e);
  }
}

function clearProfile() {
  localStorage.removeItem(STORAGE_KEY);
}

/* ---------- navigation helpers ---------- */

function goToStep(index) {
  state.stepIndex = index;
  state.screen = ONBOARDING_STEPS[index];
  render();
}

function nextStep() {
  if (state.stepIndex < ONBOARDING_STEPS.length - 1) {
    goToStep(state.stepIndex + 1);
  } else {
    finishOnboarding();
  }
}

function prevStep() {
  if (state.screen === 'chat') {
    state.screen = 'home';
    render();
    return;
  }
  if (state.stepIndex > 0) {
    goToStep(state.stepIndex - 1);
  }
}

function finishOnboarding() {
  const profile = {
    partner: state.answers.partner,
    level: state.answers.level,
    goal: state.answers.goal,
    streak: 1,
    joinedAt: new Date().toISOString(),
  };
  saveProfile(profile);
  state.screen = 'home';
  render();
}

backBtn.addEventListener('click', prevStep);

/* ---------- element builder ---------- */

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'html') node.innerHTML = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  }
  (Array.isArray(children) ? children : [children]).forEach((c) => {
    if (c == null) return;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  });
  return node;
}

function companion({ big = false, emoji = '🙂', spark = '✨' } = {}) {
  return el('div', { class: big ? 'companion companion-lg' : 'companion' }, [
    emoji,
    el('div', { class: 'spark' }, spark),
  ]);
}

/* ---------- screen renderers ---------- */

function screenWelcome() {
  const wrap = el('div', { class: 'screen center-col' });
  wrap.append(
    companion({ big: true, emoji: '👋' }),
    el('h1', { class: 'voice-line' }, 'Hi, naan Zia!'),
    el('p', { class: 'sub-line' }, 'Unga AI Spoken English Friend. Naama sernthu, dhinamum konjam nerama English pesi practice pannalam.'),
  );
  const cta = el('button', { class: 'btn-primary', onclick: nextStep }, 'Hello Zia! 👋');
  wrap.append(el('div', { class: 'spacer' }), cta);
  return wrap;
}

function screenValue1() {
  const wrap = el('div', { class: 'screen center-col' });
  wrap.append(
    companion({ big: true, emoji: '🎙️' }),
    el('h1', { class: 'voice-line' }, 'Pesuradhu thaan best way'),
    el('p', { class: 'sub-line' }, 'Grammar rules mattum padichu English varaadhu — regular ah pesradhu thaan fluency kondu varum.'),
  );
  wrap.append(el('div', { class: 'spacer' }), el('button', { class: 'btn-primary', onclick: nextStep }, 'Go ahead'));
  return wrap;
}

function screenValue2() {
  const wrap = el('div', { class: 'screen center-col' });
  wrap.append(
    companion({ big: true, emoji: '📈' }),
    el('h1', { class: 'voice-line' }, 'Dhinamum konjam neram pesunga'),
    el('p', { class: 'sub-line' }, 'Naanum ungalukku daily practice partner ah irundhu, unga fluency vera level ku kondu poven.'),
  );
  wrap.append(el('div', { class: 'spacer' }), el('button', { class: 'btn-primary', onclick: nextStep }, 'Sollu Zia'));
  return wrap;
}

function screenQPartner() {
  const wrap = el('div', { class: 'screen' });
  wrap.append(
    companion({ emoji: '🤔' }),
    el('h1', { class: 'voice-line' }, 'Unga kitta English la pesa yaaravadhu irukkangala?'),
  );

  const opts = el('div', { class: 'options' });
  const choices = [
    { key: 'yes', icon: '✅', label: 'Yes' },
    { key: 'no', icon: '🚫', label: 'No' },
  ];
  choices.forEach((c) => {
    const btn = el('button', {
      class: 'option' + (state.answers.partner === c.key ? ' selected' : ''),
      onclick: () => { state.answers.partner = c.key; render(); },
    }, [el('span', { class: 'icon' }, c.icon), el('span', {}, c.label)]);
    opts.append(btn);
  });
  wrap.append(opts, el('div', { class: 'spacer' }));

  const cta = el('button', {
    class: 'btn-primary',
    onclick: nextStep,
  }, 'Next');
  cta.disabled = !state.answers.partner;
  wrap.append(cta);
  return wrap;
}

function screenQLevel() {
  const wrap = el('div', { class: 'screen' });
  wrap.append(
    companion({ emoji: '🌱' }),
    el('h1', { class: 'voice-line' }, 'Unga English level enna?'),
  );

  const opts = el('div', { class: 'options' });
  const choices = [
    { key: 'beginner', icon: '🌱', label: 'Words mattum puriyum' },
    { key: 'basic', icon: '🌿', label: 'Konjam-konjam English pesuven' },
    { key: 'intermediate', icon: '🪴', label: 'Pesiduven, aana grammar thappa irukum' },
    { key: 'advanced', icon: '🌸', label: 'Pesuven, aana English perfect-ah illa' },
  ];
  choices.forEach((c) => {
    const btn = el('button', {
      class: 'option' + (state.answers.level === c.key ? ' selected' : ''),
      onclick: () => { state.answers.level = c.key; render(); },
    }, [el('span', { class: 'icon' }, c.icon), el('span', {}, c.label)]);
    opts.append(btn);
  });
  wrap.append(opts, el('div', { class: 'spacer' }));

  const cta = el('button', { class: 'btn-primary', onclick: nextStep }, 'Continue');
  cta.disabled = !state.answers.level;
  wrap.append(cta);
  return wrap;
}

function screenQGoal() {
  const wrap = el('div', { class: 'screen' });
  wrap.append(
    companion({ emoji: '🎯' }),
    el('h1', { class: 'voice-line' }, 'English kathukolla ungal goal enna?'),
  );

  const opts = el('div', { class: 'options' });
  const choices = [
    { key: 'career', icon: '💼', label: 'Career/Business' },
    { key: 'studies', icon: '🎓', label: 'For Studies' },
    { key: 'confidence', icon: '💪', label: 'To build confidence' },
    { key: 'fun', icon: '🎉', label: 'Just for Fun' },
  ];
  choices.forEach((c) => {
    const btn = el('button', {
      class: 'option' + (state.answers.goal === c.key ? ' selected' : ''),
      onclick: () => { state.answers.goal = c.key; render(); },
    }, [el('span', { class: 'icon' }, c.icon), el('span', {}, c.label)]);
    opts.append(btn);
  });
  wrap.append(opts, el('div', { class: 'spacer' }));

  const cta = el('button', { class: 'btn-primary', onclick: nextStep }, 'Continue');
  cta.disabled = !state.answers.goal;
  wrap.append(cta);
  return wrap;
}

function screenReady() {
  const wrap = el('div', { class: 'screen center-col' });
  wrap.append(
    companion({ big: true, emoji: '🚀' }),
    el('h1', { class: 'voice-line' }, 'Ready aachu!'),
    el('p', { class: 'sub-line' }, 'Unga profile save pannitten. Ipo naama first conversation start pannalama?'),
  );
  wrap.append(el('div', { class: 'spacer' }), el('button', { class: 'btn-primary', onclick: nextStep }, 'Start practicing'));
  return wrap;
}

const LEVEL_LABELS = {
  beginner: 'Words mattum puriyum',
  basic: 'Konjam-konjam pesuven',
  intermediate: 'Pesuven, grammar thappu varum',
  advanced: 'Pesuven, perfect-ah illa',
};
const GOAL_LABELS = {
  career: 'Career / Business',
  studies: 'For Studies',
  confidence: 'Build confidence',
  fun: 'Just for fun',
};

function screenHome() {
  const profile = loadProfile() || {};
  const wrap = el('div', { class: 'screen' });

  const header = el('div', { class: 'home-header' }, [
    companion({ emoji: '🙂' }),
    el('div', {}, [
      el('div', { class: 'home-title' }, 'Vanakkam! 👋'),
      el('div', { class: 'home-sub' }, 'Zia kூட pesa ready ah irukeengala?'),
    ]),
  ]);

  const streak = el('div', { class: 'streak-card' }, [
    el('div', { class: 'num' }, `${profile.streak ?? 1}🔥`),
    el('div', { class: 'txt' }, 'day streak — dhinamum konjam neram pesi, indha number ah valathunga.'),
  ]);

  const card = el('div', { class: 'profile-card' }, [
    el('div', { class: 'profile-row' }, [
      el('span', { class: 'label' }, 'English partner unga kitta'),
      el('span', { class: 'value' }, profile.partner === 'yes' ? 'Irukanga' : 'Illa'),
    ]),
    el('div', { class: 'profile-row' }, [
      el('span', { class: 'label' }, 'Current level'),
      el('span', { class: 'value' }, LEVEL_LABELS[profile.level] || '—'),
    ]),
    el('div', { class: 'profile-row' }, [
      el('span', { class: 'label' }, 'Goal'),
      el('span', { class: 'value' }, GOAL_LABELS[profile.goal] || '—'),
    ]),
  ]);

  const chatBtn = el('button', { class: 'btn-primary', onclick: () => { state.screen = 'chat'; render(); } }, 'Zia kூட pesalam 🎙️');
  const resetBtn = el('button', {
    class: 'btn-ghost',
    onclick: () => {
      if (confirm('Profile ah reset pannalama? Ellam mudinji, thirumba onboarding start aagum.')) {
        clearProfile();
        state = { stepIndex: 0, screen: 'welcome', answers: { partner: null, level: null, goal: null } };
        render();
      }
    },
  }, 'Reset profile');

  wrap.append(header, streak, card, el('div', { class: 'spacer' }), chatBtn, resetBtn);
  return wrap;
}

/* ---------- tiny canned chat demo ---------- */

const NOVA_REPLIES = [
  "Nice! Adhu pathi konjam explain pannunga.",
  "Super ah irukku! Innum konjam detail sollunga.",
  "Correct ah pesuringa. Ippo idha try pannunga: describe your day.",
  "Good try! Naan oru chinna correction sollattuma?",
  "Semma progress! Let's continue the conversation.",
];

function screenChat() {
  const wrap = el('div', { class: 'screen' });
  wrap.style.paddingBottom = '0';

  const log = el('div', { class: 'chat-log', id: 'chatLog' }, [
    el('div', { class: 'bubble nova' }, "Vanakkam! Naan Zia. Enna pathi pesanum today? (Type your reply in English!)"),
  ]);

  const input = el('input', { type: 'text', placeholder: 'Type in English...', id: 'chatInput' });
  const send = () => {
    const text = input.value.trim();
    if (!text) return;
    log.append(el('div', { class: 'bubble me' }, text));
    input.value = '';
    log.scrollTop = log.scrollHeight;
    setTimeout(() => {
      const reply = NOVA_REPLIES[Math.floor(Math.random() * NOVA_REPLIES.length)];
      log.append(el('div', { class: 'bubble nova' }, reply));
      log.scrollTop = log.scrollHeight;
    }, 500);
  };
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });

  const sendBtn = el('button', { class: 'chat-send', onclick: send, 'aria-label': 'Send' }, '➤');
  const inputRow = el('div', { class: 'chat-input-row' }, [input, sendBtn]);

  wrap.append(log, inputRow);
  return wrap;
}

/* ---------- render dispatch ---------- */

const RENDERERS = {
  welcome: screenWelcome,
  value1: screenValue1,
  value2: screenValue2,
  q_partner: screenQPartner,
  q_level: screenQLevel,
  q_goal: screenQGoal,
  ready: screenReady,
  home: screenHome,
  chat: screenChat,
};

function render() {
  stage.innerHTML = '';
  stage.appendChild(RENDERERS[state.screen]());

  const isOnboarding = ONBOARDING_STEPS.includes(state.screen);
  topbar.style.display = state.screen === 'home' ? 'none' : 'flex';

  if (isOnboarding) {
    const pct = ((state.stepIndex + 1) / ONBOARDING_STEPS.length) * 100;
    progressFill.style.width = pct + '%';
    backBtn.disabled = state.stepIndex === 0;
    progressFill.style.opacity = '1';
  } else {
    progressFill.style.width = '100%';
    backBtn.disabled = state.screen !== 'chat';
  }
}

/* ---------- boot ---------- */

(function init() {
  const existing = loadProfile();
  if (existing) {
    state.screen = 'home';
  }
  render();
})();
