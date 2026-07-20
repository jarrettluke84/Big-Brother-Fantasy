// 1. DATA CONFIGURATION (Directly mapped from your physical draft paper)
var initialHouseguests = [
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
    { id: 17, name: "Angela", drafter: "Unchosen", image: "angela.jpg", evicted: false }
];

var houseguests = initialHouseguests;

// Safety storage check
try {
    var savedData = localStorage.getItem('bbDraftData');
    if (savedData) {
        var parsed = JSON.parse(savedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
            houseguests = parsed;
        }
    }
} catch (e) {
    console.log("Storage fallthrough");
}

// 2. RENDER MEMORY WALL INTERACTIVE GRID
function renderWall() {
    var memoryWall = document.getElementById('memoryWall');
    if (!memoryWall) return;
    memoryWall.innerHTML = '';
    
    houseguests.forEach(function(hg) {
        var card = document.createElement('div');
        card.className = 'houseguest-card ' + (hg.evicted ? 'evicted' : '');
        
        var subtitleLabel = hg.drafter === "Unchosen" ? "Unchosen" : "(" + hg.drafter + "'s Pick)";
        var buttonText = hg.evicted ? "In House" : "Out of House";

        card.innerHTML = `
            <div class="portrait-container">
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

    var buttons = document.querySelectorAll('.status-btn');
    buttons.forEach(function(btn) {
        btn.onclick = function(e) {
            var hgId = parseInt(e.target.getAttribute('data-id'));
            toggleEviction(hgId);
        };
    });

    saveData();
    calculateStandings();
}

// 3. EVENT HANDLER FOR HOUSEGUEST STATE ALTERATIONS
function toggleEviction(id) {
    houseguests = houseguests.map(function(hg) {
        if (hg.id === id) {
            hg.evicted = !hg.evicted;
        }
        return hg;
    });
    renderWall();
}

// 4. SCOREBOARD & PROGRESS CALCULATION
function calculateStandings() {
    var standingsContainer = document.getElementById('standings');
    if (!standingsContainer) return;
    var scores = {};

    houseguests.forEach(function(hg) {
        if (hg.drafter === "Unchosen") return;

        if (!scores[hg.drafter]) {
            scores[hg.drafter] = { active: 0, total: 0 };
        }
        scores[hg.drafter].total++;
        if (!hg.evicted) {
            scores[hg.drafter].active++;
        }
    });

    var standingsHtml = '<div class="standings-list">';
    for (var drafter in scores) {
        if (scores.hasOwnProperty(drafter)) {
            var stats = scores[drafter];
            var percentAlive = (stats.active / stats.total) * 100;
            var dangerClass = stats.active < stats.total ? 'danger' : '';

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
    }
    standingsHtml += '</div>';
    standingsContainer.innerHTML = standingsHtml;
}

// 5. CACHE STATE CHANGES WITH FALLBACK
function saveData() {
    try {
        localStorage.setItem('bbDraftData', JSON.stringify(houseguests));
    } catch (e) {}
}

// Launch application
renderWall();
