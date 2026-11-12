# Panduan Setup & Penyelenggaraan Sistem: UKJK LabTrack

Panduan ini bertujuan untuk pentadbir sistem, pembangun perisian, atau pegawai teknologi maklumat yang ingin menjalankan, menyelenggara, atau membina semula aplikasi **UKJK LabTrack** pada komputer mereka.

---

## 1. Keperluan Sistem Minimum

Sebelum memulakan, pastikan persekitaran komputer anda mempunyai perisian berikut:

- **Node.js**: Versi 18.0.0 atau lebih baharu (disyorkan Node.js 20 LTS).
- **Pengurus Pakej (*Package Manager*)**: `npm` (didatangkan bersama Node.js) atau `bun` / `pnpm`.
- **Pelayar Web**: Google Chrome, Microsoft Edge, Mozilla Firefox, atau Safari versi terkini.
- **Git**: Untuk pengurusan versi kod sumber.

---

## 2. Arahan Pemasangan & Menjalankan Projek

Ikuti 4 langkah mudah berikut:

### Langkah 1: Pasang Ketergantungan (*Install Dependencies*)
Jalankan arahan ini di terminal untuk memuat turun semua pustaka perisian yang diperlukan:
```bash
npm install
```

### Langkah 2: Semakan Kod (*Linting & Type Check*)
Untuk memastikan tiada ralat sintaksis atau ralat jenis data dalam TypeScript:
```bash
npm run lint
```
*(Arahan ini menjalankan `tsc --noEmit` yang mengesahkan ketepatan semua fail tanpa mengubah fail asal).*

### Langkah 3: Menjalankan Pelayan Pembangunan (*Run Dev Server*)
Untuk memulakan aplikasi pada komputer anda:
```bash
npm run dev
```
Secara lalai, pelayan pembangunan akan dibuka pada alamat:
`http://localhost:3000`

### Langkah 4: Membina untuk Pengeluaran (*Production Build*)
Apabila anda sedia untuk memasang aplikasi ke pelayan web sebenar:
```bash
npm run build
```
Fail web yang telah dioptimumkan (*compiled & minified*) akan diletakkan di dalam folder `dist/`.

Untuk menguji binaan pengeluaran tersebut secara lokal:
```bash
npm run preview
```

---

## 3. Pembolehubah Persekitaran (*Environment Variables*)

Aplikasi menyediakan fail rujukan `.env.example`:
```ini
# GEMINI_API_KEY: Diperlukan jika fungsi AI diaktifkan pada masa hadapan
GEMINI_API_KEY="MY_GEMINI_API_KEY"

# APP_URL: Alamat URL aplikasi ini dihoskan
APP_URL="MY_APP_URL"
```

**Peraturan Keselamatan Penting:**
- Jangan sekali-kali meletakkan kunci API (*API Key*), kata laluan, atau data sulit ke dalam fail `.env` yang dipantau oleh Git.
- Fail `.gitignore` projek telah dikonfigurasikan untuk mengabaikan fail `.env` sebenar bagi melindungi keselamatan sistem.

---

## 4. Panduan Menyambungkan Projek ke GitHub

Memandangkan aplikasi ini berada di persekitaran pembangunan selamat tanpa sambungan akaun GitHub langsung, anda boleh memuat naik kod ini ke akaun GitHub peribadi atau organisasi LGM anda dengan langkah berikut:

### A. Cadangan Maklumat Repositori
- **Nama Repositori**: `ukjk-labtrack`
- **Penerangan (*Description*)**:  
  `Sistem Pengurusan Peralatan & Stok Bahan Kimia Makmal Unit Kawalan Jaminan Kualiti (UKJK), Lembaga Getah Malaysia (LGM).`
- **Tahap Keterlihatan (*Visibility*)**: **Private** (Peribadi - disyorkan sebagai lalai bagi melindungi maklumat aset organisasi).

### B. Langkah Memuat Naik ke GitHub

