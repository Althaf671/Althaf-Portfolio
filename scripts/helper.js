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
        } catch {
            toggle.setAttribute("aria-pressed", "false");
        }
    }
    
    /**
     * 
     * @param {*} audio 
     */
    stopAudio(audio, toggle) {
        audio.pause();
        toggle.setAttribute("aria-pressed", "false");
    }
}