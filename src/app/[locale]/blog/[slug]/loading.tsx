export default function BlogDetailLoading() {
    return (
        <main className="min-h-screen bg-white pb-20">
            <div className="mx-auto px-4 w-full max-w-7xl pt-6 md:pt-8 animate-pulse">
                {/* Back Link */}
                <div className="h-5 bg-gray-200 rounded w-32 mb-8"></div>

                {/* Categories */}
                <div className="mb-6 flex gap-2">
                    <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                </div>

                {/* Title */}
                <div className="mb-6 space-y-3">
                    <div className="h-10 bg-gray-200 rounded w-full"></div>
                    <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                </div>

                {/* Meta Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-8">
                    <div className="h-5 bg-gray-200 rounded w-40"></div>
                    <div className="flex items-center gap-6">
                        <div className="h-5 bg-gray-200 rounded w-20"></div>
                    </div>
                </div>

                {/* Featured Image */}
                <div className="mb-10 w-full overflow-hidden rounded-2xl shadow-sm border border-gray-100">
                    <div className="w-full h-[500px] bg-gradient-to-br from-gray-200 to-gray-300"></div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-8 bg-gray-200 rounded w-2/3 mt-8"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
            </div>
        </main>
    );
}
