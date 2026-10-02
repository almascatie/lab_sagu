// src/components/LatarLab.tsx
// Latar laboratorium sagu, digambar penuh dengan SVG (tanpa gambar, tanpa karakter).
// Ukuran dasar 1536x864, otomatis menutup layar (seperti background-size: cover).
// Tambahan: teduh hijau di tepi kiri/kanan (agar ikon sidebar jelas) + judul "Sagu Innovation Lab".

type TanamanProps = { x: number; y: number; s?: number; hijau?: string; pot?: string }

function Tanaman({ x, y, s = 1, hijau = '#5f9a4a', pot = '#c9824f' }: TanamanProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="lab-sway">
        {[-62, -38, -14, 12, 36, 60].map((a, i) => (
          <ellipse
            key={a}
            cx={0}
            cy={-30 - (i % 2) * 6}
            rx={9}
            ry={32 + (i % 3) * 5}
            transform={`rotate(${a} 0 0)`}
            fill={i % 2 ? hijau : '#4a8a3e'}
          />
        ))}
      </g>
      <path d="M-24 0 L24 0 L18 38 L-18 38 Z" fill={pot} />
      <rect x={-26} y={-4} width={52} height={8} rx={3} fill="#d9946025" />
    </g>
  )
}

type TopleProps = { x: number; y: number; w?: number; h?: number; isi: string; ket?: string }

function Toples({ x, y, w = 56, h = 92, isi, ket = '#c28a52' }: TopleProps) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={4} y={-12} width={w - 8} height={14} rx={3} fill={ket} />
      <rect x={0} y={0} width={w} height={h} rx={9} fill="#e9eef5" fillOpacity={0.75} stroke="#cdd6e3" strokeWidth={2} />
      <path
        d={`M3 ${h * 0.32} Q${w / 2} ${h * 0.26} ${w - 3} ${h * 0.32} L${w - 3} ${h - 9} Q${w - 3} ${h - 3} ${w - 9} ${h - 3} L${9} ${h - 3} Q3 ${h - 3} 3 ${h - 9} Z`}
        fill={isi}
      />
      <rect x={8} y={10} width={6} height={h - 24} rx={3} fill="#fff" fillOpacity={0.45} />
    </g>
  )
}

function Botol({ x, y, w = 26, h = 70, warna = '#dfe6f0', tutup = '#8fa3c4' }: { x: number; y: number; w?: number; h?: number; warna?: string; tutup?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={w * 0.3} y={-10} width={w * 0.4} height={12} rx={2} fill={tutup} />
      <rect x={0} y={0} width={w} height={h} rx={7} fill={warna} stroke="#c3cddc" strokeWidth={1.5} />
    </g>
  )
}

function Gelas({ x, y, w, h, cairan }: { x: number; y: number; w: number; h: number; cairan?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {cairan && <rect x={3} y={h * 0.4} width={w - 6} height={h * 0.6 - 3} fill={cairan} />}
      <rect x={0} y={0} width={w} height={h} rx={4} fill="#ffffff" fillOpacity={0.35} stroke="#b9c6d8" strokeWidth={2} />
      <rect x={6} y={6} width={4} height={h - 14} rx={2} fill="#fff" fillOpacity={0.6} />
    </g>
  )
}

