export default function BlogLoading() {
    return (
        <main className="min-h-screen pb-20 bg-gray-50/50">
            <div className="mx-auto px-4 w-full max-w-7xl">
                <header className="py-6 text-center">
                    <div className="h-10 bg-gray-200 rounded-lg w-64 mx-auto mb-3 animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded-lg w-96 mx-auto animate-pulse"></div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-full overflow-hidden border border-gray-100 shadow-sm rounded-2xl bg-white">
                                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
                                <div className="p-6 flex flex-col h-[280px]">
                                    <div className="mb-3 flex gap-2">
                                        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                                    </div>
                                    <div className="h-7 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-7 bg-gray-200 rounded w-3/4 mb-4"></div>
                                    <div className="flex-grow space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
