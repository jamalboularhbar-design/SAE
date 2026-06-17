const modules = [
  {
    title: "First useful change",
    mode: "Agent",
    color: "rgba(139, 92, 246, 0.9)",
    mission: "Open a repo, ask Cursor to explain it, then make one safe improvement.",
    drills: ["Ask for a folder map", "Review the diff", "Run a project check"],
  },
  {
    title: "IDE superpowers",
    mode: "Edit",
    color: "rgba(34, 211, 238, 0.9)",
    mission: "Use Tab completion, inline edit, and selected-code context with confidence.",
    drills: ["Complete a function", "Refactor a selection", "Move larger work to Agent"],
  },
  {
    title: "Modes mental model",
    mode: "Plan",
    color: "rgba(52, 211, 153, 0.9)",
    mission: "Know when to use Ask, Plan, Agent, and Debug for different jobs.",
    drills: ["Explain in Ask", "Design in Plan", "Fix in Debug"],
  },
  {
    title: "Prompt craft",
    mode: "Context",
    color: "rgba(245, 158, 11, 0.9)",
    mission: "Write prompts with goal, context, constraints, and verification.",
    drills: ["Attach relevant files", "Name constraints", "Define done"],
  },
  {
    title: "Codebase navigation",
    mode: "Search",
    color: "rgba(96, 165, 250, 0.9)",
    mission: "Map unfamiliar systems before changing them.",
    drills: ["Trace a flow", "Find callers", "Summarize patterns"],
  },
  {
    title: "Safe Agent workflow",
    mode: "Control",
    color: "rgba(251, 113, 133, 0.9)",
    mission: "Use checkpoints, diffs, queued messages, and command verification.",
    drills: ["Create a checkpoint", "Interrupt and refine", "Verify the change"],
  },
  {
    title: "Project rules",
    mode: "Rules",
    color: "rgba(167, 139, 250, 0.9)",
    mission: "Capture repeated preferences so Cursor follows your project style.",
    drills: ["Write one rule", "Scope it tightly", "Reference canonical files"],
  },
  {
    title: "Review and ship",
    mode: "Ship",
    color: "rgba(45, 212, 191, 0.9)",
    mission: "Use reviews, tests, browser checks, and PR habits to ship with care.",
    drills: ["Run Agent Review", "Check edge cases", "Summarize risks"],
  },
];

const questions = [
  {
    topic: "Workflow",
    prompt: "You are new to a codebase and need to add a feature. What should you ask Cursor to do first?",
    answers: [
      "Implement the feature immediately across any files it finds.",
      "Inspect the relevant files, explain the existing pattern, and propose a small plan.",
      "Rewrite the project structure so it is easier to understand.",
      "Skip exploration and run the production build.",
    ],
    correct: 1,
    explanation:
      "Start with understanding. Cursor is strongest when it has clear context, constraints, and a plan before it edits.",
  },
  {
    topic: "Modes",
    prompt: "Which mode is best when you want Cursor to investigate a failing behavior with runtime evidence?",
    answers: ["Ask", "Debug", "Inline edit", "Tab completion"],
    correct: 1,
    explanation:
      "Debug mode is designed for hypotheses, reproduction, runtime evidence, fixes, and cleanup.",
  },
  {
    topic: "Prompting",
    prompt: "Which prompt gives Cursor the clearest definition of done?",
    answers: [
      "Make this better.",
      "Fix the page.",
      "Add empty, loading, and error states to @app/dashboard/page.tsx. Do not add dependencies. Run lint and summarize risks.",
      "Use your best judgment everywhere.",
    ],
    correct: 2,
    explanation:
      "Great prompts include a concrete goal, attached context, constraints, and verification steps.",
  },
  {
    topic: "Safety",
    prompt: "Cursor changed more files than expected. What is the best next move?",
    answers: [
      "Accept the diff because the agent probably knows best.",
      "Review the diff, restore or reject unwanted edits, then rerun with tighter instructions.",
      "Delete the repo and start over.",
      "Only inspect formatting changes.",
    ],
    correct: 1,
    explanation:
      "Stay in control. Review diffs, use checkpoints, and tighten instructions when the edit scope drifts.",
  },
  {
    topic: "Rules",
    prompt: "When should you add a Cursor project rule?",
    answers: [
      "After every single prompt.",
      "When you notice repeated project-specific preferences or repeated agent mistakes.",
      "Only after the project is finished.",
      "Never, because rules make Cursor slower.",
    ],
    correct: 1,
    explanation:
      "Rules are best for durable project guidance, such as test commands, design-system conventions, and coding style.",
  },
  {
    topic: "Shipping",
    prompt: "What is the healthiest final step before opening a PR?",
    answers: [
      "Ask Cursor to review the changes for bugs, edge cases, missing tests, and complexity.",
      "Remove all tests to save time.",
      "Ignore terminal output if the UI looks fine.",
      "Ask Agent to make the diff larger.",
    ],
    correct: 0,
    explanation:
      "A final review prompt helps catch risks while the context is still fresh, especially after tests and UI checks.",
  },
];

