// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Award, Lock, LogOut, CheckCircle2, Circle, ChevronDown, UserCheck } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

// ==========================================
// 1. DATA MURID (ANDA BOLEH TUKAR DI SINI)
// ==========================================
// Menambah fungsi .sort() di hujung senarai untuk susunan A-Z secara automatik
const SENARAI_MURID = [
  { id: 1, name: "ADAM BIN AHMAD FITRI", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1HnsdFLvVDH1v-r--pqHyzDNPUIflJpGX" },
  { id: 2, name: "ADELYA QAIREEN BINTI JEFF FAZEL", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1lTUNvfRv2qR54FKu13aATXrkVf1SDEEA" },
  { id: 3, name: "ARNY IDAYU BINTI ABDULLAH", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1TdYwRk_mKAb4aDPcZm8BhikjY1DTjMIP" },
  { id: 4, name: "AUZAIE ZHARFAN BIN ROZAIDI", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/17S0rcftSjrNQZ9uAJUEpy5lqiT_yLa3i" },
  { id: 5, name: "FATIMA ALIYSA BINTI RAZALI", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1UVqyqIOkNtuUg_W65DejLB67KD_1W-cv" },
  { id: 6, name: "FENNY FEI FREDDIE", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1jvuk3x0heVU_9sspIvHN63P_nCMA6t-o" },
  { id: 7, name: "HIDAYAH BINTI AJILUR", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1ZPptVj9zqP--XHNGFoGKioLukHA5WLM" },
  { id: 8, name: "THUD HASNAN BIN HASNAN", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1vF5Z9EtFxhrfFPXBy0Eyc70ue1w_L4QO" },
  { id: 9, name: "ISKANDAR SYUKUR BIN ABDULLAH", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1ADO_REWpzTpEIpzBQ9vBtMCT7i6_7FD6" },
  { id: 10, name: "IZZATY NUR AINNYESA BINTI MAHMUD SAH", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1Vonhz-BYy18bDt0I5gRlzxSPqoPvwpoh" },
  { id: 11, name: "KEYSHA NAAILA BINTI ZAIDIE", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1TdmBe_eFvujEl4eUuRrm661FHy1kK00b" },
  { id: 12, name: "NURUL HIDAYAH BINTI ADI SAPUTRA", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1ESBYpBoL4VLhX_zWNMrD6S7OUL3n-fFQ" },
  { id: 13, name: "NUR AYRA NAJAA SHAQEERA BINTI SUFHIAN", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1cXi2V1MAaEq8r7zuIRIJ0kwmvN-PWZrp" },
  { id: 14, name: "AIREN BINTI ABDULLAH", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1jeoC5ja0rh4M03lH3meuzt4COS_xA45V" },
  { id: 15, name: "AISYAH BINTI MOHAMAD HAFIZ", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1FDgfi5r8xAaKGa1Z5OO9QAIt47HNtip7" },
  { id: 16, name: "MUHAMAD SYAQIL DAIM BIN ABD NAIB", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1jX-VSD98UDV51XSZbNBPNQKk7uVZ5r3K" },
  { id: 17, name: "MUHAMMAD AZIZAN SYAZANI BIN ABDUL RAHMAN", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/15nuOdLLQhfO2Zq7IQxv-uXeQdxLGpVJb" },
  { id: 18, name: "ARYYANA ALLYANA BINTI ABDUL RASHID", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1w4OU7tLPtuSVNmYDTEvLwltAnu9GuP1I" },
  { id: 19, name: "Nur Syaza Aqeela Binti Jeffry", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1r2pwYTVqREFULA52EH1X7CGc9Pd4OYPA" },
  { id: 20, name: "NUR ALISHA HUMAIRA BINTI IRRUL FADIL", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1APUI-5vFk41FZHmWFc8e0pdth8yFTjyG" },
  { id: 21, name: "MUHAMMAD ABDUR RAHMAN BIN ARIZAL", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1CPinDpDBr9CFTjBTivpgNUvYUIT_WDTU" },
  { id: 22, name: "NUR ANNISA MUTIA BINTI ASMAN", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/10cJZyTwNo0dA4_pl5HjrzTotNkAOpsqf" },
  { id: 23, name: "Yusrina binti Done", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1JsOv0fxHm6sSrQzt4SSQKYxSeaBz_vnC" },
  { id: 24, name: "NURIZARA BATRISYA BINTI ABDULLAH", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1vOTSMo4NXKo-b-pZqcH1HeY-WOeM92-Z" },
  { id: 25, name: "SAFIYYA MEI BINTI MOHD SYAFIEE", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1O_J7CN2CYd4N-MHSYlmrmISr4Z4-yRBr" },
  { id: 26, name: "MOHAMAD AZLEEN BIN LEE", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1mQuYPZZ335Twb3JqJpkWb7OAoqYN-8BZ" },
  { id: 27, name: "Muhammad Adeeb Amsyar bin Junaidi", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1XiW4kaSa2y_JTHKkeD6s4vupRuTAAz0Y" },
  { id: 28, name: "MOHAMAD AZIQ PUTRA BIN BALI", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1o3TqxFRQ6NnNcWjY9auRIO96KGOBydca" },
  { id: 29, name: "MOHAMMED SYAHMI RIDHUAN BIN MOHAMMED SABRI", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1k_rsa7bEV41cVxwexj_GKyNE0M6txg48" },
  { id: 30, name: "MUHAMMAD ALIFF DANISH BIN ABD RAHMAN YUSMAN", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1rR0RbQ7KgSIzn5fN93c1zlfI5G2uEo6W" },
  { id: 31, name: "MUHAMMAD NUR FAHMI BIN MOHD NIZAM", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1tHB037nZebOL1byjD19zhGfUVRKG47hj" },
  { id: 32, name: "NUR AISHA RAMADHANI BINTI MOHD RAZLAN", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1zbW4iURQSLmBWQZBExuKB6bjjHB3nn6k" },
  { id: 33, name: "RAFIF BIN MOHD RIZAL", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1tr3nb-oioFmPCttZaTMnYAVKui8A5OjR" },
  { id: 34, name: "RIZQ ARYAN BIN MOHD AIZATULLAH", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1o83hbqGCoJx9sXuMdjloGKj9ufdSZdSf" },
  { id: 35, name: "SARRAH AIN SYAZWANNA BINTI SIKAN", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1z7qUy9RjZ0n9IZFPJK5npksmh9ahOwlR" },
  { id: 36, name: "SITI KHADIJAH BINTI NILSON", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1MprZGda9ps5Rr-sG3rRLs7SUKYyw9xva" },
  { id: 37, name: "ZAHARA BINTI ABDULLAH", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1UBvfwB9rWri_K2-Y2RWMWiRIWegfz2_M" },
  { id: 38, name: "NUR QAYRA MEQAILA BINTI HARIZUL RAHIM", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1k8pGlB5uGRWAzb7NZNltpAPGv1bmwmy5" },
  { id: 39, name: "THADDEUS JAIDI", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/1PLImMvkkMBnTNdA23_czPR-h2Yj4W-nj" },
  { id: 40, name: "INAYA RAFFA BINTI AHMAD SHAH", kelas: "5 UNIK", image: "https://lh3.googleusercontent.com/d/16ieYYqCCWA10Y1P9MhxkUxbXDm_tsWtd" }
].sort((a, b) => a.name.localeCompare(b.name));

const SENARAI_BULAN = [
  "Januari", "Februari", "Mac", "April", "Mei", "Jun", 
  "Julai", "Ogos", "September", "Oktober", "November", "Disember"
];

// Kata laluan untuk admin (Boleh ditukar)
const KATA_LALUAN_ADMIN = "admin123";

// Konfigurasi Pangkalan Data Awan (Firebase) Cikgu
const firebaseConfig = {
  apiKey: "AIzaSyDnKsZ9CMs4ub1xOQcQT3t1Ub_VvspKqec",
  authDomain: "kehadiran-5-unik-58e22.firebaseapp.com",
  projectId: "kehadiran-5-unik-58e22",
  storageBucket: "kehadiran-5-unik-58e22.firebasestorage.app",
  messagingSenderId: "400426796877",
  appId: "1:400426796877:web:417f208ae58ce100175904"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export default function App() {
  // Masukkan Google Fonts untuk mengekalkan rekaan Premium
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,600&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // State Pengurusan
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  
  const [selectedMonth, setSelectedMonth] = useState("Januari");
  
  // State untuk Firebase dan Rekod Kehadiran
  const [user, setUser] = useState(null);
  const [rekodKehadiran, setRekodKehadiran] = useState({});

  // 1. Pengesahan Pangkalan Data (Auth)
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Hanya guna Anonymous Login untuk Firebase cikgu
        await signInAnonymously(auth);
      } catch (error) {
        console.error("Ralat log masuk pangkalan data:", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // 2. Tarik Data Terkini dari Awan (Real-time)
  useEffect(() => {
    if (!user) return;
    
    // Kita guna pangkalan data cikgu
    const docRef = doc(db, 'artifacts', 'kehadiran-5-unik', 'public', 'data', 'kehadiran_bulanan', 'rekod_utama');
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setRekodKehadiran(docSnap.data());
      } else {
        setRekodKehadiran({}); // Kosong jika tiada data
      }
    }, (error) => {
      console.error("Ralat mengambil data:", error);
    });

    return () => unsubscribe();
  }, [user]);

  // Fungsi Log Masuk Admin
  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === KATA_LALUAN_ADMIN) {
      setIsAdmin(true);
      setShowLogin(false);
      setLoginError(false);
      setPasswordInput("");
    } else {
      setLoginError(true);
    }
  };

  // Fungsi Log Keluar
  const handleLogout = () => {
    setIsAdmin(false);
  };

  // Fungsi untuk Admin tick/untick pelajar dan Simpan ke Awan
  const toggleKehadiran = async (muridId) => {
    if (!isAdmin || !user) return;

    const currentMonthRecords = rekodKehadiran[selectedMonth] || [];
    const isAlreadyTicked = currentMonthRecords.includes(muridId);
    
    let newRecords;
    if (isAlreadyTicked) {
      newRecords = currentMonthRecords.filter(id => id !== muridId); // Buang tick
    } else {
      newRecords = [...currentMonthRecords, muridId]; // Tambah tick
    }
    
    const dataBaru = { ...rekodKehadiran, [selectedMonth]: newRecords };
    
    // Kemaskini di skrin serta-merta
    setRekodKehadiran(dataBaru);

    // Hantar dan simpan data ke Pangkalan Data Awan Cikgu
    const docRef = doc(db, 'artifacts', 'kehadiran-5-unik', 'public', 'data', 'kehadiran_bulanan', 'rekod_utama');
    try {
      await setDoc(docRef, dataBaru, { merge: true });
    } catch (error) {
      console.error("Ralat menyimpan rekod:", error);
    }
  };

  // Gaya Font
  const fontPlayfair = { fontFamily: "'Playfair Display', serif" };
  const fontInter = { fontFamily: "'Inter', sans-serif" };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800" style={fontInter}>
      {/* --- CORAK LATAR BELAKANG HALUS --- */}
      <div className="fixed inset-0 pointer-events-none z-0" 
           style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
      </div>

      {/* --- NAVIGASI ATAS --- */}
      <nav className="relative z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="font-bold text-slate-800 flex items-center gap-2" style={fontPlayfair}>
          <Award className="text-amber-500" size={24} />
          <span>Sistem Sijil HEM</span>
        </div>
        
        {!isAdmin ? (
          <button 
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Lock size={16} /> Log Masuk Admin
          </button>
        ) : (
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 transition-colors bg-red-50 px-3 py-1.5 rounded-full"
          >
            <LogOut size={16} /> Log Keluar
          </button>
        )}
      </nav>

      {/* --- MODAL LOG MASUK ADMIN --- */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setShowLogin(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700">✕</button>
            <div className="text-center mb-6">
              <div className="inline-flex bg-slate-100 p-3 rounded-full mb-3 text-slate-600">
                <Lock size={28} />
              </div>
              <h2 className="text-xl font-bold" style={fontPlayfair}>Akses Pentadbir</h2>
              <p className="text-sm text-slate-500 mt-1">Sila masukkan kata laluan untuk mengurus senarai</p>
            </div>
            
            <form onSubmit={handleLogin}>
              <input 
                type="password" 
                placeholder="Kata Laluan" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
              {loginError && <p className="text-red-500 text-xs mb-4 text-center">Kata laluan salah. Sila cuba lagi. (Tip: admin123)</p>}
              <button type="submit" className="w-full bg-slate-900 text-white rounded-lg px-4 py-3 font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                Log Masuk
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- KANDUNGAN UTAMA --- */}
      <main className="relative z-10 max-w-6xl mx-auto p-4 sm:p-8">
        
        {/* Header Bersama (Public & Admin) */}
        <div className="text-center mb-12 pt-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-amber-100 to-amber-50 mb-6 shadow-sm border border-amber-200/50 text-amber-500">
             <Award size={36} />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 tracking-tight" style={fontPlayfair}>
             {isAdmin ? 'Pengurusan Kehadiran' : 'Anugerah Kehadiran'}
          </h1>
          
          {/* Filter Bulan */}
          <div className="flex flex-col items-center justify-center mt-6">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Pilih Bulan</label>
            <div className="relative inline-block">
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="appearance-none bg-white border border-slate-200 text-slate-700 py-3 pl-6 pr-12 rounded-full font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer text-lg"
              >
                {SENARAI_BULAN.map(bulan => (
                  <option key={bulan} value={bulan}>{bulan} 2026</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
            </div>
          </div>
        </div>

        {/* --- PAPARAN ADMIN (TICK NAMA) --- */}
        {isAdmin ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-4 px-6 flex justify-between items-center">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <UserCheck size={18} className="text-amber-500"/> Senarai Semua Murid
              </h2>
              <span className="text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                {rekodKehadiran[selectedMonth]?.length || 0} Terpilih
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {SENARAI_MURID.map((murid) => {
                const isSelected = (rekodKehadiran[selectedMonth] || []).includes(murid.id);
                return (
                  <div 
                    key={murid.id} 
                    onClick={() => toggleKehadiran(murid.id)}
                    className={`flex items-center justify-between p-4 px-6 cursor-pointer hover:bg-slate-50 transition-colors ${isSelected ? 'bg-amber-50/30' : ''}`}
                  >
                    <div className="flex items-center gap-4">
                      <img src={murid.image} alt={murid.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" />
                      <div>
                        <h3 className="font-semibold text-slate-800" style={fontPlayfair}>{murid.name}</h3>
                        <p className="text-xs text-slate-500">{murid.kelas}</p>
                      </div>
                    </div>
                    <div>
                      {isSelected ? (
                        <CheckCircle2 className="text-amber-500" size={28} />
                      ) : (
                        <Circle className="text-slate-300" size={28} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : 
        /* --- PAPARAN IBU BAPA (KAD PREMIUM) --- */
        (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {SENARAI_MURID
              .filter(murid => (rekodKehadiran[selectedMonth] || []).includes(murid.id))
              .map((murid) => (
              <div key={murid.id} className="relative group bg-white rounded-2xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.1)] transition-all duration-500 border border-slate-100 hover:-translate-y-1">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl"></div>
                
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-amber-200 via-yellow-400 to-amber-500 shadow-md transition-transform duration-500 group-hover:scale-105">
                      <img src={murid.image} alt={murid.name} className="w-full h-full rounded-full object-cover border-4 border-white bg-slate-50" />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 text-amber-400 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-slate-700 whitespace-nowrap tracking-wider">
                      100% HADIR
                    </div>
                  </div>
                  <h3 className="mt-8 text-xl font-bold text-slate-900 text-center" style={fontPlayfair}>{murid.name}</h3>
                  <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mt-2 text-center">{murid.kelas}</p>
                </div>
              </div>
            ))}

            {/* Jika tiada murid dipilih untuk bulan tersebut */}
            {(!rekodKehadiran[selectedMonth] || rekodKehadiran[selectedMonth].length === 0) && (
              <div className="col-span-full text-center py-16 bg-white/50 rounded-2xl border border-slate-200 border-dashed">
                <Award className="mx-auto text-slate-300 mb-4" size={48} />
                <h3 className="text-xl text-slate-500" style={fontPlayfair}>Senarai penerima anugerah belum dikemaskini.</h3>
                <p className="text-slate-400 mt-2 text-sm">Sila semak semula nanti.</p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-20 border-t border-slate-200/60 pt-8 text-center pb-8">
            <p className="text-slate-400 text-sm font-light">
                Disediakan oleh <span className="text-slate-600 font-medium">Unit Hal Ehwal Murid (HEM)</span>
            </p>
            <p className="text-slate-400 text-xs mt-1">Sesi Persekolahan 2026</p>
        </div>

      </main>
    </div>
  );
}