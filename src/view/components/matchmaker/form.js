async function onSubmit() {
  const container = document.getElementById("matchmakerResult");
  container.classList.remove("d-none");
  userAnswers = await collectFormData();
  let result = await score(userAnswers);
  showResults(result);
}

const scoreKeys = [
  "sociability",
  "attention_seeking",
  "playfulness",
  "calmness",
  "home_type",
  "housemates",
  "activity",
  "pet_compatibility",
];

async function getCatsScores() {
  const data = await fetch("/src/cats.json")
    .then((res) => res.json())
    .catch((error) => console.log(error));

  const scores = {};

  for (const cat in data) {
    const current = data[cat];
    scores[cat] = {};
    scoreKeys.forEach((key) => {
      scores[cat][key] = current[key];
    });
  }

  console.log("got cat's scores", scores);

  return scores;
}

async function collectFormData() {
  const form = document.getElementById("matchmakerForm");
  const inputs = form.querySelectorAll("input");
  const userAnswers = {};

  inputs.forEach((input) => {
    if (input.type === "radio" && input.checked) {
      userAnswers[input.name] = input.value;
    } else if (input.type === "range" || input.type === "text") {
      userAnswers[input.name] = input.value;
    }
  });
  console.log("got user answers: ", userAnswers);
  return userAnswers;
}

async function score(userAnswers) {
  const catsData = await fetch("/src/cats.json").then((res) => res.json());

  // Calculate max possible score for normalization
  // For each attribute, use the max possible difference (range 1-10 for ranges, penalty values for mismatches)
  const maxSociability = 9 ** 2 * 0.5; // quadratic penalty, diff 9
  const maxPlayfulness = 9 ** 2 * 0.4; // quadratic penalty, diff 9
  const maxAttSeek = Math.max(3, 9 * 0.5); // max penalty for attention seeking
  const maxHousemates = 2;
  const maxHomeType = 2;
  const maxPetCompat = 2;
  const maxScore =
    maxSociability +
    maxPlayfulness +
    maxAttSeek +
    maxHousemates +
    maxHomeType +
    maxPetCompat;

  let matchScores = [];
  for (const catKey in catsData) {
    const cat = catsData[catKey];
    const score = calculateScore(cat, userAnswers);
    // Convert score to percentage match
    let percent = 100 - Math.round((score / maxScore) * 100);
    percent = Math.max(0, Math.min(100, percent));
    matchScores.push({
      catKey,
      score,
      percent,
      cat,
    });
  }

  matchScores.sort((a, b) => b.percent - a.percent); // highest percent first

  const topCats = matchScores.slice(0, 3);
  return topCats;
}

function showResults(topCats) {
  const resultContainer = document.getElementById("resultCards");
  if (!resultContainer) return;

  const placeholders = Array.from(
    resultContainer.querySelectorAll(".resultCard"),
  );

  for (let i = 0; i < placeholders.length; i++) {
    const card = placeholders[i];
    const match = topCats[i];

    const img = card.querySelector(".result-img") || card.querySelector("img");
    const nameEl =
      card.querySelector(".result-name") || card.querySelector("h3");
    const percentEl =
      card.querySelector(".result-percent") || card.querySelector("p");

    if (img) {
      img.src = match.cat.img || "";
      img.alt = match.cat.name || "";
    }
    if (nameEl) nameEl.textContent = match.cat.name || "";
    if (percentEl) {
      let pctSpan = percentEl.querySelector(".percentage");
      const pctValue = (" " + match.percent || 0) + "%";
      if (pctSpan) {
        pctSpan.textContent = pctValue;
      } else {
        const newSpan = document.createElement("span");
        newSpan.className = "percentage";
        newSpan.textContent = pctValue;
        const strong = percentEl.querySelector(
          '[data-i18n="match-percentage"]',
        );
        if (strong && strong.parentNode === percentEl) {
          strong.insertAdjacentElement("afterend", newSpan);
        } else {
          percentEl.appendChild(newSpan);
        }
      }
    }
  }
}

function calculateScore(cat, user) {
  let score = 0;

  // Defensive: use 0 if missing, ensure numbers
  const userSociability = Number(user.sociability) || 0;
  const catSociability = Number(cat.sociability) || 0;
  const userPlayfulness = Number(user.playfulness) || 0;
  const catActivity = Number(cat.activity) || 0;
  const catAttentionSeeking = Number(cat.attention_seeking) || 0;
  const userHousemates = Number(user.housemates) || 0;
  const userHomeType = Number(user.home_type) || 0;
  const userPetCompat = Number(user.pet_compatibility) || 0;

  // Sociability: quadratic penalty, bonus for close match
  const sociabilityDiff = Math.abs(userSociability - catSociability);
  score += sociabilityDiff ** 2 * 0.5;
  if (sociabilityDiff <= 2) score -= 1;

  // Playfulness/activity: quadratic penalty, bonus for close match
  const playDiff = Math.abs(userPlayfulness - catActivity);
  score += playDiff ** 2 * 0.4;
  if (playDiff <= 2) score -= 1;

  // Attention seeking: nuanced logic
  const attSeekDiff = Math.abs(userSociability - catAttentionSeeking);
  if (userSociability < 5 && catAttentionSeeking > 7) score += 3;
  else if (userSociability > 7 && catAttentionSeeking < 5) score += 3;
  else score += attSeekDiff * 0.5;

  // Housemates: penalty for mismatch
  if (
    !Array.isArray(cat.housemates) ||
    !cat.housemates.includes(userHousemates)
  )
    score += 2;

  // Home type: penalty for mismatch
  if (!Array.isArray(cat.home_type) || !cat.home_type.includes(userHomeType))
    score += 2;

  // Pet compatibility: penalty for mismatch
  if (
    !Array.isArray(cat.pet_compatibility) ||
    !cat.pet_compatibility.includes(userPetCompat)
  )
    score += 2;

  console.log(score, typeof score);

  return score;
}
