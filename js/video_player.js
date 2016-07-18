// video player elements

var buttons = document.getElementById('buttons');
var duration = document.getElementById('duration');
var fullscreen = document.getElementById('fullscreen');
var play = document.getElementById('play');
var progressBar = document.getElementById('progress-bar');
var progressBuffer = document.getElementById('progress-buffer');
var sound = document.getElementById('sound');
var time = document.getElementById('time');
var video = document.getElementById('video');
var videoarea = document.getElementById('player');

// video player event listeners

window.addEventListener("load", function() {

	video.addEventListener("loadedmetadata", function() {
		time.innerHTML = "00:00:00" + " / " + formatTime(video.duration);
	});

	video.addEventListener("play", function() {
		play.innerHTML = '<img src="./img/pause-icon.png" alt="pause button">';
	});

	video.addEventListener("pause", function() {
		play.innerHTML = '<img src="./img/play-icon.png" alt="play button">';
	});

	video.addEventListener("ended", function() {
		play.innerHTML = '<img src="./img/play-icon.png" alt="play button">';
	});

	video.addEventListener("progress", function() {
		if (this.readyState === 4) {
			var duration = this.duration;
			var buffer = this.buffered.end(0);
			if (duration > 0) {
				var percent = ((buffer / duration)*100) + "%";
				progressBuffer.style.width = percent;
			}
		}
	});

	video.addEventListener("timeupdate", function() {
		var duration = this.duration;
		var currentTime = this.currentTime;
		var subtitles = document.getElementsByTagName('p');
		if (duration > 0) {
			var percent = ((currentTime / duration)*100) + "%";
			time.innerHTML = formatTime(currentTime) + " / " + formatTime(duration);
			progressBar.style.width = percent;
		}
		currentTime = formatTime(currentTime);
		for (var x = 0; x < subtitles.length; x++) {
			if (currentTime >= subtitles[x].dataset.start && currentTime <= subtitles[x].dataset.end) {
				subtitles[x].className = "highlight";
			} else {
				subtitles[x].className = "";
			}
		}
	});

	videoarea.addEventListener("mouseover", function() {
		buttons.className = "";
	});

	videoarea.addEventListener("mouseout", function() {
		buttons.className = "hidden";
	});

	play.addEventListener("click", function() {
		if (video.paused) {
			video.pause(); //fix for promise error if trying to replay video
			video.play();
		} else {
			video.pause();
		}
	});
	
	sound.addEventListener("click", function() {
		if (video.muted) {
			video.muted = false;
			sound.innerHTML = '<img src="./img/volume-on-icon.png" alt="volume button">';
		} else {
			video.muted = true;
			sound.innerHTML = '<img src="./img/volume-off-icon.png" alt="volume button">';
		}
	});

	fullscreen.addEventListener("click", function() {
		if (!video.fullscreenElement) {
			if (video.requestFullScreen) {
				video.requestFullScreen();
			}
			if (video.webkitRequestFullScreen) {
				video.webkitRequestFullScreen();
			}
		} else {
			if (video.exitFullScreen) {
				video.exitFullScreen();
			}
		}
	});

	duration.addEventListener("click", function(event) {
		var percent = event.offsetX / this.offsetWidth;
		var selectedTime = video.duration * percent;
		video.currentTime = selectedTime;
		progressBar.style.width = percent * 100 + "%";
	});

});

// helper functions

function formatTime(seconds) {
	var hours = Math.floor(seconds / 60 / 60);
	hours = (hours >= 10) ? hours : "0" + hours;
	var minutes = Math.floor(seconds / 60);
	minutes = (minutes >= 10) ? minutes : "0" + minutes;
	seconds = Math.round(seconds);
	seconds = (seconds >= 10) ? seconds : "0" + seconds;
	return hours + ":" + minutes + ":" + seconds;
}