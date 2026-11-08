/**
 * script.js — logika utama aplikasi Toko Buku Online.
 * Setiap halaman memiliki <body data-halaman="..."> yang menentukan
 * fungsi init mana yang dijalankan (lihat bagian paling bawah).
 */

/* ================= Fungsi bantu ================= */

/** Singkatan getElementById. */
const $ = (id) => document.getElementById(id);

/** Format angka menjadi Rupiah, contoh: 85000 -> "Rp 85.000". */
const rupiah = (n) => "Rp " + Number(n).toLocaleString("id-ID");

/** Membuka dan menutup modal box berdasarkan id. */
const bukaModal = (id) => $(id).classList.add("aktif");
const tutupModal = (id) => $(id).classList.remove("aktif");

/** Pengguna yang sedang login (disimpan di sessionStorage). */
const penggunaAktif = () =>
  JSON.parse(sessionStorage.getItem("pengguna") || "null");

/** Pesanan baru dari checkout (disimpan di localStorage agar terbaca di tracking). */
const ambilPesanan = () => JSON.parse(localStorage.getItem("pesanan") || "[]");

/**
 * Menambah satu baris ke <tbody> lewat DOM.
 * @param {HTMLElement} tbody - elemen tbody tujuan
 * @param {Array} sel - isi tiap kolom (teks atau Node)
 * @returns {HTMLTableRowElement} baris yang dibuat
 */
function tambahBaris(tbody, sel) {
  const tr = document.createElement("tr");
  sel.forEach((isi) => {
    const td = document.createElement("td");
    if (isi instanceof Node) td.appendChild(isi);
    else td.textContent = isi; // textContent mencegah injeksi HTML
    tr.appendChild(td);
  });
  tbody.appendChild(tr);
  return tr;
}

/* ================= Halaman Login ================= */

function initLogin() {
  // Validasi login: cocokkan email & password dengan dataPengguna
  $("formLogin").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("email").value.trim();
    const pass = $("password").value;
    const user = dataPengguna.find(
      (u) => u.email === email && u.password === pass,
    );
    if (!user) return alert("Email/password yang anda masukkan salah");
    sessionStorage.setItem("pengguna", JSON.stringify(user));
    location.href = "dashboard.html";
  });

  // Tombol yang memunculkan modal box
  $("btnLupa").onclick = () => bukaModal("modalLupa");
  $("btnDaftar").onclick = () => bukaModal("modalDaftar");
  $("keLogin").onclick = () => tutupModal("modalDaftar"); // tautan "Login disini"

  // Simulasi kirim tautan reset password
  $("formLupa").addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Tautan reset password dikirim ke " + $("emailLupa").value);
    tutupModal("modalLupa");
  });

  // Pendaftaran akun baru (hanya tersimpan selama halaman terbuka)
  $("formDaftar").addEventListener("submit", (e) => {
    e.preventDefault();
    const baru = {
      nama: $("namaDaftar").value.trim(),
      email: $("emailDaftar").value.trim(),
      password: $("passDaftar").value,
      role: $("roleDaftar").value,
      departemen: $("deptDaftar").value,
    };
    if (baru.password.length < 6) return alert("Password minimal 6 karakter");
    if (dataPengguna.some((u) => u.email === baru.email))
      return alert("Email sudah terdaftar");
    dataPengguna.push(baru);
    alert("Pendaftaran berhasil. Silakan login.");
    e.target.reset();
    tutupModal("modalDaftar");
  });
}

/* ================= Dashboard ================= */

function initDashboard() {
  // Greeting berdasarkan jam lokal pengguna
  const jam = new Date().getHours();
  const sapa =
    jam < 11
      ? "Selamat pagi"
      : jam < 15
        ? "Selamat siang"
        : jam < 18
          ? "Selamat sore"
          : "Selamat malam";
  $("greeting").textContent = `${sapa}, ${penggunaAktif().nama}!`;

  // Kartu statistik dihitung dari data (js/data.js)
  const jumlah = (tipe) =>
    dataTransaksi.filter((t) => t.tipe === tipe).reduce((a, t) => a + t.qty, 0);
  $("sTotal").textContent = dataKatalogBuku.reduce((a, b) => a + b.stok, 0);
  $("sMasuk").textContent = jumlah("IN");
  $("sKeluar").textContent = jumlah("OUT");
  $("sJudul").textContent = dataKatalogBuku.length;

  // History transaksi ditampilkan di modal (data contoh + pesanan baru dari checkout)
  $("btnHistory").onclick = () => {
    const tbody = $("tbodyHistory");
    tbody.innerHTML = "";
    const dariCheckout = ambilPesanan().map((p, i) => ({
      id: "N" + (i + 1),
      doc: p.noDO,
      tanggal: p.tanggalKirim,
      tipe: "OUT",
      qty: p.qty || 0,
      user: p.nama,
      ket: "Pesanan online",
    }));
    [...dataTransaksi, ...dariCheckout].forEach((t) => {
      const badge = Object.assign(document.createElement("span"), {
        className: "badge " + t.tipe.toLowerCase(),
        textContent: t.tipe,
      });
      tambahBaris(tbody, [t.id, t.doc, t.tanggal, badge, t.qty, t.user, t.ket]);
    });
    bukaModal("modalHistory");
  };
}

