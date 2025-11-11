// イベント設定ファイル
// 環境変数から読み込むか、デフォルト値を使用

export interface TimeSlotConfig {
  id: string;
  time: string; // 例: "15:00-15:45"
}

export interface EventConfig {
  // モデル情報
  modelName: string;
  subtitle?: string;
  heroImage?: string;
  
  // イベント情報
  eventDate: string; // YYYY-MM-DD形式
  eventDateDisplay: string; // 表示用（例: "12/6（土）"）
  
  // 時間枠設定
  timeSlots: TimeSlotConfig[];
  
  // 料金・詳細情報
  duration: string; // 例: "45分 / 各枠"
  price: string; // 例: "¥13,000 / 一枠"
  option?: string; // 例: "ハーネス、コルセット、マスクなど +¥2,000 / アイテム"
  location: string; // 例: "都内スタジオ"
  capacity: string; // 例: "1名 / 各枠"
  
  // 問い合わせ先
  contactEmail: string;
  
  // バックエンド設定
  apiPath: string; // 例: "make-server-6fda9f73"
}

// 環境変数から設定を読み込む
const getEnvOr = (key: string, defaultValue: string): string => {
  if (typeof window !== "undefined") {
    return import.meta.env[key] || defaultValue;
  }
  return defaultValue;
};

// デフォルト設定（環境変数が設定されていない場合）
const defaultConfig: EventConfig = {
  modelName: "Natsu Ameya",
  subtitle: "Latex Beauty.",
  eventDate: "2025-12-06",
  eventDateDisplay: "12/6（土）",
  timeSlots: [
    { id: "slot1", time: "15:00-15:45" },
    { id: "slot2", time: "16:00-16:45" },
    { id: "slot3", time: "17:00-17:45" },
  ],
  duration: "45分 / 各枠",
  price: "¥13,000 / 一枠",
  option: "ハーネス、コルセット、マスクなど +¥2,000 / アイテム",
  location: "都内スタジオ",
  capacity: "1名 / 各枠",
  contactEmail: "altfetish.com@gmail.com",
  apiPath: "make-server-6fda9f73",
};

// 環境変数から設定を読み込む（VITE_プレフィックスが必要）
export const eventConfig: EventConfig = {
  modelName: getEnvOr("VITE_MODEL_NAME", defaultConfig.modelName),
  subtitle: getEnvOr("VITE_SUBTITLE", defaultConfig.subtitle || ""),
  eventDate: getEnvOr("VITE_EVENT_DATE", defaultConfig.eventDate),
  eventDateDisplay: getEnvOr("VITE_EVENT_DATE_DISPLAY", defaultConfig.eventDateDisplay),
  timeSlots: parseTimeSlots(getEnvOr("VITE_TIME_SLOTS", "")),
  duration: getEnvOr("VITE_DURATION", defaultConfig.duration),
  price: getEnvOr("VITE_PRICE", defaultConfig.price),
  option: getEnvOr("VITE_OPTION", defaultConfig.option || ""),
  location: getEnvOr("VITE_LOCATION", defaultConfig.location),
  capacity: getEnvOr("VITE_CAPACITY", defaultConfig.capacity),
  contactEmail: getEnvOr("VITE_CONTACT_EMAIL", defaultConfig.contactEmail),
  apiPath: getEnvOr("VITE_API_PATH", defaultConfig.apiPath),
};

// 時間枠をパースする関数
// 環境変数の形式: "slot1:15:00-15:45,slot2:16:00-16:45,slot3:17:00-17:45"
function parseTimeSlots(envValue: string): TimeSlotConfig[] {
  if (!envValue) {
    return defaultConfig.timeSlots;
  }
  
  try {
    return envValue.split(",").map((slot) => {
      const [id, time] = slot.split(":");
      return { id: id.trim(), time: time.trim() };
    });
  } catch (error) {
    console.error("Failed to parse time slots from environment variable:", error);
    return defaultConfig.timeSlots;
  }
}

// 時間枠のIDリストを取得
export const getTimeSlotIds = (): string[] => {
  return eventConfig.timeSlots.map((slot) => slot.id);
};

// 時間枠のマッピング（ID -> 時間表示）を取得
export const getTimeSlotMap = (): Record<string, string> => {
  const map: Record<string, string> = {};
  eventConfig.timeSlots.forEach((slot) => {
    map[slot.id] = slot.time;
  });
  return map;
};

