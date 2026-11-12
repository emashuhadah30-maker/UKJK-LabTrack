# Panduan Pengguna: UKJK LabTrack

Dokumen ini menyediakan panduan langkah demi langkah cara menggunakan sistem **UKJK LabTrack** untuk mengurus peralatan makmal, rekod kalibrasi, verifikasi, stok bahan kimia, dan bahan guna habis (*consumables*).

---

## 1. Maksud Label dan Status Penting

Aplikasi ini menggunakan konsep **Lampu Isyarat (*Traffic Light System*)** untuk memudahkan staf mengesan status tindakan dalam sekelip mata:

| Warna Status | Maksud Pada Peralatan | Maksud Pada Bahan Kimia & Consumable | Tindakan Yang Perlu Diambil |
| :--- | :--- | :--- | :--- |
| **🟢 Hijau (*Normal / OK*)** | Tarikh kalibrasi atau verifikasi masih jauh (melebihi ambang amaran, contohnya baki > 30 hari). | Paras stok mencukupi dan tarikh luput masih lama. | Tiada tindakan segera diperlukan. Peralatan sedia digunakan. |
| **🟡 Kuning (*Perhatian / Warning*)** | Tarikh luput kalibrasi atau verifikasi semakin hampir (baki antara 1 hingga 30 hari). | Paras stok berada di bawah paras minimum (*minimum threshold*) atau tarikh luput berbaki kurang 30 hari. | Rancang temujanji vendor kalibrasi / jalankan verifikasi dalaman / sediakan pesanan belian stok. |
| **🔴 Merah (*Kritikal / Overdue*)** | Tarikh luput telah tamat atau terlewat (*overdue*), atau peralatan berstatus rosak (*BROKEN*). | Stok telah habis (sifar) atau tarikh luput bahan kimia telah berlalu. | **Henti penggunaan** jika kritikal. Hubungi vendor segera atau asingkan bahan kimia luput. |

### Label Tambahan:
- **Kalibrasi (*Calibration*)**: Ujian penentukuran ketepatan instrumen yang dilakukan secara berkala (biasanya setiap 12 bulan) oleh jurutera vendor luar bertauliah (contoh: Obsnap Instruments, SIRIM).
- **Verifikasi (*Verification*)**: Ujian pengesahan prestasi rutin oleh unit dalaman iaitu *SMR Instrument Services* (SIS) Lembaga Getah Malaysia atau staf makmal (biasanya setiap 1 atau 3 bulan).
- **Keputusan Verifikasi**:
  - `PASS` (Lulus): Instrumen memenuhi had ralat yang dibenarkan.
  - `FAIL` (Gagal): Instrumen tidak mematuhi toleransi dan memerlukan penyelenggaraan pembetulan.

---

## 2. Log Masuk dan Penukaran Peranan (*User Roles*)

Sistem menyediakan dua jenis peranan:
- **ADMIN**: Mempunyai akses penuh termasuk menambah, mengedit, memadam data peralatan/bahan kimia, mengubah tetapan sistem (ambang hari amaran), dan mengurus senarai pengguna.
- **STAFF**: Mempunyai akses untuk melihat data, merekod log kalibrasi/verifikasi, mendaftar kemasukan stok (*stock-in*), merekod penggunaan consumable, dan menjana teks peringatan. Menu tetapan sistem dihadkan bagi staf.

### Cara Log Masuk / Tukar Pengguna:
1. Di skrin utama permulaan, pilih profil anda daripada senarai (contoh: `Dr. Halimah Nasir (ADMIN)` atau `Ahmad Razali (STAFF)`).
2. Klik butang **Log Masuk ke Sistem**.
3. Untuk menukar pengguna semasa tanpa keluar dari aplikasi, klik pada avatar nama anda di penjuru kanan atas (*Navbar*) dan pilih **Tukar Pengguna**.

---

## 3. Papan Pemuka (*Dashboard*)

Papan pemuka memaparkan rumusan masa nyata makmal anda:

1. **Kad KPI**:
   - Menunjukkan jumlah peralatan aktif, jumlah item yang memerlukan tindakan segera, bilangan kalibrasi tertunggak, dan amaran stok kimia.
