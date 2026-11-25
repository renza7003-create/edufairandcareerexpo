const CONFIG = {
    SB_URL: "https://niclydymzisobxxyvnpd.supabase.co",
    SB_KEY: "sb_publishable_SeiNE3qEhs2YDtsBylXvwA_a9k9oqDV",
    PANITIA_WA: "62821144589280",
    BASE_URL: "https://renza7003-create.github.io/edufairandcareerexpo/index.html"
};

let guests = [];

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('fileInput')) initAdmin();
    if (document.getElementById('rsvpForm')) initInvitation();
});

// === 1. ADMIN & WA BLAST LOGIC ===
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
                return {
                    id: i + 1,
                    nama: String(r.nama_tamu || r.nama || '').trim(),
                    instansi: String(r.instansi || '').trim(),
                    kategori: String(r.kategori || 'Perusahaan').trim(),
                    wa,
                    sent: false
                };
            }).filter(g => g.nama);
            renderTable(guests);
            document.getElementById('tableSection').style.display = 'block';
            document.getElementById('totalCount').textContent = guests.length;
        };
        reader.readAsArrayBuffer(e.target.files[0]);
    };

    document.getElementById('searchInput')?.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        renderTable(guests.filter(g => g.nama.toLowerCase().includes(q) || g.instansi.toLowerCase().includes(q)));
    });
}

function renderTable(data) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    tbody.innerHTML = data.length ? data.map((g, i) => `
        <tr class="${g.sent ? 'status-sent' : ''}">
            <td>${i + 1}</td>
            <td><b>${esc(g.nama)}</b></td>
            <td>${esc(g.instansi)}</td>
            <td>${esc(g.kategori)}</td>
            <td>+${esc(g.wa)}</td>
            <td>
                <button class="btn btn-wa" style="padding:6px 12px;font-size:0.8rem;width:auto;" onclick="sendWA(${g.id})" id="btn-${g.id}">
                    <i class="fab fa-whatsapp"></i> ${g.sent ? 'Terkirim ✓' : 'Kirim WA'}
                </button>
            </td>
        </tr>
    `).join('') : `<tr><td colspan="6" style="text-align:center;padding:16px;color:#64748b;">Tidak ada data tamu.</td></tr>`;
}

function sendWA(id) {
    const g = guests.find(x => x.id === id);
    if (!g) return;
    const link = `${CONFIG.BASE_URL}?nama=${encodeURIComponent(g.nama)}&instansi=${encodeURIComponent(g.instansi)}&kategori=${encodeURIComponent(g.kategori)}`;
    const msg = `Yth. *${g.nama}*\n*${g.instansi}*\n\nAssalamu'alaikum Wr. Wb. Kami mengundang Bapak/Ibu dalam acara:\n\n🎓 *EDU FAIR & CAREER EXPO 2026*\n"Connecting Competence to Future: Bekerja, Melanjutkan, Berwirausaha"\n\n📅 *Hari, Tanggal:* Rabu, 25 November 2026\n⏰ *Waktu:* 07.00 – 14.00 WIB\n📍 *Lokasi:* SMKN 6 Kota Tangerang Selatan\n\nUndangan digital personal:\n${link}\n\nTerima kasih.\n*Panitia Edu Fair 2026*`;
    
    g.sent = true;
    const btn = document.getElementById(`btn-${g.id}`);
    if (btn) {
        btn.innerHTML = `<i class="fab fa-whatsapp"></i> Terkirim ✓`;
        btn.closest('tr').classList.add('status-sent');
    }
    window.open(`https://wa.me/${g.wa}?text=${encodeURIComponent(msg)}`, '_blank');
}

function esc(t) {
    return String(t).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
}

// === 2. INVITATION & RSVP LOGIC ===
function initInvitation() {
    const p = new URLSearchParams(window.location.search);
    const decode = s => s ? decodeURIComponent(s.replace(/\+/g, ' ')).trim() : '';
    
    if (p.get('nama')) {
        const nama = decode(p.get('nama'));
        document.getElementById('gName').textContent = nama;
        document.getElementById('iNama').value = nama;
    }
    if (p.get('instansi')) {
        const instansi = decode(p.get('instansi'));
        document.getElementById('gInst').textContent = instansi;
        document.getElementById('iInst').value = instansi;
    }
    if (p.get('kategori')) {
        document.getElementById('iKat').value = decode(p.get('kategori'));
    }

    // Countdown
    const target = new Date('2026-11-25T07:00:00').getTime();
    setInterval(() => {
        const diff = target - Date.now();
        if (diff > 0) {
            document.getElementById('d').textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
            document.getElementById('h').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
            document.getElementById('m').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
            document.getElementById('s').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        }
    }, 1000);

    // RSVP Submit
    document.getElementById('rsvpForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            nama_tamu: document.getElementById('iNama').value,
            instansi: document.getElementById('iInst').value,
            kategori: document.getElementById('iKat').value,
            nomor_wa: document.getElementById('iWa').value,
            status_kehadiran: document.getElementById('iStat').value,
            jumlah_tamu: parseInt(document.getElementById('iJml').value) || 1,
            pesan_ucapan: document.getElementById('iPesan').value
        };

        let ok = false;
        try {
            const sb = window.supabase.createClient(CONFIG.SB_URL, CONFIG.SB_KEY);
            const { error } = await sb.from('rsvp_kehadiran').insert([data]);
            if (!error) ok = true;
        } catch (err) {}

        alert(ok ? 'RSVP berhasil disimpan & diteruskan ke Panitia!' : 'RSVP diteruskan ke WhatsApp Panitia.');
        const msg = `📝 *RSVP Edu Fair 2026*\nNama: *${data.nama_tamu}*\nInstansi: *${data.instansi}*\nStatus: *${data.status_kehadiran}* (${data.jumlah_tamu} orang)\nPesan: "${data.pesan_ucapan || '-'}"`;
        window.open(`https://wa.me/${CONFIG.PANITIA_WA}?text=${encodeURIComponent(msg)}`, '_blank');
        e.target.reset();
    });
}
