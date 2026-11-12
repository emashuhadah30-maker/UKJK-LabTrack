# Rekod Perubahan (Changelog): UKJK LabTrack

Semua perubahan dan perkembangan sistem UKJK LabTrack direkodkan dalam dokumen ini. Format dokumen ini berasaskan prinsip [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [1.0.0] - 2026-11-12

### Ditambah (*Added*)
- **Papan Pemuka (*Dashboard*)**:
  - Kad metrik KPI masa nyata untuk jumlah peralatan aktif, amaran tarikh luput, dan baki stok kimia.
  - Sistem penunjuk lampu isyarat (🟢 Hijau = Selamat, 🟡 Kuning = Amaran Awal, 🔴 Merah = Terlewat/Habis/Tindakan Segera).
  - Senarai tindakan segera dengan pautan pantas ke modul terperinci.
- **Modul Pengurusan Peralatan**:
  - Pengurusan maklumat peralatan makmal (Kod Aset, Nama, Jenama/Model, Lokasi Makmal, Tahun Perolehan).
  - Penjejakan dua jadual penyelenggaraan serentak: Kalibrasi Vendor (kekerapan tahunan) dan Verifikasi Dalaman SIS LGM (kekerapan bulanan/suku tahun).
  - Pengiraan automatik tarikh luput penyelenggaraan seterusnya berdasarkan tarikh pelaksanaan dan kekerapan bulan.
  - Perekodan log servis berserta sokongan muat naik dokumen sijil format base64.
- **Modul Inventori Bahan Kimia**:
  - Penjejakan stok bahan kimia dengan unit ukuran piawai (ml, L, g, mg, botol) dan had ambang minimum.
  - Fungsi mendaftar stok masuk (*Stock-In*) berserta nombor lot dan nota rujukan pesanan.
  - Lejar sejarah transaksi lengkap bagi setiap bahan kimia.
- **Modul Consumables & Sampel Standard**:
  - Penjejakan stok dan rekod penggunaan bahan guna habis pengeluaran tahun 2026 (Tong gas, Beg alu, Kotak coklat, Pelekat label, Getah TSR, Kulit sijil A4).
  - Perekodan kelompok (*batch*) sampel standard getah LGM berserta potongan stok bahan kimia secara automatik.
- **Templat Peringatan Pantas (*Quick Reminders*)**:
  - Penjana teks automatik sedia guna untuk WhatsApp dan e-mel rasmi dengan pautan buka aplikasi serta-merta.
- **Pengurusan Pengguna & Tetapan**:
  - Simulasi peranan pengguna antara ADMIN dan STAFF dengan sekatan menu sensitif.
  - Pelarasan ambang hari amaran (*Warning Threshold Days* - lalai 30 hari).
  - Fungsi memuat semula data rasmi LGM atau mengosongkan data setempat.
- **Dokumentasi Lengkap Repositori**:
  - `README.md` utama yang mesra orang awam.
  - `docs/PANDUAN-PENGGUNA.md` untuk panduan operasi makmal.
  - `docs/KEPERLUAN-PRODUK.md` menyenaraikan spesifikasi PRD dan peraturan perniagaan.
  - `docs/STATUS-DAN-ROADMAP.md` membezakan status siap, diuji, dan pelan masa depan.
  - `docs/DATA-DAN-PRIVASI.md` menerangkan pengendalian data setempat pelayar.
  - `docs/SETUP-DAN-PENYELENGGARAAN.md` panduan teknikal pemasangan dan pautan GitHub.
