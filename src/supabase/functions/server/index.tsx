import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-6fda9f73/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all time slots with availability status
app.get("/make-server-6fda9f73/slots/:date", async (c) => {
  try {
    const date = c.req.param("date");
    
    // 環境変数から時間枠設定を取得、デフォルトは3つのスロット
    const timeSlotsEnv = Deno.env.get("TIME_SLOTS") || "slot1,slot2,slot3";
    const slotIds = timeSlotsEnv.split(",").map(id => id.trim());
    
    const slots = await Promise.all(
      slotIds.map(async (slotId) => {
        const bookingKey = `booking:${date}:${slotId}`;
        const booking = await kv.get(bookingKey);
        return {
          id: slotId,
          available: !booking,
        };
      })
    );
    
    return c.json({ success: true, slots });
  } catch (error) {
    console.log("Error fetching slots:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create a new booking
app.post("/make-server-6fda9f73/bookings", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, sns, timeSlot, notes, date } = body;
    
    if (!name || !email || !timeSlot || !date) {
      return c.json({ 
        success: false, 
        error: "必須項目が入力されていません" 
      }, 400);
    }
    
    const bookingKey = `booking:${date}:${timeSlot}`;
    
    // Check if slot is already booked
    const existingBooking = await kv.get(bookingKey);
    if (existingBooking) {
      return c.json({ 
        success: false, 
        error: "この枠は既に予約されています" 
      }, 400);
    }
    
    // Create booking
    const bookingData = {
      name,
      email,
      sns: sns || "",
      timeSlot,
      notes: notes || "",
      date,
      timestamp: new Date().toISOString(),
    };
    
    await kv.set(bookingKey, bookingData);
    
    console.log(`New booking created: ${bookingKey}`, bookingData);
    
    return c.json({ success: true, booking: bookingData });
  } catch (error) {
    console.log("Error creating booking:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get all bookings for a specific date
app.get("/make-server-6fda9f73/bookings/:date", async (c) => {
  try {
    const date = c.req.param("date");
    const prefix = `booking:${date}:`;
    const bookings = await kv.getByPrefix(prefix);
    
    return c.json({ success: true, bookings });
  } catch (error) {
    console.log("Error fetching bookings:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);