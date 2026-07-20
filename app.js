// 1. DATA CONFIGURATION (Pre-populated with your 17 houseguests and images folder path)
const initialHouseguests = [
    { id: 1, name: "Barrett", drafter: "Jordyn", image: "./images/barrett.jpg", evicted: false },
    { id: 2, name: "Taylor", drafter: "Emily", image: "./images/taylor.jpg", evicted: false },
    { id: 3, name: "Mallory", drafter: "Gabby", image: "./images/mallory.jpg", evicted: false },
    { id: 4, name: "La Trice", drafter: "Kait", image: "./images/latrice.jpg", evicted: false },
    { id: 5, name: "Rome", drafter: "Hawk", image: "./images/rome.jpg", evicted: false },
    { id: 6, name: "Yash", drafter: "Nick", image: "./images/yash.jpg", evicted: false },
    { id: 7, name: "Dee", drafter: "Noah", image: "./images/dee.jpg", evicted: false },
    { id: 8, name: "Lyric", drafter: "Luke", image: "./images/lyric.jpg", evicted: false },
    { id: 9, name: "Chuk", drafter: "Luke", image: "./images/chuk.jpg", evicted: false },
    { id: 10, name: "Rick", drafter: "Noah", image: "./images/rick.jpg", evicted: false },
    { id: 11, name: "Jason", drafter: "Nick", image: "./images/jason.jpg", evicted: false },
    { id: 12, name: "Ashley", drafter: "Hawk", image: "./images/ashley.jpg", evicted: false },
    { id: 13, name: "Melody", drafter: "Kait", image: "./images/melody.jpg", evicted: false },
    { id: 14, name: "Kamu", drafter: "Gabby", image: "./images/kamu.jpg", evicted: false },
    { id: 15, name: "Haley", drafter: "Emily", image: "./images/haley.jpg", evicted: false },
    { id: 16, name: "Drew", drafter: "Jordyn", image: "./images/drew.jpg", evicted: false },
    { id: 17, name: "Angela", drafter: "Unchosen", image: "./images/angela.jpg", evicted: false }
];

// Persistent state via LocalStorage
let houseguests = JSON.parse(localStorage.getItem('bbDraftData')) || initialHouseguests;

const memoryWall = document.getElementById('memoryWall');
const standingsContainer = document.getElementById('standings');

// 2. RENDER THE MEMORY WALL
function renderWall() {
    memoryWall.innerHTML = '';
    
    houseguests.forEach(hg => {
        const card = document.createElement('div');
        card.className = `houseguest-card ${hg.evicted ? 'evicted' : ''}`;
        
        // Context configuration for Angela versus the drafted players
        const secondaryLabel = hg.drafter === "Unchosen" ? "Unchosen" : `Drafter: ${hg.drafter}`;

        card.innerHTML = `
            <div class="photo-box">
                <img src="${hg.image}" alt="${hg.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
                <div class="fallback-text" style="display:none;">Missing</div>
            </div>
            <div class="name">${hg.name}</div>
            <div class="drafter-tag">${secondaryLabel}</div>
            <button class="status-btn" data-id="${hg.id}">
                ${hg.evicted ? 'Revive Guest' : 'Evict'}
            </button>
        `;
        memoryWall.appendChild(card);
    });

    // Add event listeners to buttons dynamically
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const hgId = parseInt(e.target.getAttribute('data-id'));
            toggleEviction(hgId);
        });
    });

    saveData();
    calculateStandings();
}

// 3. INTERACTIVE STATE TOGGLE
function toggleEviction(id) {
    houseguests = houseguests.map(hg => {
        if (hg.id === id) {
            return { ...hg, evicted: !hg.evicted };
        }
        return hg;
    });
    renderWall();
}

// 4. SCOREBOARD COMPUTATION
function calculateStandings() {
    const scores = {};

    houseguests.forEach(hg => {
        // Skip tracking standings for unchosen players
        if (hg.drafter === "Unchosen") return;

        if (!scores[hg.drafter]) {
            scores[hg.drafter] = { active: 0, total: 0 };
        }
        scores[hg.drafter].total++;
        if (!hg.evicted) {
            scores[hg.drafter].active++;
        }
    });

    let standingsHtml = '<ul class="standings-list">';
    for (const [drafter, stats] of Object.entries(scores)) {
        standingsHtml += `
            <li class="standings-item">
                <span><strong>${drafter}</strong></span>
                <span>${stats.active} / ${stats.total} Players Alive</span>
            </li>
        `;
    }
    standingsHtml += '</ul>';
    standingsContainer.innerHTML = standingsHtml;
}

// 5. CACHE STATE
function saveData() {
    localStorage.setItem('bbDraftData', JSON.stringify(houseguests));
}

// Initialize on execution
renderWall();
