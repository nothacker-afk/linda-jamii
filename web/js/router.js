/**
 * LindaJamii App Flow Router
 * Splash → Sign Up → Verify → Onboard → Dashboard
 */

const AppFlow = {
    currentStep: 'splash',
    steps: ['splash', 'signup', 'verify', 'onboard', 'dashboard'],

    init() {
        console.log("LindaJamii App Initialized");
        this.renderStep('splash');
        
        // Simulate Splash screen delay
        setTimeout(() => {
            this.navigateTo('signup');
        }, 3000);
    },

    navigateTo(step) {
        if (this.steps.includes(step)) {
            this.currentStep = step;
            this.renderStep(step);
        }
    },

    renderStep(step) {
        const container = document.getElementById('main-container');
        if (!container) return;

        container.innerHTML = `<div class="page-container page-${step}">
            ${this.getStepTemplate(step)}
        </div>`;
    },

    getStepTemplate(step) {
        switch(step) {
            case 'splash':
                return `
                    <div class="hero">
                        <div class="hero-content">
                            <div class="hero-badge">LindaJamii v2.0</div>
                            <h1 class="hero-title">🛡️ LindaJamii</h1>
                            <p class="hero-subtitle">Protecting communities, one neighbourhood at a time.</p>
                            <div class="loading-spinner"></div>
                        </div>
                    </div>`;
            case 'signup':
                return `
                    <div class="section">
                        <div class="container">
                            <div class="hash-tool">
                                <h3>Step 1: Create Account</h3>
                                <p>Join the safety network.</p>
                                <div class="form-group">
                                    <label>Phone Number</label>
                                    <input type="text" placeholder="+254...">
                                </div>
                                <button class="btn btn-primary" onclick="AppFlow.navigateTo('verify')">Continue</button>
                            </div>
                        </div>
                    </div>`;
            case 'verify':
                return `
                    <div class="section">
                        <div class="container">
                            <div class="hash-tool">
                                <h3>Step 2: Verification</h3>
                                <p>Enter the code sent to your phone.</p>
                                <div class="form-group">
                                    <input type="text" placeholder="OTP Code">
                                </div>
                                <button class="btn btn-primary" onclick="AppFlow.navigateTo('onboard')">Verify</button>
                            </div>
                        </div>
                    </div>`;
            case 'onboard':
                return `
                    <div class="section">
                        <div class="container">
                            <div class="hash-tool">
                                <h3>Step 3: Onboarding</h3>
                                <p>Select your neighbourhood.</p>
                                <div class="form-group">
                                    <select>
                                        <option>Westlands</option>
                                        <option>Kilimani</option>
                                        <option>Karen</option>
                                    </select>
                                </div>
                                <button class="btn btn-primary" onclick="AppFlow.navigateTo('dashboard')">Get Started</button>
                            </div>
                        </div>
                    </div>`;
            case 'dashboard':
                return `
                    <div class="section">
                        <div class="container">
                            <h1 class="gradient-text">Welcome to Dashboard</h1>
                            <p>You are now protecting your community.</p>
                            <button class="btn btn-outline" onclick="location.reload()">Logout</button>
                        </div>
                    </div>`;
            default:
                return `<h1>404</h1>`;
        }
    }
};

window.onload = () => AppFlow.init();
