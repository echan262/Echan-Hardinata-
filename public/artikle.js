// articles.js

// ================================
// DAFTAR ARTIKEL
// ================================
const ARTICLES = [

    /* ================================================
       ARTIKEL 1 – Contoh
       Jangan hapus blok ini, bisa di-copy untuk artikel baru
    ================================================ */
    {
        id: "arduino-ultrasonic",          // unik, digunakan di URL: article.html?id=arduino-ultrasonic
        title: "Arduino Ultrasonic: Cara Kerja & Contoh Project",
        tags: ["Arduino","Sensor","HC-SR04"],  // bisa ditambahkan tag baru
        thumbnail: "img/thumbnail1.jpg",   // path relatif ke public
        content: `
            <p>Belajar membuat sensor jarak otomatis dengan HC-SR04.</p>
            <p>Sensor ini sangat populer untuk project robotik dan IoT.</p>
        `,
        sub: [
            {
                subtitle: "Pengantar",
                body: "<p>Sensor ultrasonic HC-SR04 digunakan untuk mengukur jarak dengan gelombang ultrasonik.</p>"
            },
            {
                subtitle: "Contoh Project",
                body: "<p>Membuat robot obstacle avoidance menggunakan HC-SR04 dan Arduino.</p>"
            }
        ],
        files: [
            { name: "Code Arduino.zip", url: "files/arduino-ultrasonic.zip" }
        ]
    },

    /* ================================================
       ARTIKEL 2 – Contoh
       Bisa dicopy untuk artikel baru
    ================================================ */
    {
        id: "rfid-mfrc522",
        title: "RFID MFRC522: Menambah Fitur Magic Card",
        tags: ["Arduino","RFID","MFRC522"],
        thumbnail: "img/thumbnail2.jpg",
        content: "<p>Tutorial lengkap cloning, dump, dan write sektor.</p>",
        sub: [
            {
                subtitle: "Pengantar RFID",
                body: "<p>RFID MFRC522 adalah modul populer untuk membaca kartu RFID.</p>"
            },
            {
                subtitle: "Fitur Magic Card",
                body: "<p>Dengan Magic Card, kita bisa melakukan full clone dan write sektor.</p>"
            }
        ],
        files: [
            { name: "Code RFID.zip", url: "files/rfid-mfrc522.zip" }
        ]
    },

    /* ================================================
       ARTIKEL 3 – Contoh Baru
       Tambah artikel baru dengan copy blok ini
    ================================================ */
    {
        id: "automatic-irrigation",
        title: "Automatic Watering System",
        tags: ["IoT","Arduino","Watering"],
        thumbnail: "img/thumbnail3.jpg",
        content: "<p>Proyek IoT penyiraman & pemupukan otomatis untuk tanaman buah.</p>",
        sub: [
            {
                subtitle: "Deskripsi Proyek",
                body: "<p>Sistem ini menggunakan sensor kelembaban dan pompa air otomatis.</p>"
            },
            {
                subtitle: "Komponen",
                body: "<ul><li>Arduino Uno</li><li>Sensor Kelembaban Tanah</li><li>Pompa Air</li></ul>"
            },
            {
                subtitle: "Cara Kerja",
                body: "<p>Jika kelembaban tanah di bawah batas, sistem akan menyalakan pompa untuk menyiram tanaman.</p>"
            }
        ],
        files: [
            { name: "Code IoT.zip", url: "files/automatic-irrigation.zip" },
            { name: "Diagram Skematik.pdf", url: "files/automatic-irrigation-diagram.pdf" }
        ]
    }

];

// ================================
// PETUNJUK TAMBAH ARTIKEL BARU
// ================================
// 1. Copy salah satu blok artikel di atas (antara { ... })
// 2. Ubah properti:
//    - id (unik, digunakan di URL)
//    - title (judul artikel)
//    - tags (array string, opsional)
//    - thumbnail (path gambar relatif ke public)
//    - content (HTML string)
//    - sub (array sub-bab, tiap sub {subtitle, body})
//    - files (array file download, tiap file {name, url})
// 3. Paste di akhir array sebelum `];`
// 4. Simpan file, artikel baru otomatis muncul di article.html?id=ID_ARTIKEL
