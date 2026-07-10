"use client";

import { motion } from "motion/react";

export function HomeBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 1280 720"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="hSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#5AB0E0" />
          <stop offset="55%" stopColor="#9ACFE8" />
          <stop offset="100%" stopColor="#BEEACF" />
        </linearGradient>
        <linearGradient id="hHillFar" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#56A8AB" />
          <stop offset="100%" stopColor="#368890" />
        </linearGradient>
        <linearGradient id="hHill1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#44B458" />
          <stop offset="100%" stopColor="#268C3E" />
        </linearGradient>
        <linearGradient id="hHill2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38A84E" />
          <stop offset="100%" stopColor="#1E8438" />
        </linearGradient>
        <linearGradient id="hGround" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4EBC62" />
          <stop offset="100%" stopColor="#28863A" />
        </linearGradient>
        <linearGradient id="hRiver" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#58A4C8" />
          <stop offset="50%" stopColor="#78CAE5" />
          <stop offset="100%" stopColor="#58A4C8" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect width="1280" height="720" fill="url(#hSky)" />

      {/* Far Hills */}
      <path
        d="M0,330 Q100,185 210,262 Q320,160 440,278 Q560,148 660,242 Q780,138 900,252 Q1010,155 1110,234 Q1210,178 1280,212 L1280,380 L0,380Z"
        fill="url(#hHillFar)"
        opacity="0.72"
      />

      {/* Near Hill 1 */}
      <path
        d="M0,395 Q160,298 325,360 Q490,292 645,355 Q800,286 960,348 Q1120,290 1280,332 L1280,720 L0,720Z"
        fill="url(#hHill1)"
      />

      {/* Near Hill 2 */}
      <path
        d="M0,445 Q200,362 405,412 Q608,358 808,408 Q1004,358 1205,398 L1280,445 L1280,720 L0,720Z"
        fill="url(#hHill2)"
      />

      {/* Ground */}
      <path
        d="M0,502 Q165,454 325,494 Q485,448 645,488 Q806,447 962,484 Q1122,450 1280,470 L1280,720 L0,720Z"
        fill="url(#hGround)"
      />
      <rect x="0" y="585" width="1280" height="135" fill="#28883C" />

      {/* Winding River */}
      <path
        d="M510,720 Q528,658 568,620 Q618,572 645,542 Q664,516 662,492 Q660,468 638,453 Q618,438 618,422 Q618,382 660,362 Q702,342 712,312 Q722,282 700,250"
        stroke="url(#hRiver)"
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

      {/* Wooden bridges over river */}
      <rect x="618" y="462" width="66" height="16" rx="6" fill="#C89040" />
      <rect x="621" y="465" width="60" height="9" rx="3" fill="#E0B060" />
      <rect x="622" y="457" width="6" height="16" rx="2" fill="#A07030" />
      <rect x="638" y="457" width="6" height="16" rx="2" fill="#A07030" />
      <rect x="654" y="457" width="6" height="16" rx="2" fill="#A07030" />
      <rect x="670" y="457" width="6" height="16" rx="2" fill="#A07030" />
      <rect x="534" y="622" width="58" height="14" rx="6" fill="#C89040" />
      <rect x="537" y="625" width="52" height="8" rx="3" fill="#E0B060" />
      <rect x="536" y="618" width="5" height="14" rx="2" fill="#A07030" />
      <rect x="552" y="618" width="5" height="14" rx="2" fill="#A07030" />
      <rect x="568" y="618" width="5" height="14" rx="2" fill="#A07030" />
      <rect x="578" y="618" width="5" height="14" rx="2" fill="#A07030" />

      {/* Winding Path / Dirt Road */}
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
      <path
        d="M672,282 Q640,222 534,182 Q400,140 278,182"
        stroke="#D4B870"
        strokeWidth="18"
        fill="none"
        strokeLinecap="round"
        opacity="0.62"
      />
      <path
        d="M672,282 Q722,212 840,178 Q972,140 1054,186"
        stroke="#D4B870"
        strokeWidth="18"
        fill="none"
        strokeLinecap="round"
        opacity="0.62"
      />

      {/* Trees */}
      <Tree x={162} y={422} scale={1.1} />
      <Tree x={234} y={454} scale={0.8} />
      <Tree x={318} y={412} scale={0.9} />
      <Tree x={386} y={444} scale={0.75} />
      <Tree x={484} y={422} scale={1.0} />
      <Tree x={544} y={406} scale={0.7} />
      <Tree x={836} y={420} scale={0.9} />
      <Tree x={916} y={442} scale={1.05} />
      <Tree x={996} y={415} scale={0.85} />
      <Tree x={1074} y={442} scale={1.0} />
      <Tree x={1154} y={420} scale={0.75} />
      <Tree x={706} y={394} scale={0.7} />
      <Tree x={756} y={408} scale={0.8} />

      {/* Bushes */}
      <Bush x={140} y={484} />
      <Bush x={444} y={474} />
      <Bush x={866} y={474} />
      <Bush x={1106} y={478} />
      <Bush x={586} y={466} />
      <Bush x={726} y={458} />

      {/* Flowers */}
      <Flower x={192} y={494} color="#FF6B6B" />
      <Flower x={212} y={490} color="#FFD700" />
      <Flower x={228} y={495} color="#FF8FAB" />
      <Flower x={876} y={490} color="#9B59B6" />
      <Flower x={898} y={494} color="#FF6B6B" />
      <Flower x={502} y={487} color="#FFD700" />
      <Flower x={518} y={484} color="#FF8FAB" />
      <Flower x={746} y={482} color="#FF6B6B" />
      <Flower x={766} y={486} color="#9B59B6" />

      {/* Lily pads / river details */}
      <ellipse cx="652" cy="515" rx="13" ry="6.5" fill="#F0A020" />
      <polygon points="639,515 628,509 628,521" fill="#C88010" />
      <circle cx="658" cy="512" r="2.5" fill="#2A1800" />
      <ellipse cx="620" cy="445" rx="11" ry="5.5" fill="#3498DB" />
      <polygon points="609,445 600,440 600,450" fill="#2070A8" />
      <ellipse cx="642" cy="534" rx="15" ry="8.5" fill="#228B34" opacity="0.82" />
      <circle cx="642" cy="531" r="4.5" fill="#FF6B6B" />
      <ellipse cx="668" cy="548" rx="13" ry="7.5" fill="#228B34" opacity="0.82" />

      {/* Cozy House */}
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
        <line x1="80" y1="5" x2="80" y2="-5" stroke="#5A3A10" strokeWidth="2.5" />
        <polygon points="80,-5 98,2 80,9" fill="#D4A017" />
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
        <rect x="144" y="122" width="7" height="36" rx="3.5" fill="#C8860A" />
        <rect x="149" y="118" width="6" height="25" rx="3" fill="#D49820" />
        <ellipse cx="157" cy="116" rx="9" ry="6.5" fill="#E0A830" />
        <circle cx="159" cy="113" r="5" fill="#E0A830" />
        <circle cx="160.5" cy="111" r="1.8" fill="#2A1800" />
      </g>

      {/* Floating Clouds */}
      <motion.g
        initial={{ x: -200 }}
        animate={{ x: 1400 }}
        transition={{ repeat: Infinity, duration: 70, ease: "linear" }}
      >
        <Cloud x={85} y={72} scale={1.1} />
      </motion.g>
      <motion.g
        initial={{ x: -200 }}
        animate={{ x: 1400 }}
        transition={{ repeat: Infinity, duration: 95, ease: "linear", delay: 15 }}
      >
        <Cloud x={390} y={56} scale={0.85} />
      </motion.g>
      <motion.g
        initial={{ x: -200 }}
        animate={{ x: 1400 }}
        transition={{ repeat: Infinity, duration: 80, ease: "linear", delay: 30 }}
      >
        <Cloud x={760} y={68} scale={1.15} />
      </motion.g>
      <motion.g
        initial={{ x: -200 }}
        animate={{ x: 1400 }}
        transition={{ repeat: Infinity, duration: 85, ease: "linear", delay: 45 }}
      >
        <Cloud x={1060} y={60} scale={0.9} />
      </motion.g>
      <motion.g
        initial={{ x: -200 }}
        animate={{ x: 1400 }}
        transition={{ repeat: Infinity, duration: 75, ease: "linear", delay: 55 }}
      >
        <Cloud x={565} y={44} scale={0.7} />
      </motion.g>

      {/* Birds */}
      <motion.g
        initial={{ x: -300 }}
        animate={{ x: 1600 }}
        transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
      >
        <path d="M180,205 Q189,198 198,205" stroke="#5A3A10" strokeWidth="2.2" fill="none" />
        <path d="M212,190 Q221,183 230,190" stroke="#5A3A10" strokeWidth="2.2" fill="none" />
        <path d="M197,218 Q206,211 215,218" stroke="#5A3A10" strokeWidth="2.2" fill="none" />
      </motion.g>
      <motion.g
        initial={{ x: 1600 }}
        animate={{ x: -300 }}
        transition={{ repeat: Infinity, duration: 36, ease: "linear", delay: 8 }}
      >
        <path d="M910,238 Q919,231 928,238" stroke="#5A3A10" strokeWidth="1.8" fill="none" />
        <path d="M938,224 Q947,217 956,224" stroke="#5A3A10" strokeWidth="1.8" fill="none" />
      </motion.g>
    </svg>
  );
}