2. **Penapis Pantas (*Quick Filters*)**:
   - Klik pada butang kad amaran (contoh: "Perlu Tindakan") untuk menapis terus senarai peralatan atau bahan kimia yang memerlukan perhatian.
3. **Senarai Tindakan Segera (*Action Required*)**:
   - Memaparkan item berkod merah dan kuning berserta butang pintasan **Hantar Peringatan** (WhatsApp/E-mel) atau **Lihat Butiran**.

---

## 4. Modul Pengurusan Peralatan

### A. Melihat dan Menapis Peralatan:
1. Klik menu **Peralatan** pada menu navigasi sebelah kiri.
2. Gunakan **Kotak Carian** untuk mencari mengikut Kod Aset (contoh: `PBL 01`) atau nama instrumen.
3. Gunakan butang penapis mengikut lokasi makmal (contoh: *R&D LAB*, *CRM LAB*) atau status lampu isyarat (Semua, Hijau, Kuning, Merah).

### B. Mendaftar Peralatan Baharu (Khusus ADMIN):
1. Klik butang biru **+ Tambah Peralatan** di penjuru atas.
2. Isi maklumat asas:
   - **Kod Aset**: Contoh `PBL 09` *(Mesti unik)*.
   - **Nama Peralatan**: Contoh `Analytical Balance`.
   - **Jenama / Model**: Contoh `Mettler Toledo ME204`.
   - **Lokasi**: Pilih atau taip lokasi bilik makmal.
   - **Tahun Perolehan**: Contoh `2026`.
3. Tetapkan jadual:
   - Tandakan sama ada instrumen memerlukan **Kalibrasi** dan tetapkan kekerapan (contoh: `12` bulan).
   - Tandakan sama ada instrumen memerlukan **Verifikasi** dan tetapkan kekerapan (contoh: `1` bulan).
4. Klik **Simpan Peralatan**.

### C. Merekod Log Kalibrasi atau Verifikasi Baharu:
1. Pada baris peralatan berkaitan, klik butang **Lihat Butiran & Log**.
2. Di dalam tetingkap pop-up, pergi ke bahagian **Log Servis / Penyelenggaraan**.
3. Klik **+ Tambah Rekod Baharu**.
4. Lengkapkan borang:
   - **Jenis Log**: Pilih `KALIBRASI` atau `VERIFIKASI`.
   - **Tarikh Dilaksanakan**: Tarikh ujian dijalankan.
   - **Penyedia / Keputusan**: Masukkan nama syarikat vendor (jika kalibrasi) ATAU pilih `PASS` / `FAIL` (jika verifikasi).
   - **Nombor Sijil**: Contoh `OBS-2026-CAL-1142`.
   - **Lampiran Sijil**: Anda boleh memuat naik salinan fail PDF/gambar sijil sebagai simpanan digital.
   - **Catatan**: Sebarang pemerhatian teknikal.
5. Klik **Simpan Rekod**. Sistem akan mengira tarikh luput seterusnya secara automatik berasaskan kekerapan bulan yang telah ditetapkan.

---

## 5. Modul Bahan Kimia Makmal

### A. Memeriksa Inventori Bahan Kimia:
1. Klik menu **Bahan Kimia** pada menu navigasi.
2. Paparan akan menunjukkan baki stok semasa, had stok minimum, tarikh luput, dan baki hari sebelum luput.
3. Warna kad atau baris menunjukkan sama ada stok perlu dipesan semula.

### B. Merekod Stok Masuk (*Stock-In*):
Apabila bekalan bahan kimia baharu sampai ke makmal:
1. Klik butang **+ Stok Masuk** di bahagian atas atau pada baris bahan kimia berkaitan.
2. Pilih nama bahan kimia.
3. Masukkan **Kuantiti Diterima**, **Nombor Lot Bekalan**, dan **Nota Rujukan** (contoh: No. Pesanan Rasmi PO atau Nota Hantaran DO).
4. Klik **Simpan Transaksi**. Baki stok semasa akan bertambah serta-merta dan direkodkan ke dalam lejar transaksi.

### C. Menambah Bahan Kimia Baharu (Khusus ADMIN):
1. Klik butang **+ Tambah Bahan Kimia**.
2. Masukkan Kod/Nombor CAS, Nama Bahan Kimia, Gred/Formula, Lokasi Rak, Unit Ukuran, Paras Ambang Minimum, dan Tarikh Luput.
3. Klik **Simpan Bahan Kimia**.

