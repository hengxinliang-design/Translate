import React, { useEffect, useRef } from 'react';

const InterpreterPanel = ({ title, segments = [], isInterim, language }) => {
    const scrollRef = useRef(null);

    // Determine active content vs history
    // If there is interim text, that is the "active" content.
    // If not, the very last segment is "active".
    let historySegments = [];
    let activeSegment = null;
    let activeIsInterim = false;

    if (isInterim) {
        historySegments = segments;
        activeIsInterim = true;
    } else if (segments.length > 0) {
        historySegments = segments.slice(0, -1);
        activeSegment = segments[segments.length - 1];
    }

    // Auto-scroll history to bottom when it changes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [historySegments.length]);

    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div className="glass-panel flex-1 flex flex-col overflow-hidden transition-all hover:border-accent-primary/30 min-h-0">
            {/* Header */}
            <div className="p-4 border-b border-glass-border bg-bg-secondary/50 flex justify-between items-center shrink-0">
                <h2 className="font-bold text-lg text-accent-primary">{title}</h2>
                <span className="text-xs text-text-secondary bg-bg-primary px-2 py-1 rounded">
                    {language}
                </span>
            </div>

            {/* History Area (Scrollable) */}
            <div
                ref={scrollRef}
                className="flex-1 p-4 overflow-y-auto space-y-4 border-b border-glass-border/50"
            >
                {historySegments.length > 0 ? (
                    historySegments.map((segment) => {
                        const isUser1 = segment.speaker === 'User 1';
                        return (
                            <div
                                key={segment.id}
                                className={`flex flex-col ${isUser1 ? 'items-start' : 'items-end'}`}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isUser1 ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'
                                        }`}>
                                        {segment.speaker || 'User 1'}
                                    </span>
                                    <span className="text-xs text-text-secondary opacity-50">
                                        {formatTime(segment.timestamp)}
                                    </span>
                                </div>
                                <div
                                    className={`p-3 rounded-xl max-w-[90%] text-lg ${isUser1
                                        ? 'bg-blue-500/5 text-blue-100/80 border border-blue-500/10 rounded-tl-none'
                                        : 'bg-green-500/5 text-green-100/80 border border-green-500/10 rounded-tr-none'
                                        }`}
                                >
                                    {segment.text}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="h-full flex items-center justify-center text-text-secondary opacity-20 text-sm select-none">
                        History will appear here...
                    </div>
                )}
            </div>

            {/* Active/Latest Area (Fixed, Prominent) */}
            <div className="p-6 bg-bg-secondary/30 min-h-[160px] flex flex-col justify-center shrink-0">
                {activeIsInterim ? (
                    <div className="animate-pulse">
                        <span className="text-xs text-accent-primary font-bold uppercase tracking-wider mb-2 block">
                            Listening...
                        </span>
                        <p className="text-3xl font-bold text-text-primary leading-relaxed">
                            {isInterim}
                        </p>
                    </div>
                ) : activeSegment ? (
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${activeSegment.speaker === 'User 1'
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-green-500/20 text-green-300'
                                }`}>
                                {activeSegment.speaker || 'User 1'}
                            </span>
                            <span className="text-xs text-text-secondary opacity-50">
                                {formatTime(activeSegment.timestamp)}
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-text-primary leading-relaxed">
                            {activeSegment.text}
                        </p>
                    </div>
                ) : (
                    <div className="text-center text-text-secondary opacity-30 select-none">
                        <p className="text-xl">Waiting for speech...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterpreterPanel;
