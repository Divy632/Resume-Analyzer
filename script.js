const mockAnalysis = {
  overallScore: 74,
  scores: [
    { label: "Format", score: 85 },
    { label: "Content", score: 70 },
    { label: "Impact", score: 65 },
    { label: "ATS", score: 78 },
  ],
  strengths: [
    "Clean, well-structured format with clear section headings",
    "Strong use of quantified achievements in work experience",
    "Relevant skills section aligned with industry standards",
    "Professional summary is concise and targeted",
  ],
  improvements: [
    'Add more action verbs to bullet points (led, drove, spearheaded)',
    "Include measurable outcomes for at least 70% of experience bullets",
    "Education section lacks relevant coursework or honors",
    "Missing a dedicated projects or portfolio section",
  ],
  suggestions: [
    "Tailor your summary to match the specific job description you're targeting",
    "Consider adding a 'Key Achievements' section near the top for maximum impact",
    "Use the STAR method (Situation, Task, Action, Result) for experience bullets",
    "Add links to your LinkedIn, GitHub, or portfolio website",
  ],
  keywords: [
    { word: "leadership", found: true },
    { word: "agile", found: true },
    { word: "data-driven", found: false },
    { word: "cross-functional", found: true },
    { word: "ROI", found: false },
    { word: "stakeholder", found: true },
    { word: "optimization", found: false },
    { word: "scalable", found: true },
    { word: "KPI", found: false },
    { word: "automation", found: true },
  ],
};

const $ = (s) => document.querySelector(s);
const uploadLabel = $("#upload-label");
const fileInput = $("#file-upload");
const fileInfo = $("#file-info");
const resultsEl = $("#results");

// Drag & drop
["dragenter", "dragover"].forEach((e) =>
  uploadLabel.addEventListener(e, (ev) => { ev.preventDefault(); uploadLabel.classList.add("dragging"); })
);
["dragleave", "drop"].forEach((e) =>
  uploadLabel.addEventListener(e, (ev) => { ev.preventDefault(); uploadLabel.classList.remove("dragging"); })
);
uploadLabel.addEventListener("drop", (e) => { if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); });
fileInput.addEventListener("change", (e) => { if (e.target.files[0]) handleFile(e.target.files[0]); });
$("#clear-btn").addEventListener("click", resetUpload);

function handleFile(file) {
  $("#file-name").textContent = file.name;
  $("#file-size").textContent = (file.size / 1024).toFixed(1) + " KB";
  uploadLabel.classList.add("hidden");
  fileInfo.classList.remove("hidden");
  $("#clear-btn").classList.add("hidden");
  $("#analyzing-indicator").classList.remove("hidden");
  resultsEl.classList.add("hidden");
  setTimeout(() => {
    $("#analyzing-indicator").classList.add("hidden");
    $("#clear-btn").classList.remove("hidden");
    renderResults(mockAnalysis);
  }, 2500);
}

function resetUpload() {
  fileInput.value = "";
  fileInfo.classList.add("hidden");
  uploadLabel.classList.remove("hidden");
  resultsEl.classList.add("hidden");
}

function scoreColor(s) {
  if (s >= 80) return "oklch(0.7 0.17 145)";
  if (s >= 60) return "oklch(0.8 0.15 75)";
  if (s >= 40) return "oklch(0.75 0.15 60)";
  return "oklch(0.6 0.2 25)";
}

function createRing(score, label, size) {
  const sw = 8, r = (size - sw) / 2, c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  const col = scoreColor(score);
  const div = document.createElement("div");
  div.className = "score-ring";
  div.innerHTML = `
    <div class="score-ring-wrap" style="width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}">
        <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="oklch(0.25 0.01 250)" stroke-width="${sw}"/>
        <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="${col}" stroke-width="${sw}"
          stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${c}"
          style="transition:stroke-dashoffset 1.5s ease-out"/>
      </svg>
      <div class="score-value">${score}</div>
    </div>
    <span class="score-ring-label">${label}</span>`;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      div.querySelector("circle:nth-child(2)").style.strokeDashoffset = offset;
    });
  });
  return div;
}

function renderResults(data) {
  const rings = $("#score-rings");
  rings.innerHTML = "";
  rings.appendChild(createRing(data.overallScore, "Overall", 160));
  data.scores.forEach((s) => rings.appendChild(createRing(s.score, s.label, 110)));

  const sList = $("#strengths-list");
  sList.innerHTML = data.strengths.map((s) =>
    `<li><span class="bullet-dot dot-success"></span>${s}</li>`).join("");

  const iList = $("#improvements-list");
  iList.innerHTML = data.improvements.map((s) =>
    `<li><span class="bullet-dot dot-warning"></span>${s}</li>`).join("");

  const sugList = $("#suggestions-list");
  sugList.innerHTML = data.suggestions.map((s, i) =>
    `<div class="suggestion-item"><span class="suggestion-num">0${i+1}</span>${s}</div>`).join("");

  const kwList = $("#keywords-list");
  kwList.innerHTML = data.keywords.map((k) =>
    `<span class="keyword-tag ${k.found ? "keyword-found" : "keyword-missing"}">${k.word}</span>`).join("");

  resultsEl.classList.remove("hidden");
}
