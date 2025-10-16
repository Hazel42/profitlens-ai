import React, { useState } from 'react';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';
import { ArrowRightIcon } from '../components/icons/ArrowRightIcon';
import { ChartPieIcon } from '../components/icons/ChartPieIcon';
import { InventoryIcon } from '../components/icons/InventoryIcon';
import { ChartBarSquareIcon } from '../components/icons/ChartBarSquareIcon';
import { BanknotesIcon } from '../components/icons/BanknotesIcon';
import { ChatBubbleSparkleIcon } from '../components/icons/ChatBubbleSparkleIcon';

interface OnboardingViewProps {
  onComplete: () => void;
}

const slideData = [
  {
    icon: ChartPieIcon,
    title: "Dasbor Cerdas Anda",
    description: "Dapatkan gambaran lengkap performa bisnis Anda dalam sekejap. Pantau pendapatan, laba, dan metrik penting lainnya secara real-time.",
  },
  {
    icon: InventoryIcon,
    title: "Manajemen Stok & Supplier",
    description: "Lacak setiap bahan baku, dapatkan saran pemesanan ulang dari AI, dan kelola katalog harga supplier Anda di satu tempat.",
  },
  {
    icon: ChartBarSquareIcon,
    title: "Analisis Performa Mendalam",
    description: "Gunakan kekuatan AI untuk memahami menu mana yang paling menguntungkan (Matriks BCG) dan produk mana yang sering dibeli bersamaan.",
  },
  {
    icon: BanknotesIcon,
    title: "Laporan Laba & Rugi Otomatis",
    description: "ProfitLens secara otomatis menghitung laba-rugi Anda berdasarkan data penjualan, biaya HPP, biaya operasional, dan buangan.",
  },
  {
    icon: ChatBubbleSparkleIcon,
    title: "Asisten AI Selalu Siap",
    description: "Punya pertanyaan tentang data Anda? Tanyakan langsung pada Asisten AI kami untuk mendapatkan analisis dan wawasan instan.",
  },
];

const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slideData.length) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const Slide: React.FC<{ data: (typeof slideData)[0], isActive: boolean }> = ({ data, isActive }) => {
    const Icon = data.icon;
    return (
      <div className={`text-center transition-opacity duration-500 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0 absolute'}`}>
        <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-brand-primary/20 mb-6">
          <Icon className="h-12 w-12 text-brand-secondary" />
        </div>
        <h2 className="text-3xl font-bold text-white">{data.title}</h2>
        <p className="mt-4 text-lg text-gray-300 max-w-md mx-auto">{data.description}</p>
      </div>
    );
  };
  
  const FinalSlide: React.FC<{ isActive: boolean }> = ({ isActive }) => (
      <div className={`text-center transition-opacity duration-500 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0 absolute'}`}>
         <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-brand-primary/20 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-12 w-12 text-brand-secondary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 011.09-5.474.75.75 0 011.11-.322l2.68 2.68a.75.75 0 001.11 0l2.68-2.68a.75.75 0 011.11.322 9.75 9.75 0 011.09 5.474z" />
             <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-white">Anda Siap!</h2>
        <p className="mt-4 text-lg text-gray-300 max-w-md mx-auto">Jelajahi semua fitur dan mulailah mengoptimalkan keuntungan bisnis Anda hari ini.</p>
    </div>
  );


  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-2xl bg-gray-800/50 rounded-2xl p-8 md:p-12 shadow-2xl">
        <div className="min-h-[280px] flex items-center justify-center relative">
          {slideData.map((slide, index) => (
            <Slide key={index} data={slide} isActive={index === currentSlide} />
          ))}
          <FinalSlide isActive={currentSlide === slideData.length} />
        </div>

        <div className="mt-8">
          <div className="flex justify-center items-center space-x-3 mb-8">
            {[...Array(slideData.length + 1)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-3 h-3 rounded-full transition-colors ${i === currentSlide ? 'bg-brand-primary' : 'bg-gray-600 hover:bg-gray-500'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="flex items-center text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Sebelumnya
            </button>
            {currentSlide < slideData.length ? (
              <button onClick={nextSlide} className="flex items-center bg-brand-primary hover:bg-brand-dark text-white font-bold py-2 px-6 rounded-lg transition-colors">
                Berikutnya
                <ArrowRightIcon className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button onClick={onComplete} className="bg-safe-green hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                Mulai Jelajahi
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingView;
