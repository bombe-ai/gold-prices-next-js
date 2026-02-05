export default function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
            <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full border-4 border-gold-200 opacity-25"></div>
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-gold-500 border-t-transparent"></div>
            </div>
        </div>
    );
}