1. Buka laman web [GitHub](https://github.com) dan log masuk ke akaun anda.
2. Klik butang **New Repository**.
3. Masukkan nama: `ukjk-labtrack`.
4. Pilih **Private**. Jangan tandakan *Add a README file* atau *.gitignore* kerana fail tersebut telah siap dibina di dalam projek ini.
5. Klik **Create repository**.
6. Pada terminal komputer anda di dalam direktori projek ini, jalankan arahan berikut:

```bash
# 1. Pastikan anda berada di cawangan 'main'
git checkout -b main 2>/dev/null || git branch -M main

# 2. Tambah semua fail projek yang telah disaring oleh .gitignore
git add .

# 3. Buat commit pertama
git commit -m "feat: inisialisasi projek dan dokumentasi lengkap UKJK LabTrack v1.0.0"

# 4. Hubungkan ke repositori GitHub anda (gantikan USERNAME dengan nama akaun GitHub anda)
git remote add origin https://github.com/USERNAME/ukjk-labtrack.git

# 5. Muat naik kod ke GitHub
git push -u origin main
```

---

## 5. Struktur Direktori Projek

Berikut ialah ringkasan susunan fail projek:

```text
├── .env.example              # Rujukan pembolehubah persekitaran (tanpa rahsia)
├── .gitignore                # Menapis node_modules, dist, dan fail sulit
├── CHANGELOG.md              # Rekod sejarah versi dan kemas kini
├── README.md                 # Pintu masuk utama dan ringkasan produk
├── docs/                     # Dokumentasi terperinci
│   ├── PANDUAN-PENGGUNA.md   # Panduan penggunaan langkah demi langkah
│   ├── KEPERLUAN-PRODUK.md   # Spesifikasi PRD dan peraturan perniagaan
│   ├── STATUS-DAN-ROADMAP.md # Status semasa dan pelan fasa seterusnya
│   ├── DATA-DAN-PRIVASI.md   # Polisi pengendalian data dan privasi
│   └── SETUP-DAN-PENYELENGGARAAN.md # Panduan teknikal dan setup GitHub
├── index.html                # Titik masuk HTML aplikasi
├── metadata.json             # Konfigurasi persekitaran aplikasi
├── package.json              # Senarai pustaka ketergantungan dan skrip
├── public/assets/aistudio/   # Dokumen PDF sumber asal dari LGM
├── src/                      # Kod sumber aplikasi
│   ├── components/           # Komponen antaramuka React (Dashboard, Modal, dll.)
│   ├── data/                 # Data awal peralatan rasmi LGM & inventori kimia
│   ├── services/             # dataService.ts (Logik perniagaan & localStorage)
│   ├── types/                # Definisi jenis data TypeScript
│   ├── App.tsx               # Komponen utama navigasi dan pengurusan keadaan
│   ├── index.css             # Konfigurasi Tailwind CSS
│   └── main.tsx              # Titik permulaan kompilasi React
├── tsconfig.json             # Konfigurasi pengkompil TypeScript
└── vite.config.ts            # Konfigurasi binaan enjin Vite
```

---

## 6. Penyelesaian Masalah Teknikal (*Troubleshooting*)

| Masalah | Punca Biasa | Langkah Penyelesaian |
| :--- | :--- | :--- |
| **Port 3000 sedang digunakan (*Port 3000 in use*)** | Ada aplikasi lain yang sedang berjalan pada port 3000. | Jalankan `npm run dev -- --port 3001` untuk menggunakan port lain. |
| **Ralat jenis TypeScript semasa binaan** | Terdapat medan data yang tidak sepadan dengan definisi jenis. | Jalankan `npm run lint` untuk melihat baris kod yang bermasalah sebelum menjalankan binaan pengeluaran. |
| **Pustaka tidak dijumpai (*Cannot find module*)** | Folder `node_modules` belum dimuat turun sepenuhnya. | Padam fail kunci atau jalankan semula arahan `npm install`. |
