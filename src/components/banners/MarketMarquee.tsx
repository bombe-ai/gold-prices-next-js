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
                    <div key={`${item.symbol}-${index}`} className="group flex items-center pl-8 text-sm font-medium">
                        <div className="flex flex-col leading-tight mr-3">
                            <span className="text-gray-200 text-xs font-bold">{item.symbol}</span>
                        </div>
                        <span className="text-gray-400 font-medium mr-3">₹{item.price.toLocaleString('en-IN')}</span>
                        <div className={`flex items-center px-2 py-0.5 rounded-full text-xs font-bold text-white ${item.direction === 'up' ? 'bg-[#11550B] text-[#95FF8C]' :
                            item.direction === 'down' ? 'bg-[#550B0B] text-[#FF8C8C]' : 'bg-gray-600/20 text-gray-500'
                            }`}>
                            {Math.abs(item.change).toFixed(2)} ({item.percentChange.toFixed(1)}%)
                        </div>
                        <div className="ml-8 group-last:hidden">
                            <svg width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clipPath="url(#clip0_321_831)">
                                    <path d="M12.7551 12.998L10.5998 12.978C10.5343 12.8494 10.09 11.9396 10.5208 10.9939C10.7524 10.4859 10.9953 10.1905 11.2524 10.0117C11.4321 10.4828 11.64 11.1633 11.9645 11.8272C12.2047 12.319 12.5044 12.6985 12.7555 12.9976L12.7551 12.998Z" fill="#98999E" />
                                    <path d="M3.48166 13.0002C3.47978 12.8942 3.4779 12.1429 4.06026 11.6608C4.61479 11.2018 5.678 11.1946 6.24156 11.7302C6.04381 11.7796 5.80658 11.8094 5.5889 12.2062C5.39679 12.5563 5.36032 12.872 5.36145 12.9999H3.48166V13.0002Z" fill="#98999E" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M11.5308 0.430742C12.2782 -0.249718 13.6065 -0.064514 14.3042 0.564647C15.1941 1.36694 15.0204 2.71692 14.743 3.40719L14.7426 3.40757C14.4787 4.06427 14.0068 4.4739 13.7647 4.64666C13.338 4.95106 12.8369 5.16832 12.3399 5.36408L13.3963 5.66056C13.1576 6.82534 12.0816 7.58237 11.4033 8.44426C10.7428 9.28352 10.2153 10.1379 9.86981 11.1589C9.74876 11.5173 9.55062 12.67 9.47167 12.9876L8.0874 12.9778C7.53361 12.1642 7.02945 11.306 5.87902 10.9296C3.99397 10.3129 3.08265 11.5018 2.13524 12.9876L0.533283 12.9676C0.466739 11.6138 0.831795 9.88062 1.30287 8.61891L0.0697297 9.32765C-0.00959731 9.35368 -0.0114775 9.22996 0.0133357 9.15301C0.4408 7.82906 2.33901 5.84425 3.65373 5.36597C3.88795 5.28072 5.2335 4.83903 5.12598 5.3075C4.93462 6.14111 4.53648 6.07057 5.42223 6.77328C6.74523 7.82302 8.63667 7.95278 10.2127 7.54013C10.3822 7.33871 10.0608 5.14343 9.69687 4.83111C9.81192 5.15059 9.94801 5.66094 9.91643 6.29086C9.89838 6.65221 9.82959 6.95925 9.75627 7.19763C8.37538 7.25685 7.29638 7.27609 6.17829 6.36629C5.38464 5.72016 5.45043 5.4184 6.01925 4.55425C6.32904 4.08351 6.88396 3.65878 7.4118 3.47283C8.2468 3.17861 8.02236 3.46717 8.69194 2.87233C10.1721 1.55667 12.0459 3.23783 13.0451 2.64224C14.0302 2.05532 12.1714 0.413016 11.8684 2.10964L10.9153 1.93349C10.9059 1.78186 10.9244 0.982956 11.5308 0.430742ZM11.3992 3.76516C11.3815 3.15636 10.327 3.33893 10.6383 3.88586L11.3992 3.76516Z" fill="#98999E" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_321_831">
                                        <rect width="14.9676" height="13" fill="white" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
