import { useState, useEffect } from "react";
import image_4be8e46c808971bae0e069f070140540bfeb4ceb from 'figma:asset/4be8e46c808971bae0e069f070140540bfeb4ceb.png';
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { eventConfig } from "../config/event";

type TimeSlot = {
  id: string;
  available: boolean;
};

export function HeroSection() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlots();
    // 定期的にスロット情報を更新（30秒ごと）
    const interval = setInterval(fetchSlots, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/${eventConfig.apiPath}/slots/${eventConfig.eventDate}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch slots");
      }

      const data = await response.json();
      
      if (data.success) {
        const slots = data.slots.map((slot: { id: string; available: boolean }) => ({
          id: slot.id,
          available: slot.available,
        }));
        setTimeSlots(slots);
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBooking = () => {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  // 全てのスロットが売り切れかどうかを判定
  const allSoldOut = !loading && timeSlots.length > 0 && timeSlots.every(slot => !slot.available);
  const buttonText = allSoldOut ? "売り切れました" : "予約する";
  const isDisabled = allSoldOut;

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
              {eventConfig.modelName}
            </h1>
            {eventConfig.subtitle && (
              <p className="text-3xl md:text-5xl tracking-[0.2em] mt-8">
                {eventConfig.subtitle}
              </p>
            )}
          </div>

          <div className="flex justify-center mt-16">
            <button
              onClick={scrollToBooking}
              disabled={isDisabled}
              className={`px-12 py-4 rounded-none tracking-[0.2em] uppercase text-sm transition-colors ${
                isDisabled
                  ? "bg-black text-white border border-white cursor-not-allowed"
                  : "bg-white text-black hover:bg-gray-200"
              }`}
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
