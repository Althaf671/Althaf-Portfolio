export class Worker {
    constructor() {
        this.serviceWorkerPath = "./service-worker.js";
    }

    async register() {
        if (!("serviceWorker" in navigator)) {
            console.warn("Service Worker tidak support pada browser.");
            return;
        }

        if (!window.isSecureContext) {
            console.warn("Service Worker wajib dengan protokol HTTPS.");
            return;
        }

        try {
            const registration = await navigator.serviceWorker.register(
                this.serviceWorkerPath
            );

            console.log("Service Worker terdaftar:", registration.scope);
        } catch (error) {
            console.error("Service Worker gagal di register:", error);
        }
    }
}