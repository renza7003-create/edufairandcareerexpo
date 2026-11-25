# DOKUMENTASI LENGKAP PROYEK WEB UNDANGAN DIGITAL & PANEL WHATSAPP BLAST
**Edu Fair & Career Expo 2026 — SMKN 6 Kota Tangerang Selatan**

---

## 1. Penjelasan `admin.html` (Panel Admin & WhatsApp Blast)

File `admin.html` digunakan oleh panitia untuk mengunggah file data tamu (Excel/CSV), menampilkan daftar tamu ke dalam tabel, dan mengirimkan pesan blast ke WhatsApp.

### A. Bagian Head & Import Library
```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel Admin & WhatsApp Blast — Edu Fair 2026</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"></script>
</head>
```
* **`meta viewport`**: Memastikan tampilan web otomatis pas dan responsif ketika dibuka di layar HP maupun laptop.
* **`FontAwesome`**: Menyediakan ikon seperti ikon Excel, WhatsApp, dan folder.
* **`css/style.css`**: Menghubungkan file desain/styling milik kita sendiri.
* **`xlsx.full.min.js` (SheetJS)**: Library JavaScript gratis yang berfungsi membaca dan memproses isi file Excel (`.xlsx`/`.xls`) atau CSV secara langsung di browser tanpa butuh server backend.

---

### B. Header Banner
```html
<header>
    <h1>PANEL ADMIN & WHATSAPP BLAST</h1>
    <p>Edu Fair & Career Expo 2026 — SMKN 6 Kota Tangerang Selatan</p>
</header>
```
* Bagian judul paling atas halaman admin dengan latar belakang gradient biru cerah.

---

### C. Area Unggah File (Upload Dropzone)
```html
<div class="card">
    <h2 class="card-title"><i class="fas fa-file-excel" style="color: #10b981;"></i> Unggah Data Tamu</h2>
    <p style="color: #64748b; font-size: 0.85rem; margin-bottom: 14px;">Unggah file Excel (.xlsx / .xls) atau CSV (.csv) berisi daftar data tamu.</p>
    
    <div class="dropzone" id="fileDropzone">
        <i class="fas fa-cloud-upload-alt" style="font-size: 36px; color: #0284c7; margin-bottom: 8px;"></i>
        <div style="font-weight: bold; font-size: 0.9rem; margin-bottom: 2px;">Klik atau seret file ke sini</div>
        <div style="font-size: 0.78rem; color: #64748b; margin-bottom: 12px;">Format kolom: nama_tamu, instansi, kategori, nomor_wa</div>
        <input type="file" id="fileInput" accept=".xlsx, .xls, .csv" style="display:none;">
        <button class="btn btn-primary" type="button" onclick="document.getElementById('fileInput').click()">Pilih File Data Tamu</button>
    </div>

    <div style="margin-top: 12px; text-align: right;">
        <a href="assets/template_tamu.csv" class="btn btn-outline" download style="font-size: 0.8rem; padding: 6px 12px; width: auto; display: inline-flex;">
            <i class="fas fa-download"></i> Unduh Template CSV
        </a>
    </div>
</div>
```
* **`div.dropzone`**: Kotak area putus-putus (*dashed*) untuk memilih atau melempar file Excel/CSV data tamu.
* **`input type="file"`**: Elemen input tempat memilih file dari laptop. Disembunyikan (`style="display:none;"`) agar digantikan oleh tombol visual yang lebih rapi.
* **`a download`**: Tombol untuk mengunduh contoh file template CSV bagi panitia jika belum memiliki format kolom yang pas (`nama_tamu`, `instansi`, `kategori`, `nomor_wa`).

---

### D. Tabel Data Tamu & Pencarian
```html
<div class="card" id="tableSection" style="display:none;">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 12px;">
        <h2 class="card-title" style="margin:0;"><i class="fas fa-users"></i> Daftar Tamu (<span id="totalCount">0</span>)</h2>
        <input type="text" id="searchInput" class="form-control" placeholder="Cari nama, instansi..." style="width: 200px;">
    </div>
    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>No</th>
                    <th>Nama Tamu</th>
                    <th>Instansi</th>
                    <th>Kategori</th>
                    <th>No. WhatsApp</th>
                    <th>Aksi Blast</th>
                </tr>
            </thead>
            <tbody id="tableBody"></tbody>
        </table>
    </div>
</div>
```
* **`id="tableSection"`**: Kartu ini awalnya tersembunyi (`display:none;`) dan baru akan muncul secara otomatis menggunakan JavaScript setelah panitia berhasil mengunggah file tamu.
* **`id="searchInput"`**: Kolom pencarian cepat untuk memfilter nama/instansi tamu.
* **`<tbody id="tableBody"></tbody>`**: Kontainer kosong yang nanti diisi baris-baris data tamu dan tombol **Kirim WA** oleh JavaScript.

