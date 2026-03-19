import React from 'react'

export default function Loading() {
    return (
        <div className="flex-col gap-4 w-full absolute flex items-center h-screen bg-black/20 justify-center">
            <div className="w-17 h-17 border-5 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full">
                <div className="w-12 h-12 border-5 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-emerald-400 rounded-full"></div>
            </div>
        </div>
    )
}
