// 1. FIREBASE SETTING CONNECTION
const firebaseConfig = {
  apiKey: "AIzaSyD7P3zDcxJxHNbU3wwu2wIeVD0lj9AiBGw",
  authDomain: "bb-draft-2dc8a.firebaseapp.com",
  databaseURL: "https://bb-draft-2dc8a-default-rtdb.firebaseio.com",
  projectId: "bb-draft-2dc8a",
  storageBucket: "bb-draft-2dc8a.firebasestorage.app",
  messagingSenderId: "410738650882",
  appId: "1:410738650882:web:fc0b1b684e025baa6b5c1b"
};

// Access the global namespace directly
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// 1. DATA CONFIGURATION (Pre-populated with your 17 houseguests and images folder path)
const initialHouseguests = [
    { id: 1, name: "Barrett", drafter: "Jordyn", image: "./images/barrett.jpeg", evicted: false },
    { id: 2, name: "Taylor", drafter: "Emily", image: "./images/taylor.jpeg", evicted: false },
    { id: 3, name: "Mallory", drafter: "Gabby", image: "./images/mallory.jpeg", evicted: false },
    { id: 4, name: "La Trice", drafter: "Kait", image: "./images/latrice.jpeg", evicted: false },
    { id: 5, name: "Rome", drafter: "Hawk", image: "./images/rome.jpeg", evicted: false },
    { id: 6, name: "Yash", drafter: "Nick", image: "./images/yash.jpeg", evicted: false },
    { id: 7, name: "Dee", drafter: "Noah", image: "./images/dee.jpg", evicted: false },
    { id: 8, name: "Lyric", drafter: "Luke", image: "./images/lyric.jpeg", evicted: false },
    { id: 9, name: "Chuk", drafter: "Luke", image: "./images/chuk.jpeg", evicted: false },
    { id: 10, name: "Rick", drafter: "Noah", image: "./images/rick.jpg", evicted: false },
    { id: 11, name: "Jason", drafter: "Nick", image: "./images/jason.jpeg", evicted: false },
    { id: 12, name: "Ashley", drafter: "Hawk", image: "./images/ashley.jpeg", evicted: false },
    { id: 13, name: "Melody", drafter: "Kait", image: "./images/melody.jpeg", evicted: false },
    { id: 14, name: "Kamu", drafter: "Gabby", image: "./images/kamu.jpeg", evicted: false },
    { id: 15, name: "Haley", drafter: "Emily", image: "./images/haley.jpeg", evicted: false },
    { id: 16, name: "Drew", drafter: "Jordyn", image: "./images/drew.jpeg", evicted: false },
    { id: 17, name: "Angela", drafter: "Unchosen", image: "./images/angela.jpg", evicted: false }
];

// Initialize with baseline data structure before database payload arrives
let houseguests = [...initialHouseguests];

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
    
    // Optimistically render instantly on screen click
    renderWall();
    // Sync the update directly to Firebase cloud
    saveData();
}

// 4. SCOREBOARD & PROGRESS CALCULATION
function calculateStandings() {
    const scores = {};

    houseguests.forEach(hg => {
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
        const displayName = drafter === "Unchosen" ? "<em>Unchosen (Angela)</em>" : drafter;
        
        standingsHtml += `
            <li class="standings-item">
                <span><strong>${displayName}</strong></span>
                <span>${stats.active} / ${stats.total} Players Alive</span>
            </li>
        `;
    }
    standingsHtml += '</ul>';
    standingsContainer.innerHTML = standingsHtml;
}

// 5. CLOUD STORAGE STATE SYNC
function saveData() {
    // Save to LocalStorage as a local backup
    localStorage.setItem('bbDraftData', JSON.stringify(houseguests));
    // Push the state up into your Firebase database node
    database.ref("draft_state").set(houseguests);
}

// 6. LISTEN FOR LIVE CLOUD UPDATES
// This triggers automatically whenever data shifts inside Firebase, rendering updates across all phones live!
database.ref("draft_state").on("value", (snapshot) => {
    const cloudData = snapshot.val();
    if (cloudData) {
        houseguests = cloudData;
        renderWall();
    } else {
        // If your database is brand new and completely blank, seed it with your 17-player list
        houseguests = [...initialHouseguests];
        renderWall();
        saveData();
    }
});
