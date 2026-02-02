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
    allowHeaders: ["Content-Type", "Authorization", "X-User-Phone"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-816b7951/health", (c) => {
  return c.json({ status: "ok" });
});

// ========== 用户认证相关 API ==========

// 发送验证码
app.post("/make-server-816b7951/auth/send-code", async (c) => {
  try {
    const { phone } = await c.req.json();
    
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return c.json({ error: "Invalid phone number" }, 400);
    }

    // 生成6位随机验证码
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 存储验证码，5分钟过期
    const codeKey = `verification_code:${phone}`;
    await kv.set(codeKey, { code, timestamp: Date.now() });
    
    // TODO: 在生产环境中，这里应该调用短信服务发送验证码
    // 目前在开发环境，直接返回验证码（实际生产不应该这样做）
    console.log(`Verification code for ${phone}: ${code}`);
    
    return c.json({ 
      success: true, 
      message: "Verification code sent",
      // 仅开发环境返回验证码
      devCode: code 
    });
  } catch (error) {
    console.error("Send code error:", error);
    return c.json({ error: "Failed to send verification code" }, 500);
  }
});

// 注册
app.post("/make-server-816b7951/auth/register", async (c) => {
  try {
    const { phone, code, nickname } = await c.req.json();
    
    if (!phone || !code || !nickname) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // 验证验证码
    const codeKey = `verification_code:${phone}`;
    const storedCodeData = await kv.get(codeKey);
    
    if (!storedCodeData) {
      return c.json({ error: "Verification code expired or not found" }, 400);
    }

    const { code: storedCode, timestamp } = storedCodeData;
    
    // 检查验证码是否过期（5分钟）
    if (Date.now() - timestamp > 5 * 60 * 1000) {
      await kv.del(codeKey);
      return c.json({ error: "Verification code expired" }, 400);
    }

    // 验证验证码是否正确
    if (code !== storedCode) {
      return c.json({ error: "Invalid verification code" }, 400);
    }

    // 检查手机号是否已注册
    const userKey = `user:${phone}`;
    const existingUser = await kv.get(userKey);
    
    if (existingUser) {
      return c.json({ error: "Phone number already registered" }, 400);
    }

    // 创建用户
    const user = {
      phone,
      nickname,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await kv.set(userKey, user);
    
    // 删除已使用的验证码
    await kv.del(codeKey);

    return c.json({ 
      success: true, 
      user: { phone, nickname } 
    });
  } catch (error) {
    console.error("Registration error:", error);
    return c.json({ error: "Registration failed" }, 500);
  }
});

// 登录
app.post("/make-server-816b7951/auth/login", async (c) => {
  try {
    const { phone, code } = await c.req.json();
    
    if (!phone || !code) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    // 验证验证码
    const codeKey = `verification_code:${phone}`;
    const storedCodeData = await kv.get(codeKey);
    
    if (!storedCodeData) {
      return c.json({ error: "Verification code expired or not found" }, 400);
    }

    const { code: storedCode, timestamp } = storedCodeData;
    
    // 检查验证码是否过期（5分钟）
    if (Date.now() - timestamp > 5 * 60 * 1000) {
      await kv.del(codeKey);
      return c.json({ error: "Verification code expired" }, 400);
    }

    // 验证验证码是否正确
    if (code !== storedCode) {
      return c.json({ error: "Invalid verification code" }, 400);
    }

    // 检查用户是否存在
    const userKey = `user:${phone}`;
    const user = await kv.get(userKey);
    
    if (!user) {
      return c.json({ error: "Phone number not registered" }, 400);
    }

    // 删除已使用的验证码
    await kv.del(codeKey);

    return c.json({ 
      success: true, 
      user: { phone: user.phone, nickname: user.nickname } 
    });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: "Login failed" }, 500);
  }
});

// ========== 笔记管理相关 API ==========

// 获取用户的所有笔记
app.get("/make-server-816b7951/notes", async (c) => {
  try {
    const phone = c.req.header("X-User-Phone");
    
    if (!phone) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // 验证用户是否存在
    const userKey = `user:${phone}`;
    const user = await kv.get(userKey);
    
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    // 获取用户的所有笔记
    const notesPrefix = `notes:${phone}:`;
    const notes = await kv.getByPrefix(notesPrefix);
    
    // 按时间戳降序排序
    const sortedNotes = notes.sort((a, b) => b.timestamp - a.timestamp);

    return c.json({ notes: sortedNotes });
  } catch (error) {
    console.error("Get notes error:", error);
    return c.json({ error: "Failed to get notes" }, 500);
  }
});

// 创建笔记
app.post("/make-server-816b7951/notes", async (c) => {
  try {
    const phone = c.req.header("X-User-Phone");
    
    if (!phone) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { content, tags } = await c.req.json();
    
    if (!content) {
      return c.json({ error: "Content is required" }, 400);
    }

    // 创建笔记
    const noteId = Date.now().toString();
    const note = {
      id: noteId,
      content,
      tags: tags || [],
      timestamp: Date.now(),
    };

    const noteKey = `notes:${phone}:${noteId}`;
    await kv.set(noteKey, note);

    return c.json({ success: true, note });
  } catch (error) {
    console.error("Create note error:", error);
    return c.json({ error: "Failed to create note" }, 500);
  }
});

// 更新笔记
app.put("/make-server-816b7951/notes/:id", async (c) => {
  try {
    const phone = c.req.header("X-User-Phone");
    
    if (!phone) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const noteId = c.req.param("id");
    const { content, tags } = await c.req.json();
    
    if (!content) {
      return c.json({ error: "Content is required" }, 400);
    }

    // 检查笔记是否存在
    const noteKey = `notes:${phone}:${noteId}`;
    const existingNote = await kv.get(noteKey);
    
    if (!existingNote) {
      return c.json({ error: "Note not found" }, 404);
    }

    // 更新笔记
    const updatedNote = {
      ...existingNote,
      content,
      tags: tags || [],
    };

    await kv.set(noteKey, updatedNote);

    return c.json({ success: true, note: updatedNote });
  } catch (error) {
    console.error("Update note error:", error);
    return c.json({ error: "Failed to update note" }, 500);
  }
});

// 删除笔记
app.delete("/make-server-816b7951/notes/:id", async (c) => {
  try {
    const phone = c.req.header("X-User-Phone");
    
    if (!phone) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const noteId = c.req.param("id");
    const noteKey = `notes:${phone}:${noteId}`;
    
    // 检查笔记是否存在
    const existingNote = await kv.get(noteKey);
    
    if (!existingNote) {
      return c.json({ error: "Note not found" }, 404);
    }

    // 删除笔记
    await kv.del(noteKey);

    return c.json({ success: true });
  } catch (error) {
    console.error("Delete note error:", error);
    return c.json({ error: "Failed to delete note" }, 500);
  }
});

Deno.serve(app.fetch);