/* ================= Informasi Stok ================= */

function initStok() {
  const tbody = $("tbodyStok");

  /** Menampilkan satu buku sebagai baris tabel. */
  const tampilkan = (b) => {
    const img = b.gambar
      ? Object.assign(new Image(), { src: b.gambar, alt: "Sampul " + b.judul })
      : "-";
    // Badge stok: oranye bila menipis (< 10), hijau bila aman
    const badge = Object.assign(document.createElement("span"), {
      className: "badge " + (b.stok < 10 ? "out" : "in"),
      textContent: b.stok,
    });
    tambahBaris(tbody, [
      img,
      b.kode,
      b.judul,
      b.penulis,
      rupiah(b.harga),
      badge,
    ]);
  };
  dataKatalogBuku.forEach(tampilkan);

  /** Menghitung jumlah baris yang terlihat ("Total: n records"). */
  const hitung = () =>
    ($("jumlahRec").textContent = [...tbody.rows].filter(
      (r) => !r.hidden,
    ).length);
  hitung();

  // Pencarian: sembunyikan baris yang tidak cocok dengan kata kunci
  $("cariStok").oninput = () => {
    const k = $("cariStok").value.toLowerCase();
    [...tbody.rows].forEach(
      (r) => (r.hidden = !r.textContent.toLowerCase().includes(k)),
    );
    hitung();
  };

  // Tambah stok baru: validasi lalu tambah baris lewat DOM
  $("formStok").addEventListener("submit", (e) => {
    e.preventDefault();
    const b = {
      kode: $("kode").value.trim().toUpperCase(),
      judul: $("judul").value.trim(),
      penulis: $("penulis").value.trim(),
      harga: parseInt($("harga").value),
      stok: parseInt($("jumlahStok").value),
      gambar: "",
    };
    const pesan = $("pesanStok");
    if (dataKatalogBuku.some((x) => x.kode === b.kode))
      return (pesan.textContent = "Kode buku sudah digunakan.");
    if (!(b.harga > 0) || !(b.stok >= 0))
      return (pesan.textContent =
        "Harga harus > 0 dan stok tidak boleh negatif.");
    pesan.textContent = "";
    dataKatalogBuku.push(b);
    tampilkan(b);
    hitung();
    e.target.reset();
  });
}

/* ================= Pemesanan (Checkout) ================= */

