export class Helper {
    constructor() {}

    /**
     * Fungsi mengambil waktu dan kota saat ini.
     * 
     * Cara kerja:
     * Memanggil namespace Intl yang variabel DateTimeFormat, ia 
     * menerima locale, dan objek konfigurasi waktu, setelah itu
     * langsung di format dengan new Date() upper case.
     * 
     * @returns eg: ```PADANG, 3.15 PM```
     */
    getCurrentTime() {
        const time = new Intl.DateTimeFormat("en-US", {
            timeZone: "Asia/Jakarta",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        }).format(new Date()).toUpperCase();

        return `PADANG, ${time}`;
    }

    /**
     * Fungsi buat ambil tahun sekarang.
     * 
     * Cara kerja:
     * Buat objek Date, isi dengan now, lalu mabil tahun sekarang
     * jadikan string.
     * 
     * @returns eg: ```2026```
     */
    getCurrentYear() {
        return new Date(Date.now()).getFullYear().toString();
    }

    /**
     * Fungsi mengambil gambar dari collection gambar untuk di show.
     * 
     * Alur kerja:
     * 
     * @param {*} name nama gambar yang mau di load
     * @returns 
     */
    loadImage(name, type) {
        const image = document.createElement("img");
        image.src = `./assets/${name}.${type}`;
        image.alt = name;
        image.loading = "lazy";
        return image;
    }

    /**
     * Fungsi load data dari misc data.json
     * 
     * @param {*} path 
     * @returns 
     */
    async loadData(path) {
        return (await fetch(path)).json();
    }

    /**
     * Fungsi mengambil style yang mau dipakai ke innerHTML.
     * 
     * Alur kerja:
     * 
     * @param {*} style nama selector yang mau di load
     */
    loadStyle(style) {

    }

    /**
     * 
     * @param {*} audio 
     */
    async playAudio(audio, toggle) {
        try {
            await audio.play();
            toggle.setAttribute("aria-pressed", "true");
            this.fadeAudio(audio, 1);
        } catch {
            toggle.setAttribute("aria-pressed", "false");
        }
    }
    
    /**
     * 
     * @param {*} audio 
     */
    stopAudio(audio, toggle) {
        this.fadeAudio(audio, 0, () => {
            audio.pause();
            audio.currentTime = 0;
        });

        toggle.setAttribute("aria-pressed", "false");
    }

    fadeAudio(audio, targetVolume, onComplete = null) {
        const startVolume = audio.volume;
        const duration = 500;
        const steps = 30;
        const interval = duration / steps;
        let step = 0;

        const timer = setInterval(() => {
            step++;

            const progress = step / steps;
            audio.volume = startVolume + (targetVolume - startVolume) * progress;

            if (step >= steps) {
                clearInterval(timer);
                audio.volume = targetVolume;
                onComplete?.();
            }
        }, interval);
    }

    /**
     * Fungsi mengatur posisi tiap lapisan di tumpukan kode.
     * 
     * Cara kerja:
     * Tiap item dihitung jaraknya dari item aktif, hasilnya jadi
     * data-pos (0 = paling depan). CSS yang menerjemahkan data-pos
     * menjadi posisi dan rotasi. Hanya item paling depan yang bisa
     * difokus dan dibaca screen reader.
     * 
     * @param {*} items kumpulan elemen lapisan kode
     * @param {*} active index lapisan yang ada di depan
     */
    updateCodeStack(items, active) {
        items.forEach((item, i) => {
            const pos = (i - active + items.length) % items.length;

            item.dataset.pos = pos;
            item.tabIndex = pos === 0 ? 0 : -1;
            item.setAttribute("aria-hidden", String(pos !== 0));
        });
    }
}