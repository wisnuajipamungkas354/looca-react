# Looca Admin Panel 🌸✨

Web application admin panel untuk **Looca ID** (Handcrafted Accessories & DIY Workshop).
Dibangun dengan **React (TypeScript) + Vite + Tailwind CSS + shadcn/ui + React Router**.

---

## 🎨 Karakteristik Desain & Fitur
1. **Visual Style**: Mengadopsi palet warna pastel & playful dari website Astro (`looca_id`), font `Quicksand`, `Patrick Hand`, dan `Inter`, dekorasi SVG melayang (`star`, `heart`, `flower`, `cherry`), serta rounded corners lembut (`rounded-2xl` & `rounded-3xl`).
2. **Dual Navigation**:
   - **Desktop View (≥1024px)**: Left fixed Sidebar dengan sub-menu expandable *Products*.
   - **Mobile View (<1024px)**: Bottom Navigation bar seperti aplikasi native dengan safe-area padding.
3. **Dark Mode & Light Mode**: Switch tema cepat via `ModeToggle` (tersimpan di `localStorage`).
4. **Rich Feedback / Popups**:
   - Tidak menggunakan popup native browser (`alert`, `confirm`, `prompt`).
   - Notifikasi interaktif via `sonner` toast.
   - Dialog konfirmasi hapus & logout via cute `AlertDialog`.
5. **Crop & Media Handlers**:
   - **Products**: Upload hingga 3 foto (maks 1MB), terkunci rasio portrait `3:4` menggunakan `react-easy-crop`.
   - **Workshop**: Thumbnail terkunci rasio kotak `1:1`, uploader video tutorial (simulasi progress upload, simpan URL ke data).
   - **Upcoming Events**: Poster terkunci rasio portrait `3:4`, quick active/inactive switch.
6. **Data Dummy / Mock CRUD**:
   - 5 Kategori Produk: `Fashion`, `Accessories`, `Bagcharm`, `Souvenir`, `Merchandise`.
   - Pencegahan penghapusan kategori bila masih memiliki produk terhubung.
   - Click counter untuk produk dan video play counter untuk workshop.
   - Pengaturan website: WhatsApp number, Instagram, TikTok, dan Shopee store URL.

---

## 🚀 Panduan Menjalankan

### Akun Demo:
- **Email**: `admin@looca.id`
- **Password**: `admin123`

### Development Mode:
```bash
npm install
npm run dev
```
Buka browser pada URL yang muncul (biasanya `http://localhost:5173`).

### Production Build:
```bash
npm run build
npm run preview
```