---

## 2. Penjelasan `index.html` (Halaman Undangan Digital & RSVP)

File `index.html` adalah halaman utama undangan digital personal yang dibuka oleh tamu undangan melalui link WhatsApp.

### A. Bagian Head & Supabase SDK
```html
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Undangan Digital — Edu Fair & Career Expo 2026</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="css/style.css">
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
```
* **`@supabase/supabase-js`**: Library resmi Supabase untuk menghubungkan formulir RSVP langsung ke database cloud PostgreSQL.

---

### B. Header Banner Card (Tampilan Acuan)
```html
<div class="card header-card">
    <span class="pill-badge">SMKN 6 KOTA TANGERANG SELATAN</span>
    <h1>Edu Fair & Career Expo 2026</h1>
    <p>"Connecting Competence to Future: Bekerja, Melanjutkan, Berwirausaha"</p>
</div>
```
* **`span.pill-badge`**: Capsule/badge putih semi-transparan bertuliskan nama sekolah di bagian paling atas banner.
* **`h1` & `p`**: Judul utama acara dan tagline/tema acara dalam bentuk kartu gradient biru.

---

### C. Kartu Sapaan Personal Tamu
```html
<div class="card">
    <span class="guest-label">KEPADA YTH. BAPAK/IBU / REKAN:</span>
    <span class="guest-name" id="guestName">Bapak/Ibu Pimpinan Instansi / Mitra</span>
    <span class="guest-instansi" id="guestInstansi">SMKN 6 Kota Tangerang Selatan</span>
    
    <hr class="divider">
    <p class="welcome-text">
        Assalamu'alaikum Wr. Wb. Dengan hormat, kami mengundang Bapak/Ibu pimpinan instansi/mitra untuk hadir dan berpartisipasi dalam ajang pameran tahunan SMKN 6 Kota Tangerang Selatan. Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu berkenan hadir memenuhi undangan ini.
    </p>
</div>
```
* **`id="guestName"` & `id="guestInstansi"`**: Tempat JavaScript secara otomatis menyisipkan nama tamu dan instansi yang dibaca dari parameter URL (`?nama=...&instansi=...`).

---

### D. Kartu Countdown Timer (Penghitung Mundur)
```html
<div class="card" style="text-align: center;">
    <div class="countdown-title">Menuju Hari Acara</div>
    <div class="countdown">
        <div class="c-box"><div class="c-num" id="days">00</div><div class="c-lbl">HARI</div></div>
        <div class="c-box"><div class="c-num" id="hours">00</div><div class="c-lbl">JAM</div></div>
        <div class="c-box"><div class="c-num" id="minutes">00</div><div class="c-lbl">MENIT</div></div>
        <div class="c-box"><div class="c-num" id="seconds">00</div><div class="c-lbl">DETIK</div></div>
    </div>
</div>
```
* 4 box cyan berisi angka hari, jam, menit, dan detik menuju **25 November 2026 pukul 07.00 WIB** yang dihitung secara *real-time* setiap detik.

---

### E. Grid Informasi Detail & Google Maps
```html
<div class="details-grid">
    <div class="detail-card">
        <i class="fas fa-calendar-alt"></i>
        <h4>Hari & Tanggal</h4>
        <p>Rabu, 25 Nov 2026</p>
    </div>
    <div class="detail-card">
        <i class="fas fa-clock"></i>
        <h4>Waktu</h4>
        <p>07.00 – 14.00 WIB</p>
    </div>
    <div class="detail-card">
        <i class="fas fa-map-marker-alt"></i>
        <h4>Lokasi</h4>
        <p>SMKN 6 Kota Tangsel</p>
    </div>
</div>

<div class="card">
    <h2 class="section-title"><i class="fas fa-map-marked-alt"></i> Peta Lokasi Acara</h2>
    <div class="map-container">
        <iframe src="https://maps.google.com/maps?q=SMKN+6+Kota+Tangerang+Selatan&t=&z=15&ie=UTF8&iwloc=&output=embed" loading="lazy"></iframe>
    </div>
    <a href="https://maps.google.com/?q=SMKN+6+Kota+Tangerang+Selatan" target="_blank" class="btn btn-primary">
        <i class="fas fa-directions"></i> Buka Petunjuk Arah (Google Maps)
    </a>
</div>
```
* **`details-grid`**: Menampilkan 3 kartu ringkas info acara (Tanggal, Jam, Tempat).
* **`iframe` & `a.btn`**: Menampilkan pratinjau peta lokasi SMKN 6 Tangsel dan tombol langsung ke aplikasi Google Maps di HP/Laptop.

