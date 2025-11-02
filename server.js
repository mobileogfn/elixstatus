import express from "express";
import { Client, GatewayIntentBits } from "discord.js";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "public"))); // Serve frontend

// Discord Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Initial status objects
let status1 = {
  title: "EU Lategame Solo Server Loading!",
  subtitle: "EU Lategame Solo Server Is Loading!",
  color: "red",
  countdown: 0,
  countdownRunning: false
};

let status2 = {
  title: "EU LTM Server Loading!",
  subtitle: "EU LTM Server Is Loading!",
  color: "red",
  countdown: 0,
  countdownRunning: false
};

const CHANNEL_ID_1 = "1432106730162094185";
const CHANNEL_ID_2 = "1432107616439500903";

// Countdown updater
setInterval(() => {
  [status1, status2].forEach(s => {
    if (s.countdownRunning && s.countdown > 0) {
      s.subtitle = `The Bus Starts In ${s.countdown} seconds`;
      s.countdown--;
    } else if (s.countdownRunning && s.countdown <= 0) {
      s.subtitle = s.title.includes("Solo") ? "EU Lategame Solo Server Is Starting Soon!" : "EU LTM Server Is Starting Soon!";
      s.title = s.title.includes("Solo") ? "EU Lategame Solo Server Starting!" : "EU LTM Server Starting!";
      s.color = "yellow";
      s.countdownRunning = false;
    }
  });
}, 1000);

// Discord messages listener
client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  const content = message.content.toLowerCase();
  const extractNumber = text => text.match(/\d+/)?.[0] || "0";

  // SERVER 1
  if (message.channelId === CHANNEL_ID_1) {
    if (content.includes("server up")) {
      status1.title = "EU Lategame Solo Server Joinable!";
      status1.color = "limegreen";
      status1.countdown = 120;
      status1.countdownRunning = true;
    } else if (content.includes("server started")) {
      const number = extractNumber(content);
      status1.title = "EU Lategame Solo Server Has Started!";
      status1.subtitle = `The server is currently in the Lategame phase with ${number} Players!`;
      status1.color = "yellow";
      status1.countdownRunning = false;
    } else if (content.includes("server crash")) {
      const number = extractNumber(content);
      status1.title = "Server Restarting Due to Low Player Count";
      status1.subtitle = `Server restarting due to only having ${number} players!`;
      status1.color = "purple";
      status1.countdownRunning = false;
    }
  }

  // SERVER 2
  if (message.channelId === CHANNEL_ID_2) {
    if (content.includes("server up")) {
      status2.title = "EU LTM Server Joinable!";
      status2.color = "limegreen";
      status2.countdown = 120;
      status2.countdownRunning = true;
    } else if (content.includes("server started")) {
      const number = extractNumber(content);
      status2.title = "EU LTM Server Has Started!";
      status2.subtitle = `The server is currently in the LTM phase with ${number} Players!`;
      status2.color = "yellow";
      status2.countdownRunning = false;
    } else if (content.includes("server crash")) {
      const number = extractNumber(content);
      status2.title = "Server Restarting Due to Low Player Count";
      status2.subtitle = `Server restarting due to only having ${number} players!`;
      status2.color = "purple";
      status2.countdownRunning = false;
    }
  }
});

// Endpoint for frontend
app.get("/status", (req, res) => {
  res.json({ status1, status2 });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

client.login(process.env.DISCORD_TOKEN);