---

## 6. Modul Bahan Guna Habis (*Consumables*) & Sampel Standard

Modul ini khusus bagi aktiviti pengeluaran sampel piawai getah UKJK LGM:

### A. Mengemas Kini Penggunaan Consumable Pantas:
1. Klik menu **Consumables**.
2. Anda akan melihat senarai item (Tong Gas, Beg Aluminium, Kotak Coklat, Set Pelekat, Getah TSR, Kulit Sijil A4).
3. Klik butang **Kemas Kini Penggunaan** pada item yang digunakan, masukkan kuantiti yang telah digunakan, dan klik **Simpan**.

### B. Perekodan Pengeluaran Sampel Standard Getah:
1. Klik menu **Standard Samples**.
2. Klik butang **+ Rekod Kelompok Baharu (*Batch*)**.
3. Masukkan maklumat pengeluaran:
   - Kod Kelompok (*Batch Code*), Tarikh Penyediaan, Syarikat / Unit Pemohon, Kuantiti (pcs), dan No. Sijil Rujukan.
   - Senaraikan bahan kimia yang digunakan (sistem akan memotong baki bahan kimia secara automatik).
4. Klik **Simpan Kelompok**.

---

## 7. Fungsi Peringatan Pantas (*Quick Reminder*)

Apabila terdapat peralatan yang hampir atau telah tamat tempoh, anda boleh menjana notis peringatan dengan satu klik:
1. Klik ikon **Loceng / Peringatan** pada peralatan atau bahan kimia berkaitan.
2. Tetingkap akan memaparkan teks mesej yang siap digubal secara rasmi:
   - Format **WhatsApp**: Lengkap dengan ikon amaran, butiran peralatan, tarikh tamat tempoh, dan tindakan yang diminta.
   - Format **E-mel**: Lengkap dengan tajuk subjek formal dan kandungan surat rasmi makmal.
3. Klik butang **Salin Teks** atau **Buka WhatsApp Web / Buka Aplikasi E-mel** untuk terus menghantar mesej kepada pegawai atau vendor yang bertanggungjawab.

---

## 8. Modul Tetapan Sistem (Khusus ADMIN)

1. **Ambang Hari Amaran (*Warning Threshold Days*)**:
   - Nilai lalai ialah **30 hari**.
   - Jika anda ingin menerima amaran lebih awal (contohnya 60 hari untuk memberi masa kepada perolehan sebut harga vendor), ubah nilai ini dan klik **Simpan Tetapan**.
2. **Pengurusan Pengguna**:
   - Tambah profil staf baharu, tukar peranan antara ADMIN dan STAFF, atau nyahaktifkan staf yang telah bertukar unit.
3. **Pengurusan Data Demo**:
   - **Muat Semula Data Rasmi LGM**: Mengisi semula data peralatan rasmi UKJK, rekod bahan kimia, dan consumable berasaskan dokumen rasmi.
   - **Kosongkan Data**: Memadam semua rekod setempat jika ingin memulakan data makmal dari awal.

---

## 9. Penyelesaian Masalah Biasa (*Troubleshooting*)

- **Soalan: Saya telah menambah data peralatan, tetapi bila saya buka pelayar esoknya di komputer lain, data tiada?**  
  *Jawapan*: Pada versi prototaip ini, data disimpan di dalam pelayar peranti anda (*localStorage*). Data tidak disimpan di pelayan awan berpusat lagi. Oleh itu, data hanya kekal pada peranti dan pelayar yang sama.
- **Soalan: Data saya hilang selepas menutup tetingkap incognito (*Private Browsing*)?**  
  *Jawapan*: Pelayar secara automatik memadamkan memori simpanan setempat apabila tetingkap Incognito ditutup. Elakkan menggunakan mod Incognito untuk kerja harian.
- **Soalan: Adakah saya boleh memuat semula data asal jika saya tersalah padam?**  
  *Jawapan*: Ya, log masuk sebagai Admin, pergi ke menu **Tetapan**, dan klik **Muat Semula Data Rasmi LGM**.
