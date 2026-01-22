let country = {
    population: 2300,
    economy: 80,
    happiness: 70,
    military: 40,
    environment: 60,
    year: 1
};

let activeLaws = [];
let gameOver = false;

function clamp(v) { return Math.max(0, Math.min(100, v)); }

function addNews(msg) {
    let div = document.getElementById("news");
    if (!div) return;
    let p = document.createElement("p");
    p.textContent = `[Year ${country.year}] ${msg}`;
    div.appendChild(p);
    div.scrollTop = div.scrollHeight;
}

function updateUI() {
    document.getElementById("population").textContent = country.population;
    document.getElementById("economy-bar").style.width = country.economy + "%";
    document.getElementById("economy-tip").textContent = `${country.economy}/100`;
    document.getElementById("happiness-bar").style.width = country.happiness + "%";
    document.getElementById("happiness-tip").textContent = `${country.happiness}/100`;
    document.getElementById("military-bar").style.width = country.military + "%";
    document.getElementById("military-tip").textContent = `${country.military}/100`;
    document.getElementById("environment-bar").style.width = country.environment + "%";
    document.getElementById("environment-tip").textContent = `${country.environment}/100`;
}

function drawMap() {
    let c = document.getElementById("map");
    if (!c) return;
    let ctx = c.getContext("2d");
    for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
            ctx.fillStyle = `rgb(${200 - x*10}, ${150 + y*5}, 150)`;
            ctx.fillRect(x*30,y*30,30,30);
        }
    }
}

function enactLaw(type) {
    let law = null;
    if (type === "environment") law = { name:"Environmental Protection Act", duration:5, environment:+3, economy:-2 };
    else if (type === "economy") law = { name:"Tax Incentive Program", duration:4, economy:+4, happiness:-1 };
    else if (type === "military") law = { name:"Mandatory Military Service", duration:6, military:+4, happiness:-3 };
    if (law) {
        activeLaws.push(law);
        addNews(`${law.name} enacted.`);
        refreshLawsUI();
    }
}

function refreshLawsUI() {
    let ul = document.getElementById("active-laws");
    ul.innerHTML = "";
    activeLaws.forEach(l => {
        let li = document.createElement("li");
        li.textContent = `${l.name} (Years left: ${l.duration})`;
        ul.appendChild(li);
    });
}

function startFestival(type) {
    let msg="";
    if (type==="cultural") { country.happiness+=10; country.economy-=3; msg="Cultural Festival celebrated! Happiness +10, Economy -3"; }
    else if (type==="music") { country.happiness+=8; country.economy-=2; country.environment-=1; msg="Music Festival celebrated! Happiness +8, Economy -2, Environment -1"; }
    else if (type==="eco") { country.happiness+=5; country.economy-=2; country.environment+=3; msg="Eco Festival celebrated! Happiness +5, Economy -2, Environment +3"; }
    addNews(msg);
    country.economy=clamp(country.economy);
    country.happiness=clamp(country.happiness);
    country.environment=clamp(country.environment);
    updateUI();
}

function nextTurn() {
    if (gameOver) return;

    country.population += Math.floor(country.population*0.02);

    activeLaws.forEach(l => {
        if(l.economy) country.economy+=l.economy;
        if(l.happiness) country.happiness+=l.happiness;
        if(l.military) country.military+=l.military;
        if(l.environment) country.environment+=l.environment;
        l.duration--;
    });

    activeLaws = activeLaws.filter(l=>l.duration>0);
    refreshLawsUI();

    country.economy=clamp(country.economy);
    country.happiness=clamp(country.happiness);
    country.military=clamp(country.military);
    country.environment=clamp(country.environment);

    // Riots
    if (country.happiness<30 && country.happiness>0) {
        addNews("🔥 Riots erupt due to low happiness!");
        country.economy -= 4;
    }

    if (country.happiness>0 && country.happiness<=10) addNews("⚠️ The nation teeters on the brink of collapse.");

    country.population = Math.max(0, country.population);
    addNews("A new year begins. The nation continues to evolve.");
    country.year++;
    updateUI();

    checkGameOver();
}

function checkGameOver() {
    if (country.happiness <= 0 && !gameOver) {
        country.happiness=0;
        gameOver=true;
        addNews("⚠️ The government has collapsed. Order has broken down nationwide.");
        const nextBtn = document.getElementById("nextTurn");
        if (nextBtn) nextBtn.disabled=true;
        alert(`GAME OVER\n\nYour country has collapsed due to total public unrest.\nYear survived: ${country.year}`);
    }
}

// Winter theme
document.body.classList.add("winter");

// Initialize
window.onload=function() {
    drawMap();
    updateUI();
    addNews("Welcome to Atlas Reign. Your nation awaits your command.");
    const nextBtn = document.getElementById("nextTurn");
    if (nextBtn) nextBtn.onclick=nextTurn;
};
