// =======================
//    Atlas Reign Alpha
// =======================

// Main country data
let country = {
    population: 2300,
    economy: 80,
    happiness: 70,
    military: 40,
    environment: 60,
    year: 1
};

// Game over
let gameOver = false;

// Active laws list
let activeLaws = [];

// Clamp helper
function clamp(v) {
    return Math.max(0, Math.min(100, v));
}

// Add news entry
function addNews(msg) {
    let div = document.getElementById("news");
    if (!div) return;
    let p = document.createElement("p");
    p.textContent = `[Year ${country.year}] ${msg}`;
    div.appendChild(p);
    div.scrollTop = div.scrollHeight;
}

// Render stats on screen
function updateUI() {
    const popEl = document.getElementById("population");
    if (popEl) popEl.textContent = country.population;

    const economyBar = document.getElementById("economy-bar");
    const econTip = document.getElementById("economy-tip");
    if (economyBar) economyBar.style.width = country.economy + "%";
    if (econTip) econTip.textContent = `${country.economy}/100 (${country.economy}%)`;

    const happinessBar = document.getElementById("happiness-bar");
    const happyTip = document.getElementById("happiness-tip");
    if (happinessBar) happinessBar.style.width = country.happiness + "%";
    if (happyTip) happyTip.textContent = `${country.happiness}/100 (${country.happiness}%)`;

    const militaryBar = document.getElementById("military-bar");
    const milTip = document.getElementById("military-tip");
    if (militaryBar) militaryBar.style.width = country.military + "%";
    if (milTip) milTip.textContent = `${country.military}/100 (${country.military}%)`;

    const envBar = document.getElementById("environment-bar");
    const envTip = document.getElementById("environment-tip");
    if (envBar) envBar.style.width = country.environment + "%";
    if (envTip) envTip.textContent = `${country.environment}/100 (${country.environment}%)`;
}

// Simple map generator
function drawMap() {
    let c = document.getElementById("map");
    if (!c) return;
    let ctx = c.getContext("2d");

    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
            ctx.fillStyle = `rgb(${200 - x*10}, ${150 + y*5}, 150)`;
            ctx.fillRect(x * 30, y * 30, 30, 30);
        }
    }
}

// Law effects
function enactLaw(type) {
    let law = null;

    if (type === "environment") {
        law = { name: "Environmental Protection Act", duration: 5, environment: +3, economy: -2 };
        addNews("Environmental Protection Act passed.");
    } else if (type === "economy") {
        law = { name: "Tax Incentive Program", duration: 4, economy: +4, happiness: -1 };
        addNews("Tax Incentive Program passed.");
    } else if (type === "military") {
        law = { name: "Mandatory Military Service", duration: 6, military: +4, happiness: -3 };
        addNews("Mandatory Military Service enacted.");
    } else {
        // Unknown law type — ignore
        addNews(`Attempted to enact unknown law: ${type}`);
        return;
    }

    if (law) {
        activeLaws.push(law);
        refreshLawsUI();
    }
}

// Refresh active law list
function refreshLawsUI() {
    let ul = document.getElementById("active-laws");
    if (!ul) return;
    ul.innerHTML = "";
    activeLaws.forEach(l => {
        let li = document.createElement("li");
        li.textContent = `${l.name} (Years left: ${l.duration})`;
        ul.appendChild(li);
    });
}

function startFestival(type) {
    let msg = "";
    switch(type) {
        case "cultural":
            country.happiness += 10;
            country.economy -= 3;
            msg = "Cultural Festival celebrated! Happiness +10, Economy -3";
            break;
        case "music":
            country.happiness += 8;
            country.economy -= 2;
            country.environment -= 1;
            msg = "Music Festival celebrated! Happiness +8, Economy -2, Environment -1";
            break;
        case "eco":
            country.happiness += 5;
            country.economy -= 2;
            country.environment += 3;
            msg = "Eco Festival celebrated! Happiness +5, Economy -2, Environment +3";
            break;
        default:
            msg = "Unknown festival attempted.";
    }
    // show festival news immediately
    addNews(msg);

    // clamp after festival effects
    country.economy = clamp(country.economy);
    country.happiness = clamp(country.happiness);
    country.environment = clamp(country.environment);

    updateUI();
}

// Turn calculation
function nextTurn() {

    // Base population growth
    country.population += Math.floor(country.population * 0.02);

    // Apply laws
    activeLaws.forEach(l => {
        if (typeof l.economy === 'number') country.economy += l.economy;
        if (typeof l.happiness === 'number') country.happiness += l.happiness;
        if (typeof l.military === 'number') country.military += l.military;
        if (typeof l.environment === 'number') country.environment += l.environment;

        l.duration -= 1;
    });

    // Remove expired laws
    activeLaws = activeLaws.filter(l => l.duration > 0);
    refreshLawsUI();

    // Clamp stats
    country.economy = clamp(country.economy);
    country.happiness = clamp(country.happiness);
    country.military = clamp(country.military);
    country.environment = clamp(country.environment);

    // Prevent negative population
    country.population = Math.max(0, country.population);

    // News summary
    addNews("A new year begins. The nation continues to evolve.");

    country.year++;
    updateUI();
}

// Check the game over conditions

function checkGameOver() {
    if (country.happiness <= 0) {
        gameOver = true;
        addNews("NATIONAL ALERT: THE GOVERNMENT HAS COLLAPSED. ORDER HAS BROKEN DOWN NATIONWIDE.")
        alert(
            "GAME OVER\n\n" +
            "Your country has collapsed due to total public unrest.\n" +
            "Year survived: " + country.year
        );
        document.getElementById("nextTurn").disabled = true;
    }
}
checkGameOver();
if (gameOver) return;

// Protests and riots

if (country.happiness < 40) {
    addNews("Widespread protests erupt across the nation!")
}
if (country.happiness < 30) {
    addNews("Riots have broken out in several major cities!")
}
if (country.happiness < 15) {
    addNews("ALERT: THE NATION TEETERS ON THE NEARGE OF COLLAPSE!")
}
if (country.happiness < 10) {
    addNews("ALERT: RIOTS HAVE MADE MAJOR IMPACT ON THE NATION'S STABILITY; COLLAPSE IS IMMINENT!")
    document.body.classList.add("collapse");
}

// Winter theme
const winterTheme = true;
if (winterTheme) {
    document.body.classList.add("winter");
}

// Political system
if (country.support < 40) {
    addNews("The parliament blocks your proposed law.")
    return;
}

// Save / Load
localStorage.setItem("atlasSave", JSON.stringify(country));

// Initialize
window.onload = function() {
    drawMap();
    updateUI();
    addNews("Welcome to Atlas Reign. Your nation awaits your command.");

    // attach handler after DOM loaded
    const nextBtn = document.getElementById("nextTurn");
    if (nextBtn) nextBtn.onclick = nextTurn;
    checkGameOver();
};