---

### F. Formulir Konfirmasi Kehadiran (RSVP)
```html
<div class="card" id="rsvpSection">
    <h2 class="section-title"><i class="fas fa-clipboard-check"></i> Konfirmasi Kehadiran (RSVP)</h2>
    <form id="rsvpForm">
        <div class="form-group">
            <label class="form-label">Nama Lengkap & Gelar *</label>
            <input type="text" id="inputNama" class="form-control" required placeholder="Nama lengkap...">
        </div>
        <!-- Field Instansi, Kategori, WA, Status Kehadiran, Jumlah, Pesan -->
        <button type="submit" class="btn btn-amber" id="submitBtn" style="margin-top: 6px;">
            <i class="fas fa-paper-plane"></i> Konfirmasi Kehadiran
        </button>
    </form>
</div>
```
* Formulir konfirmasi kehadiran di mana data yang diisi oleh tamu akan langsung disimpan ke database Supabase dan diteruskan ke WhatsApp Panitia.

---

## 3. Penjelasan `css/style.css` (Tampilan & Desain UI)

File `css/style.css` berisi seluruh aturan warna, ukuran, jarak, dan tata letak agar halaman web terlihat rapi, modern, dan pas di layar HP maupun Desktop.

```css
/* Aturan dasar seluruh elemen */
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #f8fafc; color: #1e293b; font-family: Arial, sans-serif; line-height: 1.5; padding-bottom: 20px; }

/* Wadah utama halaman agar berada di tengah layar dengan lebar maksimal 650px */
.container { width: 100%; max-width: 650px; margin: 16px auto; padding: 0 12px; }

/* Kartu umum dengan latar putih, garis tipis, dan bayangan lembut */
.card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 12px; box-shadow: 0 3px 8px rgba(0,0,0,0.04); }

/* Kartu Header Biru Gradient */
.header-card { background: linear-gradient(135deg, #0284c7, #0ea5e9); color: #fff; text-align: center; border: none; padding: 20px 14px; box-shadow: 0 4px 14px rgba(2,132,199,0.25); }

/* Badge Kapsul Transparan di Atas Header */
.pill-badge { display: inline-block; background: rgba(255,255,255,0.22); color: #fff; font-size: 0.68rem; font-weight: bold; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; margin-bottom: 6px; }

/* Kotak Angka Countdown Timer */
.countdown { display: flex; justify-content: center; gap: 6px; }
.c-box { background: #0284c7; color: #fff; padding: 6px 8px; border-radius: 6px; text-align: center; min-width: 48px; box-shadow: 0 2px 4px rgba(2,132,199,0.2); }
.c-num { font-size: 1.1rem; font-weight: bold; line-height: 1; }
.c-lbl { font-size: 0.55rem; text-transform: uppercase; margin-top: 2px; font-weight: bold; opacity: 0.9; }

/* Grid 3 Kolom untuk Detail Acara (Tanggal, Waktu, Lokasi) */
.details-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px; }
.detail-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 6px; text-align: center; }

/* Desain Tombol Sejajar & Lurus */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; width: 100%; padding: 9px 12px; font-size: 0.85rem; font-weight: bold; border: none; border-radius: 6px; cursor: pointer; text-decoration: none; color: #fff; }
.btn-primary { background: #0284c7; }
.btn-wa { background: #10b981; }
.btn-amber { background: #f59e0b; }

/* Penyesuaian otomatis untuk layar HP kecil (< 480px) */
@media (max-width: 480px) {
    .container { padding: 0 8px; }
    .details-grid { grid-template-columns: 1fr; gap: 6px; } /* Di HP, grid berubah jadi 1 kolom bertumpuk */
}
```

---

## 4. Penjelasan `js/script.js` (Logika & Interaktivitas)

File `js/script.js` berisi seluruh logika fungsional sistem.

