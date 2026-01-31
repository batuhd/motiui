import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, Github, Info, ExternalLink, X, MapPin, History, Heart, Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react';
import { MOTIFLER } from './data/motifler';
import type { Motif } from './data/motifler';

const liquidTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [seciliKategori, setSeciliKategori] = useState<string>("Hepsi");
  const [seciliMotif, setSeciliMotif] = useState<Motif | null>(null);
  const [activeVaryasyon, setActiveVaryasyon] = useState(0);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    if (!seciliMotif) setActiveVaryasyon(0);
  }, [seciliMotif]);

  const filtrelenmisMotifler = useMemo(() => {
    return MOTIFLER.filter(motif => {
      const aramaUyumu = motif.ad.toLowerCase().includes(searchQuery.toLowerCase()) ||
        motif.anlam.toLowerCase().includes(searchQuery.toLowerCase());
      const kategoriUyumu = seciliKategori === "Hepsi" || motif.kategori === seciliKategori;
      return aramaUyumu && kategoriUyumu;
    });
  }, [searchQuery, seciliKategori]);

  const sonrakiVaryasyon = () => {
    if (seciliMotif) {
      setActiveVaryasyon((prev) => (prev + 1) % seciliMotif.svgVaryasyonlari.length);
    }
  };

  const oncekiVaryasyon = () => {
    if (seciliMotif) {
      setActiveVaryasyon((prev) => (prev - 1 + seciliMotif.svgVaryasyonlari.length) % seciliMotif.svgVaryasyonlari.length);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] dark:bg-[#171717] text-stone-900 dark:text-stone-100 font-sans transition-colors duration-500 overflow-x-hidden">
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center border-b border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/70 backdrop-blur-md sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
          <img
            src="./motiui.png"
            alt="MotiUI Logo"
            className="w-11 h-11 object-contain hover:scale-110 transition-transform duration-300"
          />
          <h1 className="text-2xl font-serif font-bold text-teal-900 dark:text-teal-400 tracking-tight">MotiUI</h1>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative hidden md:block group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-teal-600 transition-colors" size={18} />
            <input
              type="text" placeholder="Motif ara..."
              className="pl-10 pr-4 py-2 bg-stone-100 dark:bg-stone-800 rounded-full border-none focus:ring-2 focus:ring-teal-500 outline-none w-64 text-sm dark:text-white shadow-inner"
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full bg-stone-100 dark:bg-stone-800 text-teal-700 dark:text-teal-400 transition-transform hover:scale-110">
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <a href="https://github.com/batuhd/motiui" target="_blank" className="text-stone-600 dark:text-stone-400 hover:text-teal-600"><Github size={24} /></a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="max-w-6xl mx-auto px-6 py-20 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-100/50 dark:bg-teal-900/20 text-teal-800 dark:text-teal-300 text-[10px] font-bold tracking-widest uppercase mb-8 border border-teal-200 dark:border-teal-800">
          <Info size={14} className="animate-pulse" /> Hala Geliştirilmektedir
        </motion.div>

        <h2 className="text-5xl md:text-8xl font-serif text-stone-800 dark:text-stone-100 leading-tight mb-12">
          Anadolu'nun Kodları: <br />
          <span className="italic font-normal text-teal-600 dark:text-teal-400 font-serif drop-shadow-sm">Türk Motifleri</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-3">
          {["Hepsi", "Ask", "Bereket", "Guc"].map((kat) => (
            <button key={kat} onClick={() => setSeciliKategori(kat)} className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all relative ${seciliKategori === kat ? "text-white scale-105" : "bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:border-teal-400 shadow-sm"}`}>
              <span className="relative z-10">{kat === "Ask" ? "❤️ Aşk" : kat}</span>
              {seciliKategori === kat && <motion.div layoutId="nav-pill" className="absolute inset-0 bg-teal-600 rounded-full" transition={liquidTransition} />}
            </button>
          ))}
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-6xl mx-auto px-6 pb-40">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          <AnimatePresence mode="wait">
            {filtrelenmisMotifler.map((motif) => (
              <motion.div
                key={motif.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -10 }}
                onClick={() => setSeciliMotif(motif)}
                className="bg-white dark:bg-stone-900 p-8 rounded-[3.5rem] shadow-sm border border-stone-100 dark:border-stone-800 cursor-pointer group hover:shadow-2xl transition-all duration-700 h-full flex flex-col"
              >
                <div className="h-48 bg-stone-50 dark:bg-stone-950 rounded-[2.5rem] mb-8 flex items-center justify-center overflow-hidden shrink-0 group-hover:bg-teal-50/50 dark:group-hover:bg-teal-900/10 transition-colors">
                  <svg viewBox="0 0 920 690" className="w-28 h-28 stroke-teal-700 dark:stroke-teal-400 fill-none stroke-[12] transition-transform duration-1000 group-hover:scale-110">
                    <g transform="translate(0,690) scale(1,-1)">
                      <path d={motif.svgVaryasyonlari[0]} strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  </svg>
                </div>
                <h3 className="text-3xl font-serif text-stone-800 dark:text-stone-100 mb-2">{motif.ad}</h3>
                <p className="text-stone-500 dark:text-stone-400 text-sm italic mb-8 flex-grow">"{motif.anlam}"</p>
                <div className="flex justify-between items-center pt-6 border-t border-stone-50 dark:border-stone-800">
                  <span className="text-[10px] bg-stone-100 dark:bg-stone-800 text-stone-400 px-3 py-1 rounded-lg font-bold uppercase tracking-widest">{motif.kategori}</span>
                  <div className="text-teal-700 dark:text-teal-400 text-sm font-bold flex items-center gap-1 group-hover:gap-3 transition-all">İncele <BookOpen size={18} /></div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* POPUP (MODAL) */}
      <AnimatePresence>
        {seciliMotif && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSeciliMotif(null)} className="absolute inset-0 bg-stone-900/60 dark:bg-black/80 backdrop-blur-xl" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-white/95 dark:bg-stone-900/95 w-full max-w-7xl max-h-[90vh] rounded-[4rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row z-10 border border-white/20 dark:border-stone-800"
            >
              <button onClick={() => setSeciliMotif(null)} className="absolute top-10 right-10 z-30 p-3 bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-100 rounded-full shadow-md hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors"><X size={24} /></button>

              {/* SOL TARAF: BÜYÜK BUTONLU SVG CAROUSEL */}
              <div className="lg:w-1/2 bg-stone-50/50 dark:bg-stone-950/50 p-8 lg:p-12 flex flex-col items-center justify-center border-r border-stone-100 dark:border-stone-800 relative shrink-0">
                <h4 className="absolute top-12 left-12 text-[10px] font-bold text-teal-600 uppercase tracking-[0.4em] mb-4">Motif Varyasyonu Geometrisi</h4>

                {/* Sol Buton */}
                <button onClick={oncekiVaryasyon} className="absolute left-8 top-1/2 -translate-y-1/2 p-5 rounded-full bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 shadow-2xl z-20 hover:scale-110 transition-transform active:scale-95 border border-stone-100 dark:border-stone-700">
                  <ChevronLeft size={36} />
                </button>

                {/* Büyük SVG Alanı */}
                <div className="w-full aspect-square max-w-[550px] flex items-center justify-center relative p-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeVaryasyon}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.4 }}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <svg viewBox="0 0 920 690" className="w-full h-full stroke-teal-800 dark:stroke-teal-400 fill-none stroke-[8]">
                        <g transform="translate(0,690) scale(1,-1)">
                          <path d={seciliMotif.svgVaryasyonlari[activeVaryasyon]} strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                      </svg>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Sağ Buton */}
                <button onClick={sonrakiVaryasyon} className="absolute right-8 top-1/2 -translate-y-1/2 p-5 rounded-full bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 shadow-2xl z-20 hover:scale-110 transition-transform active:scale-95 border border-stone-100 dark:border-stone-700">
                  <ChevronRight size={36} />
                </button>

                <div className="mt-8 flex gap-3">
                  {seciliMotif.svgVaryasyonlari.map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${activeVaryasyon === i ? "w-10 bg-teal-600" : "w-3 bg-stone-200 dark:bg-stone-800"}`} />
                  ))}
                </div>
              </div>

              {/* SAĞ TARAF: DETAYLAR */}
              <div className="lg:w-1/2 p-12 lg:p-24 overflow-y-auto bg-white dark:bg-stone-900">
                <h3 className="text-7xl font-serif text-stone-800 dark:text-stone-100 mb-8 leading-tight">{seciliMotif.ad}</h3>
                <p className="text-stone-600 dark:text-stone-400 text-2xl leading-relaxed mb-16 font-light">{seciliMotif.detay}</p>

                {/* Resim Örnekleri */}
                <div className="mb-16">
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-8 flex items-center gap-2"><History size={16} className="text-teal-600" /> Uygulama Alanları & Kanıtlar</h4>
                  <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x">
                    {seciliMotif.ornekler.map((img, i) => (
                      <div key={i} className="min-w-[320px] h-48 bg-stone-200 dark:bg-stone-800 rounded-[2.5rem] overflow-hidden snap-center flex-shrink-0 shadow-lg group/img">
                        <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110" onError={(e) => (e.currentTarget.src = "https://placehold.co/600x400/115e59/ffffff?text=Motif+Resmi")} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-10 border-t border-stone-200 dark:border-stone-800 flex flex-wrap gap-8 justify-between items-center">
                  <div className="flex flex-wrap gap-3">
                    {seciliMotif.kullanimAlanlari.map(a => <span key={a} className="px-5 py-2 bg-stone-100 dark:bg-stone-800 rounded-2xl text-[10px] font-bold text-stone-500 uppercase tracking-tighter shadow-sm"><MapPin size={12} className="inline mr-1 text-teal-600" /> {a}</span>)}
                  </div>
                  <a href={seciliMotif.kaynakUrl} target="_blank" className="bg-teal-700 text-white px-10 py-5 rounded-[2rem] font-bold flex items-center gap-2 hover:bg-teal-800 shadow-2xl shadow-teal-900/40 transition-all">Kaynağı Gör <ExternalLink size={20} /></a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="py-24 text-center">
        <p className="text-stone-400 dark:text-stone-600 text-[10px] font-bold uppercase tracking-[0.5em] mb-4">
          By Batuhd • Built in
          <a href="https://www.sinop.bel.tr/" target="_blank" className="hover:text-teal-600 transition-colors mx-1 underline underline-offset-8 decoration-teal-900/30">Sinop</a>
          with <Heart size={16} className="inline text-red-500 fill-red-500 animate-bounce mb-1" />
        </p>
      </footer>
    </div>
  );
}