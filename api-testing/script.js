// Utility function to update status
function updateStatus(isSupported) {
    const statusContainer = document.getElementById('status-container');
    const statusClass = isSupported ? 'success' : 'error';
    const statusText = isSupported ? 
        'AI System Ready' : 
        'AI System Not Available';
    
    statusContainer.innerHTML = `
        <div class="status-badge ${statusClass}">
            ${statusText}
        </div>
    `;
}

// Check for Chrome AI API support
async function checkAISupport() {
    try {
        if (!chrome?.aiLanguageModel) {
            return false;
        }
        
        const capabilities = await chrome.aiLanguageModel.capabilities();
        return capabilities.available === 'readily';
    } catch (error) {
        console.error('AI Support Check Failed:', error);
        return false;
    }
}

// Process text with AI
async function processWithAI(prompt) {
    try {
        const model = await chrome.aiLanguageModel.create();
        return await model.prompt(prompt);
    } catch (error) {
        throw new Error(`AI Processing Failed: ${error.message}`);
    }
}

// Generate appropriate prompt based on action
function generatePrompt(action, text) {
    const prompts = {
        'summarize': `Please provide a clear and concise summary of the following text: ${text}`,
        'improve': `Please improve the writing quality while maintaining the meaning: ${text}`,
        'translate': `Translate the following text to Spanish: ${text}`,
        'explain': `Explain this concept in simple, easy-to-understand terms: ${text}`,
        'analyze': `Analyze the following text and provide key insights: ${text}`
    };
    return prompts[action] || text;
}

// Main click handler
document.getElementById('process-btn').addEventListener('click', async () => {
    const input = document.getElementById('input');
    const action = document.getElementById('action');
    const output = document.getElementById('output');

    if (!input.value.trim()) {
        output.innerHTML = `
            <div class="error">
                Please enter some text to process
            </div>
        `;
        return;
    }

    output.innerHTML = `
        <p class="loading">
            Processing your request... Please wait...
        </p>
    `;

    try {
        const isSupported = await checkAISupport();
        if (!isSupported) {
            throw new Error('Chrome AI features not available');
        }

        const prompt = generatePrompt(action.value, input.value);
        const result = await processWithAI(prompt);

        output.innerHTML = `
            <div class="result-container">
                <h3 class="result-header">
                    ${action.options[action.selectedIndex].text} Result:
                </h3>
                <div class="result-content">
                    ${result}
                </div>
            </div>
        `;

    } catch (error) {
        output.innerHTML = `
            <div class="error">
                <strong>Error:</strong> ${error.message}
                <br><br>
                To use this application:
                <ul>
                    <li>Use Chrome Canary (version 127+)</li>
                    <li>Enable these flags:
                        <ul>
                            <li>chrome://flags/#prompt-api-for-gemini-nano</li>
                            <li>chrome://flags/#optimization-guide-on-device-model</li>
                        </ul>
                    </li>
                    <li>Restart your browser</li>
                </ul>
            </div>
        `;
    }
});

// Initialize on page load
window.addEventListener('load', async () => {
    const processBtn = document.getElementById('process-btn');
    const isSupported = await checkAISupport();
    
    updateStatus(isSupported);
    
    if (!isSupported) {
        processBtn.disabled = true;
        processBtn.textContent = 'AI Not Available';
    }
});