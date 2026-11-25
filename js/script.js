const CFG = {
    URL: "https://niclydymzisobxxyvnpd.supabase.co",
    KEY: "sb_publishable_SeiNE3qEhs2YDtsBylXvwA_a9k9oqDV",
    WA: "62821144589280"
};

document.addEventListener('DOMContentLoaded', () => {
    const p = new URLSearchParams(window.location.search);
    const getDec = (k) => p.get(k) ? decodeURIComponent(p.get(k).replace(/\+/g, ' ')).trim() : '';
    
    if (p.get('nama')) { document.getElementById('gName').textContent = getDec('nama'); document.getElementById('inNama').value = getDec('nama'); }
    if (p.get('instansi')) { document.getElementById('gInst').textContent = getDec('instansi'); document.getElementById('inInst').value = getDec('instansi'); }
    if (p.get('kategori')) { document.getElementById('inKat').value = getDec('kategori'); }

    // Countdown
    const t = new Date('2026-11-25T07:00:00').getTime();
    setInterval(() => {
        const diff = t - Date.now();
        if (diff > 0) {
            document.getElementById('d').textContent = String(Math.floor(diff / 86400000)).padStart(2, '0');
            document.getElementById('h').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0');
            document.getElementById('m').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
            document.getElementById('s').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        }
    }, 1000);

    // RSVP
    document.getElementById('rsvpForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = {
            nama_tamu: document.getElementById('inNama').value,
            instansi: document.getElementById('inInst').value,
            kategori: document.getElementById('inKat').value,
            nomor_wa: document.getElementById('inWa').value,
            status_kehadiran: document.getElementById('inStatus').value,
            jumlah_tamu: parseInt(document.getElementById('inJml').value) || 1,
            pesan_ucapan: document.getElementById('inPesan').value
        };
        
        if (CFG.URL && !CFG.URL.includes("your-supabase")) {
            try {
                const sb = window.supabase.createClient(CFG.URL, CFG.KEY);
                await sb.from('rsvp_kehadiran').insert([data]);
            } catch(err) {}
        }
        
        alert('RSVP berhasil dicatat! Mengalihkan ke WhatsApp Panitia...');
        window.open(`https://wa.me/${CFG.WA}?text=${encodeURIComponent(`📝 *RSVP Edu Fair 2026*\nNama: *${data.nama_tamu}*\nInstansi: *${data.instansi}*\nStatus: *${data.status_kehadiran}* (${data.jumlah_tamu} Orang)\nPesan: "${data.pesan_ucapan || '-'}"`)}`, '_blank');
        e.target.reset();
    });
});
