// =========================================================
// VAULT FILTER SYSTEM
// Uses data attributes already printed on each .gold-track-card.
// No database call. No page reload.
// =========================================================

(() => {
    document.addEventListener("DOMContentLoaded", () => {
        const filterButtons = Array.from(document.querySelectorAll(".vault-filter"));
        const cards = Array.from(document.querySelectorAll(".gold-track-card"));
        const emptyState = document.querySelector(".vault-empty-state");

        if (!filterButtons.length || !cards.length) return;

        function cardMatchesFilter(card, filter) {
            if (filter === "all") return true;

            const map = {
                featured: "featured",
                exclusive: "exclusive",
                unreleased: "unreleased",
                teaser: "teaser",
            };

            const key = map[filter];
            if (!key) return true;

            return card.dataset[key] === "true";
        }

        function setActiveButton(activeButton) {
            filterButtons.forEach((button) => {
                const isActive = button === activeButton;

                button.classList.toggle("active", isActive);
                button.setAttribute("aria-pressed", isActive ? "true" : "false");
            });
        }

        function applyFilter(filter) {
            let visibleCount = 0;

            cards.forEach((card) => {
                const shouldShow = cardMatchesFilter(card, filter);

                card.hidden = !shouldShow;
                card.classList.toggle("is-filtered-out", !shouldShow);

                if (shouldShow) {
                    visibleCount += 1;
                }
            });

            if (emptyState) {
                emptyState.hidden = visibleCount !== 0;
            }
        }

        filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const filter = button.dataset.filter || "all";

                setActiveButton(button);
                applyFilter(filter);
            });
        });

        const defaultButton = filterButtons.find((button) => button.classList.contains("active")) || filterButtons[0];

        setActiveButton(defaultButton);
        applyFilter(defaultButton.dataset.filter || "all");
    });
})();
