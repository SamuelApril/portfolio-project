const AudioManager = (() => {

    let audio = new Audio();

    let state = {
        src: null,
        playing: false
    };

    // UI refs (set when modal opens)
    let ui = {
        playBtn: null,
        progressBar: null,
        progress: null,
        time: null
    };

    function bindUI() {
        ui.playBtn = document.querySelector(".play-btn");
        ui.progressBar = document.querySelector(".progress-bar");
        ui.progress = document.querySelector(".progress-container");
        ui.time = document.querySelector(".time");

        ui.playBtn.onclick = toggle;
        ui.progress.onclick = seek;
    }

    function load(src) {

        if (!src) return;

        // only reload if different track
        if (state.src !== src) {
            audio.src = src;
            audio.currentTime = 0;
            state.src = src;
        }

        resetUI();
    }

    function toggle() {

        if (!audio.src) return;

        if (audio.paused) {
            audio.play();
            state.playing = true;
            ui.playBtn.textContent = "⏸";
        } else {
            audio.pause();
            state.playing = false;
            ui.playBtn.textContent = "▶";
        }
    }

    function seek(e) {

        if (!audio.duration) return;

        const rect = ui.progress.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;

        audio.currentTime = percent * audio.duration;
    }

    function resetUI() {

        if (!ui.playBtn) bindUI();

        ui.playBtn.textContent = "▶";
        ui.progressBar.style.width = "0%";
        ui.time.textContent = "0:00";
    }

    function resetAll() {

        audio.pause();
        audio.currentTime = 0;
        state.playing = false;
        resetUI();
    }

    audio.addEventListener("timeupdate", () => {

        if (!audio.duration || !ui.progressBar) return;

        const percent = (audio.currentTime / audio.duration) * 100;
        ui.progressBar.style.width = percent + "%";

        const m = Math.floor(audio.currentTime / 60);
        const s = Math.floor(audio.currentTime % 60);

        ui.time.textContent = `${m}:${s.toString().padStart(2, "0")}`;
    });

    audio.addEventListener("ended", () => {
        ui.playBtn.textContent = "▶";
        state.playing = false;
    });

    return {
        load,
        resetAll
    };

})();

// expose globally for modal
window.AudioManager = AudioManager;