// Initialize window.ai if not exists
if (!window.ai) {
    window.ai = {};
}

// Constants for prompt templates
const PROMPT_TEMPLATES = {
    summarize: {
        instruction: "Provide a clear and concise summary in 2-3 sentences:",
        template: (text) => `Summarize this text concisely: ${text}`
    },
    improve: {
        instruction: "Improve writing while maintaining core meaning:",
        template: (text) => `Enhance this text for clarity and professionalism: ${text}`
    },
    translate: {
        instruction: "Translate to Spanish:",
        template: (text) => `Translate to Spanish and provide pronunciation guide: ${text}`
    },
    explain: {
        instruction: "Explain in simple terms:",
        template: (text) => `Explain this concept in simple, easy-to-understand terms with an example: ${text}`
    },
    analyze: {
        instruction: "Analyze text and provide insights:",
        template: (text) => `Analyze this text and provide key points, tone, and suggestions: ${text}`
    }
};

// Test AI API functionality
async function testAIAPI() {
    try {
        // Check if chrome.aiOriginTrial exists
        if (!chrome?.aiOriginTrial?.languageModel) {
            console.log('Chrome AI API not available');
            return false;
        }

        // Check capabilities
        const capabilities = await chrome.aiOriginTrial.languageModel.capabilities();
        console.log('AI Capabilities:', capabilities);

        if (capabilities.available === 'readily') {
            const session = await chrome.aiOriginTrial.languageModel.create();
            const response = await session.prompt('Hello, are you working?');
            console.log('AI Response:', response);
            return true;
        } else {
            console.log('AI not ready:', capabilities.available);
            return false;
        }
    } catch (error) {
        console.error('AI Test Failed:', error);
        return false;
    }
}

// Check for AI support
async function checkAISupport() {
    try {
        // Check if chrome.aiOriginTrial exists
        if (!chrome?.aiOriginTrial?.languageModel) {
            console.log('Chrome AI API not available');
            return false;
        }

        // Check capabilities
        const capabilities = await chrome.aiOriginTrial.languageModel.capabilities();
        console.log('AI Capabilities:', capabilities);

        return capabilities.available === 'readily';
    } catch (error) {
        console.error('AI Support Check Failed:', error);
        return false;
    }
}

// Process text with AI
async function processWithAI(prompt) {
    let retries = 3;
    while (retries > 0) {
        try {
            const capabilities = await chrome.aiOriginTrial.languageModel.capabilities();
            if (capabilities.available !== 'readily') {
                throw new Error('AI not ready');
            }

            const session = await chrome.aiOriginTrial.languageModel.create();
            console.log('Processing prompt:', prompt);
            const response = await session.prompt(prompt);
            console.log('AI Response:', response);
            return response;
        } catch (error) {
            console.error(`Attempt ${4-retries} failed:`, error);
            retries--;
            if (retries === 0) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

// Generate appropriate prompt based on action
function generatePrompt(action, text) {
    const promptTemplate = PROMPT_TEMPLATES[action];
    if (!promptTemplate) {
        return text;
    }
    return promptTemplate.template(text);
}

// Status update function
function updateStatus(isSupported) {
    const statusContainer = document.getElementById('status-container');
    if (!statusContainer) {
        console.error('Status container not found');
        return;
    }

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

// Main click handler
document.getElementById('process-btn').addEventListener('click', async () => {
    const input = document.getElementById('input');
    const action = document.getElementById('action');
    const output = document.getElementById('output');

    // Input validation
    if (!input.value.trim()) {
        output.innerHTML = `
            <div class="error">
                Please enter some text to process
            </div>
        `;
        return;
    }

    // Show loading state
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
        console.log('Generated Prompt:', prompt);
        const result = await processWithAI(prompt);

        // Format and display result
        output.innerHTML = `
            <div class="result-container">
                <h3 class="result-header">
                    ${action.options[action.selectedIndex].text} Result:
                </h3>
                <div class="instruction">
                    ${PROMPT_TEMPLATES[action.value].instruction}
                </div>
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
        console.error('Processing Error:', error);
    }
});

// Initialize on page load
window.addEventListener('load', async () => {
    try {
        console.log('Checking AI availability...');
        const processBtn = document.getElementById('process-btn');
        
        // Test API functionality
        const apiTest = await testAIAPI();
        console.log('API Test Result:', apiTest);
        
        const isSupported = await checkAISupport();
        console.log('AI Support Check Result:', isSupported);
        
        updateStatus(isSupported);
        
        if (!isSupported) {
            if (processBtn) {
                processBtn.disabled = true;
                processBtn.textContent = 'AI Not Available';
            }
            console.log('AI features disabled');
        } else {
            console.log('AI System Ready');
        }
    } catch (error) {
        console.error('Initialization error:', error);
    }
});