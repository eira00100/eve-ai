<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >

  <title>EVE</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      background: #0b0f14;
      color: #ffffff;
      font-family: Arial, sans-serif;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    header {
      padding: 18px;
      text-align: center;
      border-bottom: 1px solid #202630;
      font-size: 22px;
      font-weight: bold;
    }

    #messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
    }

    .message {
      margin-bottom: 14px;
      padding: 12px 15px;
      border-radius: 14px;
      max-width: 85%;
      line-height: 1.5;
      white-space: pre-wrap;
    }

    .user {
      background: #2563eb;
      margin-left: auto;
    }

    .eve {
      background: #1b222c;
      margin-right: auto;
    }

    form {
      display: flex;
      padding: 12px;
      gap: 8px;
      border-top: 1px solid #202630;
      background: #10151c;
    }

    input {
      flex: 1;
      padding: 14px;
      border: none;
      border-radius: 12px;
      background: #202833;
      color: white;
      font-size: 16px;
      outline: none;
    }

    button {
      padding: 14px 18px;
      border: none;
      border-radius: 12px;
      background: #2563eb;
      color: white;
      font-weight: bold;
    }

    button:disabled {
      opacity: 0.5;
    }
  </style>
</head>

<body>

<header>
  EVE
</header>

<div id="messages">
  <div class="message eve">
    Hello. I'm EVE. How can I help?
  </div>
</div>

<form id="chat">
  <input
    id="input"
    autocomplete="off"
    placeholder="Talk to EVE..."
  >

  <button id="send">
    Send
  </button>
</form>

<script>
  const form = document.getElementById("chat");
  const input = document.getElementById("input");
  const messages = document.getElementById("messages");
  const send = document.getElementById("send");

  function addMessage(text, type) {
    const div = document.createElement("div");

    div.className = "message " + type;
    div.textContent = text;

    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = input.value.trim();

    if (!message) return;

    addMessage(message, "user");

    input.value = "";
    send.disabled = true;
    send.textContent = "...";

    try {
      const response = await fetch("/api/chat", {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          message
        })
      });

      const data = await response.json();

      if (data.answer) {
        addMessage(data.answer, "eve");
      } else {
        addMessage(
          "Sorry, something went wrong: " +
          (data.error || "Unknown error"),
          "eve"
        );
      }

    } catch (error) {
      addMessage(
        "I couldn't connect to the EVE server.",
        "eve"
      );
    }

    send.disabled = false;
    send.textContent = "Send";
    input.focus();
  });
</script>

</body>
</html>
