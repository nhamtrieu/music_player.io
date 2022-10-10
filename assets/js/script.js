/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotate
 * 5. Next /prev
 * 6. Random
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when lick
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const repeatBtn = $('.btn-repeat');
const randomBtn = $('.btn-random');
const playlist = $('.playlist');
const timeCurr = $('.time-current');
const timeSong = $('.time-song');
console.log(timeCurr, timeSong);
const app = {
    currentIndex: Math.floor(Math.random() * 10),
    isPlaying: false,
    isRepeat: false,
    isRandom: false,
    songs: [
        {
            name: 'Ấn nút nhớ thả giấc mơ',
            singer: 'Sơn Tùng',
            path: './assets/music/an_nut_nho_tha_giac_mo.mp3',
            img: './assets/img/annutnhothagiacmo.jpg',
        },
        {
            name: 'Anh đánh rơi người yêu này',
            singer: 'Phương Thanh - Quốc Đạt',
            path: './assets/music/anh_danh_roi_nguoi_yeu_nay.mp3',
            img: './assets/img/anhdanhroinguoiyeunay.jpeg',
        },
        {
            name: 'Chiếc khăn gió ấm',
            singer: 'Khánh Phương',
            path: './assets/music/chiec_khan_gio_am.mp3',
            img: './assets/img/chieckhangioam.jpg',
        },
        {
            name: 'Mashup Cô bé mùa đông, Tuyết yêu thương',
            singer: 'Quân AP',
            path: './assets/music/co_be_mua_dong_x_tuyet_yeu_thuong.mp3',
            img: './assets/img/cobemuadong.webp',
        },
        {
            name: 'Ta là của nhau',
            singer: 'Tại đám cưới',
            path: './assets/music/ta_la_cua_nhau.mp3',
            img: './assets/img/talacunhau.jpg',
        },
        {
            name: 'Thế giới trong em',
            singer: 'Phương Ly',
            path: './assets/music/the_gioi_trong_em.mp3',
            img: './assets/img/thegioitrongem.jpg',
        },
        {
            name: 'Thêm bao nhiêu lâu',
            singer: 'DatG',
            path: './assets/music/them_bao_nhieu_lan.mp3',
            img: './assets/img/thembaonhieulau.jpg',
        },
        {
            name: 'Waiting for love',
            singer: 'Avicii',
            path: './assets/music/waiting_for_love.mp3',
            img: './assets/img/waitingforlove.jpg',
        },
        {
            name: 'Wake me up',
            singer: 'Avicii',
            path: './assets/music/wake_me_up.mp3',
            img: './assets/img/Avicii_-_Wake_Me_Up.jpg',
        },
        {
            name: 'Xứng đôi cưới thôi',
            singer: 'Lê Thiện Hiếu',
            path: './assets/music/xung_doi_cuoi_thoi.mp3',
            img: './assets/img/xungdoicuoithoi.jpg',
        },
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
                    <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
                        <div
                            class="thumb"
                            style="background-image: url('${song.img}')"
                        ></div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>`;
        });
        playlist.innerHTML = htmls.join('');
    },

    handleEvent: function () {
        const _this = this;
        const cdWidth = cd.offsetWidth;

        //xử lý phóng to / thu nhỏ cd
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        //xử lý khi quay / dừng cd
        const cdThumbAnimate = cdThumb.animate([{ transform: 'rotate(360deg)' }], {
            duration: 10000,
            iterations: Infinity,
        });
        cdThumbAnimate.pause();
        //xử lý khi bấm play
        playBtn.onclick = function () {
            if (!_this.isPlaying) {
                audio.play();
            } else {
                audio.pause();
            }
        };

        // tiếp tục bài hát
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        };

        // dừng bài hát
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        };

        // khi thời gian bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = progressPercent;
            }
        };

        // xử lý khi tua xong
        progress.oninput = function (e) {
            const seekTime = (e.target.value / 100) * audio.duration;
            audio.currentTime = seekTime;
            const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
            progress.value = progressPercent;
        };

        // chuyển bài tiếp theo
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
        };

        // chuyển bài trước
        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.randomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
        };
        // repeat song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
        };
        // random song
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
            if (randomBtn.classList.contains('active')) {
                _this.randomSong();
                audio.play();
            }
            _this.render();
        };
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                _this.nextSong();
            }
        };
        playlist.onclick = function (e) {
            const songElm = e.target.closest('.song:not(.active)');
            // click on song
            if (songElm || e.target.closest('.option')) {
                if (songElm) {
                    _this.currentIndex = Number(songElm.dataset.index);
                    _this.render();
                    _this.loadCurrentSong();
                    audio.play();
                }
            }
        };
    },

    formatTime: function () {
        let timeCd;
        const fulltime = audio.duration;
        if (fulltime) {
            timeCd = Math.floor(fulltime);
        }
        let minute = Math.floor(timeCd / 60);
        let second = Math.floor(timeCd % 60);
        let timeFormat;
        if (minute < 10 && second < 10) {
            timeFormat = `0${minute}:0${second}`;
        } else if (minute < 10 && second >= 10) {
            timeFormat = `0${minute}:${second}`;
        } else if (minute >= 10 && second < 10) {
            timeFormat = `${minute}:0${second}`;
        } else {
            timeFormat = `${minute}:${second}`;
        }
        return timeFormat;
    },
    // prev song
    prevSong: function () {
        this.currentIndex -= 1;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
            this.currentSong = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    // next song
    nextSong: function () {
        this.currentIndex += 1;
        if (this.currentIndex > this.songs.length - 1) {
            this.currentIndex = 0;
            this.currentSong = 0;
        }
        this.loadCurrentSong();
    },

    // repeat song
    repeatSong: function () {
        let newIndex = this.currentIndex;
        this.currentIndex = newIndex;
        this.loadCurrentSong();
        audio.play();
    },

    // random song
    randomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    timeSongCurrent: function () {
        timeSong.innerText = this.formatTime();
    },

    // scrollToActiveSong: function () {
    //     setTimeout(() => {
    //         $('.song.active').scrollIntoView({
    //             behavior: 'smooth',
    //             block: 'nearest',
    //         });
    //     }, 300);
    // },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },
    loadCurrentSong: function () {
        if (this.currentIndex >= 0 || this.currentIndex <= this.songs.length) {
            heading.textContent = this.currentSong.name;
            cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`;
            audio.src = this.currentSong.path;
        }
    },

    start: function () {
        // lang nghe/ xu ly su kien(DOM event)
        this.handleEvent();
        // DInh nghia cac thuoc tinh cho obj
        this.defineProperties();
        // load bai hat hien tai
        this.loadCurrentSong();
        //render ra giao dien
        this.render();
    },
};

app.start();
