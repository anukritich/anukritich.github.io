document.addEventListener("DOMContentLoaded", () => {
    // Ensure loading screen elements exist
    const loadingScreen = document.getElementById("loading-screen");
    const spinner = document.getElementById("spinner");
    const loadingText = document.getElementById("loading-text");

    if (loadingScreen && spinner && loadingText) {
        console.log("Loading screen found, initializing loading sequence");
        handleLoadingScreen();
    } else {
        console.log("Loading screen elements not found, initializing sidebar directly");
        initializeSidebar();
    }

    /**
     * Handles the loading screen animation and dismissal
     */
    function handleLoadingScreen() {
        const resources = {
            images: Array.from(document.querySelectorAll("img")),
            stylesheets: Array.from(document.querySelectorAll('link[rel="stylesheet"]')),
            scripts: Array.from(document.querySelectorAll('script[src]')),
        };

        const totalResources = Math.max(
            resources.images.length + resources.stylesheets.length + resources.scripts.length,
            1
        );

        let loadedCount = 0;

        function updateProgress() {
            loadedCount++;
            const percentage = Math.min(Math.round((loadedCount / totalResources) * 100), 100);
            loadingText.textContent = `Loading... ${percentage}%`;

            if (percentage >= 100) {
                completeLoading();
            }
        }

        // Track image loading
        resources.images.forEach((img) => {
            if (img.complete) {
                updateProgress();
            } else {
                img.addEventListener("load", updateProgress);
                img.addEventListener("error", updateProgress);
            }
        });

        // Simulate stylesheet and script loading
        resources.stylesheets.forEach(() => setTimeout(updateProgress, 100));
        resources.scripts.forEach(() => setTimeout(updateProgress, 150));

        // Timeout fallback (ensures loading completes within 3 seconds)
        setTimeout(() => {
            if (loadedCount < totalResources) {
                loadingText.textContent = "Loading... 100%";
                completeLoading();
            }
        }, 3000);

        function completeLoading() {
            loadingScreen.classList.add("fade-out");
            setTimeout(() => {
                loadingScreen.style.display = "none";
                initializeSidebar();
            }, 500);
        }
    }

    /**
     * Initializes sidebar toggle functionality
     */
    function initializeSidebar() {
        const sidebar = document.querySelector(".sidebar");
        const sidebarToggler = document.querySelector(".sidebar-toggler");

        if (sidebar && sidebarToggler) {
            const icon = sidebarToggler.querySelector(".material-symbols-rounded");

            if (icon) {
                icon.style.transform = sidebar.classList.contains("collapsed") ? "rotate(0deg)" : "rotate(180deg)";

                sidebarToggler.addEventListener("click", () => {
                    sidebar.classList.toggle("collapsed");
                    icon.style.transform = sidebar.classList.contains("collapsed") ? "rotate(0deg)" : "rotate(180deg)";
                });

                console.log("Sidebar functionality initialized");
            } else {
                console.error("Sidebar icon not found");
            }
        } else {
            console.error("Sidebar or toggler button not found!");
        }
    }
});
