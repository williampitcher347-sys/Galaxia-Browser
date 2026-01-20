const chat = document.getElementById("chat");
const input = document.getElementById("msgInput");
const sendBtn = document.getElementById("sendBtn");

const API_URL = "https://696fdb3ca06046ce61880d4c.mockapi.io/Galaxia-messages";

function formatTime() {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

async function saveMessage(text) {
  const message = {
    user: "You",
    text: text,
    time: formatTime()
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message)
  });
}

async function renderMessages() {
  const res = await fetch(API_URL);
  const messages = await res.json();

  chat.innerHTML = "";
  messages.forEach(msg => {
    const bubble = document.createElement("div");
    bubble.className = "bubble me";

    bubble.innerHTML = `
      <div>${msg.text}</div>
      <div class="meta">${msg.time}</div>
    `;

    chat.appendChild(bubble);
  });

  chat.scrollTop = chat.scrollHeight;
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  await saveMessage(text);
  await renderMessages();

  input.value = "";
}

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

/* 🔥 Auto-refresh every 3 minutes */
setInterval(renderMessages, 180000);

/* Load messages on startup */
renderMessages();
