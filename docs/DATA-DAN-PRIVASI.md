# Dasar Data & Privasi: UKJK LabTrack

Dokumen ini menerangkan bagaimana maklumat dan data makmal dikendalikan, disimpan, dan dilindungi di dalam aplikasi **UKJK LabTrack**.

---

## 1. Jenis Data yang Dikumpulkan & Diproses

Aplikasi ini hanya memproses data yang berkaitan dengan operasi inventori dan peralatan makmal:

1. **Maklumat Peralatan Makmal**:  
   Kod aset, nama peralatan, jenama dan model, nombor siri (pilihan), lokasi bilik makmal, tahun perolehan, kekerapan kalibrasi dan verifikasi, serta status operasi.
2. **Rekod Penyelenggaraan & Sijil**:  
   Tarikh pelaksanaan ujian, nama vendor kalibrasi atau keputusan verifikasi (*PASS/FAIL*), nombor sijil, fail sijil (jika dimuat naik), dan catatan teknikal.
3. **Inventori Bahan Kimia & Consumables**:  
   Kod/nombor CAS, nama kimia, gred/formula, baki kuantiti semasa, unit ukuran, paras ambang amaran, rekod stok masuk (*Stock-In*), dan rekod kelompok sampel standard getah.
4. **Maklumat Pengguna Semasa**:  
   Nama staf, alamat e-mel organisasi, dan peranan pengguna (*ADMIN* atau *STAFF*) bagi tujuan mencatatkan identiti individu yang mendaftar transaksi atau log servis.

---

## 2. Di Mana Data Disimpan?

- **Penyimpanan Setempat Pelayar (*Browser LocalStorage*)**:  
  Semua data aplikasi disimpan secara terus di dalam memori pelayar peranti anda menggunakan teknologi Web Storage API dengan kunci awalan `ukjk_` (contoh: `ukjk_equipments`, `ukjk_chemicals`, `ukjk_consumables`).
- **Ketiadaan Pelayan Berpusat (*No Backend Database*)**:  
  Pada fasa prototaip ini, data **tidak dihantar atau disimpan di mana-mana pelayan awan luaran (*cloud server*)**. Data kekal berada di dalam peranti komputer atau komputer riba yang digunakan oleh pengguna.

---

## 3. Komunikasi Luar & Kecerdasan Buatan (AI)

- **Tiada Penghantaran Data ke Model AI**:  
  Walaupun pakej perpustakaan Gemini disertakan dalam persekitaran pembangunan perisian, sistem UKJK LabTrack ini **tidak menghantar sebarang data inventori, butiran peralatan, atau maklumat staf kepada mana-mana perkhidmatan kecerdasan buatan (AI)**.
- **Tiada Penjejakan Telemetri (*No Telemetry / Analytics*)**:  
  Aplikasi ini tidak memasang kuki pihak ketiga (*third-party cookies*), analitis Google Analytics, atau perkhidmatan penjejakan iklan.
- **Pautan Aplikasi Mesej**:  
  Fungsi peringatan pantas hanya membuka pautan protokol luaran piawai (`mailto:` untuk e-mel atau pautan web WhatsApp) atas arahan terus pengguna; tiada data dihantar secara latar belakang.

---

## 4. Kawalan Akses & Keselamatan Data

- **Kawalan Antaramuka Sahaja**:  
  Aplikasi menyediakan perbezaan peranan antara `ADMIN` dan `STAFF` pada tahap antaramuka pengguna (*UI-level access control*).
- **Akses Fizikal Peranti**:  
  Memandangkan data tersimpan di dalam pelayar pengguna, sesiapa yang mempunyai akses kepada profil pengguna komputer tersebut boleh melihat data yang tersimpan. Oleh itu, pengguna dinasihatkan untuk mengunci skrin komputer (*lock screen*) apabila meninggalkan meja kerja makmal.

---

## 5. Cara Memadam atau Menetapkan Semula Data

Pengguna mempunyai kawalan penuh ke atas data setempat:

1. **Melalui Antaramuka Aplikasi**:  
   Log masuk sebagai **ADMIN**, pergi ke menu **Tetapan**, dan klik butang **Kosongkan Data Setempat**. Tindakan ini akan memadam semua rekod peralatan, kimia, dan pengguna yang tersimpan di dalam pelayar.
2. **Melalui Tetapan Pelayar Web**:  
   Pengguna boleh memadam data aplikasi pada bila-bila masa dengan mengosongkan *Cookies and Site Data* bagi domain aplikasi pada pelayar web.

---

## 6. Status Pematuhan Undang-Undang & Keselamatan

- **Belum Disahkan**:  
  Aplikasi ini belum menjalani audit keselamatan siber rasmi pihak ketiga atau penilaian pematuhan Akta Perlindungan Data Peribadi (PDPA) / garis panduan keselamatan data sektor awam Malaysia.
- Status ini akan dinilai semula apabila sistem sedia untuk dihubungkan ke pangkalan data awan agensi dan dihoskan di infrastruktur rasmi Lembaga Getah Malaysia.
