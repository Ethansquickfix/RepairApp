// ======================
// RSS Feed Integration
// ======================

async function fetchDeviceGuides(deviceName) {
  // Convert "iPhone 15 Pro" to "iPhone_15_Pro"
  const formattedName = deviceName.replace(/\s+/g, '_');
  const rssUrl = `https://www.ifixit.com/Device/${formattedName}/Guides.rss`;
  
  try {
    // Using CORS proxy to avoid issues (free service)
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const response = await fetch(`${proxyUrl}${encodeURIComponent(rssUrl)}`);
    const data = await response.json();
    
    // Parse the RSS XML content
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data.contents, "text/xml");
    
    // Extract guide information
    const items = xmlDoc.querySelectorAll("item");
    const guides = Array.from(items).map(item => ({
      title: item.querySelector("title").textContent,
      link: item.querySelector("link").textContent,
      difficulty: item.querySelector("ifixit:difficulty")?.textContent || "Unknown"
    }));
    
    return guides.slice(0, 5); // Return first 5 guides
  } catch (error) {
    console.error("Guide loading failed:", error);
    return []; // Return empty array if error
  }
}

// ======================
// Main App Functionality
// ======================

document.getElementById('captureBtn').addEventListener('click', async () => {
  // For now, using mock detection - replace later with AI
  const detectedDevice = "iPhone 13"; 
  
  // Show loading state
  document.getElementById('result').innerHTML = `
    <div class="loading">
      <p>🔍 Searching guides for ${detectedDevice}...</p>
    </div>
  `;
  
  // Fetch actual guides from iFixit
  const guides = await fetchDeviceGuides(detectedDevice);
  
  // Display results
  if (guides.length > 0) {
    let html = `<h3>${detectedDevice} Repair Guides</h3><ul class="guide-list">`;
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
    document.getElementById('result').innerHTML = html;
  } else {
    document.getElementById('result').innerHTML = `
      <div class="error">
        <p>No guides found for ${detectedDevice}.</p>
        <p>Try searching directly on <a href="https://www.ifixit.com/Answers/Search?query=${encodeURIComponent(detectedDevice)}" target="_blank">iFixit.com</a></p>
      </div>
    `;
  }
});
