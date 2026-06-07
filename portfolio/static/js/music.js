const modal = document.getElementById("track-modal");

const artwork = document.getElementById("modal-artwork");
const title = document.getElementById("modal-title");
const description = document.getElementById("modal-description");

const spotifyBtn = document.getElementById("spotify-btn");
const youtubeBtn = document.getElementById("youtube-btn");
const labelBtn = document.getElementById("label-btn");

const playBtn = document.querySelector(".play-btn");
const progress = document.querySelector(".progress-container");
const bar = document.querySelector(".progress-bar");
const time = document.querySelector(".time");

/*
    IMPORTANT:
    Move the modal out of <main class="page"> and directly into <body>.
    This prevents footer/section/transform/stacking-context issues.
*/
if (modal && modal.parentElement !== document.body) {
    document.body.appendChild(modal);
}

window.audio = window.audio || new Audio();
const audio = window.audio;

function formatTime(seconds) {
    if (!isFinite(seconds)) return "0:00";

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function resetPlayerUI() {
    if (playBtn) playBtn.classList.remove("is-playing");

    /*
        Use !important through JS because older CSS patches may have:
        width: 0% !important;
    */
    if (bar) bar.style.setProperty("width", "0%", "important");

    if (time) time.textContent = "0:00";
    if (artwork) artwork.classList.remove("playing");
}

if (playBtn && progress) {
    playBtn.addEventListener("click", () => {
        if (!audio.src) return;

        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    });

    progress.addEventListener("click", (e) => {
        if (!audio.duration) return;

        const rect = progress.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = Math.max(0, Math.min(1, clickX / rect.width));

        audio.currentTime = percent * audio.duration;
    });
}

audio.addEventListener("play", () => {
    if (playBtn) playBtn.classList.add("is-playing");
    if (artwork) artwork.classList.add("playing");
});

audio.addEventListener("pause", () => {
    if (playBtn) playBtn.classList.remove("is-playing");
    if (artwork) artwork.classList.remove("playing");
});

audio.addEventListener("ended", () => {
    resetPlayerUI();
    audio.currentTime = 0;
});

audio.addEventListener("timeupdate", () => {
    if (!audio.duration || !bar || !time) return;

    const percent = (audio.currentTime / audio.duration) * 100;

    /*
        Again: force important so the visible progress works even if old CSS
        accidentally used width: 0 !important.
    */
    bar.style.setProperty("width", percent + "%", "important");

    time.textContent = formatTime(audio.currentTime);
});

/* ===========================
        MODAL
=========================== */

function setButton(button, text, url) {
    if (!button) return;

    button.textContent = "";
    button.removeAttribute("href");
    button.classList.add("is-hidden");

    if (text && url) {
        button.textContent = text;
        button.href = url;
        button.classList.remove("is-hidden");
    }
}

window.openTrack = function(card) {
    if (!modal) return;

    modal.classList.add("active");
    document.body.classList.add("modal-open");

    if (artwork) {
        artwork.src = card.dataset.artwork || "";
        artwork.alt = card.dataset.title || "Track artwork";
    }

    if (title) title.textContent = card.dataset.title || "";
    if (description) description.textContent = card.dataset.description || "";

    audio.pause();
    audio.src = card.dataset.preview || "";
    audio.load();

    resetPlayerUI();

    setButton(spotifyBtn, "Spotify", card.dataset.spotify);
    setButton(youtubeBtn, "YouTube", card.dataset.youtube);
    setButton(labelBtn, card.dataset.label, card.dataset.labelUrl);
};

window.closeTrack = function() {
    if (!modal) return;

    audio.pause();
    audio.currentTime = 0;

    resetPlayerUI();

    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
};

/* Close when clicking the dark backdrop */
if (modal) {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            closeTrack();
        }
    });
}

/* Close with Escape key */
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
        closeTrack();
    }
});
