document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const sidebarToggler = document.querySelector(".sidebar-toggler");
    const icon = sidebarToggler.querySelector(".material-symbols-rounded");

    if (sidebar && sidebarToggler) {
        // Ensure correct rotation on page load
        icon.style.transform = "rotate(180deg)";

        sidebarToggler.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");

            // Rotate the chevron icon based on the sidebar state
            icon.style.transform = sidebar.classList.contains("collapsed") ? "rotate(180deg)" : "rotate(0)";
        });
    } else {
        console.error("Sidebar or toggler button not found!");
    }
});
