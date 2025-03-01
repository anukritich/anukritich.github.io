document.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.getElementById("loading-screen");
    const loadingText = document.getElementById("loading-text");
    const sections = document.querySelectorAll(".story-section");
    const welcomeText = document.getElementById("welcome-text");

    let currentSection = 0;
    let isScrolling = false;
    let lastScrollTime = 0;
    const scrollDelay = 1000; // Delay between scroll actions in ms

    // Add scroll indicators to each section
    sections.forEach((section, index) => {
        if (index < sections.length - 1) { // Don't add to last section
            const indicator = document.createElement("div");
            indicator.className = "scroll-indicator";
            indicator.innerHTML = "Scroll down ↓";
            section.appendChild(indicator);
        }
    });

    // Simulate loading process with percentage
    function simulateLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            if (loadingText) {
                loadingText.textContent = `Loading... ${progress}%`;
            }

            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    hideLoadingScreen();
                }, 500);
            }
        }, 100);
    }

    // Hide loading screen and start the story
    function hideLoadingScreen() {
        loadingScreen.classList.add("fade-out");
        setTimeout(() => {
            loadingScreen.style.display = "none";
            startStory();
        }, 500);
    }

    // Start the story with welcome text
    function startStory() {
        // Mark first section as active
        sections[0].classList.add("active-section");
        welcomeText.classList.add("zoom-in");

        // Set up scroll event
        window.addEventListener("wheel", handleMouseWheel);
        window.addEventListener("touchstart", handleTouchStart);
        window.addEventListener("touchmove", handleTouchMove);
    }

    // Track touch position for mobile scrolling
    let touchStartY = 0;

    function handleTouchStart(e) {
        touchStartY = e.touches[0].clientY;
    }

    function handleTouchMove(e) {
        if (isScrolling) return;

        const touchY = e.touches[0].clientY;
        const diff = touchStartY - touchY;

        // Detect scroll direction with a threshold
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                scrollToNextSection();
            } else {
                scrollToPrevSection();
            }
            touchStartY = touchY; // Reset touch position
        }
    }

    // Handle mouse wheel events
    function handleMouseWheel(e) {
        const now = Date.now();

        // Throttle scroll events
        if (isScrolling || now - lastScrollTime < scrollDelay) {
            return;
        }

        lastScrollTime = now;

        if (e.deltaY > 0) {
            // Scrolling down
            scrollToNextSection();
        } else {
            // Scrolling up
            scrollToPrevSection();
        }
    }

    // Scroll to the next section
    function scrollToNextSection() {
        if (currentSection < sections.length - 1) {
            isScrolling = true;

            // Hide current section
            sections[currentSection].classList.remove("active-section");

            // Show next section
            currentSection++;
            sections[currentSection].classList.add("active-section");

            // Scroll to the section
            sections[currentSection].scrollIntoView({ behavior: "smooth" });

            // Reset scrolling flag after animation
            setTimeout(() => {
                isScrolling = false;
            }, scrollDelay);
        }
    }

    // Scroll to the previous section
    function scrollToPrevSection() {
        if (currentSection > 0) {
            isScrolling = true;

            // Hide current section
            sections[currentSection].classList.remove("active-section");

            // Show previous section
            currentSection--;
            sections[currentSection].classList.add("active-section");

            // Scroll to the section
            sections[currentSection].scrollIntoView({ behavior: "smooth" });

            // Reset scrolling flag after animation
            setTimeout(() => {
                isScrolling = false;
            }, scrollDelay);
        }
    }

    // Start the loading simulation
    simulateLoading();
});
