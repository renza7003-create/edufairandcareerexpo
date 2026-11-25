// ==========================================
// CONFIGURATION
// ==========================================
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
                return { id: i + 1, nama: String(r.nama_tamu || r.nama || '').trim(), instansi: String(r.instansi || '').trim(), kategori: String(r.kategori || 'Perusahaan').trim(), wa: wa, sent: false };
            }).filter(g => g.nama);

            renderTable(guests);
            document.getElementById('tableSection').style.display = 'block';
            document.getElementById('totalCount').textContent = guests.length;
        };
        reader.readAsArrayBuffer(e.target.files[0]);
    };

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const q = e.target.value.toLowerCase();
            const filtered = guests.filter(g => 
                g.nama.toLowerCase().includes(q) || 
                g.instansi.toLowerCase().includes(q) || 
                g.kategori.toLowerCase().includes(q) || 
                g.wa.includes(q)
            );
            renderTable(filtered);
        });
    }
}

function renderTable(data) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;

    if (!data.length) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:16px; color:#64748b;">Tidak ada data tamu.</td></tr>`;
        return;
    }

    tbody.innerHTML = data.map((g, i) => `
        <tr class="${g.sent ? 'status-sent' : ''}">
            <td>${i + 1}</td>
            <td><b>${escapeHtml(g.nama)}</b></td>
            <td>${escapeHtml(g.instansi)}</td>
            <td>${escapeHtml(g.kategori)}</td>
            <td>+${escapeHtml(g.wa)}</td>
            <td>
                <button class="btn btn-wa" style="padding:6px 12px; font-size:0.8rem; width:auto; display:inline-flex;" onclick="sendWA(${g.id})" id="btn-${g.id}">
                    <i class="fab fa-whatsapp"></i> ${g.sent ? 'Terkirim ✓' : 'Kirim WA'}
                </button>
            </td>
        </tr>
    `).join('');
}

function sendWA(id) {
    const g = guests.find(x => x.id === id);
    if (!g) return;
    
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
    const btn = document.getElementById(`btn-${g.id}`);
    if (btn) {
        btn.innerHTML = `<i class="fab fa-whatsapp"></i> Terkirim ✓`;
        btn.closest('tr').classList.add('status-sent');
    }
    window.open(`https://wa.me/${g.wa}?text=${encodeURIComponent(msg)}`, '_blank');
}

// 2. Invitation & RSVP
function initInvitation() {
    const p = new URLSearchParams(window.location.search);
    const nama = p.get('nama');
    const instansi = p.get('instansi');
    const kategori = p.get('kategori');

    if (nama) {
        document.getElementById('guestName').textContent = nama;
        document.getElementById('inputNama').value = nama;
    }
    if (instansi) {
        document.getElementById('guestInstansi').textContent = instansi;
        document.getElementById('inputInstansi').value = instansi;
    }
    if (kategori) {
        document.getElementById('inputKategori').value = kategori;
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

    // RSVP Form
    const rsvpForm = document.getElementById('rsvpForm');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Menyimpan...`;
            }

            const data = {
                nama_tamu: document.getElementById('inputNama').value.trim(),
                instansi: document.getElementById('inputInstansi').value.trim(),
                kategori: document.getElementById('inputKategori').value,
                nomor_wa: document.getElementById('inputWa').value.trim(),
                status_kehadiran: document.getElementById('inputStatus').value,
                jumlah_tamu: parseInt(document.getElementById('inputJumlah').value) || 1,
                pesan_ucapan: document.getElementById('inputPesan').value.trim()
            };

            let savedToSupabase = false;
            if (CONFIG.SUPABASE_URL && !CONFIG.SUPABASE_URL.includes("your-supabase")) {
                try {
                    const sb = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);
                    const { error } = await sb.from('rsvp_kehadiran').insert([data]);
                    if (!error) savedToSupabase = true;
                } catch (err) {
                    console.error("Supabase Error:", err);
                }
            }

            alert(savedToSupabase ? 'RSVP berhasil disimpan ke database & diteruskan ke WA Panitia!' : 'RSVP diteruskan ke WhatsApp Panitia.');
            
            const cleanPanitiaWa = CONFIG.PANITIA_WA.replace(/\D/g, '');
            const waText = `📝 *Konfirmasi RSVP Edu Fair 2026*

Nama: *${data.nama_tamu}*
Instansi: *${data.instansi}*
Status: *${data.status_kehadiran}* (${data.jumlah_tamu} Orang)
Pesan: "${data.pesan_ucapan || '-'}"`;
            window.open(`https://wa.me/${cleanPanitiaWa}?text=${encodeURIComponent(waText)}`, '_blank');
            
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i> Konfirmasi Kehadiran`;
            }
            e.target.reset();
        });
    }
}

function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
}
