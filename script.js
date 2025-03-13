document.addEventListener("DOMContentLoaded", function () {
  const audioPlayer = document.createElement("div");
  audioPlayer.className = "audio-player";
  audioPlayer.innerHTML = `
        <div class="player-inner">
            <div class="now-playing">
                <img src="trendingimg/me.jpg" alt="Now playing" class="now-playing-img">
                <div class="track-info">
                    <span class="track-name">Favourite Girl</span>
                    <span class="artist-name">Justin Beaver</span>
                </div>
            </div>
            <div class="player-center">
                <div class="player-controls">
                    <button class="control-btn"><i class="fas fa-step-backward"></i></button>
                    <button class="control-btn play-btn"><i class="fas fa-play" id="play-icon"></i></button>
                    <button class="control-btn"><i class="fas fa-step-forward"></i></button>
                </div>
                <div class="seekbar-container">
                    <span class="current-time">0:00</span>
                    <div class="progress-bar">
                        <div class="progress"></div>
                        <div class="progress-handle"></div>
                    </div>
                    <span class="total-time">0:00</span>
                </div>
            </div>
            <div class="volume-container">
                <button class="volume-btn">
                    <i class="fas fa-volume-up"></i>
                </button>
                <div class="volume-slider">
                    <div class="volume-progress"></div>
                    <div class="volume-handle"></div>
                </div>
            </div>
        </div>
    `;
  document.body.appendChild(audioPlayer);

  const audio = new Audio();
  let isPlaying = false;

  const playBtn = document.querySelector(".play-btn");
  const playIcon = document.getElementById("play-icon");
  const prevBtn = audioPlayer.querySelector(".control-btn:nth-child(1)");
  const nextBtn = audioPlayer.querySelector(".control-btn:nth-child(3)");
  const progressBar = audioPlayer.querySelector(".progress");
  const progressHandle = audioPlayer.querySelector(".progress-handle");
  const progressContainer = audioPlayer.querySelector(".progress-bar");
  const currentTimeDisplay = audioPlayer.querySelector(".current-time");
  const totalTimeDisplay = audioPlayer.querySelector(".total-time");
  const volumeBtn = audioPlayer.querySelector(".volume-btn");
  const volumeSlider = audioPlayer.querySelector(".volume-slider");
  const volumeProgress = audioPlayer.querySelector(".volume-progress");
  const volumeHandle = audioPlayer.querySelector(".volume-handle");

  audio.volume = 0.7;
  volumeProgress.style.width = "70%";
  volumeHandle.style.left = "70%";

  const trackData = [
    {
      title: "Favourite Girl",
      artist: "Justin Beaver",
      img: "trendingimg/me.jpg",
      src: "music/favourite-girl.mp3",
    },
    {
      title: "Babaero",
      artist: "gins&melodies, Hev Abi",
      img: "trendingimg/babaero.jpg",
      src: "music/babaero.mp3",
    },
    {
      title: "City Girl",
      artist: "Shanti Dope",
      img: "trendingimg/citygirl.jpg",
      src: "music/city-girl.mp3",
    },
    {
      title: "Blue",
      artist: "yung kai",
      img: "trendingimg/blue.jpg",
      src: "music/blue.mp3",
    },
  ];

  let currentTrackIndex = 0;

  prevBtn.addEventListener("click", function () {
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      audio.play();
    } else {
      currentTrackIndex =
        (currentTrackIndex - 1 + trackData.length) % trackData.length;
      loadTrack(currentTrackIndex);
      audio
        .play()
        .then(() => {
          isPlaying = true;
          playIcon.classList.remove("fa-play");
          playIcon.classList.add("fa-pause");
        })
        .catch((e) => console.log("Play failed:", e));
    }
  });

  nextBtn.addEventListener("click", function () {
    currentTrackIndex = (currentTrackIndex + 1) % trackData.length;
    loadTrack(currentTrackIndex);
    audio
      .play()
      .then(() => {
        isPlaying = true;
        playIcon.classList.remove("fa-play");
        playIcon.classList.add("fa-pause");
      })
      .catch((e) => console.log("Play failed:", e));
  });

  function loadTrack(index) {
    const track = trackData[index];
    audio.src =
      track.src ||
      `music/${track.title.toLowerCase().replace(/\s+/g, "-")}.mp3`;
    document.querySelector(".now-playing-img").src = track.img;
    document.querySelector(".track-name").textContent = track.title;
    document.querySelector(".artist-name").textContent = track.artist;

    progressBar.style.width = "0%";
    progressHandle.style.left = "0%";
    currentTimeDisplay.textContent = "0:00";
  }

  playBtn.addEventListener("click", function () {
    if (isPlaying) {
      audio.pause();
      playIcon.classList.remove("fa-pause");
      playIcon.classList.add("fa-play");
    } else {
      audio.play().catch((e) => console.log("Play failed:", e));
      playIcon.classList.remove("fa-play");
      playIcon.classList.add("fa-pause");
    }
    isPlaying = !isPlaying;
  });

  audio.addEventListener("timeupdate", function () {
    if (isNaN(audio.duration)) return;

    const currentTime = audio.currentTime;
    const duration = audio.duration;
    const progressPercent = (currentTime / duration) * 100;

    progressBar.style.width = `${progressPercent}%`;
    progressHandle.style.left = `${progressPercent}%`;

    const currentMinutes = Math.floor(currentTime / 60);
    const currentSeconds = Math.floor(currentTime % 60)
      .toString()
      .padStart(2, "0");
    currentTimeDisplay.textContent = `${currentMinutes}:${currentSeconds}`;
  });

  audio.addEventListener("loadedmetadata", function () {
    const durationMinutes = Math.floor(audio.duration / 60);
    const durationSeconds = Math.floor(audio.duration % 60)
      .toString()
      .padStart(2, "0");
    totalTimeDisplay.textContent = `${durationMinutes}:${durationSeconds}`;
  });

  progressContainer.addEventListener("click", function (e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
  });

  volumeSlider.addEventListener("click", function (e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const volumeLevel = clickX / width;

    audio.volume = volumeLevel;
    volumeProgress.style.width = volumeLevel * 100 + "%";
    volumeHandle.style.left = volumeLevel * 100 + "%";

    updateVolumeIcon(volumeLevel);
  });

  volumeBtn.addEventListener("click", function () {
    if (audio.volume > 0) {
      this.dataset.prevVolume = audio.volume;
      audio.volume = 0;
      volumeProgress.style.width = "0%";
      volumeHandle.style.left = "0%";
      volumeBtn.querySelector("i").className = "fas fa-volume-mute";
    } else {
      const prevVolume = parseFloat(this.dataset.prevVolume) || 1;
      audio.volume = prevVolume;
      volumeProgress.style.width = prevVolume * 100 + "%";
      volumeHandle.style.left = prevVolume * 100 + "%";
      updateVolumeIcon(prevVolume);
    }
  });

  function updateVolumeIcon(volume) {
    const icon = volumeBtn.querySelector("i");
    icon.className = "fas";

    if (volume >= 0.6) {
      icon.classList.add("fa-volume-up");
    } else if (volume >= 0.1) {
      icon.classList.add("fa-volume-down");
    } else {
      icon.classList.add("fa-volume-mute");
    }
  }

  const loginModal = document.createElement("div");
  loginModal.className = "modal";
  loginModal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal" id="close-login-modal"><i class="fas fa-times"></i></button>
            <h2 class="modal-title">Login</h2>
            <form id="login-form">
                <div class="form-group">
                    <label for="login-email">Email</label>
                    <input type="email" id="login-email" required>
                </div>
                <div class="form-group">
                    <label for="login-password">Password</label>
                    <input type="password" id="login-password" required>
                </div>
                <button type="submit" class="login-btn">Login</button>
            </form>
            <div class="form-footer">
                <p>Don't have an account? <a href="#">Sign up</a></p>
            </div>
        </div>
    `;
  document.body.appendChild(loginModal);

  const trendingItems = document.querySelectorAll(".trending-item");
  trendingItems.forEach((item) => {
    item.addEventListener("click", function () {
      const songTitle = this.querySelector("h3").textContent;
      const artistName = this.querySelector("p").textContent;
      const albumArt = this.querySelector("img").src;

      const filename = songTitle.toLowerCase().replace(/\s+/g, "-") + ".mp3";

      document.querySelector(".now-playing-img").src = albumArt;
      document.querySelector(".track-name").textContent = songTitle;
      document.querySelector(".artist-name").textContent = artistName;

      audio.src = `music/${filename}`;
      audio.play().catch((e) => console.log("Play failed:", e));

      playIcon.classList.remove("fa-play");
      playIcon.classList.add("fa-pause");
      isPlaying = true;

      showAudioPlayer();
    });
  });

  const loginLink = document.querySelector(
    'a[href="#"].nav-link:not(.signup-btn)'
  );
  const signupLink = document.querySelector('a[href="#"].signup-btn');

  if (loginLink) {
    loginLink.addEventListener("click", function (e) {
      e.preventDefault();
      loginModal.classList.add("active");
    });
  }

  const signupModal = document.createElement("div");
  signupModal.className = "modal";
  signupModal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal" id="close-signup-modal"><i class="fas fa-times"></i></button>
            <h2 class="modal-title">Sign Up</h2>
            <form id="signup-form">
                <div class="form-group">
                    <label for="signup-name">Full Name</label>
                    <input type="text" id="signup-name" required>
                </div>
                <div class="form-group">
                    <label for="signup-email">Email</label>
                    <input type="email" id="signup-email" required>
                </div>
                <div class="form-group">
                    <label for="signup-password">Password</label>
                    <input type="password" id="signup-password" required>
                </div>
                <button type="submit" class="login-btn">Create Account</button>
            </form>
            <div class="form-footer">
                <p>Already have an account? <a href="#" class="switch-to-login">Login</a></p>
            </div>
        </div>
    `;
  document.body.appendChild(signupModal);

  if (signupLink) {
    signupLink.addEventListener("click", function (e) {
      e.preventDefault();
      signupModal.classList.add("active");
    });
  }

  const closeSignupBtn = signupModal.querySelector(".close-modal");
  closeSignupBtn.addEventListener("click", function () {
    signupModal.classList.remove("active");
  });

  signupModal.addEventListener("click", function (e) {
    if (e.target === signupModal) {
      signupModal.classList.remove("active");
    }
  });

  const signupForm = signupModal.querySelector(".signup-form");
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    console.log("Signup attempt:", name, email, password);

    signupModal.classList.remove("active");
    audioPlayer.classList.add("active");

    if (loginLink) {
      loginLink.textContent = "My Account";
    }
  });

  const switchToLoginLink = signupModal.querySelector(".switch-to-login");
  switchToLoginLink.addEventListener("click", function (e) {
    e.preventDefault();
    signupModal.classList.remove("active");
    loginModal.classList.add("active");
  });

  const switchToSignupLink = loginModal.querySelector(".form-footer a");
  switchToSignupLink.addEventListener("click", function (e) {
    e.preventDefault();
    loginModal.classList.remove("active");
    signupModal.classList.add("active");
  });

  function showAudioPlayer() {
    audioPlayer.classList.add("active");
    document.body.classList.add("player-active");
  }

  document
    .getElementById("close-login-modal")
    .addEventListener("click", function () {
      loginModal.classList.remove("active");
    });

  loginModal.addEventListener("click", function (e) {
    if (e.target === loginModal) {
      loginModal.classList.remove("active");
    }
  });

  const streamBtn = document.getElementById("stream-btn");
  if (streamBtn) {
    streamBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const trendingSection = document.querySelector("#trending-section");
      if (trendingSection) {
        trendingSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
});