function Tree({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  const s = scale;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x="-4.8" y="21.6" width="9.6" height="26.4" rx="3" fill="#5A3A10" />
      <circle cy="0" r="26.4" fill="#1E8A34" />
      <circle cx="-9.6" cy="-8.4" r="16.8" fill="#28A840" />
      <circle cx="9.6" cy="-6" r="16.8" fill="#28A840" />
      <circle cy="-16.8" r="14.4" fill="#44CC5A" />
    </g>
  );
}

function Bush({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <circle cy="0" r="15" fill="#1E8A34" />
      <circle cx="-11" cy="5" r="10" fill="#28A840" />
      <circle cx="11" cy="5" r="10" fill="#28A840" />
    </g>
  );
}

function Flower({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect x="-1" y="0" width="2" height="13" fill="#2A7A3B" />
      <circle cy="0" r="5.5" fill={color} />
      <circle cy="0" r="2.8" fill="#FFD700" />
    </g>
  );
}

function Cloud({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`}>
      <ellipse cx="0" cy="0" rx="65" ry="37" fill="white" opacity="0.96" />
      <ellipse cx="-37.5" cy="6" rx="42.5" ry="27.5" fill="white" opacity="0.9" />
      <ellipse cx="37.5" cy="7.2" rx="45" ry="28.8" fill="white" opacity="0.9" />
    </g>
  );
}
