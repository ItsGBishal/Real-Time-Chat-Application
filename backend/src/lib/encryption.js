import crypto from "crypto";
import { ENV } from "./env.js";

// AES-256-GCM encryption/decryption utility
const ALGORITHM = "aes-256-gcm";

function getKey() {
  const secret = ENV.ENCRYPTION_KEY || "default_fallback_key_change_in_prod!";
  return crypto.createHash("sha256").update(secret).digest();
}

export function encrypt(plainText) {
  if (!plainText) return plainText;
  try {
    const key = getKey();
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag().toString("hex");

    return `${iv.toString("hex")}:${authTag}:${encrypted}`;
  } catch (err) {
    console.error("Encryption error:", err.message);
    return plainText;
  }
}

export function decrypt(encryptedText) {
  if (!encryptedText) return encryptedText;
  if (!encryptedText.includes(":")) return encryptedText;

  try {
    const [ivHex, authTagHex, encrypted] = encryptedText.split(":");
    if (!ivHex || !authTagHex || !encrypted) return encryptedText;

    const key = getKey();
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err) {
    console.error("Decryption error:", err.message);
    return "[Encrypted Message]";
  }
}
