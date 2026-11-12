# UKJK LabTrack

**Sistem Pengurusan Peralatan & Stok Bahan Kimia Makmal**  
*Unit Kawalan Jaminan Kualiti (UKJK), Lembaga Getah Malaysia (LGM)*

---

## A. Nama Projek & Penerangan Ringkas

**UKJK LabTrack** ialah sebuah aplikasi web pengurusan makmal yang membantu staf memantau tarikh luput kalibrasi peralatan, jadual verifikasi berkala, serta baki inventori bahan kimia dan bahan guna habis (*consumables*) makmal secara tersusun.

Aplikasi ini menggantikan rekod manual dan helaian hamparan (*spreadsheet*) yang berasingan dengan satu papan pemuka (*dashboard*) interaktif yang memaparkan amaran status menggunakan sistem lampu isyarat (Hijau, Kuning, Merah).

---

## B. Masalah yang Diselesaikan

Di dalam sesebuah makmal ujian dan kawalan kualiti seperti UKJK:
1. **Peralatan Terlepas Jadual Kalibrasi atau Verifikasi**:  
   Peralatan ketepatan tinggi (seperti imbangan analitikal dan spektrofotometer) memerlukan kalibrasi tahunan dan verifikasi bulanan/suku tahun. Jika terlepas tarikh, keputusan ujian getah boleh dipertikaikan dan menjejaskan akreditasi standard kualiti makmal (seperti ISO/IEC 17025).
2. **Kekurangan Stok Bahan Kimia Secara Tiba-Tiba**:  
   Bahan kimia kritikal yang habis atau melepasi tarikh luput tanpa disedari boleh menghentikan operasi ujian sampel standard getah.
3. **Pengesanan Penggunaan Bahan Guna Habis (*Consumables*)**:  
   Pengeluaran sampel standard memerlukan tong gas, beg aluminium, kotak pembungkusan, dan pelekat label. Sebelum ini, tiada sistem pantas untuk melihat baki stok dan rekod pengeluaran mengikut suku tahun.

---

## C. Untuk Siapa?

- **Pegawai Kawalan Kualiti / Pengurus Makmal (Peranan: ADMIN)**:  
  Memantau keseluruhan status makmal, mengurus data induk peralatan dan bahan kimia, melaraskan ambang amaran (*threshold*), serta mengurus senarai staf yang mempunyai akses.
- **Juruteknologi Makmal & Pembantu Penyelidikan (Peranan: STAFF)**:  
  Menyemak tugasan harian, merekod aktiviti verifikasi peralatan, mendaftar stok masuk bahan kimia (*stock-in*), serta mencatat penggunaan bahan guna habis semasa penyediaan sampel standard.
- **Juruaudit Dalaman Kualiti**:  
  Menyemak sejarah rekod penyelenggaraan peralatan dan sijil kalibrasi dengan pantas.

---

## D. Apa yang Boleh Dibuat?

Berdasarkan kod sebenar yang telah dibina dalam sistem ini:

1. **Papan Pemuka Pantas (*Dashboard*)**:
   - Ringkasan kad status: Jumlah peralatan, amaran kalibrasi/verifikasi yang hampir tamat atau telah lewat, dan amaran stok bahan kimia.
   - Penunjuk warna lampu isyarat (Hijau = Selamat, Kuning = Perlu Perhatian, Merah = Tindakan Segera).
   - Senarai tindakan segera (*Action Required*) dengan pautan terus ke maklumat berkaitan.

2. **Pengurusan Peralatan Makmal**:
   - Pendaftaran peralatan lengkap dengan kod aset, nama, jenama/model, lokasi makmal (contoh: *R&D Lab*, *CRM Lab*), dan tahun perolehan.
   - Penjejakan dua jenis penyelenggaraan: **Kalibrasi** (oleh vendor luar seperti Obsnap/SIRIM) dan **Verifikasi** (oleh *SMR Instrument Services* - SIS LGM).
   - Log sejarah servis berserta rekod nombor sijil dan sokongan lampiran dokumen sijil.

3. **Inventori Bahan Kimia**:
   - Senarai bahan kimia bersama kod/CAS, gred/formula, lokasi simpanan, unit ukuran (*ml, L, g, mg, botol*), dan tarikh luput.
   - Perekodan stok masuk (*Stock-In*) dan penolakan stok automatik apabila digunakan dalam sampel.
   - Penandaan automatik apabila stok berada di bawah paras minimum amaran.

4. **Pengurusan Bahan Guna Habis (*Consumables*)**:
   - Pengesanan stok item seperti Tong Gas, Beg Aluminium, Kotak Coklat, Set Pelekat, Getah TSR, dan Kulit Sijil A4.
   - Perekodan penggunaan mengikut kelompok pengeluaran dan suku tahun (*Q1, Q2, Q3, Q4*).

5. **Pengeluaran Sampel Standard (*Standard Sample Batch*)**:
   - Perekodan kumpulan sampel standard getah LGM, tarikh permohonan, tarikh siap, dan rujukan sijil.

6. **Peringatan Tindakan Pantas (*Quick Reminder*)**:
   - Penjanaan draf mesej automatik untuk WhatsApp dan e-mel dengan butiran lengkap peralatan atau bahan kimia yang memerlukan tindakan segera.

7. **Simulasi Pengesahan & Kawalan Peranan**:
   - Antara muka log masuk simulasi dengan peranan **ADMIN** dan **STAFF**.
   - Kawalan paparan menu tetapan sistem khusus untuk Admin.

