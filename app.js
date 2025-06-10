// Complete fixed app.js with better device matching
document.addEventListener('DOMContentLoaded', function() {
    // Enhanced device database with iFixit naming conventions
    const DEVICE_MAP = {
        "iphone": {
            models: ["iPhone 15", "iPhone 14", "iPhone 13"],
            ifixitName: "iPhone" // Base name for iFixit URLs
        },
        "macbook": {
            models: ["MacBook Pro", "MacBook Air"],
            ifixitName: "MacBook"
        },
        "samsung": {
            models: ["Galaxy S23", "Galaxy S22"],
            ifixitName: "Galaxy"
        },
        "playstation": {
            models: ["PS5", "PS4"],
            ifixitName: "PlayStation"
        }
    };

    // DOM elements
    const video = document.getElementById('camera');
    const resultDiv = document.getElementById('result');
    const captureBtn = document.getElementById('captureBtn');

    // ======================
    // Improved Device Name Converter
    // ======================
    function convertToIfixitName(deviceName) {
        // First try exact matching
        const exactMatch = Object.values(DEVICE_MAP).flatMap(d => 
            d.models.map(m => ({ name: m, ifixit: d.ifixitName }))
            ).find(item => deviceName.includes(item.name));
        
        if (exactMatch) {
            // Handle special cases
            if (exactMatch.name.includes("iPhone")) {
                return `iPhone_${deviceName.match(/\d+/)[0]}`;
            }
            return exactMatch.ifixitName + "_" + exactMatch.name.split(' ').pop();
        }
        
        // Fallback to basic formatting
        return deviceName.replace(/\s+/g, '_');
    }

    // ======================
    // Enhanced Guide Fetcher with Fallback
    // ======================
    async function fetchDeviceGuides(deviceName) {
        const formattedName = convertToIfixitName(deviceName);
        const rssUrl = `https://www.ifixit.com/Device/${formattedName}/Guides.rss`;
        
        try {
            // Try direct CORS proxy first
            let response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`);
            
            // If no results, try broader search
            if (!response.ok) {
                const searchUrl = `https://www.ifixit.com/api/2.0/guides/search?query=${encodeURIComponent(deviceName)}`;
                response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(searchUrl)}`);
            }
            
            const data = await response.json();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data.contents, "text/xml");
            
            // Parse either RSS or API response
            const items = xmlDoc.querySelectorAll("item, guide");
            return Array.from(items).map(item => ({
                title: item.querySelector("title, guide_title")?.textContent || "Repair Guide",
                link: item.querySelector("link, url")?.textContent || 
                      `https://www.ifixit.com/Answers/Search?query=${encodeURIComponent(deviceName)}`,
                difficulty: item.querySelector("ifixit:difficulty, difficulty")?.textContent || "Moderate"
            })).slice(0, 5);
            
        } catch (error) {
            console.error("Guide loading failed:", error);
            // Final fallback - return basic troubleshooting
            return [
                {
                    title: "General Troubleshooting",
                    link: `https://www.ifixit.com/Answers/Search?query=${encodeURIComponent(deviceName)}`,
                    difficulty: "Basic"
                }
            ];
        }
    }

    // ======================
    // UI Rendering with Better Error States
    // ======================
    function renderResults(deviceName, guides) {
        let html = `<h2>${deviceName}</h2>`;
        
        if (!guides || guides.length === 0) {
            html += `
                <div class="error">
                    <p>Couldn't load specific guides.</p>
                    <button onclick="window.open('https://www.ifixit.com/Answers/Search?query=${encodeURIComponent(deviceName)}', '_blank')">
                        Search iFixit Manually
                    </button>
                </div>
            `;
        } else {
            html += `<ul class="guide-list">`;
            guides.forEach(guide => {
                html += `
                    <li>
                        <a href="${guide.link}" target="_blank">
                            <span class="guide-title">${guide.title}</span>
                            <span class="guide-difficulty">${guide.difficulty}</span>
                        </a>
                    </li>
                `;
            });
            html += `</ul>`;
        }
        
        // Add quick search buttons
        html += `
            <div class="quick-search">
                <p>Common issues:</p>
                <button onclick="window.open('https://www.ifixit.com/Answers/Search?query=${encodeURIComponent(deviceName + ' screen')}', '_blank')">Screen</button>
                <button onclick="window.open('https://www.ifixit.com/Answers/Search?query=${encodeURIComponent(deviceName + ' battery')}', '_blank')">Battery</button>
                <button onclick="window.open('https://www.ifixit.com/Answers/Search?query=${encodeURIComponent(deviceName + ' charging')}', '_blank')">Charging</button>
            </div>
        `;
        
        return html;
    }

    // ======================
    // Main App Flow
    // ======================
    captureBtn.addEventListener('click', async () => {
        // Mock detection - replace with your AI later
        const deviceType = Object.keys(DEVICE_MAP)[Math.floor(Math.random() * Object.keys(DEVICE_MAP).length)];
        const detectedDevice = DEVICE_MAP[deviceType].models[0];
        
        // Show loading state
        resultDiv.innerHTML = `
            <div class="loading">
                <p>Identifying device...</p>
                <div class="spinner"></div>
            </div>
        `;
        
        // Fetch guides with multiple fallbacks
        const guides = await fetchDeviceGuides(detectedDevice);
        
        // Render results
        resultDiv.innerHTML = renderResults(detectedDevice, guides);
    });

    // Initialize camera
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => video.srcObject = stream)
        .catch(err => resultDiv.innerHTML = `
            <div class="error">
                <p>Camera error: ${err.message}</p>
                <p>The app will still work for guide lookup.</p>
            </div>
        `);
});
