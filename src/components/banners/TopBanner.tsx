import React from 'react';

export function TopBanner() {
    return (
        <div className="w-full bg-gradient-to-r from-gray-900 to-gray-800 py-3 text-center text-white">
            <div className="container mx-auto px-4 flex items-center justify-between text-sm">
                <span className="opacity-80">Gold & Silver Rates • Real-time Updates</span>
                <div className="flex gap-4">
                    <span className="hidden sm:inline opacity-60">Kerala, India</span>
                    <span className="font-semibold text-gold-400">Live Market Open</span>
                </div>
            </div>
        </div>
    );
}
