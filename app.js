// ==========================================
// Electronics Repair Assistant - Complete app.js
// Features:
// 1. Camera access for future AI integration
// 2. Live iFixit guide loading via RSS
// 3. Error handling and loading states
// 4. Clean UI with difficulty ratings
// ==========================================

// Configuration
const SUPPORTED_DEVICES = {
    "iphone": ["iPhone 13", "iPhone 12", "iPhone 11"],
    "macbook": ["MacBook Pro 2020", "MacBook Air M1"],
    "samsung": ["Galaxy S23", "Galaxy S22"],
    "playstation": ["PS5", "PS4"]
};

// DOM Elements
const video = document.getElementById('camera');
const resultDiv = document.getElementById('result');

// ======================
// Device Camera Setup
// ======================
async function setupCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: 'environment' } // Rear camera on mobile
        });
        video.srcObject = stream;
    } catch (err) {
        resultDiv.innerHTML = `
            <div class="error">
                <p>Camera error: ${err.message}</p>
                <p>Try on smartphone or enable permissions.</p>
            </div>
        `;
    }
}

// ======================
// iFixit Guide Fetching (RSS)
// ======================
async function fetchDeviceGuides(deviceName) {
    // Convert device names to iFixit format (e.g., "iPhone 13 Pro" → "iPhone_13_Pro")
    const formattedName = deviceName.replace(/\s+/g, '_');
    const rssUrl = `https://www.ifixit.com/Device/${formattedName}/Guides.rss`;
    
    try {
        // Using CORS proxy (free tier)
        const proxyUrl = 'https://api.allorigins.win/get?url=';
        const response = await fetch(`${proxyUrl}${encodeURIComponent(rssUrl)}`);
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, "text/xml");
        
        // Extract guide data
        const items = xmlDoc.querySelectorAll("item");
        const guides = Array.from(items).map(item => ({
            title: item.querySelector("title").textContent,
            link: item.querySelector("link").textContent,
            difficulty: item.querySelector("ifixit:difficulty")?.textContent || "Moderate"
        }));
        
        return guides.slice(0, 5); // Return first 5 guides
        
    } catch (error) {
        console.error("Failed to load guides:", error);
        return []; // Return empty array on error
    }
}

// ======================
// UI Rendering
// ======================
function renderGuides(deviceName, guides) {
    if (guides.length === 0) {
        return `
            <div class="error">
                <p>No guides found for ${deviceName}.</p>
                <p>Try searching directly on <a href="https://www.ifixit.com/Answers/Search?query=${encodeURIComponent(deviceName)}" target="_blank">iFixit.com</a></p>
            </div>
        `;
    }
    
    let html = `
        <h3>${deviceName} Repair Guides</h3>
        <ul class="guide-list">
    `;
    
    guides.forEach(guide => {
        html += `
            <li>
                <a href="${guide.link}" target="_blank">
                    <span class="guide-title">${guide.title}</span>
                    <span class="guide-difficulty">Difficulty: ${guide.difficulty}</span>
                </a>
            </li>
        `;
    });
    
    html += `</ul>`;
    return html;
}

// ======================
// Main App Logic
// ======================
document.getElementById('captureBtn').addEventListener('click', async () => {
    // For now, using mock detection - replace later with AI
    const deviceType = Object.keys(SUPPORTED_DEVICES)[Math.floor(Math.random() * Object.keys(SUPPORTED_DEVICES).length)];
    const detectedDevice = SUPPORTED_DEVICES[deviceType][0];
    
    // Show loading state
    resultDiv.innerHTML = `
        <div class="loading">
            <p>🔍 Identifying device...</p>
            <p>Detected: ${detectedDevice}</p>
            <p>Loading guides...</p>
        </div>
    `;
    
    // Fetch guides from iFixit
    const guides = await fetchDeviceGuides(detectedDevice);
    
    // Display results
    resultDiv.innerHTML = `
        <h2>Identified: ${detectedDevice}</h2>
        ${renderGuides(detectedDevice, guides)}
        <div class="actions">
            <button onclick="window.open('https://www.ifixit.com/Device/${detectedDevice.replace(/\s+/g, '_')}')">
                View All Guides
            </button>
        </div>
    `;
});

// ======================
// Initialization
// ======================
setupCamera();

// Utility function for direct search
window.searchRepair = function(device, problem) {
    window.open(`https://www.ifixit.com/Answers/Search?query=${encodeURIComponent(device + ' ' + problem)}`, '_blank');
};
