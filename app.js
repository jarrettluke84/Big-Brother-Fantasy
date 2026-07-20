// 1. DATA CONFIGURATION
// Pre-populated with your 17 houseguests and their respective drafters
const initialHouseguests = [
    { id: 1, name: "Barrett", drafter: "Jordyn", evicted: false },
    { id: 2, name: "Taylor", drafter: "Emily", evicted: false },
    { id: 3, name: "Mallory", drafter: "Gabby", evicted: false },
    { id: 4, name: "La Trice", drafter: "Kait", evicted: false },
    { id: 5, name: "Rome", drafter: "Hawk", evicted: false },
    { id: 6, name: "Yash", drafter: "Nick", evicted: false },
    { id: 7, name: "Dee", drafter: "Noah", evicted: false },
    { id: 8, name: "Lyric", drafter: "Luke", evicted: false },
    { id: 9, name: "Chuk", drafter: "Luke", evicted: false },
    { id: 10, name: "Rick", drafter: "Noah", evicted: false },
    { id: 11, name: "Jason", drafter: "Nick", evicted: false },
    { id: 12, name: "Ashley", drafter: "Hawk", evicted: false },
    { id: 13, name: "Melody", drafter: "Kait", evicted: false },
    { id: 14, name: "Kamu", drafter: "Gabby", evicted: false },
    { id: 15, name: "Haley", drafter: "Emily", evicted: false },
    { id: 16, name: "Drew", drafter: "Jordyn", evicted: false },
    { id: 17, name: "Angela", drafter: "None (Unchosen)", evicted: false }
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
        
        // Extract initials for placeholder avatar text
        const initials = hg.name.split(' ').map(n => n[0]).join('').toUpperCase();

        card.innerHTML = `
            <div class="avatar-placeholder">${initials}</div>
            <div class="name">${hg.name}</div>
            <div class="drafter-tag">Drafter: ${hg.drafter}</div>
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
        // Skip tracking scores for unchosen players
        if (hg.drafter === "None (Unchosen)") return;

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
