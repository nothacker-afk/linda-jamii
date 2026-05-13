/**
 * LindaJamii M-Pesa Donation Component
 */

const DonationComponent = {
    render() {
        return `
            <div class="hash-tool donation-card" style="margin-top: 2rem; border-color: var(--accent);">
                <h3>❤️ Support LindaJamii</h3>
                <p>Help us keep the community safe. Donate via M-Pesa.</p>
                <div class="form-group">
                    <label>Phone Number (M-Pesa)</label>
                    <input type="text" id="mpesaPhone" placeholder="2547XXXXXXXX" value="254">
                </div>
                <div class="form-group">
                    <label>Amount (KES)</label>
                    <input type="number" id="mpesaAmount" placeholder="100" min="1">
                </div>
                <button class="btn btn-primary" id="btnDonate" style="background: #22c55e;" onclick="DonationComponent.initiateSTK()">
                    💸 Donate via M-Pesa
                </button>
                <div id="mpesaFeedback" class="submit-feedback"></div>
            </div>
        `;
    },

    async initiateSTK() {
        const phone = document.getElementById('mpesaPhone').value.trim();
        const amount = document.getElementById('mpesaAmount').value.trim();
        const feedback = document.getElementById('mpesaFeedback');
        const btn = document.getElementById('btnDonate');

        if (!phone || !amount) {
            this.showFeedback("Please enter phone and amount", "error");
            return;
        }

        btn.disabled = true;
        btn.textContent = "Processing STK Push...";
        this.showFeedback("Please check your phone for the M-Pesa prompt.", "info");

        try {
            const response = await fetch('http://localhost:5050/api/mpesa/donate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, amount })
            });
            
            const data = await response.json();
            
            if (response.ok && data.ResponseCode === "0") {
                this.showFeedback("✅ STK Push sent! Enter your PIN on your phone.", "success");
            } else {
                throw new Error(data.error || data.CustomerMessage || "Failed to initiate STK Push");
            }
        } catch (err) {
            this.showFeedback(`❌ Error: ${err.message}`, "error");
        } finally {
            btn.disabled = false;
            btn.textContent = "💸 Donate via M-Pesa";
        }
    },

    showFeedback(msg, type) {
        const feedback = document.getElementById('mpesaFeedback');
        feedback.textContent = msg;
        feedback.className = `submit-feedback ${type}`;
        feedback.style.display = 'block';
    }
};
