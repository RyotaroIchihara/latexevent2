import { useState, useEffect } from "react";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { eventConfig, getTimeSlotMap } from "../config/event";

type Booking = {
  name: string;
  email: string;
  sns: string;
  timeSlot: string;
  notes: string;
  date: string;
  timestamp: string;
};

export function AdminView() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/${eventConfig.apiPath}/bookings/${eventConfig.eventDate}`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      
      if (data.success) {
        setBookings(data.bookings || []);
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setError(error instanceof Error ? error.message : "予約情報の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-screen-xl mx-auto px-8 py-16">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="tracking-[0.2em] text-3xl md:text-4xl">
                ADMIN VIEW
              </h1>
              <p className="text-sm tracking-[0.15em] text-gray-400">
                予約管理画面
              </p>
            </div>
            <button
              onClick={fetchBookings}
              className="bg-white text-black px-6 py-2 rounded-none tracking-[0.15em] text-sm uppercase hover:bg-gray-200 transition-colors"
            >
              更新
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400 tracking-[0.15em]">読み込み中...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 tracking-[0.15em]">{error}</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 tracking-[0.15em]">予約がありません</p>
            </div>
          ) : (
            <div className="border border-white rounded-none overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-white hover:bg-white/5">
                    <TableHead className="text-white tracking-[0.15em] uppercase text-xs">
                      予約日時
                    </TableHead>
                    <TableHead className="text-white tracking-[0.15em] uppercase text-xs">
                      枠
                    </TableHead>
                    <TableHead className="text-white tracking-[0.15em] uppercase text-xs">
                      名前
                    </TableHead>
                    <TableHead className="text-white tracking-[0.15em] uppercase text-xs">
                      メール
                    </TableHead>
                    <TableHead className="text-white tracking-[0.15em] uppercase text-xs">
                      SNS
                    </TableHead>
                    <TableHead className="text-white tracking-[0.15em] uppercase text-xs">
                      備考
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((booking, index) => (
                    <TableRow key={index} className="border-white hover:bg-white/5">
                      <TableCell className="tracking-[0.1em] text-sm">
                        {formatDate(booking.timestamp)}
                      </TableCell>
                      <TableCell className="tracking-[0.1em]">
                        {getTimeSlotMap()[booking.timeSlot] || booking.timeSlot}
                      </TableCell>
                      <TableCell className="tracking-[0.1em]">
                        {booking.name}
                      </TableCell>
                      <TableCell className="tracking-[0.1em] text-sm">
                        {booking.email}
                      </TableCell>
                      <TableCell className="tracking-[0.1em] text-sm text-gray-400">
                        {booking.sns || "-"}
                      </TableCell>
                      <TableCell className="tracking-[0.1em] text-sm text-gray-400 max-w-xs truncate">
                        {booking.notes || "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="text-center pt-8">
            <p className="text-xs tracking-[0.2em] uppercase text-gray-400">
              総予約数: {bookings.length} / {eventConfig.timeSlots.length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