### A. Konfigurasi Global
```javascript
const CONFIG = {
    SUPABASE_URL: "https://niclydymzisobxxyvnpd.supabase.co",
    SUPABASE_ANON_KEY: "sb_publishable_SeiNE3qEhs2YDtsBylXvwA_a9k9oqDV",
    PANITIA_WA: "62821144589280",
    PRODUCTION_BASE_URL: "https://renza7003-create.github.io/edufairandcareerexpo/index.html"
};
```
* **`SUPABASE_URL` & `SUPABASE_ANON_KEY`**: Alamat dan kunci koneksi ke proyek Supabase Anda.
* **`PANITIA_WA`**: Nomor WhatsApp panitia penerima konfirmasi RSVP.
* **`PRODUCTION_BASE_URL`**: URL publik GitHub Pages Anda.

---

### B. Inisialisasi Otomatis
```javascript
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('fileDropzone')) initAdmin();
    if (document.getElementById('rsvpForm')) initInvitation();
});
```
* Saat halaman selesai dimuat, JavaScript mengecek halaman mana yang sedang dibuka (jika ada `fileDropzone` berarti halaman Admin, jika ada `rsvpForm` berarti halaman Undangan).

---

### C. Pembacaan File Excel/CSV (Panel Admin)
```javascript
function initAdmin() {
    const input = document.getElementById('fileInput');
    document.getElementById('fileDropzone').onclick = () => input.click();
    input.onchange = (e) => {
        const reader = new FileReader();
        reader.onload = (evt) => {
            const wb = XLSX.read(new Uint8Array(evt.target.result), { type: 'array' });
            const json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: "" });
            guests = json.map((r, i) => {
                let wa = String(r.nomor_wa || r.wa || '').replace(/\D/g, '');
                if (wa.startsWith('08')) wa = '62' + wa.substring(1);
                else if (wa.startsWith('8')) wa = '62' + wa;
                return { id: i + 1, nama: String(r.nama_tamu || r.nama || '').trim(), instansi: String(r.instansi || '').trim(), kategori: String(r.kategori || 'Perusahaan').trim(), wa, sent: false };
            }).filter(g => g.nama);
            renderTable(guests);
            document.getElementById('tableSection').style.display = 'block';
            document.getElementById('totalCount').textContent = guests.length;
        };
        reader.readAsArrayBuffer(e.target.files[0]);
    };
}
```
* **`FileReader` & `XLSX.read`**: Membaca file Excel/CSV di browser dan mengubah baris spreadsheet menjadi objek JSON.
* **Normalisasi Nomor WA**: Mengubah nomor diawali `08...` atau `8...` secara otomatis menjadi format standar Indonesia `628...`.

---