const storageKey = "cursor-launchpad-state";
const state = loadState();

const moduleGrid = document.querySelector("#moduleGrid");
const progressBar = document.querySelector("#progressBar");
const progressPercent = document.querySelector("#progressPercent");
const resetProgress = document.querySelector("#resetProgress");
const promptPreview = document.querySelector("#promptPreview");
const buildPrompt = document.querySelector("#buildPrompt");
const copyPrompt = document.querySelector("#copyPrompt");
const questionCounter = document.querySelector("#questionCounter");
const questionTopic = document.querySelector("#questionTopic");
const questionText = document.querySelector("#questionText");
const answerList = document.querySelector("#answerList");
const quizFeedback = document.querySelector("#quizFeedback");
const previousQuestion = document.querySelector("#previousQuestion");
const nextQuestion = document.querySelector("#nextQuestion");
const quizDots = document.querySelector("#quizDots");
const scorePill = document.querySelector("#scorePill");

function loadState() {
  const fallback = {
    completedModules: [],
    quizAnswers: Array(questions.length).fill(null),
    currentQuestion: 0,
    shippingChecks: [],
  };

  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    return {
      ...fallback,
      ...stored,
      quizAnswers: Array.from(
        { length: questions.length },
        (_, index) => stored?.quizAnswers?.[index] ?? null,
      ),
    };
  } catch {
    return fallback;
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function renderModules() {
  moduleGrid.innerHTML = modules
    .map((module, index) => {
      const completed = state.completedModules.includes(index);
      const drills = module.drills.map((drill) => `<li>${drill}</li>`).join("");

      return `
        <article class="module-card ${completed ? "completed" : ""}" style="--module-glow: ${module.color}">
          <div class="module-topline">
            <span class="module-index">${String(index + 1).padStart(2, "0")}</span>
            <span class="module-pill">${module.mode}</span>
          </div>
          <h3>${module.title}</h3>
          <p>${module.mission}</p>
          <ul>${drills}</ul>
          <button class="button ${completed ? "button-secondary" : "button-primary"}" type="button" data-module="${index}">
            ${completed ? "Completed" : "Mark complete"}
          </button>
        </article>
      `;
    })
    .join("");

  document.querySelectorAll("[data-module]").forEach((button) => {
    button.addEventListener("click", () => toggleModule(Number(button.dataset.module)));
  });
}

function toggleModule(index) {
  if (state.completedModules.includes(index)) {
    state.completedModules = state.completedModules.filter((item) => item !== index);
  } else {
    state.completedModules = [...state.completedModules, index].sort((a, b) => a - b);
  }

  saveState();
  renderModules();
  updateProgress();
}

function updateProgress() {
  const checkedBoxes = document.querySelectorAll("[data-ship-check]:checked").length;
  const totalItems = modules.length + questions.length + document.querySelectorAll("[data-ship-check]").length;
  const correctAnswers = state.quizAnswers.filter((answer, index) => answer === questions[index].correct).length;
  const completed = state.completedModules.length + correctAnswers + checkedBoxes;
  const percent = Math.round((completed / totalItems) * 100);

  progressBar.style.width = `${percent}%`;
  progressPercent.textContent = `${percent}%`;
}

function buildPromptText() {
  const goal = document.querySelector("#goalInput").value.trim();
  const context = document.querySelector("#contextInput").value.trim();
  const constraints = document.querySelector("#constraintsInput").value.trim();
  const verification = document.querySelector("#verificationInput").value.trim();

  return `Goal:
${goal || "Describe the outcome you want."}

Context:
${context || "Attach files, folders, screenshots, terminal output, or docs."}

Constraints:
${constraints || "Name boundaries, style requirements, and what should not change."}

Verification:
${verification || "List checks Cursor should run and what it should report back."}

Before editing, inspect the relevant files and propose the smallest safe plan.`;
}

function renderPrompt() {
  promptPreview.textContent = buildPromptText();
}

async function copyGeneratedPrompt() {
  const text = promptPreview.textContent;

  try {
    await navigator.clipboard.writeText(text);
    copyPrompt.textContent = "Copied";
    setTimeout(() => {
      copyPrompt.textContent = "Copy";
    }, 1400);
  } catch {
    copyPrompt.textContent = "Select text";
  }
}

function renderQuestion() {
  const index = state.currentQuestion;
  const question = questions[index];
  const selected = state.quizAnswers[index];

  questionCounter.textContent = `Question ${index + 1} of ${questions.length}`;
  questionTopic.textContent = question.topic;
  questionText.textContent = question.prompt;
  previousQuestion.disabled = index === 0;
  nextQuestion.textContent = index === questions.length - 1 ? "Finish" : "Next";

  answerList.innerHTML = question.answers
    .map((answer, answerIndex) => {
      const isSelected = selected === answerIndex;
      const resultClass = isSelected
        ? answerIndex === question.correct
          ? "selected correct"
          : "selected incorrect"
        : "";

      return `
        <button class="answer-option ${resultClass}" type="button" data-answer="${answerIndex}">
          ${answer}
        </button>
      `;
    })
    .join("");

  document.querySelectorAll("[data-answer]").forEach((button) => {
    button.addEventListener("click", () => selectAnswer(Number(button.dataset.answer)));
  });

  renderFeedback();
  renderQuizDots();
  updateScore();
  updateProgress();
}

function selectAnswer(answerIndex) {
  state.quizAnswers[state.currentQuestion] = answerIndex;
  saveState();
  renderQuestion();
}

function renderFeedback() {
  const selected = state.quizAnswers[state.currentQuestion];

  if (selected === null) {
    quizFeedback.className = "quiz-feedback";
    quizFeedback.textContent = "";
    return;
  }

  const question = questions[state.currentQuestion];
  const isCorrect = selected === question.correct;
  quizFeedback.className = "quiz-feedback active";
  quizFeedback.innerHTML = `<strong>${isCorrect ? "Correct." : "Review this."}</strong> ${question.explanation}`;
}

function renderQuizDots() {
  quizDots.innerHTML = questions
    .map((question, index) => {
      const selected = state.quizAnswers[index];
      const status =
        selected === null ? "" : selected === question.correct ? "correct" : "incorrect";
      const current = index === state.currentQuestion ? "current" : "";

      return `
        <button class="quiz-dot ${status} ${current}" type="button" data-question="${index}" aria-label="Go to question ${index + 1}">
          ${index + 1}
        </button>
      `;
    })
    .join("");

  document.querySelectorAll("[data-question]").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentQuestion = Number(button.dataset.question);
      saveState();
      renderQuestion();
    });
  });
}

