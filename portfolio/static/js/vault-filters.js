// =========================================================
// VAULT FILTER SYSTEM
// Save as: portfolio/static/js/vault-filters.js
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".vault-filter");
    const cards = document.querySelectorAll(".gold-track-card");
    const grid = document.querySelector(".gold-track-grid");

    if (!filterButtons.length || !cards.length || !grid) return;

    const emptyState = document.createElement("div");
    emptyState.className = "vault-empty-state";
    emptyState.innerHTML = `
        <strong>No tracks here yet.</strong>
        <span>Once this category has music, it will show here.</span>
    `;

    grid.insertAdjacentElement("afterend", emptyState);

    function applyFilter(filter) {
        let visibleCount = 0;

        cards.forEach((card) => {
            let showCard = false;

            if (filter === "all") {
                showCard = true;
            } else if (filter === "featured") {
                showCard = card.dataset.featured === "true";
            } else if (filter === "exclusive") {
                showCard = card.dataset.exclusive === "true";
            } else if (filter === "unreleased") {
                showCard = card.dataset.unreleased === "true";
            } else if (filter === "teaser") {
                showCard = card.dataset.teaser === "true";
            }

            card.classList.toggle("is-filtered-out", !showCard);

            if (showCard) visibleCount += 1;
        });

        emptyState.classList.toggle("active", visibleCount === 0);
    }

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;

            filterButtons.forEach((btn) => {
                btn.classList.remove("active");
            });

            button.classList.add("active");
            applyFilter(filter);
        });
    });

    applyFilter("all");
});
