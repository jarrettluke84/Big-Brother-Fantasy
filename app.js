// 1. DATA CONFIGURATION (Directly mapped from your physical draft paper)
const initialHouseguests = [
    { id: 1, name: "Barrett", drafter: "Jordyn", image: "barrett.jpg", evicted: false },
    { id: 2, name: "Taylor", drafter: "Emily", image: "taylor.jpg", evicted: false },
    { id: 3, name: "Mallory", drafter: "Gabby", image: "mallory.jpg", evicted: false },
    { id: 4, name: "La Trice", drafter: "Kait", image: "latrice.jpg", evicted: false },
    { id: 5, name: "Rome", drafter: "Hawk", image: "rome.jpg", evicted: false },
    { id: 6, name: "Yash", drafter: "Nick", image: "yash.jpg", evicted: false },
    { id: 7, name: "Dee", drafter: "Noah", image: "dee.jpg", evicted: false },
    { id: 8, name: "Lyric", drafter: "Luke", image: "lyric.jpg", evicted: false },
    { id: 9, name: "Chuk", drafter: "Luke", image: "chuk.jpg", evicted: false },
    { id: 10, name: "Rick", drafter: "Noah", image: "rick.jpg", evicted: false },
    { id: 11, name: "Jason", drafter: "Nick", image: "jason.jpg", evicted: false },
    { id: 12, name: "Ashley", drafter: "Hawk", image: "ashley.jpg", evicted: false },
    { id: 13, name: "Melody", drafter: "Kait", image: "melody.jpg", evicted: false },
    { id: 14, name: "Kamu", drafter: "Gabby", image: "kamu.jpg", evicted: false },
    { id: 15, name: "Haley", drafter: "Emily", image: "haley.jpg", evicted: false },
    { id: 16, name: "Drew", drafter: "Jordyn", image: "drew.jpg", evicted: false },
    { id: 17, name: "Angela", drafter: "None (Unchosen)", image: "angela.jpg", evicted: false }
];

// Persistent state management using LocalStorage with a fallback safety check
let houseguests;
try {
    const savedData = localStorage.getItem('bbDraftData');
    // If saved data exists and isn't broken, parse it. Otherwise, use initial layout.
    houseguests = savedData ? JSON.parse(savedData) : initialHouseguests;
    if (!Array.isArray(houseguests) || houseguests.length === 0) {
        houseguests = initialHouseguests;
    }
} catch (e) {
    houseguests = initialHouseguests;
}

const memoryWall = document.getElementById('memoryWall');
const standingsContainer = document.getElementById('standings');

// 2. RENDER MEMORY WALL INTERACTIVE GRID
function renderWall() {
    if (!memoryWall) return;
    memoryWall.innerHTML = '';
    
    houseguests.forEach(hg => {
        const card = document.createElement('div');
        card.className = `houseguest-card ${hg.evicted ? 'evicted' : ''}`;
        
        const subtitleLabel = hg.drafter === "None (Unchosen)" ? "Unchosen" : `(${hg.drafter}'s Pick)`;
        const buttonText = hg.evicted ? "In House" : "Out of House";

        // Using relative dot slash './' ensures GitHub Pages looks inside the correct repository directory
        card.innerHTML = `
            <div class="portrait-container">
                // NEW UPDATED CODE
                <img class="portrait-img" src="./images/${hg.image}" alt="${hg.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                <div class="portrait-fallback" style="display:none;">
                    IMAGE PLACEHOLDER<br><strong>[${hg.image.toUpperCase()}]</strong>
                </div>
            </div>
            <div class="hg-name">${hg.name}</div>
            <div class="hg-pick-info">${subtitleLabel}</div>
            <button class="status-btn" data-id="${hg.id}">${buttonText}</button>
        `;
        memoryWall.appendChild(card);
    });

    // Handle button event binding
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const hgId = parseInt(e.target.getAttribute('data-id'));
            toggleEviction(hgId);
        });
    });

    saveData();
    calculateStandings();
}

// 3. EVENT HANDLER FOR HOUSEGUEST STATE ALTERATIONS
function toggleEviction(id) {
    houseguests = houseguests.map(hg => {
        if (hg.id === id) {
            return { ...hg, evicted: !hg.evicted };
        }
        return hg;
    });
    renderWall();
}

// 4. SCOREBOARD & PROGRESS CALCULATION
function calculateStandings() {
    if (!standingsContainer) return;
    const scores = {};

    houseguests.forEach(hg => {
        if (hg.drafter === "None (Unchosen)") return;

        if (!scores[hg.drafter]) {
            scores[hg.drafter] = { active: 0, total: 0 };
        }
        scores[hg.drafter].total++;
        if (!hg.evicted) {
            scores[hg.drafter].active++;
        }
    });

    let standingsHtml = '<div class="standings-list">';
    for (const [drafter, stats] of Object.entries(scores)) {
        const percentAlive = (stats.active / stats.total) * 100;
        const dangerClass = stats.active < stats.total ? 'danger' : '';

        standingsHtml += `
            <div class="drafter-row ${dangerClass}">
                <div class="drafter-meta">
                    <span class="drafter-name">${drafter}</span>
                    <span class="drafter-ratio">${stats.active}/${stats.total} ALIVE</span>
                </div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${percentAlive}%"></div>
                </div>
            </div>
        `;
    }
    standingsHtml += '</div>';
    standingsContainer.innerHTML = standingsHtml;
}

// 5. CACHE STATE CHANGES
function saveData() {
    try {
        localStorage.setItem('bbDraftData', JSON.stringify(houseguests));
    } catch (e) {
        console.error("Local storage saving blocked or full", e);
    }
}

// Launch application
renderWall();
