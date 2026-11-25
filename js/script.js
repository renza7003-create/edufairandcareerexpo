// Edu Fair 2026 - Master Script
const CONFIG = {
    SUPABASE_URL: "https://niclydymzisobxxyvnpd.supabase.co",
    SUPABASE_ANON_KEY: "sb_publishable_SeiNE3qEhs2YDtsBylXvwA_a9k9oqDV",
    PANITIA_WA: "62821144589280",
    PRODUCTION_BASE_URL: "https://renza7003-create.github.io/edufairandcareerexpo/index.html"
};

let guests = [];

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('fileDropzone')) initAdmin();
    if (document.getElementById('rsvpForm')) initInvitation();
});

// Admin Panel
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

    document.getElementById('searchInput')?.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        renderTable(guests.filter(g => g.nama.toLowerCase().includes(q) || g.instansi.toLowerCase().includes(q) || g.wa.includes(q)));
    });
}

function renderTable(data) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    tbody.innerHTML = data.length ? data.map((g, i) => `
        <tr class="${g.sent ? 'status-sent' : ''}">
            <td>${i + 1}</td><td><b>${esc(g.nama)}</b></td><td>${esc(g.instansi)}</td><td>${esc(g.kategori)}</td><td>+${esc(g.wa)}</td>
            <td><button class="btn btn-wa" style="padding:6px 12px;font-size:0.8rem;width:auto;display:inline-flex;" onclick="sendWA(${g.id})" id="btn-${g.id}">
                <i class="fab fa-whatsapp"></i> ${g.sent ? 'Terkirim ✓' : 'Kirim WA'}
            </button></td>
        </tr>
    `).join('') : `<tr><td colspan="6" style="text-align:center;padding:16px;color:#64748b;">Tidak ada data.</td></tr>`;
}

function sendWA(id) {
    const g = guests.find(x => x.id === id);
    if (!g) return;
    let url = CONFIG.PRODUCTION_BASE_URL || (window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/index.html'));
    const link = `${url}?nama=${encodeURIComponent(g.nama)}&instansi=${encodeURIComponent(g.instansi)}&kategori=${encodeURIComponent(g.kategori)}`;
    const msg = `Yth. *${g.nama}*
*${g.instansi}*

Assalamu'alaikum Wr. Wb. Kami mengundang Bapak/Ibu dalam ajang:

🎓 *EDU FAIR & CAREER EXPO 2026*
"Connecting Competence to Future: Bekerja, Melanjutkan, Berwirausaha"

📅 *Hari, Tanggal:* Rabu, 25 November 2026
⏰ *Waktu:* 07.00 – 14.00 WIB
📍 *Lokasi:* SMKN 6 Kota Tangerang Selatan

Link undangan personal:
${link}

Terima kasih.
*Panitia Edu Fair 2026*`;
    
    g.sent = true;
    const btn = document.getElementById(`btn-${g.id}`);
    if (btn) { btn.innerHTML = `<i class="fab fa-whatsapp"></i> Terkirim ✓`; btn.closest('tr').classList.add('status-sent'); }
    window.open(`https://wa.me/${g.wa}?text=${encodeURIComponent(msg)}`, '_blank');
}

// Invitation & RSVP
function decodeParam(str) {
    if (!str) return '';
    try {
        return decodeURIComponent(str.replace(/\+/g, ' ')).trim();
    } catch (e) {
        return str.trim();
    }
}

function initInvitation() {
    const p = new URLSearchParams(window.location.search);
    const rawNama = p.get('nama');
    const rawInstansi = p.get('instansi');
    const rawKategori = p.get('kategori');

    if (rawNama) {
        const nama = decodeParam(rawNama);
        document.getElementById('guestName').textContent = nama;
        document.getElementById('inputNama').value = nama;
    }
    if (rawInstansi) {
        const instansi = decodeParam(rawInstansi);
        document.getElementById('guestInstansi').textContent = instansi;
        document.getElementById('inputInstansi').value = instansi;
    }
    if (rawKategori) {
        document.getElementById('inputKategori').value = decodeParam(rawKategori);
    }

    // Countdown
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

    // RSVP Submit
    document.getElementById('rsvpForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById('submitBtn');
        if (btn) { btn.disabled = true; btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Menyimpan...`; }

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
        window.open(`https://wa.me/${CONFIG.PANITIA_WA.replace(/\D/g, '')}?text=${encodeURIComponent(`📝 *RSVP Edu Fair 2026*

Nama: *${data.nama_tamu}*
Instansi: *${data.instansi}*
Status: *${data.status_kehadiran}* (${data.jumlah_tamu} Orang)
Pesan: "${data.pesan_ucapan || '-'}"`)}`, '_blank');
        if (btn) { btn.disabled = false; btn.innerHTML = `<i class="fas fa-paper-plane"></i> Konfirmasi Kehadiran`; }
        e.target.reset();
    });
}

function esc(t) { return String(t).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m])); }
