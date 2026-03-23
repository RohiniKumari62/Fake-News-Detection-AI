import { useEffect, useState } from 'react'

const MESSAGES = [
  "Hello! I'm Vera, your AI truth guardian.",
  "Did you know? 60% of people share news without reading it.",
  "Always verify before you amplify.",
  "Together we can build a more informed world.",
  "Ready to detect misinformation? Let's go!",
]

export default function RoboMascot({ phase, onDone }) {
  const [msgIndex, setMsgIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [typing, setTyping] = useState(true)

  useEffect(() => {
    if (phase !== 'awareness') return
    const msg = MESSAGES[msgIndex]
    let i = 0
    setDisplayed('')
    setTyping(true)
    const iv = setInterval(() => {
      i++
      setDisplayed(msg.slice(0, i))
      if (i >= msg.length) {
        clearInterval(iv)
        setTyping(false)
        if (msgIndex < MESSAGES.length - 1) {
          setTimeout(() => setMsgIndex((v) => v + 1), 1400)
        } else {
          setTimeout(() => onDone && onDone(), 1600)
        }
      }
    }, 36)
    return () => clearInterval(iv)
  }, [msgIndex, phase])

  const isWelcome = phase === 'welcome'
  const isAwareness = phase === 'awareness'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      <svg
        width="180" height="220" viewBox="0 0 180 220"
        style={{ overflow: 'visible', filter: 'drop-shadow(0 8px 24px rgba(59,130,246,0.18))' }}
      >
        <style>{`
          @keyframes robo-float {
            0%,100%{transform:translateY(0px)} 50%{transform:translateY(-8px)}
          }
          @keyframes robo-wave {
            0%,100%{transform:rotate(0deg) translateY(0)} 25%{transform:rotate(20deg) translateY(-4px)} 75%{transform:rotate(-10deg) translateY(-2px)}
          }
          @keyframes robo-welcome {
            0%{transform:rotate(0deg)} 25%{transform:rotate(-18deg)} 75%{transform:rotate(14deg)} 100%{transform:rotate(0deg)}
          }
          @keyframes eye-blink {
            0%,90%,100%{transform:scaleY(1)} 95%{transform:scaleY(0.08)}
          }
          @keyframes antenna-pulse {
            0%,100%{opacity:1;r:5} 50%{opacity:0.5;r:7}
          }
          @keyframes scan-line {
            0%{transform:translateY(0)} 100%{transform:translateY(38px)}
          }
          .robo-body { animation: robo-float 3.2s ease-in-out infinite; }
          .robo-eye { animation: eye-blink 4s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
          .antenna-dot { animation: antenna-pulse 1.8s ease-in-out infinite; }
          .arm-left { transform-origin: 28px 102px; transform-box: fill-box; }
          .arm-right { transform-origin: 152px 102px; transform-box: fill-box; }
          .arm-wave { animation: robo-wave 0.7s ease-in-out infinite; }
          .arm-welcome { animation: robo-welcome 1s ease-in-out forwards; }
          .scan-line { animation: scan-line 2s linear infinite; }
        `}</style>

        <g className="robo-body">
          {/* Antenna */}
          <line x1="90" y1="18" x2="90" y2="36" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"/>
          <circle className="antenna-dot" cx="90" cy="13" r="5" fill="#60A5FA"/>

          {/* Head */}
          <rect x="52" y="36" width="76" height="62" rx="14" fill="#1E293B" stroke="#3B82F6" strokeWidth="1.5"/>

          {/* Visor / face screen */}
          <rect x="60" y="44" width="60" height="38" rx="8" fill="#0F172A" stroke="#1E40AF" strokeWidth="1"/>

          {/* Scan line inside visor */}
          <clipPath id="visor-clip">
            <rect x="60" y="44" width="60" height="38" rx="8"/>
          </clipPath>
          <line className="scan-line" x1="60" y1="44" x2="120" y2="44" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.4" clipPath="url(#visor-clip)"/>

          {/* Eyes */}
          <g className="robo-eye" style={{ transformOrigin: '76px 60px' }}>
            <circle cx="76" cy="60" r="7" fill="#3B82F6" opacity="0.15"/>
            <circle cx="76" cy="60" r="5" fill="#60A5FA"/>
            <circle cx="78" cy="58" r="1.5" fill="white"/>
          </g>
          <g className="robo-eye" style={{ transformOrigin: '104px 60px', animationDelay: '0.3s' }}>
            <circle cx="104" cy="60" r="7" fill="#3B82F6" opacity="0.15"/>
            <circle cx="104" cy="60" r="5" fill="#60A5FA"/>
            <circle cx="106" cy="58" r="1.5" fill="white"/>
          </g>

          {/* Mouth — smile or open */}
          {isWelcome ? (
            <path d="M76 75 Q90 84 104 75" stroke="#10B981" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          ) : (
            <path d="M78 75 Q90 82 102 75" stroke="#60A5FA" strokeWidth="2" fill="none" strokeLinecap="round"/>
          )}

          {/* Ear bolts */}
          <circle cx="52" cy="65" r="5" fill="#1E293B" stroke="#3B82F6" strokeWidth="1.5"/>
          <circle cx="128" cy="65" r="5" fill="#1E293B" stroke="#3B82F6" strokeWidth="1.5"/>

          {/* Neck */}
          <rect x="82" y="98" width="16" height="10" rx="3" fill="#1E293B" stroke="#334155" strokeWidth="1"/>

          {/* Body */}
          <rect x="40" y="108" width="100" height="72" rx="16" fill="#1E293B" stroke="#3B82F6" strokeWidth="1.5"/>

          {/* Chest panel */}
          <rect x="56" y="118" width="68" height="40" rx="8" fill="#0F172A" stroke="#1E40AF" strokeWidth="1"/>

          {/* Chest lights */}
          <circle cx="72" cy="130" r="5" fill={isWelcome ? '#10B981' : '#3B82F6'} opacity="0.9"/>
          <circle cx="90" cy="130" r="5" fill="#F59E0B" opacity="0.9"/>
          <circle cx="108" cy="130" r="5" fill={isAwareness ? '#EF4444' : '#3B82F6'} opacity="0.9"/>

          {/* Chest bar */}
          <rect x="62" y="146" width="56" height="6" rx="3" fill="#1E40AF" opacity="0.6"/>

          {/* Left arm */}
          <g className={`arm-left ${isAwareness ? 'arm-wave' : isWelcome ? 'arm-welcome' : ''}`}>
            <rect x="14" y="108" width="24" height="48" rx="10" fill="#1E293B" stroke="#3B82F6" strokeWidth="1.5"/>
            <circle cx="26" cy="162" r="10" fill="#1E293B" stroke="#3B82F6" strokeWidth="1.5"/>
            {/* hand fingers */}
            <rect x="20" y="170" width="6" height="12" rx="3" fill="#1E293B" stroke="#3B82F6" strokeWidth="1"/>
            <rect x="28" y="168" width="6" height="14" rx="3" fill="#1E293B" stroke="#3B82F6" strokeWidth="1"/>
          </g>

          {/* Right arm — welcome pose: raised and pointing */}
          <g className={`arm-right ${isWelcome ? 'arm-welcome' : ''}`}
            style={isWelcome ? { transform: 'rotate(-40deg)', transformOrigin: '152px 108px', transformBox: 'fill-box' } : {}}>
            <rect x="142" y="108" width="24" height="48" rx="10" fill="#1E293B" stroke="#3B82F6" strokeWidth="1.5"/>
            <circle cx="154" cy="162" r="10" fill="#1E293B" stroke="#3B82F6" strokeWidth="1.5"/>
            <rect x="148" y="170" width="6" height="12" rx="3" fill="#1E293B" stroke="#3B82F6" strokeWidth="1"/>
            <rect x="156" y="168" width="6" height="14" rx="3" fill="#1E293B" stroke="#3B82F6" strokeWidth="1"/>
          </g>

          {/* Legs */}
          <rect x="58" y="180" width="24" height="28" rx="8" fill="#1E293B" stroke="#3B82F6" strokeWidth="1.5"/>
          <rect x="98" y="180" width="24" height="28" rx="8" fill="#1E293B" stroke="#3B82F6" strokeWidth="1.5"/>
          {/* Feet */}
          <rect x="52" y="202" width="32" height="12" rx="5" fill="#1E293B" stroke="#3B82F6" strokeWidth="1.5"/>
          <rect x="96" y="202" width="32" height="12" rx="5" fill="#1E293B" stroke="#3B82F6" strokeWidth="1.5"/>
        </g>
      </svg>

      {/* Speech bubble */}
      {isAwareness && (
        <div style={{
          position: 'relative',
          background: 'rgba(17,24,39,0.95)',
          border: '1px solid rgba(59,130,246,0.4)',
          borderRadius: '16px',
          padding: '14px 20px',
          maxWidth: '300px',
          textAlign: 'center',
        }}>
          {/* bubble pointer */}
          <div style={{
            position: 'absolute', top: '-9px', left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '9px solid transparent',
            borderRight: '9px solid transparent',
            borderBottom: '9px solid rgba(59,130,246,0.4)',
          }}/>
          <div style={{
            position: 'absolute', top: '-7px', left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderBottom: '8px solid rgba(17,24,39,0.95)',
          }}/>
          <p style={{
            color: '#E5E7EB', fontSize: '14px', lineHeight: '1.5', margin: 0,
            fontFamily: 'DM Sans, sans-serif', minHeight: '42px',
          }}>
            {displayed}
            {typing && <span style={{ animation: 'none', opacity: 1, color: '#60A5FA' }}>▋</span>}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '10px' }}>
            {MESSAGES.map((_, i) => (
              <div key={i} style={{
                width: i === msgIndex ? '18px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: i === msgIndex ? '#3B82F6' : '#374151',
                transition: 'all 0.3s',
              }}/>
            ))}
          </div>
        </div>
      )}

      {isWelcome && (
        <div style={{ textAlign: 'center' }}>
          <p style={{
            color: '#60A5FA', fontSize: '15px', fontFamily: 'DM Sans, sans-serif',
            margin: 0, fontWeight: 500,
          }}>
            Welcome! Sign in to continue ↓
          </p>
        </div>
      )}
    </div>
  )
}