/* ==================== Configuration ==================== */
        const CONFIG = {
            NO_BUTTON_TEXTS: [
                "Are you sure? 😢",
                "Think again 😏",
                "Really?? 💔",
                "Nope 😜",
                "Don't break my heart 💘",
                "You sure? 👉👈",
                "Let's reconsider... 🥺"
            ],
            NO_ESCAPE_MARGIN: 60,
            ESCAPE_SPEED_INCREASE: 1.05,
            MAX_ESCAPE_SPEED: 1.5,
        };

        /* ==================== State Management ==================== */
        const state = {
            noButtonClicks: 0,
            escapeSpeed: 1,
            noButtonEscaped: false,
        };

        /* ==================== DOM Elements ==================== */
        const yesBtn = document.getElementById('yesBtn');
        const noBtn = document.getElementById('noBtn');
        const celebration = document.getElementById('celebration');
        const floatingHeartsContainer = document.querySelector('.floating-hearts-container');

        /* ==================== Utility Functions ==================== */

        /**
         * Generate a safe random position for the NO button
         * Ensures button stays within viewport bounds
         */
        function getRandomPosition() {
            const btnWidth = noBtn.offsetWidth;
            const btnHeight = noBtn.offsetHeight;
            
            const maxX = window.innerWidth - btnWidth - CONFIG.NO_ESCAPE_MARGIN;
            const maxY = window.innerHeight - btnHeight - CONFIG.NO_ESCAPE_MARGIN;
            
            const minX = CONFIG.NO_ESCAPE_MARGIN;
            const minY = CONFIG.NO_ESCAPE_MARGIN;
            
            let newX, newY;
            let isSafeDistance = false;

            // Ensure new position is sufficiently different from current position
            while (!isSafeDistance) {
                newX = Math.random() * (maxX - minX) + minX;
                newY = Math.random() * (maxY - minY) + minY;

                const currentX = parseFloat(noBtn.style.left) || window.innerWidth / 2;
                const currentY = parseFloat(noBtn.style.top) || window.innerHeight / 2;

                const distance = Math.sqrt(
                    Math.pow(newX - currentX, 2) + Math.pow(newY - currentY, 2)
                );

                isSafeDistance = distance > 150;
            }

            return { x: newX, y: newY };
        }

        /**
         * Update NO button text randomly
         */
        function updateNoButtonText() {
            const randomText = CONFIG.NO_BUTTON_TEXTS[
                Math.floor(Math.random() * CONFIG.NO_BUTTON_TEXTS.length)
            ];
            noBtn.textContent = randomText;
        }

        /**
         * Move NO button to random position with smooth animation
         */
        function escapeNoButton() {
            const { x, y } = getRandomPosition();

            noBtn.style.left = x + 'px';
            noBtn.style.top = y + 'px';

            updateNoButtonText();

            // Increase escape speed for more challenge
            state.escapeSpeed = Math.min(
                state.escapeSpeed * CONFIG.ESCAPE_SPEED_INCREASE,
                CONFIG.MAX_ESCAPE_SPEED
            );

            state.noButtonClicks++;
        }

        /**
         * Create confetti particle
         */
        function createConfetti() {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            
            const emoji = ['🎉', '💕', '💖', '🎊', '✨', '💝', '🌹', '💐'][Math.floor(Math.random() * 8)];
            confetti.textContent = emoji;
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-10px';
            confetti.style.fontSize = (Math.random() * 20 + 20) + 'px';
            confetti.style.opacity = '1';
            confetti.style.animation = `confettiFall ${Math.random() * 3 + 2}s linear forwards`;

            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 3000);
        }

        /**
         * Create floating hearts in background
         */
        function createFloatingHeart() {
            const heart = document.createElement('div');
            heart.classList.add('floating-heart');
            heart.textContent = '💕';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.animationDuration = (Math.random() * 8 + 8) + 's';
            heart.style.animationDelay = Math.random() * 2 + 's';

            floatingHeartsContainer.appendChild(heart);

            setTimeout(() => heart.remove(), 10000);
        }

        /**
         * Trigger celebration mode
         */
        function triggerCelebration() {
            // Hide buttons with animation
            yesBtn.style.opacity = '0';
            noBtn.style.opacity = '0';
            yesBtn.style.transform = 'scale(0.5)';
            noBtn.style.transform = 'scale(0.5)';

            setTimeout(() => {
                yesBtn.style.display = 'none';
                noBtn.style.display = 'none';
            }, 300);

            // Show celebration modal
            celebration.classList.add('active');

            // Create confetti explosion
            for (let i = 0; i < 30; i++) {
                setTimeout(() => createConfetti(), i * 50);
            }

            // Create extra floating hearts
            for (let i = 0; i < 15; i++) {
                setTimeout(() => createFloatingHeart(), i * 100);
            }
        }

        /* ==================== CSS Animations (Dynamic) ==================== */
        const style = document.createElement('style');
        style.textContent = `
            @keyframes confettiFall {
                to {
                    transform: translateY(100vh) rotateZ(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        /* ==================== Event Listeners ==================== */

        // YES Button - Celebration Mode
        yesBtn.addEventListener('click', () => {
            triggerCelebration();
        });

        // NO Button - Escape mechanics
        noBtn.addEventListener('mouseenter', escapeNoButton);
        noBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            escapeNoButton();
        });

        // Prevent NO button click (backup safety)
        noBtn.addEventListener('click', (e) => {
            e.preventDefault();
            escapeNoButton();
        });

        // Handle window resize for NO button boundary recalculation
        window.addEventListener('resize', () => {
            const btnWidth = noBtn.offsetWidth;
            const btnHeight = noBtn.offsetHeight;
            const x = parseFloat(noBtn.style.left);
            const y = parseFloat(noBtn.style.top);

            if (x + btnWidth > window.innerWidth || y + btnHeight > window.innerHeight) {
                const { x: newX, y: newY } = getRandomPosition();
                noBtn.style.left = newX + 'px';
                noBtn.style.top = newY + 'px';
            }
        });

        /* ==================== Initialization ==================== */

        /**
         * Initialize floating background hearts
         */
        function initializeFloatingHearts() {
            for (let i = 0; i < 5; i++) {
                setTimeout(() => createFloatingHeart(), i * 1000);
            }
            // Continue creating hearts periodically
            setInterval(createFloatingHeart, 2000);
        }

        /**
         * Initialize NO button position
         */
        function initializeNoButton() {
            // Start position: slightly to the right of center
            const startX = window.innerWidth / 2 + 100;
            const startY = window.innerHeight / 2;

            noBtn.style.position = 'fixed';
            noBtn.style.left = startX + 'px';
            noBtn.style.top = startY + 'px';
        }

        // Run initialization on page load
        window.addEventListener('DOMContentLoaded', () => {
            initializeFloatingHearts();
            initializeNoButton();
        });

        // Fallback initialization (in case DOMContentLoaded already fired)
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initializeFloatingHearts();
                initializeNoButton();
            });
        } else {
            initializeFloatingHearts();
            initializeNoButton();
        }