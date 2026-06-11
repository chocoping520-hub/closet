import React from "react";

interface RenderProps {
  x: number;
  y: number;
  scale: number;
  rotation: number; // in degrees
}

export const HatRenderer: React.FC<{ jobId: string } & RenderProps> = ({ jobId, x, y, scale, rotation }) => {
  const transformStyle = {
    transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg) scale(${scale})`,
    transformOrigin: "center bottom",
    transition: "transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  };

  const getHatSVG = () => {
    switch (jobId) {
      case "firefighter":
        return (
          <g>
            {/* Firefighter Helmet */}
            <path d="M-60 0 C-60 -50 60 -50 60 0 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="4" />
            <ellipse cx="0" cy="2" rx="70" ry="10" fill="#DC2626" stroke="#991B1B" strokeWidth="2" />
            {/* Gold Badge */}
            <polygon points="0,-40 12,-20 10,-5 -10,-5 -12,-20" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
            <path d="M-4 -20 L4 -20 L2 -10 L-2 -10 Z" fill="#EF4444" />
            {/* Neck guard shield back */}
            <path d="M-55 5 C-55 15 55 15 55 5 Z" fill="#4B5563" />
          </g>
        );
      case "police":
        return (
          <g>
            {/* Police Cap */}
            <path d="M-60 -5 C-60 -45 60 -45 60 -5 Z" fill="#1E3A8A" stroke="#172554" strokeWidth="4" />
            <path d="M-65 -4 C-65 4 65 4 65 -4 Z" fill="#111827" />
            {/* Shiny black visor */}
            <path d="M-50 4 C-35 18 35 18 50 4 Z" fill="#111827" />
            {/* Gold crest */}
            <polygon points="0,-25 10,-15 6,-2 -6,-2 -10,-15" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
            <circle cx="0" cy="-14" r="3" fill="#FFFFFF" />
            {/* Gold band */}
            <rect x="-40" y="-8" width="80" height="4" fill="#FBBF24" rx="2" />
          </g>
        );
      case "doctor":
        return (
          <g>
            {/* Doctor Head Mirror / Band */}
            <rect x="-55" y="-10" width="110" height="8" fill="#4B5563" rx="4" />
            {/* Round reflector glass */}
            <circle cx="-15" cy="-10" r="18" fill="#9CA3AF" stroke="#374151" strokeWidth="3" />
            <circle cx="-15" cy="-10" r="14" fill="#E5E7EB" />
            <circle cx="-10" cy="-15" r="5" fill="#FFFFFF" opacity="0.8" />
            {/* Little Red Cross Symbol on headband */}
            <rect x="20" y="-12" width="12" height="12" fill="#FFFFFF" rx="2" />
            <path d="M26 -12 V0 M20 -6 H32" stroke="#EF4444" strokeWidth="3" />
          </g>
        );
      case "nurse":
        return (
          <g>
            {/* Nurse Cap */}
            <path d="M-35 0 C-35 -25 35 -25 35 0 Z" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="3" />
            <path d="M-40 0 H40" stroke="#FDA4AF" strokeWidth="4" />
            {/* Pink heart with hospital cross inside */}
            <path d="M0,-8 C-4,-12 -10,-12 -10,-6 C-10,0 0,6 0,6 C0,6 10,0 10,-6 C10,-12 4,-12 0,-8 Z" fill="#F43F5E" />
            <path d="M0,-5 V1 M-3,-2 H3" stroke="#FFFFFF" strokeWidth="2" />
          </g>
        );
      case "baker":
        return (
          <g>
            {/* Chef Tall Hat */}
            <path d="M-45 -15 C-65 -45 -35 -70 -15 -60 C-10 -75 20 -75 25 -60 C45 -65 55 -45 40 -15 Z" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="4" />
            <rect x="-35" y="-18" width="70" height="20" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="3" rx="4" />
            <rect x="-35" y="-10" width="70" height="4" fill="#EF4444" />
          </g>
        );
      case "zookeeper":
        return (
          <g>
            {/* Safari Hat */}
            <path d="M-55 2 C-55 -35 55 -35 55 2 Z" fill="#D97706" stroke="#92400E" strokeWidth="3" />
            <ellipse cx="0" cy="4" rx="75" ry="10" fill="#B45309" stroke="#78350F" strokeWidth="2" />
            {/* Ribbon around hat */}
            <path d="M-48 -3 H48 L46 3 H-46 Z" fill="#047857" />
            {/* Paw print emblem */}
            <circle cx="0" cy="-14" r="5" fill="#FFFFFF" />
            <circle cx="-6" cy="-20" r="2.5" fill="#FFFFFF" />
            <circle cx="0" cy="-22" r="2.5" fill="#FFFFFF" />
            <circle cx="6" cy="-20" r="2.5" fill="#FFFFFF" />
          </g>
        );
      case "ballerina":
        return (
          <g>
            {/* Sparkling Tiara */}
            <path d="M-30 5 L-20 -15 L0 -25 L20 -15 L30 5 Z" fill="none" stroke="#E5E7EB" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <polygon points="0,-28 8,-12 -8,-12" fill="#FBBF24" />
            {/* Jewelry circles */}
            <circle cx="0" cy="-28" r="4" fill="#67E8F9" stroke="#06B6D4" />
            <circle cx="-20" cy="-15" r="3" fill="#F472B6" />
            <circle cx="20" cy="-15" r="3" fill="#F472B6" />
            <circle cx="-10" cy="-5" r="2.5" fill="#60A5FA" />
            <circle cx="10" cy="-5" r="2.5" fill="#60A5FA" />
          </g>
        );
      case "idol":
        return (
          <g>
            {/* Violet headset with glowing stars */}
            <path d="M-55 0 C-55 -45 55 -45 55 0" fill="none" stroke="#2D114D" strokeWidth="6" />
            {/* LED ears */}
            <circle cx="-55" cy="0" r="14" fill="#a78bfa" stroke="#6d28d9" strokeWidth="3" />
            <circle cx="-55" cy="0" r="8" fill="#F43F5E" />
            <circle cx="55" cy="0" r="14" fill="#a78bfa" stroke="#6d28d9" strokeWidth="3" />
            <circle cx="55" cy="0" r="8" fill="#F43F5E" />
            {/* Star ornaments */}
            <polygon points="-25,-38 -20,-26 -8,-26 -17,-18 -14,-6 -25,-14 -36,-6 -33,-18 -42,-26 -30,-26" fill="#FBBF24" />
            <polygon points="25,-38 30,-26 42,-26 33,-18 36,-6 25,-14 14,-6 17,-18 8,-26 20,-26" fill="#EF4444" />
            {/* Microphone headset arm */}
            <path d="M-55 5 C-55 25 -25 35 -15 32" fill="none" stroke="#2D114D" strokeWidth="4" strokeLinecap="round" />
            <circle cx="-15" cy="32" r="5" fill="#F43F5E" />
          </g>
        );
      case "skating":
        return (
          <g>
            {/* Flower hair band decoration */}
            <ellipse cx="-25" cy="-25" rx="10" ry="10" fill="#38BDF8" opacity="0.6" />
            <circle cx="-25" cy="-25" r="5" fill="#E0F2FE" />
            <ellipse cx="25" cy="-25" rx="10" ry="10" fill="#38BDF8" opacity="0.6" />
            <circle cx="25" cy="-25" r="5" fill="#E0F2FE" />
            {/* Glistening crown tiara arc */}
            <path d="M-30 -10 C-10 -25 10 -25 30 -10" fill="none" stroke="#E0F2FE" strokeWidth="4" />
            <circle cx="0" cy="-22" r="4" fill="#60A5FA" />
          </g>
        );
      case "mechanic":
        return (
          <g>
            {/* Mechanic Cap flipped backwards or styled */}
            <path d="M-50 0 C-50 -40 50 -40 50 0 Z" fill="#4B5563" stroke="#1F2937" strokeWidth="3" />
            <path d="M-45 -3 C-20 -15 20 -15 45 -3 Z" fill="#374151" />
            {/* Crossed wrench/screwdriver logo */}
            <path d="M-10 -22 H10 V-18 H-10 Z" fill="#9CA3AF" />
            <circle cx="0" cy="-20" r="5" fill="#FBBF24" />
          </g>
        );
      case "astronaut":
        return (
          <g>
            {/* Space Helmet Dome */}
            <circle cx="0" cy="-10" r="62" fill="rgba(219, 234, 254, 0.25)" stroke="#E2E8F0" strokeWidth="5" />
            {/* Visor window block */}
            <path d="M-45 -30 C-45 -55 45 -55 45 -30 C45 -5 30 10 -30 10 C-45 10 -45 -5 -45 -30 Z" fill="rgba(30, 64, 175, 0.4)" stroke="#60A5FA" strokeWidth="3" />
            {/* Side communication antennas */}
            <rect x="-67" y="-20" width="6" height="24" fill="#9CA3AF" rx="2" />
            <circle cx="-64" cy="-23" r="4" fill="#EF4444" />
            <rect x="61" y="-20" width="6" height="24" fill="#9CA3AF" rx="2" />
            <circle cx="64" cy="-23" r="4" fill="#10B981" />
          </g>
        );
      case "pilot":
        return (
          <g>
            {/* Pilot Cap */}
            <path d="M-58 -10 C-58 -48 58 -48 58 -10 Z" fill="#0F172A" stroke="#1E293B" strokeWidth="3" />
            <path d="M-62 -10 H62 V-2 H-62 Z" fill="#1E293B" />
            {/* Glossy visor */}
            <path d="M-48 -2 C-30 12 30 12 48 -2 Z" fill="#0F172A" />
            {/* Golden wings crest */}
            <circle cx="0" cy="-22" r="9" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
            <polygon points="-18,-24 -8,-20 0,-28 8,-20 18,-24 10,-14 -10,-14" fill="#FBBF24" />
            {/* Cool aviator sunglasses */}
            <path d="M-35 -5 C-35 15 -18 15 -10 -5 Z" fill="#111827" opacity="0.9" stroke="#FBBF24" strokeWidth="2" />
            <path d="M10 -5 C18 15 35 15 35 -5 Z" fill="#111827" opacity="0.9" stroke="#FBBF24" strokeWidth="2" />
            <line x1="-10" y1="-5" x2="10" y2="-5" stroke="#FBBF24" strokeWidth="3" />
          </g>
        );
      case "explorer":
        return (
          <g>
            {/* Pith Explorer Hat */}
            <path d="M-50 4 C-50 -32 50 -32 50 4 Z" fill="#EAB308" stroke="#CA8A04" strokeWidth="3" />
            <ellipse cx="0" cy="5" rx="72" ry="12" fill="#D97706" stroke="#B45309" strokeWidth="2" />
            {/* Green leaf badge */}
            <path d="M-8 -12 Q0 -24 8 -12 Q0 2 -8 -12" fill="#10B981" />
            <path d="M-15 -6 Q-10 -15 -5 -6 Q-10 2 -15 -6" fill="#059669" />
          </g>
        );
      case "magician":
        return (
          <g>
            {/* Top Hat */}
            <rect x="-35" y="-55" width="70" height="55" fill="#111827" stroke="#374151" strokeWidth="3" rx="4" />
            <ellipse cx="0" cy="0" rx="55" ry="10" fill="#1F2937" stroke="#111827" strokeWidth="2" />
            {/* Red band */}
            <rect x="-35" y="-12" width="70" height="10" fill="#EF4444" />
            {/* Magic stars coming out */}
            <polygon points="40,-45 43,-38 50,-38 45,-34 47,-27 40,-31 33,-27 35,-34 30,-38 37,-38" fill="#FBBF24" />
          </g>
        );
      case "scientist":
        return (
          <g>
            {/* Neon safety goggles */}
            <path d="M-45 -12 H45 V6 H-45 Z" fill="rgba(6, 182, 212, 0.2)" stroke="#06B6D4" strokeWidth="4" rx="6" />
            <circle cx="-20" cy="-3" r="14" fill="none" stroke="#22D3EE" strokeWidth="3" />
            <circle cx="20" cy="-3" r="14" fill="none" stroke="#22D3EE" strokeWidth="3" />
            <line x1="-6" y1="-3" x2="6" y2="-3" stroke="#22D3EE" strokeWidth="4" />
            {/* Sparks shine overlay */}
            <line x1="-28" y1="-10" x2="-22" y2="-4" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <line x1="12" y1="-10" x2="18" y2="-4" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          </g>
        );
      case "farmer":
        return (
          <g>
            {/* Straw Hat */}
            <path d="M-50 -2 C-50 -35 50 -35 50 -2 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="3" />
            <ellipse cx="0" cy="2" rx="74" ry="12" fill="#D97706" stroke="#B45309" strokeWidth="2" />
            {/* Red band bandana ribbon */}
            <path d="M-46 -4 C-20 -8 20 -8 46 -4" fill="none" stroke="#EF4444" strokeWidth="4" />
            {/* Straw texture lines */}
            <line x1="-30" y1="-15" x2="-20" y2="-25" stroke="#CA8A04" strokeWidth="1.5" />
            <line x1="20" y1="-25" x2="30" y2="-15" stroke="#CA8A04" strokeWidth="1.5" />
          </g>
        );
      case "soccer":
        return (
          <g>
            {/* Cheer Korea hair headband */}
            <rect x="-45" y="-12" width="90" height="12" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" rx="3" />
            {/* "KOREA" text graphic or white tiger mark */}
            <circle cx="0" cy="-6" r="4" fill="#FFFFFF" />
            <path d="M-2 -6 H2" stroke="#EF4444" strokeWidth="2" />
            <path d="M0,-8 V-4" stroke="#EF4444" strokeWidth="2" />
            {/* Left and right band tie ribbons */}
            <path d="M-45 -6 L-55 -15 L-52 -20 L-42 -10 Z" fill="#EF4444" />
            <path d="M45 -6 L55 -15 L52 -20 L42 -10 Z" fill="#EF4444" />
          </g>
        );
      case "diver":
        return (
          <g>
            {/* Yellow Diving Goggles & Snorkel */}
            <path d="M-42 -15 H42 V10 H-42 Z" fill="rgba(56, 189, 248, 0.3)" stroke="#EAB308" strokeWidth="4" rx="8" />
            <rect x="-18" y="-5" width="36" height="4" fill="#111827" rx="2" />
            {/* Snorkel tube */}
            <path d="M35 5 L50 5 L52 -25 L46 -25 L44 0 L35 0 Z" fill="#EAB308" stroke="#CA8A04" strokeWidth="1" />
            {/* Breath bubbles */}
            <circle cx="50" cy="-35" r="4" fill="#E0F2FE" opacity="0.7" />
            <circle cx="54" cy="-45" r="2" fill="#E0F2FE" opacity="0.7" />
          </g>
        );
      case "hairstylist":
        return (
          <g>
            {/* Rainbow hair rollers and hair pins */}
            <rect x="-35" y="-20" width="16" height="12" fill="#F472B6" rx="4" />
            <circle cx="-27" cy="-14" r="3" fill="#FFFFFF" />
            <rect x="-10" y="-30" width="20" height="12" fill="#38BDF8" rx="4" />
            <rect x="18" y="-20" width="16" height="12" fill="#A78BFA" rx="4" />
            <ellipse cx="-18" cy="-8" rx="12" ry="4" fill="#FBBF24" />
            <ellipse cx="18" cy="-8" rx="12" ry="4" fill="#34D399" />
          </g>
        );
      case "gamedeveloper":
        return (
          <g>
            {/* RGB back-lit headset with cyber antennas */}
            <path d="M-52 4 C-52 -45 52 -45 52 4" fill="none" stroke="#4C1D95" strokeWidth="5" />
            {/* RGB illuminated capsules */}
            <rect x="-64" y="-12" width="14" height="30" fill="#1F2937" stroke="#A78BFA" strokeWidth="3" rx="4" />
            {/* LED strip */}
            <rect x="-60" y="-8" width="6" height="22" fill="#06B6D4" />
            <rect x="50" y="-12" width="14" height="30" fill="#1F2937" stroke="#A78BFA" strokeWidth="3" rx="4" />
            {/* LED strip */}
            <rect x="54" y="-8" width="6" height="22" fill="#EC4899" />
            {/* Goggle projection overlay light */}
            <path d="M-30 -15 H30 V2 H-30 Z" fill="rgba(167, 139, 250, 0.15)" stroke="#8B5CF6" strokeWidth="2" rx="4" />
          </g>
        );
      case "artist":
        return (
          <g>
            {/* French red beret */}
            <ellipse cx="0" cy="-18" rx="38" ry="14" fill="#EF4444" stroke="#B91C1C" strokeWidth="3.5" />
            <path d="M -12 -31 C -5 -35 5 -35 12 -31" stroke="#EF4444" strokeWidth="3" fill="none" />
            {/* Beret stem stub */}
            <path d="M0 -31 L0 -37" stroke="#B91C1C" strokeWidth="4.5" strokeLinecap="round" />
            {/* Mini cute paint blob behind ear */}
            <circle cx="28" cy="-8" r="5" fill="#3B82F6" />
          </g>
        );
      case "detective":
        return (
          <g>
            {/* Deerstalker sherlock houndstooth hat design */}
            <path d="M -42 -5 Q -42 -44 0 -44 Q 42 -44 42 -5 Z" fill="#92400E" stroke="#451A03" strokeWidth="3.5" />
            <ellipse cx="0" cy="-5" rx="55" ry="8" fill="#B45309" stroke="#451A03" strokeWidth="3" />
            {/* Small stylish tied ribbon at peak */}
            <circle cx="0" cy="-44" r="5" fill="#451A03" />
            <path d="M -8 -40 L 8 -40" stroke="#FBBF24" strokeWidth="3" />
            {/* Houndstooth lines ornament */}
            <path d="M-20 -5 V-32 M0 -5 V-44 M20 -5 V-32" stroke="#451A03" strokeWidth="2.5" strokeDasharray="4,4" />
          </g>
        );
      case "builder":
        return (
          <g>
            {/* Yellow hardhat dome */}
            <path d="M -40 -10 Q -40 -46 0 -46 Q 40 -46 40 -10 Z" fill="#FBBF24" stroke="#B45309" strokeWidth="4" />
            {/* Front reinforced cap ridge */}
            <path d="M -8 -46 Q 0 -36 8 -46" stroke="#D97706" strokeWidth="3" fill="none" />
            {/* Hard hat visor rim */}
            <path d="M -48 -10 C -25 -2 25 -2 48 -10" stroke="#B45309" strokeWidth="4" fill="none" />
            {/* Safety emblem sticker sticker center */}
            <circle cx="0" cy="-26" r="7" fill="#FFFFFF" stroke="#047857" strokeWidth="2" />
            <path d="M -3 -26 H 3 M 0 -29 V -23" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );
      case "gardener":
        return (
          <g>
            {/* Wide straw gardener sun hat */}
            <ellipse cx="0" cy="-12" rx="56" ry="11" fill="#F3F4F6" opacity="0.3" />
            {/* Crown dome */}
            <path d="M -32 -16 Q -32 -42 0 -42 Q 32 -42 32 -16 Z" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="3.5" />
            {/* Soft straw texture line */}
            <ellipse cx="0" cy="-16" rx="54" ry="12" fill="#F59E0B" opacity="0.8" stroke="#D97706" strokeWidth="3.5" />
            {/* Green ribbon band */}
            <rect x="-31" y="-23" width="62" height="7" fill="#10B981" stroke="#047857" strokeWidth="1" />
            {/* Sprouting small cute flower */}
            <circle cx="20" cy="-30" r="5" fill="#F43F5E" />
            <circle cx="20" cy="-30" r="1.5" fill="#FBBF24" />
            <path d="M16 -26 C14 -28 17 -30 20 -30" stroke="#047857" strokeWidth="1.5" fill="none" />
          </g>
        );
      case "judge":
        return (
          <g>
            {/* Traditional curly white judge bar wig crown */}
            <path d="M -40 -12 Q -40 -45 0 -45 Q 40 -45 40 -12" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="4" />
            {/* Curly clouds rolls left & right */}
            <circle cx="-38" cy="-28" r="9" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="2" />
            <circle cx="-42" cy="-15" r="10" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="2" />
            <circle cx="-34" cy="-5" r="9" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="2" />
            <circle cx="38" cy="-28" r="9" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="2" />
            <circle cx="42" cy="-15" r="10" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="2" />
            <circle cx="34" cy="-5" r="9" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="2" />
            {/* Small lawyer bib tie at throat */}
            <path d="M -8 -8 L -14 18 H 14 L 8 -8 Z" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="2" />
            <line x1="0" y1="-8" x2="0" y2="18" stroke="#D1D5DB" strokeWidth="1.5" />
          </g>
        );
      case "lifeguard":
        return (
          <g>
            {/* Life guard red sun visor cap */}
            <path d="M -36 -12 Q -33 -34 0 -34 Q 33 -34 36 -12 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="3.5" />
            {/* Front peak bill visor */}
            <path d="M -46 -12 Q 0 -3 46 -12 Z" fill="#B91C1C" stroke="#991B1B" strokeWidth="1.5" />
            {/* White cross safety print */}
            <rect x="-3" y="-26" width="6" height="12" fill="#FFFFFF" rx="1" />
            <rect x="-6" y="-23" width="12" height="6" fill="#FFFFFF" rx="1" />
          </g>
        );
      case "musician":
        return (
          <g>
            {/* Musical Treble clef hairpin decoration */}
            <path d="M -10 -40 Q -15 -42 -10 -47 Q -5 -50 0 -40 L 0 -10 Q 0 -4 -4 -4 Q -10 -4 -10 -10 Q -10 -16 -4 -16 Q 0 -13 0 -10" fill="none" stroke="#4F46E5" strokeWidth="4.5" strokeLinecap="round" />
            <circle cx="-4" cy="-4" r="5" fill="#4F46E5" />
            {/* Side silver beam nodes hair pins */}
            <circle cx="-28" cy="-15" r="6" fill="#818CF8" />
            <path d="M-36 -15 H-20" stroke="#312E81" strokeWidth="2" />
            <circle cx="28" cy="-15" r="6" fill="#EC4899" />
            <path d="M20 -15 H36" stroke="#9D174D" strokeWidth="2" />
          </g>
        );
      case "clown":
        return (
          <g>
            {/* Massive curly red-orange curly clown hair block */}
            <path d="M -45 -10 Q -45 -48 0 -48 Q 45 -48 45 -10 Z" fill="#EAB308" stroke="#CA8A04" strokeWidth="2.5" />
            <circle cx="-38" cy="-32" r="14" fill="#EF4444" opacity="0.9" />
            <circle cx="-45" cy="-15" r="14" fill="#3B82F6" opacity="0.9" />
            <circle cx="38" cy="-32" r="14" fill="#10B981" opacity="0.9" />
            <circle cx="45" cy="-15" r="14" fill="#F43F5E" opacity="0.9" />
            {/* Small funny yellow party hat on top */}
            <polygon points="0,-48 -14,-72 14,-72" fill="#EC4899" stroke="#9D174D" strokeWidth="3" />
            <circle cx="0" cy="-75" r="5.5" fill="#FBBF24" />
          </g>
        );
      case "racer":
        return (
          <g>
            {/* Sporty Full-face racing helmet */}
            <circle cx="0" cy="-16" r="34" fill="#171717" stroke="#404040" strokeWidth="3.5" />
            {/* Red racing stripe in center */}
            <path d="M -6 -48 L -4 -20 H 4 L 6 -48 Z" fill="#EF4444" />
            {/* Dynamic reflective cyan visor glass */}
            <path d="M -26 -24 C -22 -1 22 -1 26 -24 Z" fill="#06B6D4" opacity="0.85" stroke="#0891B2" strokeWidth="2.5" />
            {/* Visor shine flare */}
            <path d="M-12 -12 L10 -12" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          </g>
        );
      case "vet":
        return (
          <g>
            {/* Vet head band with circular diagnostic mirror */}
            <rect x="-42" y="-18" width="84" height="7" fill="#374151" rx="2" stroke="#1F2937" strokeWidth="1" />
            {/* Glowing neon green LED indicator for ears checks */}
            <circle cx="-28" cy="-23" r="3.5" fill="#10B981" />
            {/* Metal concentric inspector mirror */}
            <circle cx="0" cy="-14" r="16" fill="#9CA3AF" stroke="#4B5563" strokeWidth="3.5" />
            <circle cx="0" cy="-14" r="8" fill="#E5E7EB" />
            <circle cx="-2" cy="-16" r="3" fill="#FFFFFF" />
          </g>
        );
      default:
        return null;
    }
  };

  return <g style={transformStyle}>{getHatSVG()}</g>;
};

export const TopRenderer: React.FC<{ jobId: string } & RenderProps> = ({ jobId, x, y, scale, rotation }) => {
  const transformStyle = {
    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
    transformOrigin: "center top",
    transition: "transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  };

  const getTopSVG = () => {
    switch (jobId) {
      case "firefighter":
        return (
          <g>
            {/* Firefighter jacket body */}
            <path d="M-50 0 L-80 90 L-50 90 L-45 130 H45 L50 90 L80 90 L50 0 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="4" />
            {/* Yellow reflective striping */}
            <rect x="-42" y="30" width="84" height="12" fill="#FBBF24" />
            <line x1="-70" y1="60" x2="-55" y2="40" stroke="#FBBF24" strokeWidth="10" />
            <line x1="70" y1="60" x2="55" y2="40" stroke="#FBBF24" strokeWidth="10" />
            <rect x="-42" y="100" width="84" height="12" fill="#FBBF24" />
            {/* Fire crest badge / Walkie talkie */}
            <rect x="-32" y="45" width="14" height="22" fill="#1F2937" rx="2" />
            <rect x="-29" y="35" width="3" height="12" fill="#1F2937" />
            <path d="M20 45 L32 45 L26 60 Z" fill="#FBBF24" />
          </g>
        );
      case "police":
        return (
          <g>
            {/* Police Uniform top */}
            <path d="M-50 0 L-78 85 L-52 85 L-44 125 H44 L52 85 L78 85 L50 0 Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="4" />
            {/* Dark Navy Tie */}
            <polygon points="0,20 -10,135 0,145 10,135" fill="#1E3A8A" />
            <polygon points="-12,0 12,0 0,22" fill="#1E3A8A" />
            {/* Golden Star badge */}
            <polygon points="24,25 31,31 39,26 35,34 42,40 33,40 30,48 27,40 18,40 25,34" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
            {/* Epaulettes */}
            <rect x="-48" y="2" width="15" height="6" fill="#1E3A8A" rx="1" />
            <rect x="33" y="2" width="15" height="6" fill="#1E3A8A" rx="1" />
          </g>
        );
      case "doctor":
        return (
          <g>
            {/* Doctor White Coat overlaying teal shirt */}
            <path d="M-50 0 L-76 80 L-50 80 L-42 120 H42 L50 80 L76 80 L50 0 Z" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="4" />
            <path d="M-22 0 L0 55 L22 0 Z" fill="#0D9488" />
            {/* Mirror / Stethoscope lines */}
            <path d="M-40 45 C-30 110 30 110 40 45" fill="none" stroke="#9CA3AF" strokeWidth="6" strokeLinecap="round" />
            <circle cx="28" cy="115" r="14" fill="#D1D5DB" stroke="#4B5563" strokeWidth="3" />
            <circle cx="28" cy="115" r="8" fill="#F9FAFB" />
            {/* Pocket with shiny red pen */}
            <rect x="-35" y="70" width="22" height="24" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2" />
            <rect x="-26" y="58" width="4" height="16" fill="#EF4444" rx="1" />
          </g>
        );
      case "nurse":
        return (
          <g>
            {/* Nurse Pink uniform jacket */}
            <path d="M-46 0 L-72 82 L-48 82 L-42 118 H42 L48 82 L72 82 L46 0 Z" fill="#FFE4E6" stroke="#FDA4AF" strokeWidth="4" />
            {/* V-neck outline */}
            <polygon points="-16,0 16,0 0,32" fill="#FB7185" />
            {/* Red heart medical pocket */}
            <rect x="18" y="55" width="20" height="22" fill="#FFFFFF" stroke="#FDA4AF" strokeWidth="1.5" rx="2" />
            <path d="M28,60 C26,57 22,57 22,61 C22,65 28,69 28,69 C28,69 34,65 34,61 C34,57 30,57 28,60 Z" fill="#E11D48" />
          </g>
        );
      case "baker":
        return (
          <g>
            {/* Chef double breasted jacket */}
            <path d="M-48 0 L-76 85 L-50 85 L-42 122 H42 L50 85 L76 85 L48 0 Z" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="4" />
            {/* Chef buttons (double breasted coordinate) */}
            <circle cx="-16" cy="40" r="4" fill="#4B5563" />
            <circle cx="16" cy="40" r="4" fill="#4B5563" />
            <circle cx="-16" cy="70" r="4" fill="#4B5563" />
            <circle cx="16" cy="70" r="4" fill="#4B5563" />
            <circle cx="-16" cy="100" r="4" fill="#4B5563" />
            <circle cx="16" cy="100" r="4" fill="#4B5563" />
            {/* Red Scarf tie */}
            <path d="M-22 0 C-10 15 10 15 22 0" fill="none" stroke="#EF4444" strokeWidth="6" />
            <path d="M-6 8 L10 32 L22 28 L6 4 Z" fill="#EF4444" />
          </g>
        );
      case "zookeeper":
        return (
          <g>
            {/* Zookeeper Khaki Vest with cute animal badge */}
            <path d="M-48 0 L-76 85 L-48 85 L-42 120 H42 L48 85 L76 85 L48 0 Z" fill="#047857" stroke="#064E3B" strokeWidth="4" />
            {/* Open vest front */}
            <polygon points="-12,0 12,0 0,45" fill="#FFE4E6" opacity="0" />
            <path d="M-15 0 L-10 120 M15 0 L10 120" stroke="#064E3B" strokeWidth="2" />
            {/* Vest pockets */}
            <rect x="-35" y="70" width="18" height="20" fill="#065F46" rx="2" />
            <rect x="17" y="70" width="18" height="20" fill="#065F46" rx="2" />
            {/* Paw print logo */}
            <circle cx="-26" cy="45" r="5" fill="#F59E0B" />
            <circle cx="-31" cy="39" r="2.5" fill="#F59E0B" />
            <circle cx="-26" cy="37" r="2.5" fill="#F59E0B" />
            <circle cx="-21" cy="39" r="2.5" fill="#F59E0B" />
          </g>
        );
      case "ballerina":
        return (
          <g>
            {/* Ballerina Sequined Top */}
            <path d="M-42 12 C-42 60 -36 100 -24 110 H24 C36 100 42 60 42 12 Z" fill="#F472B6" stroke="#DB2777" strokeWidth="4" />
            {/* Sparkly mesh trim */}
            <path d="M-42 12 C-20 30 20 30 42 12 C30 -2 -30 -2 -42 12 Z" fill="rgba(244, 114, 182, 0.4)" stroke="#F472B6" />
            {/* Silver sparkles */}
            <circle cx="-16" cy="45" r="3" fill="#FFFFFF" />
            <circle cx="16" cy="45" r="3" fill="#FFFFFF" />
            <circle cx="0" cy="70" r="4" fill="#FFFFFF" />
          </g>
        );
      case "idol":
        return (
          <g>
            {/* Glitter stage jacket (shiny magenta/purple) */}
            <path d="M-48 0 L-76 80 L-50 80 L-42 120 H42 L50 80 L76 80 L48 0 Z" fill="#8B5CF6" stroke="#4C1D95" strokeWidth="4" />
            {/* Sequin glitter circles */}
            <circle cx="-20" cy="35" r="3.5" fill="#10B981" />
            <circle cx="20" cy="35" r="3.5" fill="#F43F5E" />
            <circle cx="-25" cy="75" r="5" fill="#FBBF24" />
            <circle cx="25" cy="75" r="5" fill="#06B6D4" />
            {/* Golden Star patterns */}
            <polygon points="0,50 4,58 12,58 6,64 8,72 0,67 -8,72 -6,64 -12,58 -4,58" fill="#FFFFFF" />
          </g>
        );
      case "skating":
        return (
          <g>
            {/* Sparkly Figure Skater dress top (cyan ice dress) */}
            <path d="M-44 14 C-44 60 -34 105 -22 112 H22 C34 105 44 60 44 14 Z" fill="#E0F2FE" stroke="#38BDF8" strokeWidth="4" />
            {/* Sheer mesh sleeves layout */}
            <path d="M-44 14 L-72 65 L-60 70 L-32 30 Z" fill="rgba(56, 189, 248, 0.25)" />
            <path d="M44 14 L72 65 L60 70 L32 30 Z" fill="rgba(56, 189, 248, 0.25)" />
            {/* Snow crystals embroidery */}
            <line x1="0" y1="40" x2="0" y2="70" stroke="#38BDF8" strokeWidth="2.5" />
            <line x1="-15" y1="55" x2="15" y2="55" stroke="#38BDF8" strokeWidth="2.5" />
          </g>
        );
      case "mechanic":
        return (
          <g>
            {/* Overalls denim top */}
            <path d="M-46 15 L-74 85 L-52 85 L-44 125 H44 L52 85 L74 85 L46 15 Z" fill="#2563EB" stroke="#1D4ED8" strokeWidth="4" />
            {/* Yellow checker stitching */}
            <path d="M-18 15 V125 M18 15 V125" stroke="#FBBF24" strokeWidth="2" strokeDasharray="4,4" />
            {/* Chest pocket containing tools */}
            <rect x="-20" y="45" width="40" height="42" fill="#1D4ED8" stroke="#FBBF24" strokeWidth="1.5" rx="3" />
            {/* Tool tags poking out */}
            <rect x="-12" y="24" width="6" height="24" fill="#9CA3AF" rx="1" /> {/* wrench handle */}
            <rect x="-13" y="16" width="8" height="8" fill="#9CA3AF" rx="2" />
            <rect x="6" y="20" width="5" height="28" fill="#EF4444" rx="1" /> {/* screwdriver */}
          </g>
        );
      case "astronaut":
        return (
          <g>
            {/* Astronaut Thick Spacesuit Top (White) */}
            <path d="M-48 0 L-76 80 L-50 80 L-42 120 H42 L50 80 L76 80 L48 0 Z" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="4" />
            {/* Control panel buttons on chest */}
            <rect x="-24" y="35" width="48" height="38" fill="#334155" rx="4" />
            <circle cx="-12" cy="46" r="4" fill="#EF4444" />
            <circle cx="0" cy="46" r="4" fill="#10B981" />
            <circle cx="12" cy="46" r="4" fill="#3B82F6" />
            <rect x="-16" y="58" width="32" height="6" fill="#FBBF24" rx="1" />
            {/* Round shoulder pad ridges */}
            <ellipse cx="-44" cy="22" rx="10" ry="16" fill="#E2E8F0" />
            <ellipse cx="44" cy="22" rx="10" ry="16" fill="#E2E8F0" />
          </g>
        );
      case "pilot":
        return (
          <g>
            {/* Crisp captain white shirt */}
            <path d="M-48 0 L-74 85 L-50 85 L-42 120 H42 L50 85 L74 85 L48 0 Z" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="4" />
            {/* Golden epaulet stripes on shoulders */}
            <rect x="-48" y="4" width="14" height="20" fill="#0F172A" rx="2" />
            <rect x="-48" y="8" width="14" height="3" fill="#FBBF24" />
            <rect x="-48" y="13" width="14" height="3" fill="#FBBF24" />
            <rect x="-48" y="18" width="14" height="3" fill="#FBBF24" />

            <rect x="34" y="4" width="14" height="20" fill="#0F172A" rx="2" />
            <rect x="34" y="8" width="14" height="3" fill="#FBBF24" />
            <rect x="34" y="13" width="14" height="3" fill="#FBBF24" />
            <rect x="34" y="18" width="14" height="3" fill="#FBBF24" />

            {/* Tie black and tie crest */}
            <polygon points="0,20 -8,115 0,122 8,115" fill="#000000" />
            <polygon points="-10,-2 10,-2 0,20" fill="#000000" />
            {/* Pilot wings logo */}
            <path d="M-18 45 L18 45 L0 36 Z" fill="#FBBF24" />
            <circle cx="0" cy="45" r="3" fill="#EF4444" />
          </g>
        );
      case "explorer":
        return (
          <g>
            {/* Explorer Safari jacket with compass strap */}
            <path d="M-48 0 L-76 85 L-48 85 L-42 120 H42 L48 85 L76 85 L48 0 Z" fill="#D97706" stroke="#92400E" strokeWidth="4" />
            {/* Compass accessory strap hanging diagonal */}
            <line x1="-40" y1="0" x2="35" y2="105" stroke="#FFFFFF" strokeWidth="6" />
            <line x1="-40" y1="0" x2="35" y2="105" stroke="#78350F" strokeWidth="4" />
            {/* Round compass glass badge */}
            <circle cx="15" cy="75" r="15" fill="#F1F5F9" stroke="#EAB308" strokeWidth="2" />
            <line x1="15" y1="65" x2="15" y2="85" stroke="#EF4444" strokeWidth="2" />
            <line x1="5" y1="75" x2="25" y2="75" stroke="#3B82F6" strokeWidth="2" />
          </g>
        );
      case "magician":
        return (
          <g>
            {/* Tuxedo top */}
            <path d="M-48 0 L-76 85 L-50 85 L-42 120 H42 L50 85 L76 85 L48 0 Z" fill="#111827" stroke="#374151" strokeWidth="4" />
            {/* Crimson inner coat fold and bowtie */}
            <polygon points="-22 0 0 52 22 0" fill="#991B1B" />
            <polygon points="-12,-4 12,-4 0,10" fill="#FFFFFF" />
            {/* Red Bowtie */}
            <path d="M-14 -12 L14 -4 L14 -20 L-14 -12 Z" fill="#EF4444" />
            <path d="M14 -12 L-14 -4 L-14 -20 L14 -12 Z" fill="#EF4444" />
            <circle cx="0" cy="-12" r="5" fill="#DC2626" />
            {/* Golden Star trail wand in hand */}
            <line x1="45" y1="50" x2="70" y2="10" stroke="#000" strokeWidth="4" strokeLinecap="round" />
            <circle cx="70" cy="10" r="3" fill="#FFFFFF" />
          </g>
        );
      case "scientist":
        return (
          <g>
            {/* Cyan sci coat and pocket containing colorful flask */}
            <path d="M-48 0 L-74 85 L-50 85 L-42 120 H42 L50 85 L74 85 L48 0 Z" fill="#ECEFF1" stroke="#90A4AE" strokeWidth="4" />
            {/* Bright cyan undershirt */}
            <polygon points="-20 0 0 45 20 0" fill="#00ACC1" />
            {/* Flask peeking from pocket */}
            <rect x="18" y="65" width="22" height="24" fill="#FFFFFF" stroke="#90A4AE" strokeWidth="2" />
            <path d="M24 64 L24 48 H34 L34 64 Z" fill="#EC4899" stroke="#90A4AE" />
            <circle cx="29" cy="62" r="9" fill="#EC4899" />
          </g>
        );
      case "farmer":
        return (
          <g>
            {/* Plannel farming checks yellow and red overalls */}
            <path d="M-46 15 L-74 85 L-52 85 L-44 125 H44 L52 85 L74 85 L46 15 Z" fill="#15803D" stroke="#166534" strokeWidth="4" />
            {/* Plannel shirt sleeves */}
            <ellipse cx="-55" cy="50" rx="14" ry="24" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
            <ellipse cx="55" cy="50" rx="14" ry="24" fill="#FBBF24" stroke="#B45309" strokeWidth="2" />
            {/* Big sunflower logo on bib */}
            <circle cx="0" cy="55" r="10" fill="#D97706" />
            <circle cx="0" cy="70" r="16" fill="#FBBF24" opacity="0.8" />
          </g>
        );
      case "soccer":
        return (
          <g>
            {/* Korean Red Tiger soccer team Jersey */}
            <path d="M-48 8 L-76 75 L-55 75 L-45 120 H45 L55 75 L76 75 L48 8 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="4" />
            {/* Core blue lines on sides */}
            <path d="M-45 70 L-42 120 H-32 L-36 70 Z" fill="#1D4ED8" />
            <path d="M45 70 L42 120 H32 L36 70 Z" fill="#1D4ED8" />
            {/* Gold tiger badge */}
            <circle cx="-20" cy="40" r="10" fill="#3B82F6" />
            <path d="M-24 40 H-16 L-20 45 Z" fill="#FBBF24" />
            {/* Giant "10" number on center of shirt */}
            <text x="0" y="90" fontSize="36" fontWeight="bold" fill="#FFFFFF" textAnchor="middle" fontFamily="sans-serif">10</text>
          </g>
        );
      case "diver":
        return (
          <g>
            {/* Deep sea diving wetsuit (black & yellow stripes) with air tank on back */}
            {/* Oxygen tank backdrop */}
            <rect x="-26" y="-15" width="22" height="110" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="4" rx="10" />
            <rect x="4" y="-15" width="22" height="110" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="4" rx="10" />

            {/* Suit body */}
            <path d="M-46 0 L-72 82 L-48 82 L-42 118 H42 L48 82 L72 82 L46 0 Z" fill="#1E2937" stroke="#111827" strokeWidth="4" />
            {/* Yellow athletic warning stripes */}
            <rect x="-42" y="35" width="84" height="14" fill="#EAB308" />
            <rect x="-40" y="80" width="80" height="14" fill="#EAB308" />
          </g>
        );
      case "hairstylist":
        return (
          <g>
            {/* Stylish denim bib apron over shirt */}
            <path d="M-48 10 L-74 85 L-50 85 L-42 118 H42 L50 85 L74 85 L48 10 Z" fill="#F43F5E" opacity="0.3" />
            <path d="M-34 30 L-32 118 H32 L34 30 Z" fill="#475569" stroke="#1E293B" strokeWidth="4" />
            {/* Apron straps */}
            <line x1="-34" y1="30" x2="-44" y2="10" stroke="#1E293B" strokeWidth="4" />
            <line x1="34" y1="30" x2="44" y2="10" stroke="#1E293B" strokeWidth="4" />
            {/* Pocket filled with colorful scissors, hairspray */}
            <rect x="-20" y="65" width="40" height="38" fill="#334155" stroke="#E2E8F0" strokeWidth="1.5" rx="2" />
            {/* Scissor handles peaking out of pocket */}
            <circle cx="-8" cy="48" r="8" fill="none" stroke="#D1D5DB" strokeWidth="3" />
            <circle cx="8" cy="48" r="8" fill="none" stroke="#D1D5DB" strokeWidth="3" />
          </g>
        );
      case "gamedeveloper":
        return (
          <g>
            {/* Tech Hoodie with high contrast 8bit graphic hoodie strings */}
            <path d="M-48 14 L-76 80 L-50 80 L-42 122 H42 L50 80 L76 80 L48 14 Z" fill="#312E81" stroke="#1E1B4B" strokeWidth="4" />
            {/* Cute big hood pocket */}
            <path d="M-28 85 H28 L20 115 H-20 Z" fill="#1E1B4B" stroke="#818CF8" />
            {/* Retro controller neon print */}
            <rect x="-18" y="40" width="36" height="20" fill="#4338CA" rx="4" />
            <circle cx="-10" cy="50" r="3" fill="#EC4899" />
            <circle cx="10" cy="50" r="3" fill="#06B6D4" />
            <path d="M-2 50 H2 M0 48 V52" stroke="#FFFFFF" strokeWidth="2" />
          </g>
        );
      case "artist":
        return (
          <g>
            {/* Shirt background */}
            <path d="M-46 14 L-72 80 L-50 80 L-42 120 H42 L50 80 L76 80 L46 14 Z" fill="#FFFBEB" stroke="#D97706" strokeWidth="4" />
            {/* Linen apron */}
            <path d="M-28 35 L-24 120 H24 L28 35 Z" fill="#D97706" stroke="#92400E" strokeWidth="3" />
            {/* Colorful paint splatters */}
            <circle cx="-12" cy="55" r="5" fill="#3B82F6" />
            <circle cx="8" cy="65" r="4" fill="#EF4444" />
            <circle cx="-6" cy="95" r="6" fill="#FBBF24" />
            <circle cx="12" cy="90" r="3.5" fill="#10B981" />
            {/* Palette brush peaking out of pocket */}
            <path d="M-18 80 H-4 V110 H-18 Z" fill="#78350F" opacity="0.8" />
            <path d="M-15 65 L-11 80" stroke="#78350F" strokeWidth="3.5" />
            <circle cx="-11" cy="63" r="3.5" fill="#F43F5E" />
          </g>
        );
      case "detective":
        return (
          <g>
            {/* Trench Coat Double-breasted checkered shape */}
            <path d="M-48 10 L-76 80 L-50 80 L-44 124 H44 L50 80 L76 80 L48 10 Z" fill="#78350F" stroke="#451A03" strokeWidth="4.5" />
            {/* Turn-down classic lapels collar */}
            <polygon points="-40,10 0,35 -20,55" fill="#451A03" />
            <polygon points="40,10 0,35 20,55" fill="#451A03" />
            {/* Double buttons rows */}
            <circle cx="-14" cy="60" r="4.5" fill="#F59E0B" stroke="#451A03" strokeWidth="1.5" />
            <circle cx="14" cy="60" r="4.5" fill="#F59E0B" stroke="#451A03" strokeWidth="1.5" />
            <circle cx="-14" cy="85" r="4.5" fill="#F59E0B" stroke="#451A03" strokeWidth="1.5" />
            <circle cx="14" cy="85" r="4.5" fill="#F59E0B" stroke="#451A03" strokeWidth="1.5" />
            {/* Waist Belt */}
            <rect x="-43" y="102" width="86" height="12" fill="#451A03" />
            <rect x="-8" y="99" width="16" height="18" fill="none" stroke="#FBBF24" strokeWidth="2.5" rx="2" />
          </g>
        );
      case "builder":
        return (
          <g>
            {/* Flannel long-sleeve base shirt */}
            <path d="M-48 12 L-76 80 L-50 80 L-42 122 H42 L50 80 L76 80 L48 12 Z" fill="#EA580C" stroke="#9A3412" strokeWidth="4" />
            <line x1="-70" y1="50" x2="-58" y2="35" stroke="#9A3412" strokeWidth="2" />
            <line x1="70" y1="50" x2="58" y2="35" stroke="#9A3412" strokeWidth="2" />
            {/* Neon safety vest body */}
            <path d="M-34 26 L-32 122 H32 L34 26 Z" fill="#EAB308" stroke="#854D0E" strokeWidth="3.5" />
            {/* Gray retro-reflective tape vertical & horizontal stripes */}
            <rect x="-24" y="35" width="8" height="87" fill="#9CA3AF" stroke="#4B5563" strokeWidth="1" />
            <rect x="16" y="35" width="8" height="87" fill="#9CA3AF" stroke="#4B5563" strokeWidth="1" />
            <rect x="-32.5" y="75" width="65" height="12" fill="#9CA3AF" stroke="#4B5563" strokeWidth="1" />
          </g>
        );
      case "gardener":
        return (
          <g>
            {/* Yellow base shirt */}
            <path d="M-46 14 L-74 80 L-50 80 L-42 120 H42 L50 80 L74 80 L46 14 Z" fill="#FCD34D" stroke="#D97706" strokeWidth="4" />
            {/* Green linen garden apron */}
            <path d="M-30 38 L-26 120 H26 L30 38 Z" fill="#059669" stroke="#047857" strokeWidth="3.5" />
            {/* Soft pink daisy flowers poking out of pockets */}
            <rect x="6" y="75" width="16" height="18" fill="#047857" rx="2" />
            <circle cx="14" cy="65" r="4.5" fill="#F43F5E" />
            <circle cx="14" cy="65" r="1.5" fill="#FBBF24" />
            {/* Left pocket with mini rake gardening tool */}
            <rect x="-22" y="75" width="16" height="18" fill="#047857" rx="2" />
            <path d="M-17 60 V75 M-21 60 H-13 M-21 60 V65 M-17 60 V65 M-13 60 V65" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );
      case "judge":
        return (
          <g>
            {/* Dark sacred black legal gown robes */}
            <path d="M-50 8 L-78 85 L-52 85 L-44 125 H44 L52 85 L78 85 L50 8 Z" fill="#111827" stroke="#1F2937" strokeWidth="4.5" />
            {/* Distinct purple velvet broad bands running down front collar */}
            <path d="M-15 15 L-10 125 H10 L15 15 Z" fill="#581C87" opacity="0.8" />
            {/* Golden scales emblem badge pinned on breast */}
            <circle cx="-25" cy="45" r="7.5" fill="#EAB308" stroke="#F59E0B" strokeWidth="1.5" />
            <line x1="-25" y1="41" x2="-25" y2="50" stroke="#F59E0B" strokeWidth="2" />
            <line x1="-29" y1="43" x2="-21" y2="43" stroke="#F59E0B" strokeWidth="2.5" />
          </g>
        );
      case "lifeguard":
        return (
          <g>
            {/* Red swim keeper short-sleeve shirt */}
            <path d="M-46 12 L-72 75 L-48 75 L-42 120 H42 L48 75 L72 75 L46 12 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="4" />
            {/* Bold Yellow life-guard cross printed on center */}
            <rect x="-5" y="45" width="10" height="30" fill="#FBBF24" rx="1.5" />
            <rect x="-15" y="55" width="30" height="10" fill="#FBBF24" rx="1.5" />
            {/* Whistle hanging around neck */}
            <path d="M-8 12 Q 0 45 8 12" fill="none" stroke="#F3F4F6" strokeWidth="2.5" />
            <rect x="-4" y="32" width="8" height="12" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1" rx="1" />
          </g>
        );
      case "musician":
        return (
          <g>
            {/* White dress shirt background layer */}
            <path d="M-44 14 L-70 80 L-50 80 L-42 120 H42 L50 80 L70 80 L44 14 Z" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="4" />
            {/* Sharp tuxedo tailcoat jacket on sides */}
            <path d="M-45 14 L-72 80 L-50 80 L-42 120 H-14 L-24 14 Z" fill="#1F2937" stroke="#111827" strokeWidth="3" />
            <path d="M45 14 L72 80 L50 80 L42 120 H14 L24 14 Z" fill="#1F2937" stroke="#111827" strokeWidth="3" />
            {/* Crimson red butterfly bow tie for orchestra concert */}
            <polygon points="-12,28 0,38 -12,48" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
            <polygon points="12,28 0,38 12,48" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
            <circle cx="0" cy="38" r="4.5" fill="#EF4444" />
          </g>
        );
      case "clown":
        return (
          <g>
            {/* Rainbow Dot crazy suspenders shirt */}
            <path d="M-48 10 L-76 80 L-50 80 L-42 120 H42 L50 80 L76 80 L48 10 Z" fill="#FFFDEB" stroke="#CA8A04" strokeWidth="4" />
            {/* Big colorful polka dots */}
            <circle cx="-15" cy="45" r="5" fill="#3B82F6" />
            <circle cx="20" cy="52" r="7.5" fill="#10B981" />
            <circle cx="-25" cy="85" r="6" fill="#F43F5E" />
            {/* Funny suspenders straps */}
            <rect x="-30" y="10" width="8" height="110" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
            <rect x="22" y="10" width="8" height="110" fill="#EF4444" stroke="#991B1B" strokeWidth="1.5" />
            {/* Golden giant water squirt flower badge */}
            <circle cx="0" cy="72" r="14" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
            <circle cx="0" cy="72" r="5" fill="#EF4444" />
          </g>
        );
      case "racer":
        return (
          <g>
            {/* Professional carbon reinforcement speed suit */}
            <path d="M-48 10 L-76 80 L-50 80 L-42 122 H42 L50 80 L76 80 L48 10 Z" fill="#262626" stroke="#171717" strokeWidth="4.5" />
            {/* Checker pattern stripes along shoulders and arms */}
            <rect x="-70" y="40" width="16" height="16" fill="#FFFFFF" />
            <rect x="-54" y="40" width="16" height="16" fill="#171717" />
            <rect x="54" y="40" width="16" height="16" fill="#FFFFFF" />
            <rect x="38" y="40" width="16" height="16" fill="#171717" />
            {/* Red racing crest and stripes down chest */}
            <path d="M -30 20 L -30 122 H -20 L -20 20 Z" fill="#EF4444" />
            <path d="M 30 20 L 30 122 H 20 L 20 20 Z" fill="#EF4444" />
            {/* Dynamic speed star emblem */}
            <polygon points="0,52 3,59 10,59 5,64 7,71 0,67 -7,71 -5,64 -10,59 -3,59" fill="#FBBF24" />
          </g>
        );
      case "vet":
        return (
          <g>
            {/* Clean mint green medical scrubs vest */}
            <path d="M-46 14 L-74 80 L-50 80 L-42 120 H42 L50 80 L74 80 L46 14 Z" fill="#34D399" stroke="#059669" strokeWidth="4" />
            {/* Stethoscope around neck hanging on the chest */}
            <path d="M-15 14 Q 0 45 15 14" fill="none" stroke="#6B7280" strokeWidth="3.5" />
            <path d="M-15 14 V24 M15 14 V24" stroke="#9CA3AF" strokeWidth="5.5" strokeLinecap="round" />
            {/* Stethoscope sensor/soundpiece listening head */}
            <circle cx="10" cy="52" r="7" fill="#4B5563" stroke="#D1D5DB" strokeWidth="2" />
            {/* Puppy print badge on left chest pocket */}
            <rect x="-28" y="45" width="18" height="20" fill="#059669" rx="2" />
            <circle cx="-19" cy="52" r="4.5" fill="#FFFFFF" />
            {/* Dog nose */}
            <circle cx="-19" cy="-52" r="1" fill="#111827" />
          </g>
        );
      default:
        return null;
    }
  };

  return <g style={transformStyle}>{getTopSVG()}</g>;
};

export const BottomRenderer: React.FC<{ jobId: string } & RenderProps> = ({ jobId, x, y, scale, rotation }) => {
  const transformStyle = {
    // Fits on base line of torso coordinates
    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
    transformOrigin: "center top",
    transition: "transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  };

  const getBottomSVG = () => {
    switch (jobId) {
      case "firefighter":
        return (
          <g>
            {/* Pant split leg style fire pants */}
            <path d="M-44 0 L-46 110 H-10 L-5 50 L5 50 L10 110 H46 L44 0 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="4" />
            {/* Yellow reflective bottom cuffs */}
            <rect x="-45.5" y="80" width="34.5" height="12" fill="#FBBF24" />
            <rect x="11" y="80" width="34.5" height="12" fill="#FBBF24" />
          </g>
        );
      case "police":
        return (
          <g>
            {/* Dark Navy dress pants */}
            <path d="M-43 0 L-42 115 H-12 L-4 50 L4 50 L12 115 H42 L43 0 Z" fill="#1E3A8A" stroke="#172554" strokeWidth="4" />
            {/* Belt and golden buckle */}
            <rect x="-43" y="0" width="86" height="10" fill="#111827" />
            <rect x="-10" y="-2" width="20" height="14" fill="#FBBF24" rx="2" />
          </g>
        );
      case "doctor":
        return (
          <g>
            {/* Surgical scrubs teal bottoms */}
            <path d="M-42 0 L-40 108 H-12 L-4 48 L4 48 L12 108 H40 L42 0 Z" fill="#0D9488" stroke="#0F766E" strokeWidth="4" />
          </g>
        );
      case "nurse":
        return (
          <g>
            {/* Cute pink uniform pants */}
            <path d="M-40 0 L-38 105 H-12 L-4 45 L4 45 L12 105 H38 L40 0 Z" fill="#FFE4E6" stroke="#FDA4AF" strokeWidth="4" />
          </g>
        );
      case "baker":
        return (
          <g>
            {/* Checkered chef trousers */}
            <path d="M-42 0 L-42 112 H-12 L-4 50 L4 50 L12 112 H42 L42 0 Z" fill="#374151" stroke="#1F2937" strokeWidth="4" />
            {/* Checkered patterns vertical/horizontal lines */}
            <path d="M-32 0 V112 M-22 0 V112 M-12 0 V112 M12 0 V112 M22 0 V112 M32 0 V112" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3,3" />
          </g>
        );
      case "zookeeper":
        return (
          <g>
            {/* Safari active cargo shorts */}
            <path d="M-43 0 L-45 65 H-15 L-5 45 L5 45 L15 65 H45 L43 0 Z" fill="#D97706" stroke="#B45309" strokeWidth="4" />
            {/* Flap cargo pockets on sides */}
            <rect x="-42" y="20" width="12" height="24" fill="#78350F" rx="2" />
            <rect x="30" y="20" width="12" height="24" fill="#78350F" rx="2" />
          </g>
        );
      case "ballerina":
        return (
          <g>
            {/* Puffy Ballet tutu layers */}
            <ellipse cx="0" cy="18" rx="85" ry="24" fill="#F472B6" stroke="#DB2777" strokeWidth="3" />
            <ellipse cx="0" cy="12" rx="72" ry="18" fill="#FBCFE8" />
            <ellipse cx="0" cy="6" rx="55" ry="12" fill="#FFF1F2" />
            {/* Tights legs showing */}
            <rect x="-18" y="22" width="10" height="90" fill="#FFE4E6" />
            <rect x="8" y="22" width="10" height="90" fill="#FFE4E6" />
          </g>
        );
      case "idol":
        return (
          <g>
            {/* Metallic stage pants */}
            <path d="M-43 0 L-44 110 H-14 L-4 50 L4 50 L14 110 H44 L43 0 Z" fill="#C084FC" stroke="#7C3AED" strokeWidth="4" />
            {/* Left knee sparkly star patch */}
            <polygon points="-24,65 -22,70 -16,70 -20,74 -18,80 -24,76 -30,80 -28,74 -32,70 -26,70" fill="#FFFFFF" />
          </g>
        );
      case "skating":
        return (
          <g>
            {/* Sparkly ice skirt and tights legs */}
            <path d="M-44 0 C-44 45 44 45 44 0" fill="#38BDF8" stroke="#0284C7" strokeWidth="3" />
            <path d="M-48 6 C-30 35 30 35 48 6" fill="rgba(125, 211, 252, 0.8)" />
            {/* White sheer tights legs */}
            <rect x="-18" y="20" width="12" height="90" fill="#F1F5F9" stroke="#E2E8F0" />
            <rect x="8" y="20" width="12" height="90" fill="#F1F5F9" stroke="#E2E8F0" />
          </g>
        );
      case "mechanic":
        return (
          <g>
            {/* Heavy overalls legs coordinate */}
            <path d="M-44 0 L-46 112 H-16 L-4 50 L4 50 L16 112 H46 L44 0 Z" fill="#1D4ED8" stroke="#172554" strokeWidth="4" />
          </g>
        );
      case "astronaut":
        return (
          <g>
            {/* Fluffy Astronaut White Space trousers */}
            <path d="M-46 0 L-48 114 H-16 L-4 52 L4 52 L16 114 H48 L46 0 Z" fill="#F8FAFC" stroke="#64748B" strokeWidth="4" />
            {/* Thick air seams ribbed padding */}
            <line x1="-42" y1="50" x2="-22" y2="50" stroke="#94A3B8" strokeWidth="3" />
            <line x1="-44" y1="75" x2="-20" y2="75" stroke="#94A3B8" strokeWidth="3" />
            <line x1="22" y1="50" x2="42" y2="50" stroke="#94A3B8" strokeWidth="3" />
            <line x1="20" y1="75" x2="44" y2="75" stroke="#94A3B8" strokeWidth="3" />
          </g>
        );
      case "pilot":
        return (
          <g>
            {/* Sharp navy officer trousers */}
            <path d="M-42 0 L-42 115 H-12 L-4 50 L4 50 L12 115 H42 L42 0 Z" fill="#0F172A" stroke="#1E293B" strokeWidth="4" />
          </g>
        );
      case "explorer":
        return (
          <g>
            {/* Explorer Desert Shorts */}
            <path d="M-42 0 L-44 60 H-14 L-5 42 L5 42 L14 60 H44 L42 0 Z" fill="#CA8A04" stroke="#854D0E" strokeWidth="4" />
            {/* Belt and buckle */}
            <rect x="-42" y="0" width="84" height="8" fill="#5F370E" />
            <rect x="-8" y="-2" width="16" height="12" fill="#EAB308" />
          </g>
        );
      case "magician":
        return (
          <g>
            {/* Pinstripe tux pants */}
            <path d="M-42 0 L-42 114 H-12 L-4 50 L4 50 L12 114 H42 L42 0 Z" fill="#111827" stroke="#1F2937" strokeWidth="4" />
            {/* Silver vertical pinstripes */}
            <line x1="-30" y1="0" x2="-30" y2="114" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="-18" y1="0" x2="-18" y2="114" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="18" y1="0" x2="18" y2="114" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="5,5" />
            <line x1="30" y1="0" x2="30" y2="114" stroke="#9CA3AF" strokeWidth="1" strokeDasharray="5,5" />
          </g>
        );
      case "scientist":
        return (
          <g>
            {/* Scientific lab white trousers */}
            <path d="M-40 0 L-38 108 H-12 L-4 48 L4 48 L12 108 H38 L40 0 Z" fill="#FFFFFF" stroke="#CFD8DC" strokeWidth="4" />
          </g>
        );
      case "farmer":
        return (
          <g>
            {/* Cute denim patch farm trousers */}
            <path d="M-43 0 L-45 110 H-14 L-4 50 L4 50 L14 110 H45 L43 0 Z" fill="#047857" stroke="#064E3B" strokeWidth="4" />
            {/* Patches with sunflowers */}
            <rect x="-35" y="65" width="15" height="16" fill="#F59E0B" rx="1.5" />
            <line x1="-35" y1="65" x2="-20" y2="81" stroke="#064E3B" strokeWidth="1.5" />
            <line x1="-20" y1="65" x2="-35" y2="81" stroke="#064E3B" strokeWidth="1.5" />
          </g>
        );
      case "soccer":
        return (
          <g>
            {/* Athletic sports running shorts */}
            <path d="M-44 0 L-46 45 H-18 L-5 30 L5 30 L18 45 H46 L44 0 Z" fill="#111827" stroke="#374151" strokeWidth="3" />
            {/* Sport stripes down sides */}
            <path d="M-44 0 L-45 45 H-40 L-39 0 Z" fill="#EF4444" />
            <path d="M44 0 L45 45 H40 L40 0 Z" fill="#EF4444" />
          </g>
        );
      case "diver":
        return (
          <g>
            {/* diving wetsuit snug trousers */}
            <path d="M-42 0 L-40 114 H-12 L-4 50 L4 50 L12 114 H40 L42 0 Z" fill="#111827" stroke="#1F2937" strokeWidth="4" />
          </g>
        );
      case "hairstylist":
        return (
          <g>
            {/* Carpenter active stylist cargo pants */}
            <path d="M-43 0 L-44 110 H-14 L-4 48 L4 48 L14 110 H44 L43 0 Z" fill="#4B5563" stroke="#374151" strokeWidth="4" />
            <rect x="-38" y="45" width="10" height="20" fill="#374151" rx="1" />
          </g>
        );
      case "gamedeveloper":
        return (
          <g>
            {/* Comfortable fleece joggers with cyan side stripes */}
            <path d="M-43 0 L-42 112 H-15 L-4 50 L4 50 L15 112 H42 L43 0 Z" fill="#1E1B4B" stroke="#312E81" strokeWidth="4" />
            {/* Cyber neon pink stripes */}
            <path d="M-42 0 L-40 112 H-37 L-39 0 Z" fill="#EC4899" />
            <path d="M42 0 L40 112 H37 L39 0 Z" fill="#06B6D4" />
          </g>
        );
      case "artist":
        return (
          <g>
            {/* Soft gray painter slacks with colorful splatters */}
            <path d="M-42 0 L-40 112 H-14 L-4 48 L4 48 L14 112 H40 L42 0 Z" fill="#4B5563" stroke="#1F2937" strokeWidth="4" />
            <circle cx="-25" cy="40" r="4.5" fill="#EF4444" opacity="0.8" />
            <circle cx="28" cy="65" r="3.5" fill="#3B82F6" opacity="0.8" />
            <circle cx="-18" cy="85" r="4" fill="#FBBF24" opacity="0.8" />
            <circle cx="20" cy="95" r="5" fill="#10B981" opacity="0.8" />
          </g>
        );
      case "detective":
        return (
          <g>
            {/* Smart plaid brown inspector slacks */}
            <path d="M-41 0 L-39 114 H-13 L-4 48 L4 48 L13 114 H39 L41 0 Z" fill="#78350F" stroke="#451A03" strokeWidth="4" />
            <path d="M-18 0 V114 M18 0 V114 M-28 0 V114 M28 0 V114" stroke="#451A03" strokeWidth="1" strokeDasharray="4,4" />
          </g>
        );
      case "builder":
        return (
          <g>
            {/* Tough blue carpenter canvas utility pants */}
            <path d="M-43 0 L-40 112 H-13 L-5 50 L5 50 L13 112 H40 L43 0 Z" fill="#1D4ED8" stroke="#172554" strokeWidth="4" />
            {/* Safety stripes and heavy knee pads */}
            <rect x="-34" y="60" width="14" height="24" fill="#2563EB" stroke="#172554" strokeWidth="1.5" rx="3" />
            <rect x="20" y="60" width="14" height="24" fill="#2563EB" stroke="#172554" strokeWidth="1.5" rx="3" />
            {/* Yellow knee tape */}
            <rect x="-34" y="55" width="14" height="5" fill="#EAB308" />
            <rect x="20" y="55" width="14" height="5" fill="#EAB308" />
          </g>
        );
      case "gardener":
        return (
          <g>
            {/* Soft muddy brown gardening pants */}
            <path d="M-42 0 L-40 110 H-13 L-4 48 L4 48 L13 110 H40 L42 0 Z" fill="#78350F" stroke="#451A03" strokeWidth="4" />
            {/* Dirt patches on knees */}
            <ellipse cx="-22" cy="70" rx="9" ry="12" fill="#451A03" opacity="0.3" />
            <ellipse cx="22" cy="74" rx="10" ry="14" fill="#451A03" opacity="0.25" />
          </g>
        );
      case "judge":
        return (
          <g>
            {/* Smart formal black wool slacks */}
            <path d="M-41 0 L-40 115 H-14 L-4 50 L4 50 L14 115 H40 L41 0 Z" fill="#1F2937" stroke="#111827" strokeWidth="4" />
            {/* Sharp center trouser press crease */}
            <line x1="-24" y1="0" x2="-24" y2="115" stroke="#4B5563" strokeWidth="2.5" />
            <line x1="24" y1="0" x2="24" y2="115" stroke="#4B5563" strokeWidth="2.5" />
          </g>
        );
      case "lifeguard":
        return (
          <g>
            {/* Bright red sports boardshorts */}
            <path d="M-44 0 L-46 55 H-18 L-5 35 L5 35 L18 55 H46 L44 0 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="4" />
            {/* Lifesaver white stripes on sides */}
            <path d="M-44 0 L-45 55 H-40 L-40 0 Z" fill="#FFFFFF" />
            <path d="M44 0 L45 55 H40 L40 0 Z" fill="#FFFFFF" />
          </g>
        );
      case "musician":
        return (
          <g>
            {/* Perfect black tuxedo match pants */}
            <path d="M-41 0 L-40 114 H-13 L-4 50 L4 50 L13 114 H40 L41 0 Z" fill="#111827" stroke="#1F2937" strokeWidth="4" />
            {/* White satin side stripe ribbons */}
            <line x1="-38.5" y1="0" x2="-38" y2="114" stroke="#FFFFFF" strokeWidth="2.5" />
            <line x1="38.5" y1="0" x2="38" y2="114" stroke="#FFFFFF" strokeWidth="2.5" />
          </g>
        );
      case "clown":
        return (
          <g>
            {/* Giant oversized funny polka dot pants */}
            <path d="M-55 0 L-68 105 H-20 L-6 40 L6 40 L20 105 H68 L55 0 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="4.5" />
            {/* Giant teal patches on knees */}
            <rect x="-48" y="55" width="22" height="24" fill="#06B6D4" stroke="#D97706" strokeWidth="2" rx="4" />
            <path d="M-48 55 L-26 79 M-26 55 L-48 79" stroke="#E0F2FE" strokeWidth="2" />
            <rect x="26" y="55" width="22" height="24" fill="#10B981" stroke="#D97706" strokeWidth="2" rx="4" />
            <path d="M26 55 L48 79 M48 55 L26 79" stroke="#E5F6DF" strokeWidth="2" />
          </g>
        );
      case "racer":
        return (
          <g>
            {/* Sleek racing composite slacks */}
            <path d="M-42 0 L-40 112 H-13 L-4 50 L4 50 L13 112 H40 L42 0 Z" fill="#171717" stroke="#404040" strokeWidth="4" />
            {/* Checkered print lower calves protectors */}
            <rect x="-40" y="70" width="13" height="30" fill="#FFFFFF" />
            <rect x="-37" y="70" width="5" height="30" fill="#EF4444" />
            <rect x="27" y="70" width="13" height="30" fill="#FFFFFF" />
            <rect x="32" y="70" width="5" height="30" fill="#EF4444" />
          </g>
        );
      case "vet":
        return (
          <g>
            {/* Seafoam mint green hospital pants */}
            <path d="M-41 0 L-39 110 H-13 L-4 48 L4 48 L13 110 H39 L41 0 Z" fill="#34D399" stroke="#059669" strokeWidth="4" />
          </g>
        );
      default:
        return null;
    }
  };

  return <g style={transformStyle}>{getBottomSVG()}</g>;
};

export const ShoesRenderer: React.FC<{ jobId: string } & RenderProps> = ({ jobId, x, y, scale, rotation }) => {
  const transformStyle = {
    // Fits at the base location of bottom leg lines
    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
    transformOrigin: "center top",
    transition: "transform 0.1s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  };

  const getShoesSVG = () => {
    switch (jobId) {
      case "firefighter":
        return (
          <g>
            {/* Heavy black fire rubber boots */}
            <path d="M-46 0 L-48 24 L-58 26 C-62 26 -65 34 -58 36 H-10 V0 Z" fill="#1F2937" stroke="#111827" strokeWidth="2" />
            <path d="M46 0 L48 24 L58 26 C62 26 65 34 58 36 H10 V0 Z" fill="#1F2937" stroke="#111827" strokeWidth="2" />
            {/* Highlight steel cap gold bands */}
            <rect x="-42" y="8" width="8" height="3" fill="#FBBF24" />
            <rect x="34" y="8" width="8" height="3" fill="#FBBF24" />
          </g>
        );
      case "police":
        return (
          <g>
            {/* Shiny black police uniform shoes */}
            <path d="M-44 0 L-44 15 L-54 18 C-58 18 -60 26 -52 28 H-12 V0 Z" fill="#111827" stroke="#000" strokeWidth="2" />
            <path d="M44 0 L44 15 L54 18 C58 18 60 26 52 28 H12 V0 Z" fill="#111827" stroke="#000" strokeWidth="2" />
          </g>
        );
      case "doctor":
        return (
          <g>
            {/* Comfortable White Medical Clogs */}
            <path d="M-42 0 L-42 16 C-48 16 -54 20 -50 28 H-12 V0 Z" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="3" />
            <path d="M42 0 L42 16 C48 16 54 20 50 28 H12 V0 Z" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="3" />
            {/* Breathable cute speed bumps holes */}
            <circle cx="-35" cy="18" r="1.5" fill="#94A3B8" />
            <circle cx="-42" cy="18" r="1.5" fill="#94A3B8" />
            <circle cx="35" cy="18" r="1.5" fill="#94A3B8" />
            <circle cx="42" cy="18" r="1.5" fill="#94A3B8" />
          </g>
        );
      case "nurse":
        return (
          <g>
            {/* Clean White Sneakers */}
            <path d="M-40 0 L-40 18 L-50 22 C-55 22 -56 28 -48 30 H-12 V0 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="3.5" />
            <path d="M40 0 L40 18 L50 22 C55 22 56 28 48 30 H12 V0 Z" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="3.5" />
            {/* Pink lacing lines */}
            <line x1="-36" y1="12" x2="-28" y2="12" stroke="#FDA4AF" strokeWidth="2" />
            <line x1="36" y1="12" x2="28" y2="12" stroke="#FDA4AF" strokeWidth="2" />
          </g>
        );
      case "baker":
        return (
          <g>
            {/* Bakery shoes & Oven mitt overlay */}
            <path d="M-44 0 L-44 14 L-54 18 C-58 18 -60 26 -52 28 H-12 V0 Z" fill="#FFFFFF" stroke="#CFD8DC" strokeWidth="2" />
            <path d="M44 0 L44 14 L54 18 C58 18 60 26 52 28 H12 V0 Z" fill="#FFFFFF" stroke="#CFD8DC" strokeWidth="2" />
          </g>
        );
      case "zookeeper":
        return (
          <g>
            {/* Brown rugged leather safety boots */}
            <path d="M-45 0 L-46 22 L-56 24 C-60 24 -62 32 -54 34 H-14 V0 Z" fill="#92400E" stroke="#451A03" strokeWidth="2.5" />
            <path d="M45 0 L46 22 L56 24 C60 24 62 32 54 34 H14 V0 Z" fill="#92400E" stroke="#451A03" strokeWidth="2.5" />
            {/* Yellow shoelace stitches */}
            <line x1="-40" y1="14" x2="-32" y2="10" stroke="#FBBF24" strokeWidth="2" />
            <line x1="40" y1="14" x2="32" y2="10" stroke="#FBBF24" strokeWidth="2" />
          </g>
        );
      case "ballerina":
        return (
          <g>
            {/* Ballet pink slippers with ribbon laces */}
            <path d="M-18 0 C-22 25 -32 25 -28 32 H-8 V0 Z" fill="#FBCFE8" stroke="#F472B6" strokeWidth="2" />
            <path d="M8 0 C12 25 32 25 28 32 H8 V0 Z" fill="#FBCFE8" stroke="#F472B6" strokeWidth="2" />
            {/* Ribbons intersecting */}
            <line x1="-18" y1="-25" x2="-24" y2="10" stroke="#F472B6" strokeWidth="1.5" />
            <line x1="-28" y1="-25" x2="-20" y2="10" stroke="#F472B6" strokeWidth="1.5" />
            <line x1="18" y1="-25" x2="24" y2="10" stroke="#F472B6" strokeWidth="1.5" />
            <line x1="28" y1="-25" x2="20" y2="10" stroke="#F472B6" strokeWidth="1.5" />
          </g>
        );
      case "idol":
        return (
          <g>
            {/* Silver shiny high platform stage boots */}
            <path d="M-18 0 V24 L-28 26 C-34 26 -34 34 -28 36 H-10 V0 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="3" />
            <path d="M18 0 V24 L28 26 C34 26 34 34 28 36 H10 V0 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="3" />
            {/* Star badge shines details */}
            <circle cx="-16" cy="18" r="4" fill="#FBBF24" />
            <circle cx="16" cy="18" r="4" fill="#FBBF24" />
          </g>
        );
      case "skating":
        return (
          <g>
            {/* Ice skates boots and steel blades */}
            <path d="M-18 0 L-18 20 L-26 22 C-32 22 -32 28 -24 30 H-8 V0 Z" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="2" />
            <path d="M18 0 L18 20 L26 22 C32 22 32 28 24 30 H8 V0 Z" fill="#FFFFFF" stroke="#D1D5DB" strokeWidth="2" />
            {/* Silver skater blades below foot */}
            <rect x="-32" y="30" width="30" height="4" fill="#E2E8F0" stroke="#94A3B8" />
            <rect x="2" y="30" width="30" height="4" fill="#E2E8F0" stroke="#94A3B8" />
            {/* Vertical mounting support pins */}
            <line x1="-24" y1="28" x2="-24" y2="30" stroke="#94A3B8" strokeWidth="2.5" />
            <line x1="-12" y1="28" x2="-12" y2="30" stroke="#94A3B8" strokeWidth="2.5" />
            <line x1="24" y1="28" x2="24" y2="30" stroke="#94A3B8" strokeWidth="2.5" />
            <line x1="12" y1="28" x2="12" y2="30" stroke="#94A3B8" strokeWidth="2.5" />
          </g>
        );
      case "mechanic":
        return (
          <g>
            {/* Brown steel-toe mechanic oily boots */}
            <path d="M-46 0 L-48 24 L-58 26 C-62 26 -65 34 -58 36 H-10 V0 Z" fill="#78350F" stroke="#451A03" strokeWidth="2" />
            <path d="M46 0 L48 24 L58 26 C62 26 65 34 58 36 H10 V0 Z" fill="#78350F" stroke="#451A03" strokeWidth="2" />
          </g>
        );
      case "astronaut":
        return (
          <g>
            {/* Puffy Moon gravity boots */}
            <path d="M-18 0 V22 L-28 24 C-34 24 -36 34 -28 36 H-8 V0 Z" fill="#F1F5F9" stroke="#64748B" strokeWidth="4" />
            <path d="M18 0 V22 L28 24 C34 24 36 34 28 36 H8 V0 Z" fill="#F1F5F9" stroke="#64748B" strokeWidth="4" />
          </g>
        );
      case "pilot":
        return (
          <g>
            {/* High polish officer boots */}
            <path d="M-42 0 L-42 20 L-50 22 C-55 22 -55 28 -48 30 H-12 V0 Z" fill="#0F172A" stroke="#000" strokeWidth="2" />
            <path d="M42 0 L42 20 L50 22 C55 22 55 28 48 30 H12 V0 Z" fill="#0F172A" stroke="#000" strokeWidth="2" />
          </g>
        );
      case "explorer":
        return (
          <g>
            {/* explorer hiking ranger boots */}
            <path d="M-15 0 L-16 22 L-26 24 C-30 24 -32 32 -24 34 H-8 V0 Z" fill="#7C2D12" stroke="#431407" strokeWidth="2" />
            <path d="M15 0 L16 22 L26 24 C30 24 32 32 24 34 H8 V0 Z" fill="#7C2D12" stroke="#431407" strokeWidth="2" />
          </g>
        );
      case "magician":
        return (
          <g>
            {/* Magic shiny formal loafers */}
            <path d="M-42 0 L-42 16 C-48 16 -52 24 -46 26 H-12 V0 Z" fill="#111827" stroke="#374151" strokeWidth="2" />
            <path d="M42 0 L42 16 C48 16 52 24 46 26 H12 V0 Z" fill="#111827" stroke="#374151" strokeWidth="2" />
            <circle cx="-25" cy="18" r="3.5" fill="#EF4444" />
            <circle cx="25" cy="18" r="3.5" fill="#EF4444" />
          </g>
        );
      case "scientist":
        return (
          <g>
            {/* white specialized experimental sneakers */}
            <path d="M-38 0 L-38 18 L-48 22 C-52 22 -54 28 -46 30 H-12 V0 Z" fill="#ECEFF1" stroke="#90A4AE" strokeWidth="2.5" />
            <path d="M38 0 L38 18 L48 22 C52 22 54 28 46 30 H12 V0 Z" fill="#ECEFF1" stroke="#90A4AE" strokeWidth="2.5" />
          </g>
        );
      case "farmer":
        return (
          <g>
            {/* Heavy duty yellow mud rainboots */}
            <path d="M-45 0 V24 L-55 26 C-60 26 -60 34 -52 36 H-14 V0 Z" fill="#EAB308" stroke="#854D0E" strokeWidth="3" />
            <path d="M45 0 V24 L55 26 C60 26 60 34 52 36 H14 V0 Z" fill="#EAB308" stroke="#854D0E" strokeWidth="3" />
          </g>
        );
      case "soccer":
        return (
          <g>
            {/* Neon Green Soccer spikes and tall white team socks */}
            <rect x="-18" y="-15" width="10" height="15" fill="#FFFFFF" stroke="#E2E8F0" />
            <rect x="8" y="-15" width="10" height="15" fill="#FFFFFF" stroke="#E2E8F0" />
            {/* Neon Spikes */}
            <path d="M-18 0 L-18 18 L-28 20 C-34 20 -34 28 -28 30 H-8 V0 Z" fill="#84CC16" stroke="#4D7C0F" strokeWidth="2.5" />
            <path d="M18 0 L18 18 L28 20 C34 20 34 28 28 30 H8 V0 Z" fill="#84CC16" stroke="#4D7C0F" strokeWidth="2.5" />
            {/* Small spike studs under shoe */}
            <rect x="-24" y="30" width="3" height="3" fill="#111827" />
            <rect x="-14" y="30" width="3" height="3" fill="#111827" />
            <rect x="24" y="30" width="3" height="3" fill="#111827" />
            <rect x="14" y="30" width="3" height="3" fill="#111827" />
          </g>
        );
      case "diver":
        return (
          <g>
            {/* diving yellow fins / flippers */}
            <path d="M-18 0 L-18 14 L-45 32 L-20 40 L-10 14 V0 Z" fill="#EAB308" stroke="#CA8A04" strokeWidth="2" />
            <path d="M18 0 L18 14 L45 32 L20 40 L10 14 V0 Z" fill="#EAB308" stroke="#CA8A04" strokeWidth="2" />
          </g>
        );
      case "hairstylist":
        return (
          <g>
            {/* stylish thick platform work clogs */}
            <path d="M-42 0 L-42 22 C-48 22 -52 28 -46 32 H-12 V0 Z" fill="#3F3F46" stroke="#18181B" strokeWidth="3" />
            <path d="M42 0 L42 22 C48 22 52 28 46 32 H12 V0 Z" fill="#3F3F46" stroke="#18181B" strokeWidth="3" />
          </g>
        );
      case "gamedeveloper":
        return (
          <g>
            {/* LED smart lightup shoes */}
            <path d="M-18 0 V20 L-28 22 C-34 22 -35 30 -28 32 H-8 V0 Z" fill="#111827" stroke="#312E81" strokeWidth="3" />
            <path d="M18 0 V20 L28 22 C34 22 35 30 28 32 H8 V0 Z" fill="#111827" stroke="#312E81" strokeWidth="3" />
            {/* Cyan and Magenta glowing LED soles */}
            <path d="M-28 28 H-8 L-10 32 H-26 Z" fill="#06B6D4" opacity="0.9" />
            <path d="M28 28 H8 L10 32 H26 Z" fill="#EC4899" opacity="0.9" />
          </g>
        );
      case "artist":
        return (
          <g>
            {/* Canvas shoes with splatters */}
            <path d="M-38 0 L-38 18 C-44 18 -48 24 -42 26 H-12 V0 Z" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="2" />
            <path d="M38 0 L38 18 C48 18 52 24 42 26 H12 V0 Z" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="2" />
            <circle cx="-32" cy="18" r="2.5" fill="#EF4444" />
            <circle cx="32" cy="18" r="2.5" fill="#3B82F6" />
          </g>
        );
      case "detective":
        return (
          <g>
            {/* Dark brown silent detective oxford shoes */}
            <path d="M-40 0 L-40 18 L-50 20 C-54 20 -55 26 -48 28 H-12 V0 Z" fill="#451A03" stroke="#1C0A00" strokeWidth="2" />
            <path d="M40 0 L40 18 L50 20 C54 20 55 26 48 28 H12 V0 Z" fill="#451A03" stroke="#1C0A00" strokeWidth="2" />
            <line x1="-36" y1="12" x2="-22" y2="12" stroke="#1C0A00" strokeWidth="1.5" />
            <line x1="22" y1="12" x2="36" y2="12" stroke="#1C0A00" strokeWidth="1.5" />
          </g>
        );
      case "builder":
        return (
          <g>
            {/* Steel-toed heavy work safety boots */}
            <path d="M-42 0 L-44 24 L-54 26 C-58 26 -60 32 -52 34 H-10 V0 Z" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
            <path d="M42 0 L44 24 L54 26 C58 26 60 32 52 34 H10 V0 Z" fill="#B45309" stroke="#78350F" strokeWidth="2.5" />
            {/* Steel front caps protective lining */}
            <path d="M-52 22 C-55 22 -55 30 -47 30 L-42 30 V22 Z" fill="#9CA3AF" />
            <path d="M52 22 C55 22 55 30 47 30 L42 30 V22 Z" fill="#9CA3AF" />
          </g>
        );
      case "gardener":
        return (
          <g>
            {/* Robust olive green gardener boots */}
            <path d="M-40 0 V24 L-50 26 C-54 26 -54 32 -46 34 H-12 V0 Z" fill="#065F46" stroke="#047857" strokeWidth="2.5" />
            <path d="M40 0 V24 L50 26 C54 26 54 32 46 34 H12 V0 Z" fill="#065F46" stroke="#047857" strokeWidth="2.5" />
          </g>
        );
      case "judge":
        return (
          <g>
            {/* Classy formal high-shine leather shoes */}
            <path d="M-38 0 L-38 18 C-44 18 -48 24 -42 26 H-12 V0 Z" fill="#111827" stroke="#374151" strokeWidth="2" />
            <path d="M38 0 L38 18 C48 18 52 24 42 26 H12 V0 Z" fill="#111827" stroke="#374151" strokeWidth="2" />
            {/* Golden belt buckle on center of shoe */}
            <rect x="-32" y="10" width="8" height="6" fill="#FBBF24" rx="1" />
            <rect x="24" y="10" width="8" height="6" fill="#FBBF24" rx="1" />
          </g>
        );
      case "lifeguard":
        return (
          <g>
            {/* Special water sport sandals */}
            <path d="M-38 10 H-12" stroke="#EF4444" strokeWidth="4" />
            <path d="M12 10 H38" stroke="#EF4444" strokeWidth="4" />
            {/* Yellow dynamic soles */}
            <path d="M-42 16 H-10 C-10 24 -42 24 -42 16 Z" fill="#FBBF24" stroke="#D97706" />
            <path d="M10 16 H42 C42 24 10 24 10 16 Z" fill="#FBBF24" stroke="#D97706" />
          </g>
        );
      case "musician":
        return (
          <g>
            {/* Soft patent piano-pedal shoes with high flexibility */}
            <path d="M-38 0 L-38 16 C-44 16 -48 22 -42 24 H-12 V0 Z" fill="#1F2937" stroke="#111827" strokeWidth="2" />
            <path d="M38 0 L38 16 C48 16 52 22 42 24 H12 V0 Z" fill="#1F2937" stroke="#111827" strokeWidth="2" />
            {/* White trim highlight */}
            <ellipse cx="-25" cy="12" rx="3" ry="1.5" fill="#E5E7EB" />
            <ellipse cx="25" cy="12" rx="3" ry="1.5" fill="#E5E7EB" />
          </g>
        );
      case "clown":
        return (
          <g>
            {/* Massive disproportionate round clown red-orange shoes */}
            <ellipse cx="-40" cy="18" rx="28" ry="16" fill="#F97316" stroke="#C2410C" strokeWidth="3" />
            <ellipse cx="-35" cy="14" rx="12" ry="8" fill="#FBBF24" />
            <ellipse cx="40" cy="18" rx="28" ry="16" fill="#F97316" stroke="#C2410C" strokeWidth="3" />
            <ellipse cx="35" cy="14" rx="12" ry="8" fill="#FBBF24" />
          </g>
        );
      case "racer":
        return (
          <g>
            {/* Slick racing fireproof high-tops */}
            <path d="M-22 0 L-22 22 L-34 24 C-40 24 -42 30 -34 32 H-8 V0 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="2.5" />
            <path d="M22 0 L22 22 L34 24 C40 24 42 30 34 32 H8 V0 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="2.5" />
            {/* Sport stripes */}
            <line x1="-28" y1="12" x2="-14" y2="12" stroke="#FFFFFF" strokeWidth="3.5" />
            <line x1="14" y1="12" x2="28" y2="12" stroke="#FFFFFF" strokeWidth="3.5" />
          </g>
        );
      case "vet":
        return (
          <g>
            {/* Cute animal paw-print comfortable sneakers */}
            <path d="M-38 0 L-38 18 C-44 18 -48 24 -42 26 H-12 V0 Z" fill="#10B981" stroke="#047857" strokeWidth="2" />
            <path d="M38 0 L38 18 C48 18 52 24 42 26 H12 V0 Z" fill="#10B981" stroke="#047857" strokeWidth="2" />
            {/* Tiny dog footprints on sides */}
            <circle cx="-25" cy="14" r="2.5" fill="#FFFFFF" />
            <circle cx="-29" cy="10" r="1.2" fill="#FFFFFF" />
            <circle cx="-25" cy="8" r="1.2" fill="#FFFFFF" />
            <circle cx="-21" cy="10" r="1.2" fill="#FFFFFF" />
            <circle cx="25" cy="14" r="2.5" fill="#FFFFFF" />
            <circle cx="21" cy="10" r="1.2" fill="#FFFFFF" />
            <circle cx="25" cy="8" r="1.2" fill="#FFFFFF" />
            <circle cx="29" cy="10" r="1.2" fill="#FFFFFF" />
          </g>
        );
      default:
        return null;
    }
  };

  return <g style={transformStyle}>{getShoesSVG()}</g>;
};

// Merged preview model for drawing the final integrated costume (perfectly grouped and scaled)
export const MergedCostumeRenderer: React.FC<{
  topJobId: string;
  bottomJobId: string;
  // Dynamic scale ratios
  scale?: number;
  offsetY?: number;
}> = ({ topJobId, bottomJobId, scale = 1, offsetY = 0 }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="-160 -190 320 380"
      className="overflow-visible select-none pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.15)]"
    >
      <g transform={`translate(0, ${offsetY}) scale(${scale})`}>
        {/* Underlay shadow */}
        <ellipse cx="0" cy="145" rx="55" ry="10" fill="#E2E8F0" opacity="0.8" />

        {/* 1. SHOES on Bottom cuffs - drawn first */}
        <ShoesRenderer jobId={bottomJobId} x={0} y={130} scale={0.75} rotation={0} />

        {/* 2. BOTTOM Pants/Skirt on Lower half - drawn under Top */}
        <BottomRenderer jobId={bottomJobId} x={0} y={55} scale={0.75} rotation={0} />

        {/* 3. TOP Jacket on Chest - drawn on top of Bottom */}
        <TopRenderer jobId={topJobId} x={0} y={-35} scale={0.75} rotation={0} />

        {/* 4. HAT Accessory on Head - positioned slightly higher to widen gap */}
        <HatRenderer jobId={topJobId} x={0} y={-150} scale={0.85} rotation={0} />
      </g>
    </svg>
  );
};
