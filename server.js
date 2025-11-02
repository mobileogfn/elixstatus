import express from "express";
import { Client, GatewayIntentBits } from "discord.js";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

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

setInterval(() => {
  if (status1.countdownRunning && status1.countdown > 0) {
    status1.subtitle = `The Bus Starts In ${status1.countdown} seconds`;
    status1.countdown--;
  } else if (status1.countdownRunning && status1.countdown <= 0) {
    status1.subtitle = "EU Lategame Solo Server Is Starting Soon!";
    status1.title = "EU Lategame Solo Server Starting!";
    status1.color = "yellow";
    status1.countdownRunning = false;
  }

  if (status2.countdownRunning && status2.countdown > 0) {
    status2.subtitle = `The Bus Starts In ${status2.countdown} seconds`;
    status2.countdown--;
  } else if (status2.countdownRunning && status2.countdown <= 0) {
    status2.subtitle = "EU LTM Server Is Starting Soon!";
    status2.title = "EU LTM Server Starting!";
    status2.color = "yellow";
    status2.countdownRunning = false;
  }
}, 1000);

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  const content = message.content.toLowerCase();

  const extractNumber = text => text.match(/\d+/)?.[0] || "0";

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

app.get("/status", (req, res) => {
  res.json({ status1, status2 });
});

client.login(process.env.DISCORD_TOKEN);

app.listen(3000, () => console.log("Server running on port 3000"));
