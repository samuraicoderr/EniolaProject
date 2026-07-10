"use client";

import React from "react";
import { motion } from "motion/react";

export default function AuthScene() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#5AB0E0]">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1280 720"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="authSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#5AB0E0" />
            <stop offset="55%" stopColor="#9ACFE8" />
            <stop offset="100%" stopColor="#BEEACF" />
          </linearGradient>
          <linearGradient id="authHillFar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#56A8AB" />
            <stop offset="100%" stopColor="#368890" />
          </linearGradient>
          <linearGradient id="authHill1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#44B458" />
            <stop offset="100%" stopColor="#268C3E" />
          </linearGradient>
          <linearGradient id="authHill2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38A84E" />
            <stop offset="100%" stopColor="#1E8438" />
          </linearGradient>
          <linearGradient id="authGround" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4EBC62" />
            <stop offset="100%" stopColor="#28863A" />
          </linearGradient>
          <linearGradient id="authRiver" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#58A4C8" />
            <stop offset="50%" stopColor="#78CAE5" />
            <stop offset="100%" stopColor="#58A4C8" />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width="1280" height="720" fill="url(#authSky)" />

        {/* Sun */}
        <circle cx="1100" cy="90" r="45" fill="#FFD700" opacity="0.9" />
        <circle cx="1100" cy="90" r="60" fill="#FFD700" opacity="0.3" />

        {/* Far hills */}
        <path
          d="M0,330 Q100,185 210,262 Q320,160 440,278 Q560,148 660,242 Q780,138 900,252 Q1010,155 1110,234 Q1210,178 1280,212 L1280,380 L0,380Z"
          fill="url(#authHillFar)"
          opacity="0.72"
        />

        {/* Mid hills */}
        <path
          d="M0,395 Q160,298 325,360 Q490,292 645,355 Q800,286 960,348 Q1120,290 1280,332 L1280,720 L0,720Z"
          fill="url(#authHill1)"
        />

        {/* Front hills */}
        <path
          d="M0,445 Q200,362 405,412 Q608,358 808,408 Q1004,358 1205,398 L1280,445 L1280,720 L0,720Z"
          fill="url(#authHill2)"
        />

        {/* Ground */}
        <path
          d="M0,502 Q165,454 325,494 Q485,448 645,488 Q806,447 962,484 Q1122,450 1280,470 L1280,720 L0,720Z"
          fill="url(#authGround)"
        />
        <rect x="0" y="585" width="1280" height="135" fill="#28883C" />

        {/* River */}
        <path
          d="M510,720 Q528,658 568,620 Q618,572 645,542 Q664,516 662,492 Q660,468 638,453 Q618,438 618,422 Q618,382 660,362 Q702,342 712,312 Q722,282 700,250"
          stroke="url(#authRiver)"
          strokeWidth="50"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M510,720 Q528,658 568,620 Q618,572 645,542 Q664,516 662,492 Q660,468 638,453 Q618,438 618,422 Q618,382 660,362 Q702,342 712,312 Q722,282 700,250"
          stroke="#A0E0F8"
          strokeWidth="22"
          fill="none"
          strokeLinecap="round"
          opacity="0.45"
        />

        {/* Bridge */}
        <rect x="618" y="462" width="66" height="16" rx="6" fill="#C89040" />
        <rect x="621" y="465" width="60" height="9" rx="3" fill="#E0B060" />
        {[622, 638, 654, 670].map((x) => (
          <rect key={x} x={x} y="457" width="6" height="16" rx="2" fill="#A07030" />
        ))}

        {/* Path */}
        <path
          d="M195,720 Q248,642 302,582 Q362,512 434,492 Q512,472 604,492"
          stroke="#D4B870"
          strokeWidth="22"
          fill="none"
          strokeLinecap="round"
          opacity="0.72"
        />
        <path
          d="M195,720 Q248,642 302,582 Q362,512 434,492 Q512,472 604,492"
          stroke="#EDD898"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M1085,720 Q1044,652 984,592 Q924,536 844,512 Q764,492 702,492"
          stroke="#D4B870"
          strokeWidth="22"
          fill="none"
          strokeLinecap="round"
          opacity="0.72"
        />
        <path
          d="M1085,720 Q1044,652 984,592 Q924,536 844,512 Q764,492 702,492"
          stroke="#EDD898"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          opacity="0.55"
        />

        {/* Trees */}
        {[
          [162, 422, 26.4],
          [234, 454, 19.36],
          [318, 412, 22],
          [386, 444, 18.04],
          [484, 422, 24.2],
          [544, 406, 16.5],
          [836, 420, 22],
          [916, 442, 25.3],
          [996, 415, 19.8],
          [1074, 442, 24.2],
          [1154, 420, 18.04],
          [706, 394, 15.84],
          [756, 408, 19.36],
        ].map(([x, y, r], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <rect x={-Number(r) * 0.18} y={Number(r) * 0.82} width={Number(r) * 0.36} height={Number(r)} rx="3" fill="#5A3A10" />
            <circle cy="0" r={r} fill="#1E8A34" />
            <circle cx={-Number(r) * 0.36} cy={-Number(r) * 0.32} r={Number(r) * 0.64} fill="#28A840" />
            <circle cx={Number(r) * 0.36} cy={-Number(r) * 0.23} r={Number(r) * 0.64} fill="#28A840" />
            <circle cy={-Number(r) * 0.64} r={Number(r) * 0.55} fill="#44CC5A" />
          </g>
        ))}

        {/* Bushes */}
        {[
          [140, 484],
          [444, 474],
          [866, 474],
          [1106, 478],
          [586, 466],
          [726, 458],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <circle cy="0" r="15" fill="#1E8A34" />
            <circle cx="-11" cy="5" r="10" fill="#28A840" />
            <circle cx="11" cy="5" r="10" fill="#28A840" />
          </g>
        ))}

        {/* Flowers */}
        {[
          [192, 494, "#FF6B6B"],
          [212, 490, "#FFD700"],
          [228, 495, "#FF8FAB"],
          [876, 490, "#9B59B6"],
          [898, 494, "#FF6B6B"],
          [502, 487, "#FFD700"],
          [518, 484, "#FF8FAB"],
          [746, 482, "#FF6B6B"],
          [766, 486, "#9B59B6"],
        ].map(([x, y, color], i) => (
          <g key={i} transform={`translate(${x},${y})`}>
            <rect x="-1" y="0" width="2" height="13" fill="#2A7A3B" />
            <circle cy="0" r="5.5" fill={color as string} />
            <circle cy="0" r="2.8" fill="#FFD700" />
          </g>
        ))}

        {/* Little house */}
        <g transform="translate(578, 272)">
          <ellipse cx="80" cy="178" rx="80" ry="16" fill="#3EA050" />
          <ellipse cx="80" cy="174" rx="74" ry="13" fill="#52C060" />
          <ellipse cx="80" cy="174" rx="88" ry="18" fill="none" stroke="#60AACC" strokeWidth="9" opacity="0.68" />
          <rect x="28" y="90" width="104" height="84" rx="5" fill="#C8860A" />
          <rect x="32" y="94" width="96" height="78" rx="4" fill="#E2A030" />
          <polygon points="22,92 80,46 138,92" fill="#B5451B" />
          <polygon points="26,92 80,50 134,92" fill="#D45030" />
          <rect x="71" y="28" width="18" height="24" rx="3" fill="#B5451B" />
          <polygon points="66,28 80,12 94,28" fill="#8B3010" />
          <circle cx="80" cy="12" r="7" fill="#D4A017" />
          <circle cx="80" cy="12" r="4.5" fill="#FFD700" />
          <rect x="32" y="94" width="11" height="80" rx="3.5" fill="#B87020" />
          <rect x="117" y="94" width="11" height="80" rx="3.5" fill="#B87020" />
          <rect x="36" y="100" width="22" height="20" rx="3" fill="#1B3A8C" />
          <rect x="39" y="103" width="6" height="14" rx="1.5" fill="#D4A017" />
          <rect x="48" y="103" width="6" height="14" rx="1.5" fill="#D4A017" />
          <rect x="102" y="100" width="22" height="20" rx="3" fill="#1B3A8C" />
          <rect x="105" y="103" width="6" height="14" rx="1.5" fill="#D4A017" />
          <rect x="114" y="103" width="6" height="14" rx="1.5" fill="#D4A017" />
          <rect x="60" y="122" width="40" height="52" rx="6" fill="#5A2808" />
          <path d="M60 129 Q80 112 100 129" fill="#6B3A10" />
          <rect x="63" y="131" width="16" height="42" rx="2.5" fill="#6B3A10" />
          <rect x="81" y="131" width="16" height="42" rx="2.5" fill="#6B3A10" />
          <circle cx="79" cy="152" r="3.5" fill="#D4A017" />
          <circle cx="83" cy="152" r="3.5" fill="#D4A017" />
        </g>
      </svg>

      {/* Floating clouds */}
      <motion.div
        className="absolute left-[6%] top-[10%] opacity-90"
        animate={{ x: [0, 24, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <Cloud />
      </motion.div>
      <motion.div
        className="absolute left-[30%] top-[8%] opacity-85"
        animate={{ x: [0, -18, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Cloud small />
      </motion.div>
      <motion.div
        className="absolute right-[20%] top-[12%] opacity-90"
        animate={{ x: [0, 30, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <Cloud />
      </motion.div>
      <motion.div
        className="absolute right-[8%] top-[7%] opacity-80"
        animate={{ x: [0, -22, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Cloud small />
      </motion.div>

      {/* Animated birds */}
      <motion.svg
        className="absolute left-[14%] top-[28%] w-20 h-10"
        viewBox="0 0 60 30"
        animate={{ x: [0, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M10,20 Q15,12 20,20" stroke="#5A3A10" strokeWidth="2.2" fill="none" />
        <path d="M30,15 Q35,7 40,15" stroke="#5A3A10" strokeWidth="2.2" fill="none" />
        <path d="M20,25 Q25,17 30,25" stroke="#5A3A10" strokeWidth="2.2" fill="none" />
      </motion.svg>
    </div>
  );
}

function Cloud({ small = false }: { small?: boolean }) {
  const scale = small ? 0.6 : 1;
  return (
    <svg
      width={140 * scale}
      height={80 * scale}
      viewBox="0 0 140 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse cx="70" cy="45" rx="68" ry="35" fill="white" />
      <ellipse cx="35" cy="50" rx="44" ry="28" fill="white" />
      <ellipse cx="105" cy="52" rx="46" ry="29" fill="white" />
    </svg>
  );
}
