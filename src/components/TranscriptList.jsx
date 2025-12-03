import React, { useEffect, useRef } from 'react';

const TranscriptList = ({ transcript, translatedSegments }) => {
    const scrollRef = useRef(null);

    // Merge transcript and translation data
    const mergedItems = transcript.map(item => {
        const translation = translatedSegments.find(t => t.id === item.id);
        return {
            ...item,
            translation: translation ? translation.text : ''
        };
    });

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [mergedItems.length, translatedSegments]);

    return (
        <main className="relative z-10 h-[calc(100vh-140px)] flex flex-col items-center justify-end pb-32 px-4 md:px-20 max-w-5xl mx-auto">
            <div
                ref={scrollRef}
                className="w-full flex flex-col gap-8 overflow-y-auto no-scrollbar mask-image-linear-gradient"
            >
                {mergedItems.map((item, index) => {
                    const isActive = index === mergedItems.length - 1;

                    if (isActive) {
                        return (
                            <div key={item.id} className="mt-4 animate-fade-in-up">
                                <p className="text-2xl md:text-3xl text-white font-medium mb-3 tracking-wide leading-relaxed">
                                    {item.text}
                                </p>
                                <p className="text-3xl md:text-4xl font-bold leading-relaxed text-gradient">
                                    {item.translation || <span className="animate-pulse">...</span>}
                                    {/* Cursor effect */}
                                    <span className="inline-block w-1 h-8 ml-1 bg-cyan-400 align-middle animate-pulse"></span>
                                </p>
                            </div>
                        );
                    }

                    return (
                        <div key={item.id} className="opacity-40 transition-opacity hover:opacity-60 duration-300">
                            <p className="text-lg text-gray-300 mb-1">{item.text}</p>
                            <p className="text-xl text-gray-400 font-light">{item.translation}</p>
                        </div>
                    );
                })}

                {mergedItems.length === 0 && (
                    <div className="text-center opacity-40">
                        <p className="text-lg text-gray-300 mb-1">Start speaking to see the transcript...</p>
                        <p className="text-xl text-gray-400 font-light">开始说话以查看实时字幕...</p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default TranscriptList;
