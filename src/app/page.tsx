import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroGate from '@/components/HeroGate';
import Marquee from '@/components/Marquee';
import TurnstileDemo from '@/components/TurnstileDemo';
import LatencyChart from '@/components/LatencyChart';
import FlowDiagram from '@/components/FlowDiagram';
import PriceCalculator from '@/components/PriceCalculator';
import ScrollReveal from '@/components/ScrollReveal';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="land" style={{ display: 'block' }}>
        <div className="wrap hero">
          <div>
            <h1>
              Tantangan masuk, <em>token</em> keluar.
            </h1>
            <p>
              Antarmuka solver Cloudflare Turnstile dengan API sederhana,
              antrean real-time, dan latensi rata-rata di bawah dua detik.
            </p>
            <div className="row">
              <Link className="btn" href="/dokumentasi">
                Baca dokumentasi →
              </Link>
              <a className="btn g" href="#demo">
                Coba demo
              </a>
            </div>
          </div>
          <HeroGate />
        </div>

        <Marquee />

        <section className="s wrap two" id="demo">
          <div className="rv">
            <h2>Rasakan satu putaran gerbang.</h2>
            <p className="sub">
              Klik widget untuk mengirim verifikasi langsung ke solver backend
              Railway dan menerima token Cloudflare valid secara real-time.
            </p>
          </div>
          <TurnstileDemo />
        </section>

        <section className="s wrap two">
          <LatencyChart />
        </section>

        <section className="s wrap">
          <h2 className="rv" style={{ maxWidth: '20ch' }}>
            Tiga langkah, satu jalur.
          </h2>
          <FlowDiagram />
        </section>

        <section className="s wrap two">
          <div className="rv">
            <h2>Bayar sesuai putaran.</h2>
            <p className="sub">
              Geser untuk melihat estimasi biaya bulanan sesuai beban request Anda.
            </p>
          </div>
          <PriceCalculator />
        </section>

        <div className="wrap cta rv">
          <h2>Buka gerbangnya.</h2>
          <Link className="btn" href="/dokumentasi">
            Lihat dokumentasi →
          </Link>
        </div>

        <Footer />
      </main>
      <ScrollReveal />
    </>
  );
}
