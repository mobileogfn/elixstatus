// Backend URL — local testing or deployed server
const BACKEND_URL = "http://localhost:3000";

async function updateStatus() {
  try {
    const res = await fetch(`${BACKEND_URL}/status`);
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
