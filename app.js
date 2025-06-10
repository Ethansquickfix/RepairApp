// ======================
// CONFIGURATION
// ======================
const DEVICE_GUIDES = {
    "iPhone 13": ["Screen Replacement", "Battery Replacement", "Back Glass Repair"],
    "iPhone 12": ["Display Assembly", "Camera Repair", "Charging Port"],
    "MacBook Air M1": ["Battery Replacement", "Keyboard Repair", "Trackpad"],
    "Galaxy S23": ["Screen Repair", "USB-C Port", "Back Glass"],
    "PS5": ["HDMI Port Replacement", "Fan Cleaning", "Power Supply"]
};

// ======================
// EMBEDDED GUIDE VIEWER
// ======================
function showEmbeddedGuide(guideTitle, deviceName) {
    // Clean the guide title for URL
    const cleanTitle = guideTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const embedUrl = `https://www.ifixit.com/Guide/${encodeURIComponent(deviceName.replace(/\s+/g, '+'))}+${encodeURIComponent(cleanTitle)}/embed`;
    
    resultDiv.innerHTML = `
        <div class="guide-viewer">
            <h3>${guideTitle}</h3>
            <iframe src="${embedUrl}" class="guide-iframe"></iframe>
            <button onclick="showDeviceGuides('${deviceName}')">← Back to Repairs</button>
        </div>
    `;
}

// ======================
// DEVICE GUIDE DISPLAY
// ======================
function showDeviceGuides(deviceName) {
    const guides = DEVICE_GUIDES[deviceName] || [
        "Battery Replacement",
        "Screen Repair",
        "Charging Port Repair"
    ];
    
    let html = `
        <h2>${deviceName}</h2>
        <h3>Select Repair:</h3>
        <ul class="guide-list">
    `;
    
    guides.forEach(guide => {
        html += `
            <li>
                <button onclick="showEmbeddedGuide('${guide}', '${deviceName}')">
                    ${guide}
                </button>
            </li>
        `;
    });
    
    html += `</ul>`;
    resultDiv.innerHTML = html;
}

// ======================
// MAIN APP FLOW
// ======================
const video = document.getElementById('camera');
const resultDiv = document.getElementById('result');

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
    
    setTimeout(() => showDeviceGuides(randomDevice), 800);
});

// Initialize camera
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => video.srcObject = stream)
    .catch(err => console.log("Camera not available"));
