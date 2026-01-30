import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { 
    Ticket, 
    Film 
} from "lucide-react";

const BookingsPage = () => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#0a0a0a] text-white flex flex-col items-center justify-center font-sans">
            
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-900/20 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-red-900/10 blur-[120px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-4xl px-6">
                
                <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-red-500 transition-all mb-10 group">
                    <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Home</span>
                </Link>

                <div className="relative bg-[#111111]/80 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-16 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] overflow-hidden">
                    
                    <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-red-600/50 to-transparent"></div>

                    <div className="flex flex-col items-center text-center">
                        
                        <div className="relative mb-10">
                            <div className="absolute inset-0 bg-red-600/20 blur-3xl rounded-full animate-pulse"></div>
                            <div className="relative w-28 h-28 bg-[#1a1a1a] border border-white/10 rounded-3xl flex items-center justify-center shadow-inner rotate-6">
                                <Ticket size={56} className="text-red-600" />
                            </div>
                        </div>

                        <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                            NOT YOUR <span className="text-red-600">TICKETS</span> YET
                        </h2>
                        
                        <p className="text-gray-400 text-lg max-w-sm leading-relaxed mb-12">
                            Your cinema history is a blank screen. Let's add some blockbuster moments!
                        </p>

                        <Link 
                            to="/movies" 
                            className="group relative px-12 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/20 flex items-center gap-3 overflow-hidden"
                        >
                            <span className="relative z-10">Explore Now</span>
                            <Film size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                </div>

                <div className="mt-16 flex justify-center opacity-30">
                    <div className="w-32 h-px bg-linear-to-r from-transparent via-white to-transparent"></div>
                </div>
            </div>
        </div>
    );
};

export default BookingsPage;