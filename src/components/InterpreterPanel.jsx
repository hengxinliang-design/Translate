import React, { useEffect, useRef } from 'react';

const InterpreterPanel = ({ title, segments = [], isInterim, language }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [segments, isInterim]);

    return (
        <div className="glass-panel flex-1 flex flex-col h-[500px] overflow-hidden transition-all hover:border-accent-primary/30">
            <div className="p-4 border-b border-glass-border bg-bg-secondary/50 flex justify-between items-center">
                <h2 className="font-bold text-lg text-accent-primary">{title}</h2>
                <span className="text-xs text-text-secondary bg-bg-primary px-2 py-1 rounded">
                    {language}
                </span>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 p-6 overflow-y-auto space-y-4 font-medium text-lg leading-relaxed"
            >
                {segments.length > 0 || isInterim ? (
                    <div className="space-y-4">
                        {segments.map((segment) => {
                            const isUser1 = segment.speaker === 'User 1';
                            return (
                                <div
                                    key={segment.id}
                                    className={`flex flex-col ${isUser1 ? 'items-start' : 'items-end'}`}
                                >
                                    <span className="text-xs text-text-secondary mb-1 px-1">
                                        {segment.speaker || 'User 1'}
                                    </span>
                                    <div
                                        className={`p-3 rounded-lg max-w-[85%] ${isUser1
                                                ? 'bg-blue-500/10 text-blue-200 border border-blue-500/20 rounded-tl-none'
                                                : 'bg-green-500/10 text-green-200 border border-green-500/20 rounded-tr-none'
                                            }`}
                                    >
                                        {segment.text}
                                    </div>
                                </div>
                            );
                        })}

                        {isInterim && (
                            <div className="p-3 rounded-lg bg-bg-primary/30 text-text-secondary italic animate-pulse">
                                {isInterim}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-text-secondary opacity-30 select-none">
                        Waiting for input...
                    </div>
                )}
            </div>
        </div>
    );
};

export default InterpreterPanel;
