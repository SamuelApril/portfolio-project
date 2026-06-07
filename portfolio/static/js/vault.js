document.addEventListener("DOMContentLoaded", () => {
    const cards = document.querySelectorAll(".track-card");

    cards.forEach(card => {
        const particleContainer = card.querySelector(".vault-particles");

        card.addEventListener("mousemove", event => {
            const rect = card.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const rotateY = ((x / rect.width) - 0.5) * 12;
            const rotateX = ((rect.height / 2 - y) / rect.height) * 12;

            card.style.transform = `
                perspective(900px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-10px)
                scale(1.03)
            `;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });

        card.addEventListener("mouseenter", () => {
            if (!particleContainer) return;

            for (let i = 0; i < 8; i++) {
                createParticle(particleContainer);
            }
        });
    });
});

function createParticle(container) {
    const particle = document.createElement("span");

    particle.className = "particle";

    particle.style.left = `${40 + Math.random() * 20}%`;
    particle.style.top = `${40 + Math.random() * 20}%`;

    const angle = Math.random() * Math.PI * 2;
    const distance = 60 + Math.random() * 80;

    particle.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
    particle.style.setProperty("--y", `${Math.sin(angle) * distance}px`);

    particle.style.animationDuration = `${(1.8 + Math.random()).toFixed(2)}s`;

    container.appendChild(particle);

    particle.addEventListener("animationend", () => {
        particle.remove();
    });
}
