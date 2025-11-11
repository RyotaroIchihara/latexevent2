import { useState, useEffect } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { projectId, publicAnonKey } from "../utils/supabase/info";

type TimeSlot = {
  id: string;
  time: string;
  available: boolean;
};

const SLOT_TIMES: Record<string, string> = {
  slot1: "15:00-15:45",
  slot2: "16:00-16:45",
  slot3: "17:00-17:45",
};

const EVENT_DATE = "2025-12-06";

export function BookingFormSection() {
  const [formData, setFormData] = useState({
    timeSlot: "",
    name: "",
    email: "",
    sns: "",
    notes: "",
  });
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  useEffect(() => {
    fetchSlots();
  }, []);

  const fetchSlots = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6fda9f73/slots/${EVENT_DATE}`,
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
          time: SLOT_TIMES[slot.id],
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.timeSlot || !formData.name || !formData.email) {
      setSubmitStatus({
        type: "error",
        message: "必須項目（希望枠・お名前・メールアドレス）を入力してください",
      });
      return;
    }

    setSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-6fda9f73/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            sns: formData.sns,
            timeSlot: formData.timeSlot,
            notes: formData.notes,
            date: EVENT_DATE,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSubmitStatus({
          type: "success",
          message: "予約が完了しました！ありがとうございます。",
        });
        // フォームをリセット
        setFormData({
          timeSlot: "",
          name: "",
          email: "",
          sns: "",
          notes: "",
        });
        // スロット情報を再取得
        await fetchSlots();
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "予約に失敗しました。もう一度お試しください。",
        });
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      setSubmitStatus({
        type: "error",
        message: "エラーが発生しました。もう一度お試しください。",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="booking" className="bg-black text-white py-24">
      <div className="max-w-screen-xl mx-auto px-8">
        <div className="max-w-2xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="tracking-[0.2em] text-3xl md:text-4xl">
              BOOKING FORM
            </h2>
            <p className="text-sm tracking-[0.15em] text-gray-400">
              ご希望の枠を選択してお申し込みください
            </p>
            <div className="text-sm tracking-[0.1em] text-gray-400 space-y-2 pt-4">
              <p>申込みは予約決定ではありません。まず、以下の希望枠を一つ選択してください。下にフォームが出るのでご入力ください。1度送信されると変更はこのサイトではできないため、お手数ですがメールでお問い合わせください。</p>
              <p>
                <a href="mailto:altfetish.com@gmail.com" className="underline hover:text-white transition-colors">
                  altfetish.com@gmail.com
                </a>
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <Label className="tracking-[0.15em] text-sm uppercase">
                希望枠 *
              </Label>
              {loading ? (
                <p className="text-center text-gray-400 py-4">読み込み中...</p>
              ) : (
                <RadioGroup
                  value={formData.timeSlot}
                  onValueChange={(value) => setFormData({ ...formData, timeSlot: value })}
                  className="flex flex-col md:flex-row gap-4"
                  required
                >
                  {timeSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`flex items-center space-x-3 px-6 py-4 rounded-none flex-1 ${
                        slot.available
                          ? "border border-white"
                          : "border border-gray-600 opacity-40"
                      }`}
                    >
                      <RadioGroupItem
                        value={slot.id}
                        id={slot.id}
                        disabled={!slot.available}
                        className={slot.available ? "border-white" : "border-gray-600"}
                      />
                      <Label
                        htmlFor={slot.id}
                        className={`tracking-[0.1em] flex-1 ${
                          slot.available ? "cursor-pointer" : "cursor-not-allowed"
                        }`}
                      >
                        {slot.time}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </div>

            {formData.timeSlot && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label htmlFor="name" className="tracking-[0.15em] text-sm uppercase">
                    お名前 *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-transparent border-white/30 text-white placeholder:text-gray-500"
                    placeholder="お名前を入力してください"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="email" className="tracking-[0.15em] text-sm uppercase">
                    メールアドレス *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-transparent border-white/30 text-white placeholder:text-gray-500"
                    placeholder="example@email.com"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="sns" className="tracking-[0.15em] text-sm uppercase">
                    SNS（任意）
                  </Label>
                  <Input
                    id="sns"
                    type="text"
                    value={formData.sns}
                    onChange={(e) => setFormData({ ...formData, sns: e.target.value })}
                    className="bg-transparent border-white/30 text-white placeholder:text-gray-500"
                    placeholder="Twitter、Instagramなどのアカウント名"
                  />
                </div>

              <div className="space-y-4">
                  <Label htmlFor="notes" className="tracking-[0.15em] text-sm uppercase">
                    備考（任意）
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    className="bg-transparent border-white/30 text-white placeholder:text-gray-500"
                    placeholder="その他、ご質問やご要望がございましたらご記入ください"
                  />
                </div>

                {submitStatus.type && (
                  <div
                    className={`p-4 border ${
                      submitStatus.type === "success"
                        ? "border-green-500 text-green-400"
                        : "border-red-500 text-red-400"
                    }`}
                  >
                    <p className="text-sm tracking-[0.1em]">{submitStatus.message}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={submitting || !formData.timeSlot || !formData.name || !formData.email}
                  className="w-full bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed tracking-[0.15em] uppercase"
                >
                  {submitting ? "送信中..." : "予約を送信"}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
