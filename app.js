const textarea = document.getElementById('userInput');

// Your active NVIDIA API Key
const NVIDIA_API_KEY = "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";

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
        // FIXED URL: Sending directly to NVIDIA instead of a local backend path
        const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${NVIDIA_API_KEY}`
            },
            body: JSON.stringify({
                model: "meta/llama-3.1-8b-instruct", 
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
                max_tokens: 1024
            })
        });

        const textData = await response.text();
        const data = JSON.parse(textData);

        if (!response.ok) {
            throw new Error(data.message || "NVIDIA Error");
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