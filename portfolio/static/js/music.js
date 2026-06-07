// =========================================================
// SAMUEL APRIL TRACK MODAL PLAYER
// One audio engine. One modal controller. No duplicate players.
// =========================================================

(() => {
    document.addEventListener("DOMContentLoaded", () => {
        const modal = document.getElementById("track-modal");
        if (!modal) return;

        const artwork = document.getElementById("modal-artwork");
        const title = document.getElementById("modal-title");
        const description = document.getElementById("modal-description");

        const spotifyBtn = document.getElementById("spotify-btn");
        const youtubeBtn = document.getElementById("youtube-btn");
        const labelBtn = document.getElementById("label-btn");

        const playBtn = modal.querySelector(".play-btn");
        const progress = modal.querySelector(".progress-container");
        const bar = modal.querySelector(".progress-bar");
        const time = modal.querySelector(".time");
        const closeBtn = modal.querySelector("[data-close-track]");

        /*
            Critical stacking fix:
            Keep the modal outside <main class="page"> so footer/sections/page
            transforms can never cover it.
        */
        if (modal.parentElement !== document.body) {
            document.body.appendChild(modal);
        }

        const audio = new Audio();
        window.audio = audio;

        let activeCard = null;
        let lastFocusedElement = null;

        function formatTime(seconds) {
            if (!Number.isFinite(seconds)) return "0:00";

            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);

            return `${mins}:${secs.toString().padStart(2, "0")}`;
        }

        function setProgress(percent) {
            const safePercent = Math.max(0, Math.min(100, percent || 0));

            if (bar) {
                bar.style.width = `${safePercent}%`;
            }

            if (progress) {
                progress.setAttribute("aria-valuenow", Math.round(safePercent).toString());
            }
        }

        function resetPlayerUI() {
            if (playBtn) {
                playBtn.classList.remove("is-playing");
                playBtn.setAttribute("aria-label", "Play preview");
            }

            setProgress(0);

            if (time) {
                time.textContent = "0:00";
            }

            if (artwork) {
                artwork.classList.remove("playing");
            }
        }

        function setButton(button, text, url) {
            if (!button) return;

            button.textContent = "";
            button.removeAttribute("href");
            button.hidden = true;
            button.classList.add("is-hidden");

            const safeText = (text || "").trim();
            const safeUrl = (url || "").trim();

            if (safeText && safeUrl) {
                button.textContent = safeText;
                button.href = safeUrl;
                button.hidden = false;
                button.classList.remove("is-hidden");
            }
        }

        function setStreamingButtons(card) {
            setButton(spotifyBtn, "Spotify", card.dataset.spotify);
            setButton(youtubeBtn, "YouTube", card.dataset.youtube);
            setButton(labelBtn, card.dataset.label, card.dataset.labelUrl);
        }

        function seekToClientX(clientX) {
            if (!progress || !audio.duration || !Number.isFinite(audio.duration)) return;

            const rect = progress.getBoundingClientRect();
            const clickX = clientX - rect.left;
            const ratio = Math.max(0, Math.min(1, clickX / rect.width));

            audio.currentTime = ratio * audio.duration;
            setProgress(ratio * 100);
        }

        async function togglePlayback() {
            if (!audio.src || !playBtn || playBtn.disabled) return;

            try {
                if (audio.paused) {
                    await audio.play();
                } else {
                    audio.pause();
                }
            } catch (error) {
                console.warn("Audio playback failed:", error);
            }
        }

        function openTrack(card) {
            if (!card) return;

            activeCard = card;
            lastFocusedElement = document.activeElement;

            const theme = (card.dataset.theme || "cyan").trim();
            document.body.dataset.trackTheme = theme;

            modal.classList.add("active");
            modal.setAttribute("aria-hidden", "false");
            document.body.classList.add("modal-open");

            if (artwork) {
                artwork.src = card.dataset.artwork || "";
                artwork.alt = card.dataset.title || "Track artwork";
            }

            if (title) {
                title.textContent = card.dataset.title || "";
            }

            if (description) {
                description.textContent = card.dataset.description || "";
                description.scrollTop = 0;
            }

            audio.pause();
            audio.removeAttribute("src");

            const previewUrl = (card.dataset.preview || "").trim();

            if (previewUrl) {
                audio.src = previewUrl;
                audio.load();

                if (playBtn) {
                    playBtn.disabled = false;
                }

                if (progress) {
                    progress.tabIndex = 0;
                    progress.setAttribute("aria-disabled", "false");
                }
            } else {
                if (playBtn) {
                    playBtn.disabled = true;
                }

                if (progress) {
                    progress.tabIndex = -1;
                    progress.setAttribute("aria-disabled", "true");
                }
            }

            resetPlayerUI();
            setStreamingButtons(card);

            if (closeBtn) {
                closeBtn.focus({ preventScroll: true });
            }
        }

        function closeTrack() {
            audio.pause();
            audio.currentTime = 0;
            audio.removeAttribute("src");

            resetPlayerUI();

            modal.classList.remove("active");
            modal.setAttribute("aria-hidden", "true");
            document.body.classList.remove("modal-open");
            document.body.removeAttribute("data-track-theme");

            activeCard = null;

            if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
                lastFocusedElement.focus({ preventScroll: true });
            }
        }

        window.openTrack = openTrack;
        window.closeTrack = closeTrack;

        document.querySelectorAll(".js-track-card").forEach((card) => {
            card.addEventListener("click", () => {
                openTrack(card);
            });

            card.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    openTrack(card);
                }
            });
        });

        if (playBtn) {
            playBtn.addEventListener("click", togglePlayback);
        }

        if (progress) {
            progress.addEventListener("click", (event) => {
                seekToClientX(event.clientX);
            });

            progress.addEventListener("keydown", (event) => {
                if (!audio.duration || !Number.isFinite(audio.duration)) return;

                const step = Math.max(audio.duration * 0.05, 5);

                if (event.key === "ArrowRight" || event.key === "ArrowUp") {
                    event.preventDefault();
                    audio.currentTime = Math.min(audio.duration, audio.currentTime + step);
                }

                if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
                    event.preventDefault();
                    audio.currentTime = Math.max(0, audio.currentTime - step);
                }

                if (event.key === "Home") {
                    event.preventDefault();
                    audio.currentTime = 0;
                }

                if (event.key === "End") {
                    event.preventDefault();
                    audio.currentTime = audio.duration;
                }
            });
        }

        audio.addEventListener("loadedmetadata", () => {
            setProgress(0);
            if (time) time.textContent = "0:00";
        });

        audio.addEventListener("play", () => {
            if (playBtn) {
                playBtn.classList.add("is-playing");
                playBtn.setAttribute("aria-label", "Pause preview");
            }

            if (artwork) {
                artwork.classList.add("playing");
            }
        });

        audio.addEventListener("pause", () => {
            if (playBtn) {
                playBtn.classList.remove("is-playing");
                playBtn.setAttribute("aria-label", "Play preview");
            }

            if (artwork) {
                artwork.classList.remove("playing");
            }
        });

        audio.addEventListener("ended", () => {
            audio.currentTime = 0;
            resetPlayerUI();
        });

        audio.addEventListener("timeupdate", () => {
            if (!audio.duration || !Number.isFinite(audio.duration)) return;

            const percent = (audio.currentTime / audio.duration) * 100;

            setProgress(percent);

            if (time) {
                time.textContent = formatTime(audio.currentTime);
            }
        });

        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeTrack();
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener("click", closeTrack);
        }

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && modal.classList.contains("active")) {
                closeTrack();
            }
        });
    });
})();
