# Dokumen Keperluan Produk: UKJK LabTrack

**Sistem Pengurusan Peralatan & Stok Bahan Kimia Makmal**  
*Unit Kawalan Jaminan Kualiti (UKJK), Lembaga Getah Malaysia (LGM)*

---

## 1. Pengenalan dan Tujuan

Unit Kawalan Jaminan Kualiti (UKJK) bertanggungjawab memastikan semua peralatan ujian getah berada dalam keadaan jitu, mematuhi standard kalibrasi/verifikasi berkala, serta menguruskan inventori bahan kimia dan bahan guna habis (*consumables*) untuk penyediaan sampel standard rasmi Lembaga Getah Malaysia (LGM).

**Tujuan Pembangunan Produk:**
1. Menghapuskan kebergantungan kepada pemantauan tarikh manual yang berisiko menyebabkan peralatan terlepas jadual kalibrasi (menjejaskan pematuhan ISO/IEC 17025).
2. Memusatkan rekod penyelenggaraan peralatan dan sijil kalibrasi ke dalam satu sistem digital yang pantas dan mudah diakses.
3. Memberikan amaran awal (*early warning*) apabila stok bahan kimia dan bahan guna habis berada pada tahap kritikal.
4. Memudahkan penjanaan mesej peringatan kepada pegawai atau vendor yang berkaitan.

---

## 2. Dokumen Sumber Rasmi

Sistem ini dibina berasaskan 5 dokumen rasmi yang disertakan di dalam repositori (`public/assets/aistudio/`):
1. **UKJK_LabTrack_-_Product_Requirements_Document__PRD_.md_-_Google_Docs_826b19bc.pdf**: Dokumen keperluan asas produk asal.
2. **jadual_kalibrasi_a9fd0e4d.pdf**: Jadual kalibrasi peralatan makmal UKJK oleh vendor luar (seperti Obsnap Instruments dan SIRIM).
3. **jadual_verifikasi_00360e10.pdf**: Jadual verifikasi bulanan dan suku tahunan oleh *SMR Instrument Services* (SIS) LGM.
4. **bahan_kimia_dan_stok_penggunaan_consumable_a5307053.pdf**: Senarai inventori bahan kimia, lokasi rak simpanan, unit ukuran, dan rekod penggunaan bahan guna habis tahun 2026.
5. **standard_sample_7c720e54.pdf**: Jadual pengeluaran, pensijilan, dan pengedaran sampel standard getah LGM bagi suku tahun Q1–Q4.

---

## 3. Skop Produk (Minimum Viable Product - MVP)

### Termasuk Dalam Skop Semasa:
- Paparan papan pemuka masa nyata dengan kad KPI dan penunjuk lampu isyarat (Hijau, Kuning, Merah).
- Pengurusan data induk peralatan makmal (kod aset unik, nama, jenama/model, lokasi makmal, tahun perolehan).
- Penjejakan tarikh kalibrasi vendor dan tarikh verifikasi dalaman SIS secara serentak.
- Perekodan log servis berserta sokongan muat naik dokumen sijil (penyimpanan asas base64).
- Pengurusan inventori bahan kimia dengan had ambang minimum dan tarikh luput.
- Lejar transaksi stok masuk (*Stock-In*) dan potongan stok keluar automatik.
- Modul pengurusan bahan guna habis (*consumables*) dan rekod pengeluaran sampel standard getah.
- Penjana templat mesej peringatan automatik (WhatsApp dan E-mel).
- Kawalan peranan pengguna (ADMIN dan STAFF) serta pelarasan tetapan ambang hari amaran.

### Di Luar Skop Semasa (Dikhaskan untuk Fasa Seterusnya):
- Pangkalan data awan berpusat (Cloud Database).
- Integrasi penghantaran e-mel atau SMS secara automatik tanpa penglibatan pengguna.
- Sambungan log masuk ke pelayan Active Directory / e-mel rasmi kerajaan.
- Mod luar talian PWA (*Progressive Web App*) dengan penyegerakan automatik.

---

## 4. Keperluan Fungsian & Peraturan Perniagaan (*Business Rules*)

### FR-001: Simulasi Akses & Peranan Pengguna
- **Peraturan**: Sistem mesti membezakan fungsi antara peranan `ADMIN` dan `STAFF`.
- `ADMIN` dibenarkan menambah/mengedit/memadam peralatan, bahan kimia, pengguna, dan mengubah tetapan sistem.
- `STAFF` hanya dibenarkan merekod log aktiviti, merekod stok masuk, merekod penggunaan consumable, dan menjana teks peringatan.

