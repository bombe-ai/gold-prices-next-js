"use client";

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface PageAnimateWrapperProps {
    children: React.ReactNode;
}

export function PageAnimateWrapper({ children }: PageAnimateWrapperProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.fromTo(
            wrapperRef.current,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );
    }, { scope: wrapperRef });

    return (
        <div ref={wrapperRef} className="will-change-opacity">
            {children}
        </div>
    );
}
