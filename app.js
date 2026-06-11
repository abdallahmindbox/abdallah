const textarea = document.getElementById('userInput');

textarea.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {
    const inputField = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatContainer = document.getElementById('chat-container');
    
    const prompt = inputField.value.trim();
    if (!prompt) return;

    // UI Feedback
    inputField.value = '';
    inputField.disabled = true;
    sendBtn.disabled = true;

    appendMessage(prompt, "user");
    const aiMessageDiv = appendMessage("Processing request, abdallah is thinking 😅😁", "ai");

    try {
        // Send directly to our local secure backend
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: prompt })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Server error occurred");
        }

        aiMessageDiv.innerText = data.reply;

    } catch (error) {
        console.error(error);
        aiMessageDiv.className = "message system-message";
        aiMessageDiv.innerText = `System Error: ${error.message}`;
    } finally {
        inputField.disabled = false;
        sendBtn.disabled = false;
        inputField.focus();
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

function appendMessage(text, sender) {
    const chatContainer = document.getElementById('chat-container');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerText = text;
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    return messageDiv;
}