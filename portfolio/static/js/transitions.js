document.addEventListener("DOMContentLoaded", () => {

    const links = document.querySelectorAll("a[href]");

    links.forEach(link => {

        const url = link.getAttribute("href");

        if (
            !url ||
            url.startsWith("http") ||
            url.startsWith("#") ||
            url.startsWith("mailto:") ||
            url.startsWith("tel:") ||
            url.startsWith("javascript:")
        ) return;

        link.addEventListener("click", (e) => {
            e.preventDefault();

            const existing = document.querySelector(".transition-overlay");
            if (existing) existing.remove();

            const overlay = document.createElement("div");
            overlay.className = "transition-overlay glitch-out";
            document.body.appendChild(overlay);

            overlay.addEventListener("animationend", () => {
                window.location.href = url;
            });
        });
    });

    const header = document.querySelector(".site-header");
    let lastScrollY = window.scrollY;

    if (header) {
        window.addEventListener("scroll", () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 140) {
                header.classList.add("nav-hidden");
            } else {
                header.classList.remove("nav-hidden");
            }

            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    const backToTop = document.getElementById("back-to-top");

    if (backToTop) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 520) {
                backToTop.classList.add("visible");
            } else {
                backToTop.classList.remove("visible");
            }
        }, { passive: true });

        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

});
