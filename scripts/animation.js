export class Animation {

    /**
     * ease: animasi keluar
     * current: posisi viewport
     * target: 
     * isRunning: status apakah animasi initiated
     * handleWheel: buat bikin instance handleWheel 
     * handleScroll: buat bikin instance animationScroll
     */
    constructor() {
        this.ease = 0.08;
        this.current = window.scrollY;
        this.target = window.scrollY;
        this.isRunning = false;

        this.handleWheel = this.handleWheel.bind(this);
        this.animateScroll = this.animateScroll.bind(this);
    }

    /**
     * Fungsi untuk inisialisai smooth scroll
     * 
     * Cara kerja:
     * Kita set event listener untuk baca pergerakan trackpad,
     * lalu efek pergerakan akan di kontrol oleh handleWheel(),
     * kita set passsive karena mecegah behavior default.
     * 
     */
    initSmoothScroll() {
        window.addEventListener("wheel", this.handleWheel, {
            passive: false
        });
    }

    /**
     * Fungsi untuk mengontrol seberapa halus efek scrolling window.
     * 
     * Cara kerja:
     * Set preventDefault(), kemudian set batas max area scroll,
     * pada properti target, di isi dengan Math.max, lalu cek
     * apakah properti running truem jika tidak maka set animasi scroll.
     * 
     * @param {*} event si window wheel
     */
    handleWheel(event) {
        event.preventDefault();

        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        this.target = Math.max(0, Math.min(maxScroll, this.target + event.deltaY));

        if (!this.isRunning) {
            this.isRunning = true;
            requestAnimationFrame(this.animateScroll);
        }
    }

    /**
     * Fungsi untuk membuat scroll animasi
     */
    animateScroll() {
        this.current += (this.target - this.current) * this.ease;

        if (Math.abs(this.target - this.current) < 0.5) {
            this.current = this.target;
            this.isRunning = false;
        } else {
            requestAnimationFrame(this.animateScroll);
        }

        window.scrollTo(0, this.current);
    }

    /**
     * Fungsi scroll progress
     * 
     * Cara kerja:
     * Ia menerima persentase dan progress bar dari query select, 
     * lalu kita set tinggi area yg bisa di scroll, kemudian set progress pada 
     * lintang Y dibagi tinggi kali 100. lalu set text konten dan height nya.
     * 
     * @param {*} percentage 
     * @param {*} progressBar 
     */
    updateScrollProgress(percentage, progressBar) {
        const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;

        const progress = scrollableHeight > 0
            ? (window.scrollY / scrollableHeight) * 100
            : 0;

        percentage.textContent = `${Math.round(progress)}%`;
        progressBar.style.height = `${progress}%`;
    }

    /**
     * Fungsi scroll halus ke posisi back to top
     * 
     * Cara kerja:
     * Current dengan posisi scroll sekarang, set target ke
     * posisi tujuan, lalu jalankan animateScroll() kalau belum jalan.
     * 
     * @param {*} y posisi tujuan
     */
    scrollToPosition(y = 0) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

        this.current = window.scrollY;
        this.target = Math.max(0, Math.min(maxScroll, y));

        if (!this.isRunning) {
            this.isRunning = true;
            requestAnimationFrame(this.animateScroll);
        }
    }
}
