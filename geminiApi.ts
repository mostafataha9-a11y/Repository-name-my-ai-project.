import * as GoogleAI from "@google/genai";

// 1. قراءة المفتاح من ملف .env.local (تأكد أن الملف يبدأ بنقطة)
// @ts-ignore
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// 2. حل مشكلة الخط الأحمر في السطر الذي توقفنا عنده:
// نستخدم (GoogleAI as any) لضمان أن المتصفح يرى المكتبة بشكل صحيح
const genAI = new (GoogleAI as any).GoogleGenerativeAI(API_KEY);

/**
 * دالة تحليل صور الديكور باستخدام نموذج Gemini 1.5 Flash
 */
export const analyzeDecorImage = async (imageFile: File, userPrompt: string): Promise<string> => {
  try {
    if (!API_KEY) {
      throw new Error("مفتاح الـ API مفقود! تأكد من وجود ملف .env.local في المجلد الرئيسي.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // تحويل الصورة لبيانات Base64 ليقرأها الذكاء الاصطناعي
    const base64Data = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(imageFile);
    });

    // إرسال البيانات لـ Gemini
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: imageFile.type
        }
      },
      {
        text: userPrompt || "أنت مصمم ديكور محترف. حلل هذه الغرفة وقدم نصائح دقيقة لتحسينها باللغة العربية."
      }
    ]);

    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return `عذراً، حدث خطأ: ${error.message || "فشل الاتصال بالذكاء الاصطناعي"}`;
  }
};