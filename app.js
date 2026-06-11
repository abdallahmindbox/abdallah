const textarea = document.getElementById('userInput');

// Using an OpenRouter key ensures the browser doesn't block the request via CORS
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