import React, { useEffect, useRef } from 'react';

export default function PreLoader() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const timer = setTimeout(() => {
            el.style.opacity = '0';
            el.style.transition = 'opacity 0.3s';
            setTimeout(() => el.remove(), 300);
        }, 400);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div ref={ref} className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
    );
}
