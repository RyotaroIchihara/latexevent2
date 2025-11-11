import image_4be8e46c808971bae0e069f070140540bfeb4ceb from 'figma:asset/4be8e46c808971bae0e069f070140540bfeb4ceb.png';
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function HeroSection() {
  const scrollToBooking = () => {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black">
      <div className="absolute inset-0 opacity-30">
        <ImageWithFallback
          src={image_4be8e46c808971bae0e069f070140540bfeb4ceb}
          alt="Black latex fashion"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative z-10 max-w-screen-xl mx-auto px-8 py-32 text-center">
        <div className="space-y-12">
          <div className="space-y-6">
            <p className="tracking-[0.3em] uppercase text-sm text-gray-400">
              Private Photo Session
            </p>
            <h1 className="tracking-[0.1em] text-5xl md:text-7xl">
              Natsu Ameya
            </h1>
            <p className="text-3xl md:text-5xl tracking-[0.2em] mt-8">
              Latex Beauty.
            </p>
          </div>

          <div className="flex justify-center mt-16">
            <button
              onClick={scrollToBooking}
              className="bg-white text-black px-12 py-4 rounded-none tracking-[0.2em] uppercase text-sm hover:bg-gray-200 transition-colors"
            >
              予約する
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
