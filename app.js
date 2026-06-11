const textarea = document.getElementById('userInput');

// OpenRouter allows websites to communicate directly without a backend server
const OPENROUTER_API_KEY = "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";

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

    inputField.value = '';
    inputField.disabled = true;
    sendBtn.disabled = true;

    appendMessage(prompt, "user");
    const aiMessageDiv = appendMessage("Abdallah Woxmo processing request...", "ai");

    try {
        // Fetching directly from OpenRouter's browser-allowed API gateway
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "HTTP-Referer": window.location.origin, 
                "X-Title": "Abdallah Woxmo Workspace"
            },
            body: JSON.stringify({
                model: "meta-llama/llama-3.1-8b-instruct:free", 
                messages: [{ role: "user", content: prompt }]
            })
        });

        const textData = await response.text();
        const data = JSON.parse(textData);

        if (!response.ok) {
            throw new Error(data.error?.message || "API Error");
        }

        aiMessageDiv.innerText = data.choices[0].message.content;

    } catch (error) {
        console.error(error);
        aiMessageDiv.className = "message system-message";
        aiMessageDiv.innerText = `Error: ${error.message}`;
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
