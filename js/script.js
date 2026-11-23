// ==========================================
// CONFIGURATION (Ganti dengan data Supabase & Link GitHub Anda)
// ==========================================
const CONFIG = {
    // Kosongkan atau isi URL Supabase Anda setelah membuat project di supabase.com
    SUPABASE_URL: "https://your-supabase-project.supabase.co",
    SUPABASE_ANON_KEY: "your-supabase-anon-key-here",
    
    // Nomor WhatsApp Panitia untuk menerima konfirmasi RSVP (Format: 628...)
    PANITIA_WA: "6281234567890",
    
    // URL Deployment GitHub Pages (Ganti dengan link GitHub Pages Anda setelah deploy)
    // Contoh: "https://nurrahmadind.github.io/edufairandcareerexpo/index.html"
    PRODUCTION_BASE_URL: "" 
};

let guests = [];

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('fileDropzone')) initAdmin();
    if (document.getElementById('rsvpForm')) initInvitation();
});

// 1. Admin & WhatsApp Blast
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
                return { id: i + 1, nama: r.nama_tamu || r.nama || '', instansi: r.instansi || '', kategori: r.kategori || 'Perusahaan', wa: wa, sent: false };
            }).filter(g => g.nama);

            renderTable(guests);
            document.getElementById('tableSection').style.display = 'block';
            document.getElementById('totalCount').textContent = guests.length;
        };
        reader.readAsArrayBuffer(e.target.files[0]);
    };
}

function renderTable(data) {
    document.getElementById('tableBody').innerHTML = data.map((g, i) => `
        <tr class="${g.sent ? 'status-sent' : ''}">
            <td>${i + 1}</td>
            <td><b>${g.nama}</b></td>
            <td>${g.instansi}</td>
            <td>${g.kategori}</td>
            <td>+${g.wa}</td>
            <td><button class="btn btn-wa" style="padding:4px 8px;font-size:0.8rem;" onclick="sendWA(${g.id})" id="btn-${g.id}">Kirim WA</button></td>
        </tr>
    `).join('');
}

function sendWA(id) {
    const g = guests.find(x => x.id === id);
    if (!g) return;
    
    // Gunakan PRODUCTION_BASE_URL jika sudah di-deploy, jika kosong gunakan window.location
    let baseUrl = CONFIG.PRODUCTION_BASE_URL;
    if (!baseUrl || baseUrl.includes('your-')) {
        baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/index.html');
    }
    
    const link = `${baseUrl}?nama=${encodeURIComponent(g.nama)}&instansi=${encodeURIComponent(g.instansi)}&kategori=${encodeURIComponent(g.kategori)}`;
    
    const msg = `Yth. *${g.nama}*
*${g.instansi}*

Assalamu'alaikum Wr. Wb. Dengan hormat, kami mengundang Bapak/Ibu pimpinan instansi/mitra untuk hadir dan berpartisipasi dalam ajang pameran tahunan:

🎓 *EDU FAIR & CAREER EXPO 2026*
"Connecting Competence to Future: Bekerja, Melanjutkan, Berwirausaha"

📅 *Hari, Tanggal:* Rabu, 25 November 2026
⏰ *Waktu:* 07.00 – 14.00 WIB
📍 *Lokasi:* SMKN 6 Kota Tangerang Selatan

Informasi lengkap dapat diakses secara eksklusif melalui tautan personal berikut:
${link}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu berkenan hadir memenuhi undangan ini.

Atas perhatian, waktu, dan kerja sama yang baik, kami ucapkan terima kasih.

*Hormat kami,*
*Panitia Edu Fair & Career Expo 2026*`;
    
    g.sent = true;
    document.getElementById(`btn-${g.id}`).innerText = "Terkirim ✓";
    document.getElementById(`btn-${g.id}`).closest('tr').className = "status-sent";
    window.open(`https://wa.me/${g.wa}?text=${encodeURIComponent(msg)}`, '_blank');
}

// 2. Invitation & RSVP
function initInvitation() {
    const p = new URLSearchParams(window.location.search);
    if (p.get('nama')) { document.getElementById('guestName').textContent = p.get('nama'); document.getElementById('inputNama').value = p.get('nama'); }
    if (p.get('instansi')) { document.getElementById('guestInstansi').textContent = p.get('instansi'); document.getElementById('inputInstansi').value = p.get('instansi'); }
    if (p.get('kategori')) document.getElementById('inputKategori').value = p.get('kategori');

    // Countdown
    const target = new Date('2026-11-25T07:00:00').getTime();
    setInterval(() => {
        const d = target - Date.now();
        if (d > 0) {
            document.getElementById('days').textContent = Math.floor(d / 86400000);
            document.getElementById('hours').textContent = Math.floor((d % 86400000) / 3600000);
            document.getElementById('minutes').textContent = Math.floor((d % 3600000) / 60000);
            document.getElementById('seconds').textContent = Math.floor((d % 60000) / 1000);
        }
    }, 1000);

    // RSVP
    document.getElementById('rsvpForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            nama_tamu: document.getElementById('inputNama').value,
            instansi: document.getElementById('inputInstansi').value,
            kategori: document.getElementById('inputKategori').value,
            nomor_wa: document.getElementById('inputWa').value,
            status_kehadiran: document.getElementById('inputStatus').value,
            jumlah_tamu: parseInt(document.getElementById('inputJumlah').value) || 1,
            pesan_ucapan: document.getElementById('inputPesan').value
        };

        let savedToSupabase = false;
        if (CONFIG.SB_URL && !CONFIG.SB_URL.includes("your-supabase")) {
            try {
                const sb = window.supabase.createClient(CONFIG.SB_URL, CONFIG.SB_KEY);
                const { error } = await sb.from('rsvp_kehadiran').insert([data]);
                if (!error) savedToSupabase = true;
            } catch (err) {
                console.error("Supabase Error:", err);
            }
        }

        alert(savedToSupabase ? 'RSVP berhasil disimpan ke database & diteruskan ke WA Panitia!' : 'RSVP diteruskan ke WhatsApp Panitia.');
        
        const waText = `📝 *Konfirmasi RSVP Edu Fair 2026*\n\nNama: *${data.nama_tamu}*\nInstansi: *${data.instansi}*\nStatus: *${data.status_kehadiran}* (${data.jumlah_tamu} Orang)\nPesan: "${data.pesan_ucapan || '-'}"`;
        window.open(`https://wa.me/${CONFIG.PANITIA_WA}?text=${encodeURIComponent(waText)}`, '_blank');
        e.target.reset();
    });
}