function initCheckout() {
  let keranjang = []; // isi: { kode, qty }
  dataKatalogBuku.forEach((b) =>
    $("pilihBuku").add(new Option(`${b.judul} — ${rupiah(b.harga)}`, b.kode)),
  );

  const cari = (kode) => dataKatalogBuku.find((x) => x.kode === kode);
  const hitungTotal = () =>
    keranjang.reduce((t, it) => t + cari(it.kode).harga * it.qty, 0);

  /** Menggambar ulang tabel keranjang (jumlah dapat diubah, item dapat dihapus). */
  const gambarUlang = () => {
    const tbody = $("tbodyKeranjang");
    tbody.innerHTML = "";
    keranjang.forEach((it, i) => {
      const b = cari(it.kode);
      const qty = Object.assign(document.createElement("input"), {
        type: "number",
        min: 1,
        max: b.stok,
        value: it.qty,
      });
      qty.onchange = () => {
        const v = parseInt(qty.value);
        if (!(v >= 1 && v <= b.stok)) {
          alert(`Jumlah harus 1–${b.stok}`);
          qty.value = it.qty;
          return;
        }
        it.qty = v;
        gambarUlang();
      };
      const hapus = Object.assign(document.createElement("button"), {
        textContent: "Hapus",
        className: "btn bahaya",
        type: "button",
      });
      hapus.onclick = () => {
        keranjang.splice(i, 1);
        gambarUlang();
      };
      tambahBaris(tbody, [
        b.judul,
        rupiah(b.harga),
        qty,
        rupiah(b.harga * it.qty),
        hapus,
      ]);
    });
    $("totalBayar").textContent = rupiah(hitungTotal());
  };

  // Tambah buku ke keranjang (stok dicek agar tidak berlebih)
  $("btnTambah").onclick = () => {
    const kode = $("pilihBuku").value,
      qty = parseInt($("jumlah").value),
      b = cari(kode);
    if (!b || !(qty >= 1)) return alert("Pilih buku dan isi jumlah minimal 1.");
    const ada = keranjang.find((x) => x.kode === kode);
    if ((ada ? ada.qty : 0) + qty > b.stok)
      return alert(`Stok ${b.judul} hanya ${b.stok}.`);
    if (ada) ada.qty += qty;
    else keranjang.push({ kode, qty });
    gambarUlang();
  };

  // Kirim pesanan: validasi data pemesan, buat nomor DO, simpan
  $("formCheckout").addEventListener("submit", (e) => {
    e.preventDefault();
    const pesan = $("pesanCheckout");
    if (!keranjang.length)
      return (pesan.textContent =
        "Keranjang masih kosong. Tambahkan buku terlebih dahulu.");
    if (!/^08\d{8,12}$/.test($("telepon").value.trim()))
      return (pesan.textContent =
        "Nomor telepon tidak valid. Contoh: 081234567890.");
    pesan.textContent = "";
    const noDO =
      "DO" + new Date().getFullYear() + Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem(
      "pesanan",
      JSON.stringify([
        ...ambilPesanan(),
        {
          noDO,
          nama: $("nama").value.trim(),
          ekspedisi: $("ekspedisi").value,
          tanggalKirim: new Date().toISOString().slice(0, 10),
          jenisPaket: $("paket").value,
          total: hitungTotal(),
          status: 0,
          qty: keranjang.reduce((a, i) => a + i.qty, 0),
        },
      ]),
    );
    $("noDOBaru").textContent = noDO;
    bukaModal("modalSukses");
    keranjang = [];
    gambarUlang();
    e.target.reset();
  });
}

/* ================= Tracking Pengiriman ================= */

function initTracking() {
  $("formCari").addEventListener("submit", (e) => {
    e.preventDefault();
    const no = $("noDO").value.trim().toUpperCase();
    const d = [...dataTracking, ...ambilPesanan()].find((x) => x.noDO === no);
    if (!d) {
      $("hasil").hidden = true;
      return alert("Nomor Delivery Order tidak ditemukan.");
    }

    $("tNama").textContent = d.nama;
    $("tEkspedisi").textContent = d.ekspedisi;
    $("tTanggal").textContent = d.tanggalKirim;
    $("tPaket").textContent = d.jenisPaket;
    $("tTotal").textContent = rupiah(d.total);
    $("tStatus").textContent = statusPengiriman[d.status];
    $("bar").style.width =
      (d.status / (statusPengiriman.length - 1)) * 100 + "%"; // progress bar

    const langkah = $("langkah");
    langkah.innerHTML = "";
    statusPengiriman.forEach((s, i) => {
      const sp = Object.assign(document.createElement("span"), {
        textContent: s,
      });
      if (i <= d.status) sp.className = "on";
      langkah.appendChild(sp);
    });
    $("hasil").hidden = false;
  });
}

/* ================= Inisialisasi ================= */

const halaman = document.body.dataset.halaman;

// Halaman selain login hanya boleh dibuka setelah login
if (halaman !== "login" && !penggunaAktif()) location.href = "index.html";

// Semua tombol dengan atribut data-tutup menutup modal terkait
document
  .querySelectorAll("[data-tutup]")
  .forEach((t) => (t.onclick = () => tutupModal(t.dataset.tutup)));

// Tombol logout (ada di header semua halaman selain login)
const btnLogout = $("btnLogout");
if (btnLogout)
  btnLogout.onclick = () => {
    sessionStorage.removeItem("pengguna");
    location.href = "index.html";
  };

// Isi nama & avatar pengguna pada topbar
const pengguna = penggunaAktif();
if (pengguna && $("namaUser")) {
  $("namaUser").textContent = pengguna.nama;
  $("avatar").textContent = pengguna.nama[0].toUpperCase();
}

// Jalankan fungsi sesuai halaman
({
  login: initLogin,
  dashboard: initDashboard,
  stok: initStok,
  checkout: initCheckout,
  tracking: initTracking,
})[halaman]?.();
