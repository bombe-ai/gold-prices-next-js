"use client";

import { useRef } from 'react';
import { MarketData } from '@/lib/types';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface MarketMarqueeProps {
    items: MarketData[];
}

export function MarketMarquee({ items }: MarketMarqueeProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);

    // Duplicate logic for seamless loop: ensure enough duplicates to fill screen + scroll
    const marqueeItems = [...items, ...items, ...items, ...items];

    useGSAP(() => {
        if (!innerRef.current) return;

        const totalWidth = innerRef.current.scrollWidth / 2; // Approximate half since we duplicated

        // Horizontal Scroll
        const tl = gsap.timeline({ repeat: -1 });
        tl.to(innerRef.current, {
            x: "-50%",
            duration: 100, // Adjust speed here, higher is slower
            ease: "none",
        });

        // Pause on Hover
        const container = containerRef.current;
        if (container) {
            container.addEventListener("mouseenter", () => tl.pause());
            container.addEventListener("mouseleave", () => tl.play());
        }

        return () => {
            if (container) {
                container.removeEventListener("mouseenter", () => tl.pause());
                container.removeEventListener("mouseleave", () => tl.play());
            }
        };

    }, { scope: containerRef });

    if (!items || items.length === 0) return null;

    return (
        <div ref={containerRef} className="relative flex overflow-hidden w-full h-full items-center cursor-default">
            {/* We render a very long strip of items */}
            <div ref={innerRef} className="flex whitespace-nowrap will-change-transform">
                {marqueeItems.map((item, index) => (
                    <div key={`${item.symbol}-${index}`} className="flex items-center px-8 text-sm font-medium border-r border-white/10 last:border-0">
                        <div className="flex flex-col leading-tight mr-3">
                            <span className="text-gray-200 text-xs font-bold">{item.symbol}</span>
                        </div>
                        <span className="text-white font-mono mr-3">₹{item.price.toLocaleString('en-IN')}</span>
                        <span className={`flex items-center text-xs font-semibold ${item.direction === 'up' ? 'text-green-400' : item.direction === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                            {item.change > 0 ? '▲' : '▼'} {Math.abs(item.change).toFixed(2)} ({item.percentChange.toFixed(2)}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
