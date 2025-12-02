import React from 'react';

const AudioVisualizer = ({ isListening }) => {
    return (
        <div className="h-12 flex items-center justify-center gap-1">
            {[...Array(12)].map((_, i) => (
                <div
                    key={i}
                    className={`w-1 bg-accent-primary rounded-full transition-all duration-150 ${isListening ? 'animate-wave' : 'h-1 opacity-20'
                        }`}
                    style={{
                        height: isListening ? undefined : '4px',
                        animationDelay: `${i * 0.05}s`,
                        animationDuration: '0.8s'
                    }}
                />
            ))}
            <style>{`
        @keyframes wave {
          0%, 100% { height: 8px; opacity: 0.5; }
          50% { height: 32px; opacity: 1; }
        }
        .animate-wave {
          animation: wave infinite ease-in-out;
        }
      `}</style>
        </div>
    );
};

export default AudioVisualizer;
