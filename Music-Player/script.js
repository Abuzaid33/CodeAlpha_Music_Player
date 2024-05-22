let now_playing = document.querySelector('.now-playing');
let track_art = document.querySelector('.track-art');
let track_name = document.querySelector('.track-name');
let track_artist = document.querySelector('.track-artist');

let playpause_btn = document.querySelector('.playpause-track');
let next_btn = document.querySelector('.next-track');
let prev_btn = document.querySelector('.prev-track');

let seek_slider = document.querySelector('.seek_slider');
let volume_slider = document.querySelector('.volume_slider');
let curr_time = document.querySelector('.current-time');
let total_duration = document.querySelector('.total-duration');
let wave = document.getElementById('wave');
let randomIcon = document.querySelector('.randomActive');
let curr_track = document.createElement('audio');

let track_index = 0;
let isPlaying = false;
let isRandom = false;
let updateTimer;

const music_list = [
    {
        img: 'images/stay.png',
        name: 'Stay',
        artist: 'The Kid LAROI, Justin Bieber',
        music: 'music/stay.mp3'
    },
    {
        img: 'images/fallingdown.jpg',
        name: 'Falling Down',
        artist: 'Wid Cards',
        music: 'music/fallingdown.mp3'
    },
    {
        img: 'images/faded.png',
        name: 'Faded',
        artist: 'Alan Walker',
        music: 'music/Faded.mp3'
    },
    {
        img: 'images/ratherbe.jpg',
        name: 'Rather Be',
        artist: 'Clean Bandit',
        music: 'music/Rather Be.mp3'
    }
];

loadTrack(track_index);
createPlaylist();

function loadTrack(track_index) {
    clearInterval(updateTimer);
    reset();

    curr_track.src = music_list[track_index].music;
    curr_track.load();

    track_art.style.backgroundImage = "url(" + music_list[track_index].img + ")";
    track_name.textContent = music_list[track_index].name;
    track_artist.textContent = music_list[track_index].artist;
    now_playing.textContent = "Playing music " + (track_index + 1) + " of " + music_list.length;

    updateTimer = setInterval(setUpdate, 1000);

    curr_track.addEventListener('ended', nextTrack);
    random_bg_color();
}

function random_bg_color() {
    let hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e'];
    let a;

    function populate(a) {
        for (let i = 0; i < 6; i++) {
            let x = Math.round(Math.random() * 14);
            let y = hex[x];
            a += y;
        }
        return a;
    }
    let Color1 = populate('#');
    let Color2 = populate('#');
    var angle = 'to right';

    let gradient = 'linear-gradient(' + angle + ',' + Color1 + ', ' + Color2 + ")";
    document.body.style.background = gradient;
}

function reset() {
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}

function randomTrack() {
    isRandom ? pauseRandom() : playRandom();
}

function playRandom() {
    isRandom = true;
    randomIcon.classList.add('randomActive');
}

function pauseRandom() {
    isRandom = false;
    randomIcon.classList.remove('randomActive');
}

function repeatTrack() {
    let current_index = track_index;
    loadTrack(current_index);
    playTrack();
}

function playpauseTrack() {
    isPlaying ? pauseTrack() : playTrack();
}

function playTrack() {
    curr_track.play();
    isPlaying = true;
    track_art.classList.add('rotate');
    wave.classList.add('loader');
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseTrack() {
    curr_track.pause();
    isPlaying = false;
    track_art.classList.remove('rotate');
    wave.classList.remove('loader');
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

function nextTrack() {
    if (track_index < music_list.length - 1 && isRandom === false) {
        track_index += 1;
    } else if (track_index < music_list.length - 1 && isRandom === true) {
        let random_index = Number.parseInt(Math.random() * music_list.length);
        track_index = random_index;
    } else {
        track_index = 0;
    }
    loadTrack(track_index);
    playTrack();
}

function prevTrack() {
    if (track_index > 0) {
        track_index -= 1;
    } else {
        track_index = music_list.length - 1;
    }
    loadTrack(track_index);
    playTrack();
}

function seekTo() {
    let seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
}

function setVolume() {
    curr_track.volume = volume_slider.value / 100;
}

function setUpdate() {
    let seekPosition = 0;
    if (!isNaN(curr_track.duration)) {
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);
        seek_slider.value = seekPosition;

        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
        if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}

function createPlaylist() {
    const playlistElement = document.getElementById('playlist');
    music_list.forEach((track, index) => {
        const trackItem = document.createElement('li');
        trackItem.textContent = `${track.name} - ${track.artist}`;
        trackItem.onclick = () => {
            track_index = index;
            loadTrack(track_index);
            playTrack();
        };
        playlistElement.appendChild(trackItem);
    });
}

function searchMusic() {
    let searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    let category = document.getElementById('categorySelect').value;
    
    let filteredMusic;
    if (category === 'all') {
        filteredMusic = music_list.filter(track =>             track.name.toLowerCase().includes(searchTerm) || 
        track.artist.toLowerCase().includes(searchTerm)
    );
} else if (category === 'artist') {
    filteredMusic = music_list.filter(track => 
        track.artist.toLowerCase().includes(searchTerm)
    );
} else if (category === 'genre') {
    filteredMusic = music_list.filter(track => 
        track.genre.toLowerCase().includes(searchTerm)
    );
}

if (filteredMusic.length > 0) {
    // Clear existing playlist and populate with filtered music
    playlist.innerHTML = '';
    filteredMusic.forEach((track, index) => {
        let listItem = document.createElement('li');
        listItem.textContent = `${track.name} - ${track.artist}`;
        listItem.setAttribute('data-index', index);
        listItem.addEventListener('click', () => {
            track_index = index;
            loadTrack(track_index);
            playTrack();
        });
        playlist.appendChild(listItem);
    });
} else {
    // Show a message if no matching music found
    alert('No matching music found.');
}
}

function filterByArtist(artist) {
let filteredMusic = music_list.filter(track => track.artist === artist);
updatePlaylist(filteredMusic);
}

function filterByGenre(genre) {
let filteredMusic = music_list.filter(track => track.genre === genre);
updatePlaylist(filteredMusic);
}

function updatePlaylist(filteredMusic) {
playlist.innerHTML = '';
filteredMusic.forEach((track, index) => {
    let listItem = document.createElement('li');
    listItem.textContent = `${track.name} - ${track.artist}`;
    listItem.setAttribute('data-index', index);
    listItem.addEventListener('click', () => {
        track_index = index;
        loadTrack(track_index);
        playTrack();
    });
    playlist.appendChild(listItem);
});
}
document.addEventListener('DOMContentLoaded', function () {
    const togglePlaylistBtn = document.getElementById('togglePlaylistBtn');
    const playlistContainer = document.getElementById('playlistContainer');

    // Add event listener to the "Show Playlist" button
    togglePlaylistBtn.addEventListener('click', function () {
        // Toggle the display property of the playlist container
        if (playlistContainer.style.display === 'none' || playlistContainer.style.display === '') {
            playlistContainer.style.display = 'block';
        } else {
            playlistContainer.style.display = 'none';
        }
    });
});
