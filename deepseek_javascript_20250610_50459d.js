// Sample device database
const devices = {
    "iphone": {
        name: "iPhone 15 Pro",
        repairs: ["Screen", "Battery", "Back Glass"]
    },
    "macbook": {
        name: "MacBook Air M2", 
        repairs: ["Keyboard", "Battery", "Display"]
    }
};

// Camera setup
const video = document.getElementById('camera');
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => video.srcObject = stream);

// Identification function
document.getElementById('captureBtn').addEventListener('click', () => {
    const deviceKey = Math.random() > 0.5 ? "iphone" : "macbook"; // Mock AI
    const device = devices[deviceKey];
    
    document.getElementById('result').innerHTML = `
        <h2>Identified: ${device.name}</h2>
        <h3>Common Repairs:</h3>
        <ul>
            ${device.repairs.map(repair => 
                `<li>${repair} <a href="https://www.ifixit.com/search?q=${device.name}+${repair}" target="_blank">(Guide)</a></li>`
            ).join('')}
        </ul>
    `;
});