function updateScore() {
  const answered = state.quizAnswers.filter((answer) => answer !== null).length;
  const correct = state.quizAnswers.filter((answer, index) => answer === questions[index].correct).length;
  scorePill.textContent = `Score: ${correct} / ${answered}`;
}

function goToQuestion(offset) {
  const nextIndex = state.currentQuestion + offset;

  if (nextIndex < 0) {
    return;
  }

  if (nextIndex >= questions.length) {
    document.querySelector("#ship").scrollIntoView({ behavior: "smooth" });
    return;
  }

  state.currentQuestion = nextIndex;
  saveState();
  renderQuestion();
}

function setupShippingChecks() {
  document.querySelectorAll("[data-ship-check]").forEach((checkbox, index) => {
    checkbox.checked = state.shippingChecks.includes(index);
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        state.shippingChecks = [...new Set([...state.shippingChecks, index])];
      } else {
        state.shippingChecks = state.shippingChecks.filter((item) => item !== index);
      }

      saveState();
      updateProgress();
    });
  });
}

function resetAllProgress() {
  state.completedModules = [];
  state.quizAnswers = Array(questions.length).fill(null);
  state.currentQuestion = 0;
  state.shippingChecks = [];
  saveState();
  setupShippingChecks();
  renderModules();
  renderQuestion();
  updateProgress();
}

buildPrompt.addEventListener("click", renderPrompt);
copyPrompt.addEventListener("click", copyGeneratedPrompt);
previousQuestion.addEventListener("click", () => goToQuestion(-1));
nextQuestion.addEventListener("click", () => goToQuestion(1));
resetProgress.addEventListener("click", resetAllProgress);

document
  .querySelectorAll("#goalInput, #contextInput, #constraintsInput, #verificationInput")
  .forEach((input) => input.addEventListener("input", renderPrompt));

renderModules();
setupShippingChecks();
renderPrompt();
renderQuestion();
