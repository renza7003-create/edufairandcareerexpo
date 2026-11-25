const CONFIG = {
    SB_URL: "https://niclydymzisobxxyvnpd.supabase.co",
    SB_KEY: "sb_publishable_SeiNE3qEhs2YDtsBylXvwA_a9k9oqDV",
    PANITIA_WA: "62821144589280"
};

document.addEventListener('DOMContentLoaded', () => {
    // URL Params parsing
    const p = new URLSearchParams(window.location.search);
    const decode = s => s ? decodeURIComponent(s.replace(/\+/g, ' ')).trim() : '';
    
    if(p.get('nama')) { document.getElementById('gName').textContent = decode(p.get('nama')); document.getElementById('iNama').value = decode(p.get('nama')); }
    if(p.get('instansi')) { document.getElementById('gInst').textContent = decode(p.get('instansi')); document.getElementById('iInst').value = decode(p.get('instansi')); }
    if(p.get('kategori')) { document.getElementById('iKat').value = decode(p.get('kategori')); }

    // Countdown
    const target = new Date('2026-11-25T07:00:00').getTime();
    setInterval(() => {
        const diff = target - Date.now();
        if(diff > 0) {
            document.getElementById('d').textContent = String(Math.floor(diff / 86400000)).padStart(2,'0');
            document.getElementById('h').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2,'0');
            document.getElementById('m').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2,'0');
            document.getElementById('s').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2,'0');
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
            if(!error) ok = true;
        } catch(err) {}

        alert(ok ? 'RSVP berhasil disimpan & diteruskan ke Panitia!' : 'RSVP diteruskan ke WhatsApp Panitia.');
        const msg = `📝 *RSVP Edu Fair 2026*\nNama: *${data.nama_tamu}*\nInstansi: *${data.instansi}*\nStatus: *${data.status_kehadiran}* (${data.jumlah_tamu} orang)\nPesan: "${data.pesan_ucapan || '-'}"`;
        window.open(`https://wa.me/${CONFIG.PANITIA_WA}?text=${encodeURIComponent(msg)}`, '_blank');
        e.target.reset();
    });
});
