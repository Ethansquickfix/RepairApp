// CONFIG - Customize these devices and guides
const DEVICE_GUIDES = {
    "iPhone 13": {
        "Screen Replacement": "iphone-13-screen-replacement",
        "Battery Replacement": "iphone-13-battery-replacement",
        "Charging Port": "iphone-13-charging-port-replacement"
    },
    "MacBook Air M1": {
        "Battery Replacement": "macbook-air-m1-2020-battery-replacement",
        "Keyboard Replacement": "macbook-air-m1-keyboard-replacement"
    },
    "PS5": {
        "HDMI Port Replacement": "ps5-hdmi-port-replacement",
        "Fan Cleaning": "ps5-cooling-fan-replacement"
    }
};

// DOM Elements
const video = document.getElementById('camera');
const resultDiv = document.getElementById('result');

// ======================
// EMBED REAL GUIDES (NOT FORUMS)
// ======================
function showEmbeddedGuide(deviceName, repairName, guideSlug) {
    resultDiv.innerHTML = `
        <div class="guide-container">
            <h3>${deviceName} - ${repairName}</h3>
            <div class="guide-actions">
                <button onclick="showDeviceGuides('${deviceName}')">← Back to Repairs</button>
                <button onclick="window.open('https://www.ifixit.com/Guide/${guideSlug}')">
                    View on iFixit.com ↗
                </button>
            </div>
            <iframe 
                src="https://www.ifixit.com/Guide/${guideSlug}/embed" 
                class="guide-iframe"
                loading="lazy">
            </iframe>
        </div>
    `;
}

// ======================
// SHOW AVAILABLE REPAIRS
// ======================
function showDeviceGuides(deviceName) {
    const guides = DEVICE_GUIDES[deviceName] || {
        "Battery Replacement": "battery-replacement",
        "Screen Repair": "screen-replacement"
    };

    let html = `
        <h2>${deviceName}</h2>
        <h3>Select Repair:</h3>
        <div class="repair-buttons">
    `;

    for (const [repairName, guideSlug] of Object.entries(guides)) {
        html += `
            <button 
                onclick="showEmbeddedGuide('${deviceName}', '${repairName}', '${guideSlug}')"
                class="repair-btn">
                ${repairName}
            </button>
        `;
    }

    html += `</div>`;
    resultDiv.innerHTML = html;
}

// ======================
// MAIN APP FLOW
// ======================
document.getElementById('captureBtn').addEventListener('click', () => {
    // Mock detection - replace with your AI later
    const devices = Object.keys(DEVICE_GUIDES);
    const randomDevice = devices[Math.floor(Math.random() * devices.length)];
    
    resultDiv.innerHTML = `
        <div class="loading">
            <h2>Identified: ${randomDevice}</h2>
            <p>Loading repair options...</p>
        </div>
    `;
    
    setTimeout(() => showDeviceGuides(randomDevice), 500);
});

// Initialize camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => video.srcObject = stream)
    .catch(err => console.log("Camera not available"));