### D. Generator Pesan WA Blast & Link Personal
```javascript
function sendWA(id) {
    const g = guests.find(x => x.id === id);
    if (!g) return;
    let url = CONFIG.PRODUCTION_BASE_URL || (window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/index.html'));
    const link = `${url}?nama=${encodeURIComponent(g.nama)}&instansi=${encodeURIComponent(g.instansi)}&kategori=${encodeURIComponent(g.kategori)}`;
    const msg = `Yth. *${g.nama}*\n*${g.instansi}*\n\nAssalamu'alaikum Wr. Wb. Kami mengundang Bapak/Ibu dalam ajang:\n\n🎓 *EDU FAIR & CAREER EXPO 2026*\n"Connecting Competence to Future: Bekerja, Melanjutkan, Berwirausaha"\n\n📅 *Hari, Tanggal:* Rabu, 25 November 2026\n⏰ *Waktu:* 07.00 – 14.00 WIB\n📍 *Lokasi:* SMKN 6 Kota Tangerang Selatan\n\nLink undangan personal:\n${link}\n\nTerima kasih.\n*Panitia Edu Fair 2026*`;
    
    g.sent = true;
    const btn = document.getElementById(`btn-${g.id}`);
    if (btn) { btn.innerHTML = `<i class="fab fa-whatsapp"></i> Terkirim ✓`; btn.closest('tr').classList.add('status-sent'); }
    window.open(`https://wa.me/${g.wa}?text=${encodeURIComponent(msg)}`, '_blank');
}
```
* Menyusun tautan personal (`?nama=...&instansi=...`) dan pesan formal otomatis, lalu membuka WhatsApp (`wa.me`) dengan teks pesan sudah terisi di kotak ketik.

---

### E. Membaca Parameter URL & Countdown Timer (Halaman Undangan)
```javascript
function initInvitation() {
    const p = new URLSearchParams(window.location.search);
    if (p.get('nama')) { document.getElementById('guestName').textContent = p.get('nama'); document.getElementById('inputNama').value = p.get('nama'); }
    if (p.get('instansi')) { document.getElementById('guestInstansi').textContent = p.get('instansi'); document.getElementById('inputInstansi').value = p.get('instansi'); }
    if (p.get('kategori')) document.getElementById('inputKategori').value = p.get('kategori');

    // Countdown Timer 25 November 2026 07.00 WIB
    const target = new Date('2026-11-25T07:00:00').getTime();
    setInterval(() => {
        const d = target - Date.now();
        if (d > 0) {
            document.getElementById('days').textContent = String(Math.floor(d / 86400000)).padStart(2, '0');
            document.getElementById('hours').textContent = String(Math.floor((d % 86400000) / 3600000)).padStart(2, '0');
            document.getElementById('minutes').textContent = String(Math.floor((d % 3600000) / 60000)).padStart(2, '0');
            document.getElementById('seconds').textContent = String(Math.floor((d % 60000) / 1000)).padStart(2, '0');
        }
    }, 1000);
```
* **`URLSearchParams`**: Membaca nama dan instansi dari link unik WhatsApp lalu menampilkannya di halaman web.
* **`setInterval`**: Menghitung selisih waktu dari sekarang menuju hari acara setiap 1 detik.

---

### F. Menyimpan RSVP ke Supabase & Meneruskan ke WA Panitia
```javascript
    document.getElementById('rsvpForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            nama_tamu: document.getElementById('inputNama').value.trim(),
            instansi: document.getElementById('inputInstansi').value.trim(),
            kategori: document.getElementById('inputKategori').value,
            nomor_wa: document.getElementById('inputWa').value.trim(),
            status_kehadiran: document.getElementById('inputStatus').value,
            jumlah_tamu: parseInt(document.getElementById('inputJumlah').value) || 1,
            pesan_ucapan: document.getElementById('inputPesan').value.trim()
        };

        let saved = false;
        if (CONFIG.SUPABASE_URL && !CONFIG.SUPABASE_URL.includes("your-supabase")) {
            try {
                const sb = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
                const { error } = await sb.from('rsvp_kehadiran').insert([data]);
                if (!error) saved = true;
            } catch (err) {}
        }

        alert(saved ? 'RSVP berhasil disimpan ke database & diteruskan ke WA Panitia!' : 'RSVP diteruskan ke WhatsApp Panitia.');
        window.open(`https://wa.me/${CONFIG.PANITIA_WA.replace(/\D/g, '')}?text=${encodeURIComponent(`📝 *RSVP Edu Fair 2026*\n\nNama: *${data.nama_tamu}*\nInstansi: *${data.instansi}*\nStatus: *${data.status_kehadiran}* (${data.jumlah_tamu} Orang)\nPesan: "${data.pesan_ucapan || '-'}"`)}`, '_blank');
        e.target.reset();
    });
}
```
* Melakukan `insert` data konfirmasi kehadiran ke tabel `rsvp_kehadiran` di Supabase, lalu membuka obrolan WhatsApp ke nomor panitia.

---

## 5. Tutorial Lengkap Perintah Git (Untuk Meng-update Kode)

Setiap kali Anda selesai mengubah atau memperbaiki kode di VS Code/komputer Anda, ikuti 3 langkah sederhana ini di terminal untuk memperbarui website Anda di GitHub Pages:

### Langkah 1: Buka Terminal di Folder Proyek
Buka terminal VS Code (atau Git Bash) dan pastikan berada di folder proyek:
```bash
cd C:\Users\ASUS\Documents\undanganWeb
```

### Langkah 2: Cek Status Perubahan (Opsional)
Untuk melihat file apa saja yang baru Anda ubah:
```bash
git status
```

### Langkah 3: Jalankan 3 Perintah Utama Git secara Berurutan

1. **`git add .`** (Tanda titik artinya memasukkan **semua** perubahan file terbaru ke dalam antrean simpan):
   ```bash
   git add .
   ```

2. **`git commit -m "catatan perubahan"`** (Membuat catatan pesan tentang apa yang Anda perbarui):
   ```bash
   git commit -m "Memperbarui tampilan header dan form rsvp"
   ```

3. **`git push origin main`** (Mengirimkan kode terbaru dari komputer Anda ke server GitHub Pages secara online):
   ```bash
   git push origin main
   ```

---

### 💡 Ringkasan Praktis:
Setiap kali ada perubahan kode di masa mendatang, Anda hanya perlu menjalankan 1 baris gabungan ini di terminal:
```bash
git add . && git commit -m "update kode" && git push origin main
```
Dalam waktu 1-2 menit, website GitHub Pages Anda akan otomatis ter-update mengikuti kode terbaru yang Anda buat!
