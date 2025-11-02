// Cubes background
const NUM_CUBES = 6;
const CUBE_SIZE = 100;
const positions = [];

function isOverlapping(x, y, size, positions) {
  for (let pos of positions) {
    const dx = Math.abs(x - pos.x);
    const dy = Math.abs(y - pos.y);
    if (dx < size && dy < size) return true;
  }
  return false;
}

for (let i = 0; i < NUM_CUBES; i++) {
  let x, y, attempts = 0;
  do {
    x = Math.random() * (window.innerWidth - CUBE_SIZE);
    y = Math.random() * (window.innerHeight - CUBE_SIZE);
    attempts++;
  } while (isOverlapping(x, y, CUBE_SIZE, positions) && attempts < 100);

  positions.push({ x, y });
  const cube = document.createElement('div');
  cube.className = 'cube';
  cube.style.left = `${x}px`;
  cube.style.top = `${y}px`;
  document.body.appendChild(cube);
}

// Update server status
async function updateStatus() {
  try {
    const res = await fetch("/status");
    if (!res.ok) throw new Error("Network response not ok");
    const data = await res.json();

    const s1 = data.status1;
    const s2 = data.status2;

    document.getElementById("server1Title").textContent = s1.title;
    document.getElementById("server1Subtitle").textContent = s1.subtitle;
    document.getElementById("server1Indicator").style.backgroundColor = s1.color;

    document.getElementById("server2Title").textContent = s2.title;
    document.getElementById("server2Subtitle").textContent = s2.subtitle;
    document.getElementById("server2Indicator").style.backgroundColor = s2.color;

  } catch (err) {
    console.error("Failed to fetch server status:", err);
  }
}

setInterval(updateStatus, 1000);
updateStatus();