---

## E. Contoh Cara Penggunaan

### Senario: Merekod Verifikasi Berkala Bagi Imbangan Analitikal (PBL 01)
1. Buka aplikasi dan log masuk sebagai staf makmal.
2. Pada menu tepi (*Sidebar*), klik **Peralatan**.
3. Cari peralatan `PBL 01` (Analytical Balance) menggunakan kotak carian.
4. Klik butang **Lihat Butiran & Log**.
5. Pada tetingkap pop-up, skrol ke bahagian **Log Servis** dan klik **Tambah Rekod Baharu**.
6. Pilih jenis log: **VERIFIKASI**, masukkan tarikh pelaksanaan, keputusan ujian (*PASS* / *FAIL*), dan catatan jika ada.
7. Klik **Simpan Rekod**. Status tarikh verifikasi seterusnya akan dikemas kini secara automatik dan penunjuk lampu isyarat akan bertukar menjadi hijau semula.

---

## F. Cara Mencuba

Aplikasi ini boleh dicapai terus melalui pelayar web pada pautan berikut:

- **Pautan Paparan Aplikasi (Shared Preview)**:  
  [https://ais-pre-peu5hq2ociw7mxkxeuacet-999060639460.asia-east1.run.app](https://ais-pre-peu5hq2ociw7mxkxeuacet-999060639460.asia-east1.run.app)
- **Pautan Pembangun (Development Preview)**:  
  [https://ais-dev-peu5hq2ociw7mxkxeuacet-999060639460.asia-east1.run.app](https://ais-dev-peu5hq2ociw7mxkxeuacet-999060639460.asia-east1.run.app)

*(Nota: Jika anda ingin menjalankan kod sumber ini di komputer anda sendiri, sila rujuk panduan [docs/SETUP-DAN-PENYELENGGARAAN.md](docs/SETUP-DAN-PENYELENGGARAAN.md).)*

---

## G. Status Projek

| Aspek | Status Semasa | Penerangan Ringkas |
| :--- | :--- | :--- |
| **Peringkat Pembangunan** | **Prototaip Fungsian / MVP** | Semua modul teras telah siap dibina dan berfungsi sepenuhnya dalam pelayar. |
| **Kompilasi & Kod** | **Lulus Ujian Sintaks & Build** | Kod melepasi semakan TypeScript (`tsc --noEmit`) dan build pengeluaran Vite (`npm run build`). |
| **Penyimpanan Data** | **Penyimpanan Setempat (*localStorage*)** | Data disimpan di dalam memori pelayar peranti pengguna. Tidak hilang jika di-refresh, tetapi belum disambungkan ke pangkalan data awan berpusat. |
| **Pengesahan Pengguna** | **Simulasi Peranan** | Pemilihan profil Admin dan Staff tersedia untuk menguji aliran kerja antaramuka. Log masuk kata laluan sebenar belum diaktifkan. |
| **Ujian Makmal Fizikal (UAT)** | **Belum Disahkan** | Sistem belum menjalani ujian penerimaan lapangan rasmi di makmal fizikal UKJK LGM. |

---

## H. Panduan Lanjut

Untuk maklumat terperinci, sila rujuk dokumen-dokumen berikut:

- 📖 [Panduan Pengguna Lengkap](docs/PANDUAN-PENGGUNA.md) — Langkah demi langkah penggunaan sistem bagi setiap modul.
- 📋 [Dokumen Keperluan Produk (PRD)](docs/KEPERLUAN-PRODUK.md) — Objektif perniagaan, peraturan pengiraan, dan skop projek.
- 🗺️ [Status Pembangunan & Perancangan (Roadmap)](docs/STATUS-DAN-ROADMAP.md) — Senarai apa yang sudah siap, kekangan semasa, dan pelan masa depan.
- 🔒 [Data & Privasi](docs/DATA-DAN-PRIVASI.md) — Cara data dikendalikan dan keselamatan maklumat makmal.
- 💻 [Panduan Setup & Penyelenggaraan](docs/SETUP-DAN-PENYELENGGARAAN.md) — Arahan menjalankan kod sumber dan panduan menyambung ke GitHub.
- 📝 [Rekod Perubahan (Changelog)](CHANGELOG.md) — Sejarah kemas kini sistem.

---

## I. Ringkasan Teknologi

Aplikasi ini dibina berasaskan teknologi web moden yang ringan dan pantas:

- **React (v19)**: Digunakan untuk membina struktur paparan dan interaksi pengguna.
- **TypeScript**: Memastikan kod selamat, tepat, dan mengurangkan ralat sistem sebelum dijalankan.
- **Tailwind CSS**: Digunakan untuk penggayaan antaramuka yang kemas, responsif, dan mudah dibaca pada skrin komputer mahupun tablet.
- **Vite**: Alat binaan (*build tool*) pantas untuk pembangunan aplikasi web moden.
- **Lucide React**: Ikon grafik yang bersih untuk visualisasi butang dan status makmal.

---

## J. Maklum Balas & Lesen

- **Maklum Balas & Laporan Isu**:  
  Sebarang cadangan penambahbaikan atau isu boleh dilaporkan melalui tab **Issues** di GitHub apabila repositori ini telah dipautkan.
- **Status Lesen**:  
  Lesen rasmi aplikasi belum ditetapkan oleh pemilik projek. Hak cipta terpelihara bagi Unit Kawalan Jaminan Kualiti (UKJK), Lembaga Getah Malaysia (LGM).
