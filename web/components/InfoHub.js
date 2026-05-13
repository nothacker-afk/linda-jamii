/**
 * LindaJamii InfoHub Component
 * Displays Weather Forecast and Community News
 */

const InfoHubComponent = {
    render() {
        return `
            <div class="info-hub-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-top: 2rem;">
                <!-- Weather Section -->
                <div class="hash-tool" id="weatherWidget">
                    <h3>⛅ Weather Forecast</h3>
                    <div id="weatherList" class="loading-spinner"></div>
                </div>

                <!-- News Section -->
                <div class="hash-tool" id="newsWidget">
                    <h3>📰 Community News</h3>
                    <p style="font-size: 0.8rem; color: var(--text-muted);">Medical, Geopolitical & Climate Updates</p>
                    <div id="newsList" class="loading-spinner"></div>
                </div>
            </div>
        `;
    },

    async init() {
        this.loadWeather();
        this.loadNews();
    },

    async loadWeather() {
        const list = document.getElementById('weatherList');
        try {
            const res = await fetch('http://localhost:5050/api/info/weather');
            const data = await res.json();
            
            list.className = "";
            list.innerHTML = data.forecast.map(f => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; border-bottom: 1px solid var(--border);">
                    <span><strong>${f.day}</strong></span>
                    <span>${f.icon} ${f.condition}</span>
                    <span style="color: var(--primary-light);">${f.temp}°C</span>
                </div>
            `).join('');
        } catch (err) {
            list.innerHTML = `<p style="color: var(--danger);">Failed to load weather</p>`;
        }
    },

    async loadNews() {
        const list = document.getElementById('newsList');
        try {
            const res = await fetch('http://localhost:5050/api/info/news');
            const data = await res.json();
            
            list.className = "";
            list.innerHTML = data.articles.map(a => `
                <div style="margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border);">
                    <div style="font-size: 0.7rem; color: var(--accent); text-transform: uppercase;">${a.category}</div>
                    <div style="font-size: 0.9rem; font-weight: 600;">${a.title}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted);">${a.source}</div>
                </div>
            `).join('');
        } catch (err) {
            list.innerHTML = `<p style="color: var(--danger);">Failed to load news</p>`;
        }
    }
};