### FR-002: Logik Penilaian Status Lampu Isyarat (*Traffic Light Logic*)
Setiap instrumen dan bahan kimia dinilai statusnya secara dinamik berdasarkan formula:

$$\text{Baki Hari} = \text{Tarikh Luput Seterusnya} - \text{Tarikh Hari Ini}$$

- **Status MERAH (Tindakan Segera / Bahaya)**:
  - Peralatan: $\text{Baki Hari} < 0$ (telah terlewat/overdue) ATAU status operasi ialah `BROKEN` (rosak).
  - Bahan Kimia: Stok semasa $= 0$ ATAU tarikh luput bahan telah berlalu ($\text{Baki Hari} < 0$).
- **Status KUNING (Amaran / Perhatian)**:
  - Peralatan: $0 \le \text{Baki Hari} \le \text{Ambang Amaran}$ (nilai lalai: 30 hari).
  - Bahan Kimia: Stok semasa $\le \text{Ambang Minimum}$ ATAU $0 \le \text{Baki Hari Luput} \le \text{Ambang Amaran}$.
- **Status HIJAU (Normal / Selamat)**:
  - Peralatan: $\text{Baki Hari} > \text{Ambang Amaran}$ dan instrumen beroperasi aktif.
  - Bahan Kimia: Stok melebihi ambang minimum dan tarikh luput melebihi ambang amaran.

### FR-003: Pengiraan Automatik Tarikh Luput Seterusnya
- Apabila log baharu (kalibrasi atau verifikasi) disimpan dengan tarikh pelaksanaan $T$ dan kekerapan $M$ bulan:
$$\text{Tarikh Seterusnya} = T + M \text{ bulan}$$
- Tarikh ini dikemas kini secara automatik pada rekod induk peralatan tanpa perlu dikira secara manual oleh staf.

### FR-004: Penolakan Stok Bahan Kimia Automatik
- Apabila kelompok sampel standard getah didaftarkan dengan menyenaraikan bahan kimia yang digunakan, sistem akan:
  1. Menolak kuantiti yang digunakan daripada baki semasa bahan kimia berkaitan.
  2. Mencatat rekod transaksi lejar jenis `STOCK_OUT` dengan nota rujukan kod kelompok sampel standard.
  3. Mengemaskini status lampu isyarat bahan kimia serta-merta jika baki menyusut ke paras kuning atau merah.

---

## 5. Ringkasan Aliran Pengguna (*User Flows*)

```
[Mula] 
  │
  ├──> Log Masuk / Pilih Profil (Admin / Staff)
  │
  ├──> Papan Pemuka (Dashboard)
  │      ├── Lihat Status Lampu Isyarat (Hijau, Kuning, Merah)
  │      └── Klik Amaran Tindakan Segera ──> Tetingkap Peringatan (WhatsApp / Emel)
  │
  ├──> Modul Peralatan
  │      ├── Tambah / Kemas Kini Peralatan (Admin)
  │      └── Lihat Butiran & Tambah Log Kalibrasi/Verifikasi (Staff/Admin)
  │            └── Status dikemas kini secara automatik
  │
  ├──> Modul Bahan Kimia
  │      ├── Semak Stok & Tarikh Luput
  │      └── Rekod Stok Masuk (Stock-In)
  │
  ├──> Modul Consumables & Sampel Standard
  │      ├── Kemas kini penggunaan gas / beg alu / kotak
  │      └── Rekod kelompok sampel piawai (Stok kimia dipotong automatik)
  │
  └──> Modul Tetapan (Admin)
         ├── Laraskan Ambang Hari Amaran (Default: 30 Hari)
         └── Urus Senarai Pengguna / Muat Semula Data Demo
```

---

## 6. Kriteria Penerimaan (*Acceptance Criteria*)

1. **Ketepatan Pengiraan**:  
   Sistem mestilah memaparkan status KUNING tepat apabila baki hari mencapai atau berada di bawah nilai ambang yang ditetapkan dalam tetapan.
2. **Integriti Rekod Transaksi**:  
   Setiap pertambahan stok (*Stock-In*) atau pengurangan stok (*Stock-Out*) mestilah mempunyai rekod lejar bertarikh bersama nama pengguna yang merekodkannya.
3. **Penyimpanan Luar Talian / Setempat**:  
   Perubahan data tidak hilang apabila pengguna me-refresh pelayar web (*persisted in localStorage*).
4. **Kecekapan Antaramuka**:  
   Pengguna boleh mencari peralatan menggunakan kod aset atau lokasi dalam masa kurang 2 saat pada peranti biasa.
