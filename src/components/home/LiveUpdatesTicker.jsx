import { useSelector } from 'react-redux'
import { Radio, Clock, AlertCircle } from 'lucide-react'

export default function LiveUpdatesTicker() {
  const updates = useSelector((state) => state.liveUpdates.items)

  const activeUpdates = updates.filter((u) => u.active)

  const getText = (update) => {
    return update.textEnglish || update.text
  }

  return (
    <div style={{
      backgroundColor: 'linear-gradient(to right, #ea580c, #f97316)',
      background: 'linear-gradient(135deg, #ea580c 0%, #f97316 100%)',
      padding: '12px 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'relative',
      zIndex: 20
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 16px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          {/* Live Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(4px)',
            borderRadius: '9999px',
            padding: '4px 16px',
            flexShrink: 0
          }}>
            <Radio style={{
              width: '16px',
              height: '16px',
              color: 'white',
              animation: 'pulse 1.5s ease-in-out infinite'
            }} />
            <span style={{
              color: 'white',
              fontWeight: '600',
              fontSize: '12px'
            }}>LIVE</span>
          </div>

          {/* Ticker */}
          <div style={{
            flex: 1,
            overflow: 'hidden',
            height: '40px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              animation: 'marquee 20s linear infinite',
              whiteSpace: 'nowrap'
            }}>
              {activeUpdates.map((update, index) => (
                <div
                  key={update.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    margin: '0 32px',
                    color: 'white'
                  }}
                >
                  {update.priority === 'high' ? (
                    <AlertCircle style={{ width: '16px', height: '16px', color: '#fde047' }} />
                  ) : (
                    <Clock style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.8)' }} />
                  )}
                  <span style={{ fontSize: '14px' }}>{getText(update)}</span>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {activeUpdates.map((update, index) => (
                <div
                  key={`dup-${update.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    margin: '0 32px',
                    color: 'white'
                  }}
                >
                  {update.priority === 'high' ? (
                    <AlertCircle style={{ width: '16px', height: '16px', color: '#fde047' }} />
                  ) : (
                    <Clock style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.8)' }} />
                  )}
                  <span style={{ fontSize: '14px' }}>{getText(update)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee-slow {
          animation: marquee 20s linear infinite;
        }
        
        @media (max-width: 640px) {
          .ticker-text {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  )
}