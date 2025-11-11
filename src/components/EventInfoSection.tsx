import { useState, useEffect, useCallback } from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { eventConfig, getTimeSlotMap } from "../config/event";

type TimeSlot = {
  id: string;
  time: string;
  available: boolean;
};

export function EventInfoSection() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSlots = useCallback(async () => {
    try {
      const slotTimeMap = getTimeSlotMap();
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
          time: slotTimeMap[slot.id] || slot.id,
          available: slot.available,
        }));
        setTimeSlots(slots);
      }
    } catch (error) {
      console.error("Error fetching slots:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlots();
    // 定期的にスロット情報を更新（30秒ごと）
    const interval = setInterval(fetchSlots, 30000);
    return () => clearInterval(interval);
  }, [fetchSlots]);

  return (
    <section className="bg-white text-black py-24">
      <div className="max-w-screen-xl mx-auto px-8">
        <div className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="tracking-[0.2em] text-3xl md:text-4xl">
              EVENT INFORMATION
            </h2>
          </div>

          <div className="max-w-2xl mx-auto space-y-12">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-black pb-4">
                <span className="tracking-[0.15em] text-sm uppercase text-gray-600">
                  Date
                </span>
                <span className="tracking-[0.1em]">{eventConfig.eventDateDisplay}</span>
              </div>

              <div className="space-y-4">
                <p className="tracking-[0.15em] text-sm uppercase text-gray-600">
                  Available Time Slots
                </p>
                {loading ? (
                  <p className="text-center text-gray-400 py-8">読み込み中...</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {timeSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className={`
                          border rounded-none p-6 text-center tracking-[0.1em]
                          ${
                            slot.available
                              ? "border-black bg-white hover:bg-gray-50 cursor-pointer"
                              : "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                          }
                        `}
                      >
                        <div className="space-y-2">
                          <p>{slot.time}</p>
                          <p className="text-xs tracking-[0.2em] uppercase">
                            {slot.available ? "Available" : "SOLD OUT"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-8">
              <div className="flex justify-between items-center border-b border-black pb-4">
                <span className="tracking-[0.15em] text-sm uppercase text-gray-600">
                  Duration
                </span>
                <span className="tracking-[0.1em]">{eventConfig.duration}</span>
              </div>
              <div className="flex justify-between items-center border-b border-black pb-4">
                <span className="tracking-[0.15em] text-sm uppercase text-gray-600">
                  料金
                </span>
                <span className="tracking-[0.1em]">{eventConfig.price}</span>
              </div>
              {eventConfig.option && (
                <div className="flex justify-between items-center border-b border-black pb-4">
                  <span className="tracking-[0.15em] text-sm uppercase text-gray-600">
                    Option
                  </span>
                  <span className="tracking-[0.1em] text-sm">{eventConfig.option}</span>
                </div>
              )}
              <div className="flex justify-between items-center border-b border-black pb-4">
                <span className="tracking-[0.15em] text-sm uppercase text-gray-600">
                  Location
                </span>
                <span className="tracking-[0.1em]">{eventConfig.location}</span>
              </div>
              <div className="flex justify-between items-center border-b border-black pb-4">
                <span className="tracking-[0.15em] text-sm uppercase text-gray-600">
                  Capacity
                </span>
                <span className="tracking-[0.1em]">{eventConfig.capacity}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
