const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

function appendMessage(sender, text) {
    const msg = document.createElement('div');
    msg.classList.add('message', sender);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msg;
}

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const userMessage = input.value.trim();
    if (!userMessage) return;

    appendMessage('user', userMessage);
    input.value = '';

    const thinkingMessageElement = appendMessage('bot', 'Gemini is thinking...');

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: userMessage
            })
        });

        // Hapus atau update pesan 'thinking' setelah respons diterima
        if (thinkingMessageElement && thinkingMessageElement.parentNode) {
            thinkingMessageElement.parentNode.removeChild(thinkingMessageElement);
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new Error(`HTTP error! Status: ${response.status}, Details: ${errorData.message || 'No specific error message.'}`);
        }

        const data = await response.json();
        appendMessage('bot', data.reply);
    } catch (error) {
        console.error('Error sending message:', error);
        if (thinkingMessageElement && thinkingMessageElement.parentNode) {
            thinkingMessageElement.parentNode.removeChild(thinkingMessageElement);
        }
        appendMessage('bot', 'Error: Could not get a response from the server. Please try again later.');
    }
});