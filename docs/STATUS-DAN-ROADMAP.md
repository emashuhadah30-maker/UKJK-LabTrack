# Status Projek & Pelan Masa Depan (Roadmap): UKJK LabTrack

Dokumen ini merekodkan status sebenar sistem **UKJK LabTrack** pada masa ini, membezakan fungsi yang telah dibina, diuji, belum disahkan, serta perancangan fasa berikutnya tanpa sebarang andaian atau tarikh palsu.

---

## 1. Status Komponen & Ciri Semasa

### A. Sudah Dibina (*Built & Functional*)
Ciri-ciri berikut telah siap dikodkan dan boleh digunakan di dalam aplikasi web:

- ✅ **Papan Pemuka Pantas (*Dashboard*)**: Kad ringkasan metrik makmal, pengiraan jumlah amaran, dan penunjuk lampu isyarat (Hijau, Kuning, Merah).
- ✅ **Modul Peralatan Makmal**: Pendaftaran kod aset, jenama/model, lokasi makmal, tahun perolehan, penjejakan dua jadual serentak (Kalibrasi Vendor & Verifikasi Dalaman SIS).
- ✅ **Log Servis & Muat Naik Sijil**: Perekodan log servis kalibrasi/verifikasi berserta sokongan simpanan fail sijil (format base64 disimpan di memori pelayar).
- ✅ **Pengiraan Automatik Tarikh Luput**: Pengiraan tarikh kalibrasi/verifikasi seterusnya berdasarkan kekerapan bulan yang ditetapkan.
- ✅ **Inventori Bahan Kimia**: Penjejakan baki stok, paras ambang minimum, tarikh luput, dan status lampu isyarat.
- ✅ **Lejar Transaksi Bahan Kimia**: Perekodan stok masuk (*Stock-In*) dan potongan stok automatik apabila digunakan dalam sampel.
- ✅ **Modul Consumables Makmal**: Penjejakan stok bahan guna habis (Tong gas, Beg alu, Kotak coklat, Pelekat label, Getah TSR, Kulit sijil A4) dan log penggunaan 2026.
- ✅ **Modul Kelompok Sampel Standard (*Standard Sample Batch*)**: Perekodan kelompok pengeluaran sampel getah LGM, maklumat pemohon, no. sijil, dan rujukan PO.
- ✅ **Templat Peringatan Pantas (*Quick Reminders*)**: Penjanaan teks mesej WhatsApp dan e-mel rasmi dengan pautan buka aplikasi mesej.
- ✅ **Kawalan Peranan Pengguna (*User Roles*)**: Simulasi peranan ADMIN dan STAFF berserta penapisan menu sensitif (tetapan sistem hanya boleh diakses Admin).
- ✅ **Tetapan Sistem**: Pelarasan fleksibel bagi ambang hari amaran (*Warning Threshold Days* - lalai: 30 hari).
- ✅ **Data Contoh Rasmi LGM**: Pra-muat data sebenar peralatan, bahan kimia, dan consumable daripada jadual rasmi UKJK.

---

### B. Telah Diuji (*Tested*)
Status ujian yang telah disahkan secara teknikal:

- ✅ **Kompilasi TypeScript (`tsc --noEmit`)**: Lulus sepenuhnya tanpa ralat jenis (*zero TypeScript errors*).
- ✅ **Binaan Pengeluaran Vite (`npm run build`)**: Lulus sepenuhnya dan menghasilkan berkas sedia guna di direktori `dist/`.
- ✅ **Ujian Logik Lampu Isyarat**: Disahkan berfungsi menukar warna daripada Hijau ke Kuning dan Merah berdasarkan perbezaan tarikh luput dengan tarikh sistem.
- ✅ **Ujian Pengekalan Data Pelayar (*localStorage persistence*)**: Disahkan bahawa data kekal disimpan apabila laman web dimuat semula (*page refresh*) dalam sesi pelayar yang sama.

---

### C. Belum Disahkan (*Unverified*)
Perkara yang belum diuji secara formal di persekitaran operasi sebenar:

- ⚠️ **Ujian Penerimaan Pengguna Lapangan (*User Acceptance Testing - UAT*)**: Sistem belum diuji oleh staf makmal UKJK dalam operasi harian sebenar di makmal fizikal.
- ⚠️ **Kapasiti Fail Sijil Besar**: Memandangkan fail sijil disimpan sebagai base64 dalam *localStorage*, penyimpanan fail PDF bersaiz besar (melebihi 5MB) berisiko mencapai had kuota memori pelayar (biasanya 5MB–10MB bagi setiap domain).
- ⚠️ **Keserasian Pelayar Pelbagai Platform**: Baru diuji pada persekitaran pelayar berasaskan Chromium; belum disahkan secara mendalam pada pelayar Safari mudah alih atau versi pelayar lama.

---

### D. Kekangan & Isu Diketahui Semasa (*Known Limitations*)

1. **Penyimpanan Setempat Sahaja (*Local Storage Only*)**:  
   Data tersimpan secara eksklusif di dalam memori pelayar peranti yang sedang digunakan. Jika pengguna membuka aplikasi di komputer lain atau membersihkan cache pelayar, data terkini tidak akan disegerakkan secara automatik.
2. **Ketiadaan Pengesahan Kata Laluan Sebenar (*No Password Auth*)**:  
   Sistem log masuk semasa adalah berasaskan simulasi profil untuk memudahkan demonstrasi aliran kerja. Ia tidak mempunyai kata laluan atau sambungan ke direktori staf LGM.
3. **Peringatan Manual**:  
   Fungsi peringatan menjana teks untuk WhatsApp dan e-mel, tetapi pengguna masih perlu menekan butang hantar sendiri melalui peranti masing-masing (tiada perkhidmatan bot penghantaran automatik).

---

## 2. Pelan Pembangunan Masa Depan (*Roadmap*)

*Nota: Keutamaan berikut disusun mengikut fasa keperluan teknikal tanpa menjanjikan sebarang tarikh siap tertentu.*

### Fasa 1: Pengukuhan Data & Pangkalan Data Awan (Dirancang)
- [ ] Menyambungkan sistem ke pangkalan data awan berpusat (seperti Google Cloud SQL / Firebase) supaya rekod makmal boleh dikongsi serentak antara semua staf di makmal berbeza.
- [ ] Memindahkan simpanan fail sijil ke storan objek selamat (*Cloud Storage*) bagi mengelakkan had saiz fail pelayar.

### Fasa 2: Pengesahan & Keselamatan Pengguna (Dirancang)
- [ ] Melaksanakan sistem log masuk rasmi menggunakan e-mel rasmi LGM / kata laluan disulitkan.
- [ ] Menambah log audit (*audit trail*) yang tidak boleh dipadam bagi setiap perubahan status peralatan untuk tujuan akreditasi ISO 17025.

### Fasa 3: Laporan Rasmi & Automasi (Dirancang)
- [ ] Menjana dan memuat turun Laporan Status Bulanan Makmal dalam format PDF dan lembaran Excel secara automatik.
- [ ] Integrasi penghantaran notifikasi e-mel automatik (contohnya penghantaran notis amaran kepada pegawai 30 hari sebelum tarikh luput kalibrasi).
- [ ] Pengimbasan Kod QR / Kod Bar aset fizikal menggunakan kamera telefon bimbit untuk semakan pantas status instrumen di atas meja makmal.
