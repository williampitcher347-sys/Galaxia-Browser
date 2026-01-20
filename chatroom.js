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

async function deleteMessage(id) {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
  renderMessages();
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
      <button class="delete-btn" data-id="${msg.id}">❌</button>
    `;

    chat.appendChild(bubble);
  });

  // Attach delete button events
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      deleteMessage(id);
    });
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

renderMessages();