export function LatarLab({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1536 864"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    >
      <style>{`
        .lab-sway { transform-box: fill-box; transform-origin: 50% 100%; animation: labSway 7s ease-in-out infinite; }
        .lab-sway-b { animation-duration: 9s; animation-delay: -3s; }
        .lab-beam { animation: labBeam 10s ease-in-out infinite; }
        .lab-debu { animation: labDebu 12s ease-in-out infinite; }
        @keyframes labSway { 0%,100% { transform: rotate(-1.6deg); } 50% { transform: rotate(1.6deg); } }
        @keyframes labBeam { 0%,100% { opacity: .55; } 50% { opacity: .8; } }
        @keyframes labDebu { 0%,100% { transform: translate(0,0); opacity: .0; } 30% { opacity: .8; } 100% { transform: translate(24px,-46px); opacity: 0; } }
        @media (prefers-reduced-motion: reduce) { .lab-sway, .lab-beam, .lab-debu { animation: none; } }
      `}</style>

      <defs>
        <linearGradient id="ll-dinding" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f6ecd8" />
          <stop offset="0.45" stopColor="#eceef5" />
          <stop offset="1" stopColor="#dfe3ee" />
        </linearGradient>
        <linearGradient id="ll-sinar" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff6d6" stopOpacity="0.85" />
          <stop offset="1" stopColor="#fff6d6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ll-langit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#bfe0f5" />
          <stop offset="1" stopColor="#e9f3dc" />
        </linearGradient>
        <linearGradient id="ll-meja" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbfaf7" />
          <stop offset="1" stopColor="#e6e8ee" />
        </linearGradient>

        {/* Teduh hijau tepi kiri & kanan (agar ikon sidebar lebih jelas) */}
        <linearGradient id="ll-hijau-kiri" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#2f6b3a" stopOpacity="0.62" />
          <stop offset="0.6" stopColor="#4f8f4a" stopOpacity="0.28" />
          <stop offset="1" stopColor="#6aa94c" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ll-hijau-kanan" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#2f6b3a" stopOpacity="0.62" />
          <stop offset="0.6" stopColor="#4f8f4a" stopOpacity="0.28" />
          <stop offset="1" stopColor="#6aa94c" stopOpacity="0" />
        </linearGradient>

        <filter id="ll-buram" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id="ll-buram-kecil" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.4" />
        </filter>
      </defs>

      {/* ===== DINDING ===== */}
      <rect width="1536" height="864" fill="url(#ll-dinding)" />

      {/* ===== JUDUL DINDING ===== */}
      <g textAnchor="middle" style={{ pointerEvents: 'none' }}>
        <text
          x="800"
          y="212"
          fontSize="96"
          fontWeight="700"
          fill="#3f6b2f"
          style={{ fontFamily: "'Caveat','Patrick Hand','Comic Sans MS',cursive" }}
        >
          Sagu
        </text>
        <text
          x="800"
          y="262"
          fontSize="46"
          fontWeight="600"
          fill="#5a3a22"
          style={{ fontFamily: "'Caveat','Patrick Hand','Comic Sans MS',cursive" }}
        >
          Innovation Lab
        </text>
        <path d="M700 280 Q800 270 900 280" stroke="#d9a441" strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* daun kecil */}
        <path d="M900 180 Q912 160 930 158 Q926 178 900 180 Z" fill="#5f9a4a" />
        <path d="M900 180 Q892 164 880 160 Q880 176 900 180 Z" fill="#7ab356" />
      </g>

      {/* ===== JENDELA KIRI ===== */}
      <g>
        <rect x="0" y="0" width="178" height="470" fill="url(#ll-langit)" />
        <circle cx="40" cy="110" r="90" fill="#7fb35a" opacity="0.8" />
        <circle cx="120" cy="60" r="80" fill="#6aa34c" opacity="0.85" />
        <circle cx="60" cy="280" r="100" fill="#8dbb62" opacity="0.7" />
        <circle cx="140" cy="230" r="70" fill="#a3c97a" opacity="0.7" />
        <rect x="68" y="0" width="14" height="470" fill="#c98c4c" />
        <rect x="0" y="150" width="178" height="12" fill="#c98c4c" />
        <rect x="166" y="0" width="14" height="470" fill="#b97a3c" />
        <path d="M0 0 L178 130 L178 20 L100 0 Z" fill="#ffffff" opacity="0.18" />
      </g>

      {/* ===== POSTER KIRI: POHON SAGU ===== */}
      <g>
        <rect x="265" y="98" width="257" height="302" rx="4" fill="#f4efe6" stroke="#ddd6c8" strokeWidth="2" />
        <g stroke="#3f6b4a" strokeWidth="2.2" fill="none" strokeLinecap="round">
          <path d="M352 360 C350 300 352 240 350 190" strokeWidth="5" />
          {[-70, -48, -26, 26, 48, 70].map((a) => (
            <path key={a} d="M350 190 C350 150 380 135 420 150" transform={`rotate(${a} 350 190)`} />
          ))}
          {[-60, -35, 35, 60].map((a) => (
            <path key={a} d="M350 190 C350 160 372 150 396 156" transform={`rotate(${a} 350 190) translate(0 -14)`} />
          ))}
          <path d="M330 360 H372" />
        </g>
        <path d="M385 330 C395 300 420 296 432 306 C410 306 398 318 385 330 Z" fill="#6d9a55" stroke="#3f6b4a" strokeWidth="1.5" />
        <g>
          <circle cx="478" cy="208" r="32" fill="#faf7f0" stroke="#4d7a58" strokeWidth="2" />
          <rect x="460" y="195" width="36" height="26" rx="3" fill="#e0b57a" />
          <rect x="460" y="195" width="36" height="9" rx="3" fill="#efcf9c" />
          <circle cx="478" cy="276" r="32" fill="#faf7f0" stroke="#4d7a58" strokeWidth="2" />
          <g stroke="#d98a2b" strokeWidth="3" strokeLinecap="round">
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={i} x1="478" y1="276" x2={478 + 20 * Math.cos((i * Math.PI) / 5)} y2={276 + 20 * Math.sin((i * Math.PI) / 5)} />
            ))}
          </g>
          <circle cx="478" cy="276" r="6" fill="#f0b45a" />
          <circle cx="478" cy="344" r="32" fill="#faf7f0" stroke="#4d7a58" strokeWidth="2" />
          <path d="M452 356 Q478 318 504 356 Z" fill="#ffffff" stroke="#e3e3e3" />
        </g>
        <g fill="#d8d2c6">
          <rect x="437" y="120" width="60" height="5" rx="2" />
          <rect x="437" y="131" width="40" height="5" rx="2" />
        </g>
      </g>

      {/* ===== POSTER KANAN: MOLEKUL ===== */}
      <g>
        <rect x="1085" y="106" width="240" height="272" rx="4" fill="#f4efe6" stroke="#ddd6c8" strokeWidth="2" />
        <g stroke="#3b5f8a" strokeWidth="2" fill="#f4efe6">
          <path d="M1147 190 L1147 230 M1147 230 L1115 250 M1147 230 L1180 250 M1147 190 L1147 160" fill="none" />
          <rect x="1131" y="214" width="32" height="32" transform="rotate(45 1147 230)" />
          <circle cx="1147" cy="154" r="8" />
          <circle cx="1108" cy="194" r="8" />
          <circle cx="1189" cy="194" r="8" />
          <circle cx="1147" cy="270" r="8" />
        </g>
        <circle cx="1252" cy="240" r="46" fill="#faf7f0" stroke="#4d7a58" strokeWidth="2" />
        <path d="M1252 262 C1230 250 1232 224 1252 214 C1272 224 1274 250 1252 262 Z" fill="#5f9a4a" />
        <path d="M1252 260 V220" stroke="#faf7f0" strokeWidth="2" />
        <g stroke="#3b5f8a" strokeWidth="2" fill="none">
          <path d="M1124 322 L1147 308 L1170 322" />
          <path d="M1120 340 L1147 324 L1174 340 L1174 366 L1147 380 L1120 366 Z" transform="translate(0 -6) scale(1 0.8) translate(0 70)" />
        </g>
        <g fill="#d8d2c6">
          <rect x="1214" y="126" width="84" height="5" rx="2" />
          <rect x="1214" y="138" width="60" height="5" rx="2" />
          <rect x="1214" y="150" width="76" height="5" rx="2" />
          <rect x="1210" y="316" width="86" height="5" rx="2" />
          <rect x="1210" y="332" width="70" height="5" rx="2" />
          <rect x="1210" y="348" width="80" height="5" rx="2" />
        </g>
      </g>

      {/* ===== LAMPU GANTUNG ===== */}
      <g>
        <line x1="1020" y1="0" x2="1020" y2="-10" stroke="#8a93a6" />
        <rect x="964" y="0" width="338" height="34" rx="4" fill="#4a5878" />
        <rect x="974" y="22" width="318" height="10" rx="3" fill="#fff6dc" />
      </g>

      {/* ===== RAK KANAN ===== */}
      <g>
        <rect x="1448" y="0" width="88" height="600" fill="#f1f1f5" />
        <rect x="1448" y="150" width="88" height="8" fill="#d9dce6" />
        <rect x="1448" y="320" width="88" height="8" fill="#d9dce6" />
        <rect x="1448" y="470" width="88" height="8" fill="#d9dce6" />
        <rect x="1476" y="70" width="34" height="80" rx="3" fill="#3a63a8" />
        <rect x="1516" y="62" width="30" height="88" rx="3" fill="#2f55a0" />
        <rect x="1470" y="226" width="40" height="94" rx="3" fill="#3a63a8" />
        <rect x="1512" y="196" width="26" height="124" rx="3" fill="#cbd5e6" />
        <rect x="1494" y="266" width="22" height="30" rx="3" fill="#c98c4c" />
        <Botol x={1456} y={400} w={30} h={70} />
        <Botol x={1500} y={384} w={30} h={86} warna="#e6ecf6" />
        <rect x="1466" y="332" width="20" height="40" rx="3" fill="#c98c4c" />
        <Botol x={1496} y={340} w={26} h={64} />
      </g>

      {/* ===== SULUR GANTUNG ===== */}
      <g className="lab-sway lab-sway-b" style={{ transformOrigin: '1430px 0px' }}>
        <path d="M1432 0 C1424 80 1444 150 1430 230 C1420 290 1436 340 1426 400" stroke="#4f8a3e" strokeWidth="3" fill="none" />
        {Array.from({ length: 13 }).map((_, i) => {
          const y = 20 + i * 30
          const kiri = i % 2 === 0
          const x = 1432 + Math.sin(i * 0.9) * 8
          return (
            <ellipse
              key={i}
              cx={x + (kiri ? -14 : 14)}
              cy={y}
              rx="14"
              ry="9"
              transform={`rotate(${kiri ? -35 : 35} ${x} ${y})`}
              fill={i % 3 ? '#5f9a4a' : '#7ab356'}
            />
          )
        })}
      </g>

      {/* ===== LEMARI & ALAT BELAKANG ===== */}
      <g>
        <rect x="1170" y="380" width="170" height="214" fill="#e4e6ee" />
        <rect x="1180" y="392" width="72" height="62" fill="#d4d6e0" />
        <rect x="1260" y="392" width="30" height="72" fill="#c9cddb" />
        <rect x="1296" y="392" width="30" height="62" fill="#e2c9a0" />
        <rect x="1122" y="390" width="40" height="30" fill="#e9dca8" opacity="0.8" />
        <rect x="1130" y="374" width="22" height="24" fill="#eee2b0" opacity="0.8" />
      </g>

      {/* ===== SINAR MATAHARI ===== */}
      <g className="lab-beam">
        <polygon points="178,0 520,0 1100,640 560,640" fill="url(#ll-sinar)" opacity="0.7" />
        <polygon points="0,150 178,130 760,700 420,720" fill="url(#ll-sinar)" opacity="0.35" />
      </g>

      {/* ===== MEJA BELAKANG ===== */}
      <g>
        <rect x="430" y="592" width="1100" height="20" fill="url(#ll-meja)" />
        <rect x="430" y="612" width="1100" height="136" fill="#c4cadb" />
        <g stroke="#b3bace" strokeWidth="2">
          <line x1="640" y1="612" x2="640" y2="748" />
          <line x1="860" y1="612" x2="860" y2="748" />
          <line x1="1080" y1="612" x2="1080" y2="748" />
          <line x1="1300" y1="612" x2="1300" y2="748" />
        </g>
        <g fill="#a9b2c8">
          <rect x="560" y="660" width="40" height="5" rx="2" />
          <rect x="780" y="660" width="40" height="5" rx="2" />
          <rect x="1000" y="660" width="40" height="5" rx="2" />
          <rect x="1220" y="660" width="40" height="5" rx="2" />
        </g>

        {/* peralatan di meja belakang */}
        <g filter="url(#ll-buram-kecil)">
          <Tanaman x={523} y={540} s={0.7} />
          <Tanaman x={630} y={510} s={0.9} hijau="#6aa94c" />
          <rect x="404" y="428" width="24" height="64" rx="3" fill="#d6dae6" transform="translate(0 100)" />
          <rect x="436" y="428" width="24" height="64" rx="3" fill="#cdd2e0" transform="translate(0 100)" />
          <rect x="468" y="438" width="24" height="54" rx="3" fill="#e1e4ee" transform="translate(0 100)" />
          <Botol x={682} y={500} w={32} h={92} />
          <Botol x={900} y={512} w={24} h={80} warna="#e8edf6" />
          <Botol x={936} y={510} w={20} h={82} warna="#eceff6" />
          <Botol x={966} y={520} w={22} h={72} />
          <Botol x={1000} y={496} w={34} h={96} warna="#e9eef7" />
          <rect x="1068" y="536" width="22" height="56" rx="3" fill="#d6dae6" />
          <Gelas x={1236} y={534} w={30} h={58} cairan="#b7d9f2" />
          <rect x="1284" y="560" width="60" height="32" rx="3" fill="#2f5b9a" />
        </g>

        {/* mikroskop */}
        <g transform="translate(1100 592)">
          <ellipse cx="0" cy="0" rx="46" ry="8" fill="#2c2f3a" />
          <rect x="-8" y="-84" width="16" height="84" rx="6" fill="#d9dbe4" />
          <path d="M8 -90 C46 -80 50 -30 20 -12" stroke="#d9dbe4" strokeWidth="14" fill="none" strokeLinecap="round" />
          <rect x="-16" y="-124" width="22" height="58" rx="8" fill="#eceef4" transform="rotate(-18 0 -90)" />
          <rect x="-38" y="-40" width="52" height="8" rx="3" fill="#8e94a8" />
        </g>
      </g>

      {/* ===== MEJA DEPAN ===== */}
      <g>
        <path d="M0 748 L1536 748 L1536 864 L0 864 Z" fill="url(#ll-meja)" />
        <rect x="0" y="742" width="1536" height="12" fill="#ffffff" />
        <rect x="0" y="754" width="1536" height="3" fill="#d7dbe6" />
      </g>

      {/* ===== BATANG SAGU & KERANJANG (KIRI) ===== */}
      <g>
        <g className="lab-sway lab-sway-b">
          {[-60, -38, -16, 8, 30, 54].map((a, i) => (
            <path
              key={a}
              d="M180 740 C170 660 180 600 210 566 C232 610 226 680 190 740 Z"
              transform={`rotate(${a} 180 740)`}
              fill={i % 2 ? '#3f8a3a' : '#2f7a34'}
            />
          ))}
        </g>
        {/* batang */}
        <g transform="translate(-10 520) rotate(18 70 90)">
          <rect x="0" y="40" width="190" height="140" rx="60" fill="#8a5a38" />
          <ellipse cx="38" cy="110" rx="46" ry="62" fill="#e6c79d" />
          <ellipse cx="38" cy="110" rx="34" ry="48" fill="none" stroke="#caa273" strokeWidth="2" />
          <ellipse cx="38" cy="110" rx="22" ry="32" fill="none" stroke="#caa273" strokeWidth="2" />
          <ellipse cx="38" cy="110" rx="10" ry="15" fill="#d4af7e" />
        </g>
        {/* keranjang pati */}
        <g>
          <path d="M92 706 Q92 760 150 764 Q212 764 214 706 Z" fill="#b97a3c" />
          <path d="M92 706 H214" stroke="#9b6230" strokeWidth="5" />
          <path d="M98 706 Q150 650 208 706 Z" fill="#ffffff" />
          <path d="M120 704 Q150 676 190 704" fill="#eef0f4" />
          <path d="M196 724 Q196 770 270 774 Q356 774 376 724 Z" fill="#bf803f" />
          <path d="M196 724 H376" stroke="#9b6230" strokeWidth="5" />
          <path d="M204 724 Q284 658 370 724 Z" fill="#ffffff" />
          <path d="M240 720 Q284 686 340 720" fill="#eceff4" />
        </g>
        <g stroke="#b88a52" strokeWidth="2" opacity="0.7" fill="none">
          <path d="M60 770 Q120 750 190 768" />
          <path d="M40 780 Q110 764 170 780" />
        </g>
      </g>

      {/* ===== ALAT KACA & PAPAN RACIK (TENGAH) ===== */}
      <g>
        {/* botol kecil + gelas */}
        <g>
          <rect x="462" y="736" width="44" height="44" rx="6" fill="#e8e6e0" stroke="#d1cec6" />
          <rect x="470" y="720" width="28" height="18" rx="4" fill="#d9d6ce" />
          <Gelas x={506} y={690} w={60} h={80} cairan="#dfeaf7" />
          <Gelas x={534} y={704} w={36} h={66} />
        </g>
        {/* buku catatan */}
        <rect x="570" y="744" width="108" height="20" rx="3" fill="#f2f0ea" stroke="#cfcabd" transform="rotate(-2 624 754)" />
        <rect x="584" y="748" width="82" height="3" rx="1.5" fill="#bfb9a8" transform="rotate(-2 624 754)" />
        {/* papan kayu + mangkuk kaca */}
        <rect x="700" y="744" width="260" height="38" rx="6" fill="#ecd3a3" />
        <rect x="700" y="744" width="260" height="10" rx="5" fill="#f6e4be" />
        <g>
          <ellipse cx="832" cy="726" rx="72" ry="22" fill="#ffffff" fillOpacity="0.4" stroke="#b9c8d9" strokeWidth="3" />
          <path d="M762 726 Q764 764 832 766 Q902 764 902 726" fill="#ffffff" fillOpacity="0.35" stroke="#b9c8d9" strokeWidth="3" />
          <path d="M790 730 Q808 704 840 712 Q866 706 876 730 Q850 748 810 746 Z" fill="#f4eee0" />
          <path d="M800 728 Q820 716 846 722" stroke="#e1d8c2" strokeWidth="3" fill="none" />
          <path d="M770 718 Q790 706 812 712" stroke="#fff" strokeWidth="3" fill="none" opacity="0.8" />
        </g>
        {/* kilau ajaib */}
        <g stroke="#f0cf5c" strokeWidth="3" strokeLinecap="round" opacity="0.9">
          <line x1="868" y1="662" x2="872" y2="676" />
          <line x1="900" y1="676" x2="888" y2="684" />
        </g>
        {/* cawan kecil */}
        <rect x="934" y="716" width="46" height="34" rx="6" fill="#d6a569" />
        <ellipse cx="957" cy="716" rx="23" ry="6" fill="#e6bb83" />
      </g>

      {/* ===== GELAS UKUR, MORTAR, BAKI TOPLES (KANAN) ===== */}
      <g>
        <Gelas x={1012} y={676} w={46} h={92} />
        <line x1="1050" y1="640" x2="1030" y2="700" stroke="#9aa1b3" strokeWidth="4" strokeLinecap="round" />
        <Gelas x={970} y={730} w={34} h={38} />

        {/* mortar dengan daun */}
        <g>
          <path d="M1030 758 Q1030 792 1066 794 Q1102 792 1102 758 Z" fill="#fbfaf7" stroke="#dcd9d0" />
          <ellipse cx="1066" cy="758" rx="36" ry="7" fill="#f2efe7" />
          <path d="M1070 746 Q1080 716 1112 702 Q1110 734 1070 746 Z" fill="#4f8f3e" />
          <path d="M1060 748 Q1050 722 1022 712 Q1026 740 1060 748 Z" fill="#6aa94c" />
          <path d="M1070 746 Q1090 724 1106 706" stroke="#3a7a2e" strokeWidth="1.5" fill="none" />
        </g>

        {/* baki kayu + toples */}
        <g>
          <rect x="1104" y="756" width="324" height="30" rx="4" fill="#a8683a" />
          <rect x="1104" y="756" width="324" height="8" rx="3" fill="#bf7f4a" />
          <Toples x={1126} y={668} isi="#fbfbfb" />
          <Toples x={1198} y={676} h={84} isi="#d8a85e" />
          <Toples x={1262} y={684} w={56} h={76} isi="#f1f0ec" />
          <Toples x={1346} y={684} w={56} h={76} isi="#e8dfd0" />
        </g>

        {/* toples besar di belakang baki */}
        <Toples x={1328} y={650} w={50} h={62} isi="#e9e6de" ket="#2b2d36" />
      </g>

      {/* ===== TANAMAN KIRI-ATAS ===== */}
      <Tanaman x={50} y={370} s={1.2} hijau="#6aa94c" />
      <Tanaman x={118} y={350} s={0.9} hijau="#7ab356" />
      <Tanaman x={360} y={470} s={1.1} hijau="#6aa94c" />
      <Tanaman x={545} y={500} s={0.9} hijau="#5f9a4a" />
      <Tanaman x={1070} y={470} s={1} hijau="#6aa94c" />
      <Tanaman x={1190} y={540} s={0.8} hijau="#5f9a4a" pot="#c07845" />
      <Tanaman x={1395} y={330} s={1.1} hijau="#5f9a4a" />
      <Tanaman x={1196} y={575} s={0.7} hijau="#74b052" />

      {/* ===== DEBU CAHAYA ===== */}
      <g fill="#fffbe6">
        {[
          [420, 360, 0],
          [560, 260, 3],
          [700, 420, 6],
          [840, 320, 2],
          [960, 460, 8],
          [620, 520, 5],
        ].map(([x, y, d], i) => (
          <circle key={i} className="lab-debu" cx={x} cy={y} r="3" style={{ animationDelay: `${-d}s` }} />
        ))}
      </g>

      {/* ===== TEDUH HIJAU KIRI & KANAN (agar ikon sidebar jelas) ===== */}
      <rect x="0" y="0" width="340" height="864" fill="url(#ll-hijau-kiri)" />
      <rect x="1196" y="0" width="340" height="864" fill="url(#ll-hijau-kanan)" />

      {/* ===== DAUN DEPAN (BURAM) ===== */}
      <g filter="url(#ll-buram)">
        <g className="lab-sway">
          <path d="M-20 864 C20 760 40 700 20 630 C80 700 90 790 60 864 Z" fill="#3f8a3a" />
          <path d="M40 864 C70 800 120 770 150 790 C130 820 90 850 70 864 Z" fill="#5f9a4a" />
        </g>
        <g className="lab-sway lab-sway-b">
          <path d="M1536 864 C1500 780 1500 720 1520 640 C1560 710 1560 800 1536 864 Z" fill="#4f8f3e" />
          <path d="M1400 864 C1430 820 1490 800 1520 810 C1500 840 1450 864 1420 864 Z" fill="#6aa94c" />
        </g>
        <path d="M200 864 C260 820 340 820 380 864 Z" fill="#3a7a34" opacity="0.8" />
      </g>

      {/* ===== LAPISAN VIGNETTE LEMBUT ===== */}
      <rect width="1536" height="864" fill="#ffffff" opacity="0.04" />
    </svg>
  )
}

export default LatarLab
