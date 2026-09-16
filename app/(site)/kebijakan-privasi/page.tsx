// Author: Zeday | https://join.co.id
import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHeading from "@/components/SectionHeading";
import { siteConfig } from "@/lib/site-config";
import { isEmailConfigured } from "@/lib/email";
import { isWhatsAppConfigured } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: `Bagaimana ${siteConfig.name} mengumpulkan, menggunakan, dan melindungi data pribadi yang anda berikan lewat website ini.`,
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="font-heading text-xl font-bold text-ink dark:text-ink-dark">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-ink/80 dark:text-ink-dark/80">
        {children}
      </div>
    </section>
  );
}

export default function KebijakanPrivasiPage() {
  const emailConfigured = isEmailConfigured();
  const whatsappConfigured = isWhatsAppConfigured();
  const analyticsEnabled = Boolean(siteConfig.gaId);

  return (
    <>
      <Breadcrumb items={[{ label: "Kebijakan Privasi" }]} />

      <section className="py-14 sm:py-20">
        <div className="container-page max-w-3xl">
          <SectionHeading
            eyebrow="Privasi & Data Pribadi"
            title="Kebijakan Privasi"
            description={`Terakhir diperbarui: dokumen ini menjelaskan bagaimana ${siteConfig.name} mengumpulkan, menggunakan, menyimpan, dan melindungi data pribadi yang anda berikan lewat website ini, sesuai dengan Undang-Undang No. 27 Tahun 2022 tentang Pelindungan Data Pribadi.`}
          />

          <div className="mt-10">
            <Section title="1. Data yang Kami Kumpulkan">
              <p>Kami hanya mengumpulkan data yang anda berikan secara langsung lewat dua formulir di website ini:</p>
              <ul className="ml-5 list-disc space-y-1">
                <li>
                  <strong>Formulir Kontak</strong>: nama, alamat email, nomor telepon, dan isi pesan anda.
                </li>
                <li>
                  <strong>Formulir Pendaftaran Siswa Baru</strong>: nama dan usia calon siswa, jenjang yang dituju, serta nama, alamat email, dan nomor telepon orang tua/wali.
                </li>
              </ul>
              <p>
                Kami tidak mengumpulkan data anda lewat cara lain (mis. melacak aktivitas browsing anda di situs lain) dan tidak meminta data sensitif seperti NIK, data kesehatan, atau data keuangan lewat formulir ini.
              </p>
            </Section>

            <Section title="2. Bagaimana Data Digunakan">
              <p>
                Data dari <strong>Formulir Kontak</strong> diteruskan sebagai email ke alamat email pengelola sekolah untuk dijawab langsung — data ini <strong>tidak disimpan</strong> di database website.
              </p>
              <p>
                Data dari <strong>Formulir Pendaftaran</strong> disimpan di database website agar dapat ditindaklanjuti oleh staf sekolah (menghubungi anda, memproses penerimaan), dan dapat dilihat oleh staf yang memiliki akun admin di website ini.
              </p>
            </Section>

            <Section title="3. Pemberitahuan ke Pihak Sekolah">
              <p>Saat anda mengirim formulir pendaftaran, sistem meneruskan notifikasi ke staf sekolah lewat:</p>
              <ul className="ml-5 list-disc space-y-1">
                <li>Email{emailConfigured ? "" : " (saat ini belum aktif di website ini)"}.</li>
                <li>
                  WhatsApp, lewat layanan pihak ketiga (Fonnte){whatsappConfigured ? "" : " (saat ini belum aktif di website ini)"}.
                </li>
              </ul>
              <p>
                Pihak ketiga ini hanya menerima data secukupnya untuk mengirim notifikasi (isi pesan pendaftaran), dan tidak memiliki akses ke database website ini.
              </p>
            </Section>

            <Section title="4. Penyimpanan & Keamanan Data">
              <p>
                Data pendaftaran disimpan di server milik/yang disewa oleh {siteConfig.name}, dilindungi dengan koneksi terenkripsi (HTTPS). Akses ke panel admin dilindungi kata sandi per akun staf dan dapat ditambah verifikasi dua langkah (2FA); setiap perubahan data tercatat lengkap dengan siapa pelakunya.
              </p>
              <p>
                Kami menyimpan data pendaftaran selama diperlukan untuk keperluan administrasi penerimaan siswa. Anda dapat meminta data dihapus lebih awal lewat kontak di bagian 6 di bawah.
              </p>
            </Section>

            <Section title="5. Cookie & Analitik">
              <p>
                Website ini menggunakan cookie teknis untuk sesi login admin (hanya relevan bagi staf sekolah, bukan pengunjung umum) dan menyimpan preferensi mode terang/gelap di perangkat anda sendiri (tidak dikirim ke server).
              </p>
              {analyticsEnabled ? (
                <p>
                  Website ini menggunakan Google Analytics untuk memahami jumlah dan perilaku pengunjung secara agregat (anonim, tidak mengidentifikasi anda secara pribadi). Lihat{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline dark:text-primary-light"
                  >
                    Kebijakan Privasi Google
                  </a>{" "}
                  untuk detailnya.
                </p>
              ) : (
                <p>Website ini saat ini tidak menggunakan Google Analytics atau pelacak pihak ketiga lain.</p>
              )}
              <p>
                Peta lokasi sekolah di halaman Kontak dimuat langsung dari Google Maps, yang tunduk pada kebijakan privasi Google sendiri saat peta tersebut dimuat di browser anda.
              </p>
            </Section>

            <Section title="6. Hak Anda">
              <p>Sesuai UU Pelindungan Data Pribadi, anda berhak untuk:</p>
              <ul className="ml-5 list-disc space-y-1">
                <li>Meminta salinan data pribadi anda yang kami simpan.</li>
                <li>Meminta koreksi data yang tidak akurat.</li>
                <li>Meminta penghapusan data pendaftaran anda dari sistem kami.</li>
                <li>Menarik persetujuan dan mengajukan keberatan atas penggunaan data anda.</li>
              </ul>
              <p>
                Untuk menggunakan hak-hak ini, hubungi kami lewat{" "}
                <a href={`mailto:${siteConfig.email}`} className="text-primary underline dark:text-primary-light">
                  {siteConfig.email}
                </a>{" "}
                atau telepon {siteConfig.phone}. Kami akan menindaklanjuti permintaan anda dalam waktu yang wajar.
              </p>
            </Section>

            <Section title="7. Perubahan Kebijakan Ini">
              <p>
                Kami dapat memperbarui kebijakan ini sewaktu-waktu mengikuti perubahan layanan di website. Versi terbaru akan selalu tersedia di halaman ini.
              </p>
            </Section>
          </div>
        </div>
      </section>
    </>
  );
}
