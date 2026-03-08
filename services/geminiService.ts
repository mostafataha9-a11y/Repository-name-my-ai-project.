
import { GoogleGenAI, Type, Modality, GenerateContentParameters } from "@google/genai";
import { Language, Region, UserRank, UserPreferences } from "../types";

// Internal helper to get the AI instance lazily
let aiInstance: GoogleGenAI | null = null;

function getAI() {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured. Please set it in your environment variables.");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

// Internal helper for content generation with built-in retry logic and model fallback
async function safeGenerateContent(params: GenerateContentParameters, retryCount = 0): Promise<any> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent(params);
    return response;
  } catch (error: any) {
    // Handle missing API key or other initialization errors gracefully
    if (error?.message?.includes("GEMINI_API_KEY is not configured")) {
      console.warn("Gemini API call skipped: API key missing.");
      return { text: "API_KEY_MISSING" };
    }
    const isQuotaError = error?.message?.includes('429') || error?.message?.includes('quota');
    if (isQuotaError && params.model !== 'gemini-3-flash-preview') {
      return safeGenerateContent({ ...params, model: 'gemini-3-flash-preview' }, retryCount);
    }
    if (retryCount < 2 && (error?.status >= 500 || isQuotaError)) {
      const delay = Math.pow(2, retryCount) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return safeGenerateContent(params, retryCount + 1);
    }
    throw error;
  }
}

/**
 * NEW: Analyze AR Performance and suggest optimizations.
 */
export const analyzeARPerformance = async (assetCount: number, latency: number, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? `حلل أداء مشهد الواقع المعزز الحالي: عدد المجسمات (${assetCount})، تأخير الاستجابة (${latency}ms). 
         المطلوب: تقديم 3 اقتراحات تقنية مختصرة لتحسين الأداء والحفاظ على استقرار 60fps.`
      : `Analyze AR scene performance: Asset count (${assetCount}), Latency (${latency}ms). 
         Required: Provide 3 concise technical suggestions to optimize performance and maintain 60fps stability.`;

    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            performanceScore: { type: Type.NUMBER },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            optimizationLevel: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

// --- EXISTING EXPORTS ---

export const describeARScene = async (base64Image: string, lang: Language) => {
  try {
    const prompt = lang === 'ar' 
      ? "صف ما تراه الكاميرا في هذه الغرفة حالياً للمستخدم الكفيف. حدد الأسطح (أرض، جدران) وأي عوائق أو أثاث موجود بأسلوب توجيهي مكاني."
      : "Describe what the camera is seeing in this room for a blind user. Identify surfaces (floor, walls) and any obstacles or furniture in a spatial guidance style.";
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: prompt }] },
    });
    return response.text;
  } catch (error) { return lang === 'ar' ? "فشل تحليل المشهد حالياً." : "Failed to analyze the scene at this moment."; }
};

export const suggestARImprovements = async (base64Image: string, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? "بناءً على صورة هذه الغرفة، اقترح 3 تحسينات معمارية أو ديكورية فورية يمكن تنفيذها. اجعل الاقتراحات قصيرة وموجهة للفعل (مثل: أضف إضاءة مخفية)."
      : "Based on this room image, suggest 3 immediate architectural or decor improvements. Keep suggestions short and action-oriented (e.g., 'Add hidden ceiling lighting').";
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: prompt }] },
    });
    return response.text;
  } catch (error) { return null; }
};

export const getAIExpertAdvice = async (prompt: string) => {
  try {
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a senior AI Architectural Expert providing professional design advice. Focus on structural integrity, aesthetics, and global standards."
      }
    });
    return response.text;
  } catch (error) { return "I'm sorry, I cannot provide advice at this moment."; }
};

export const generateMoodBoard = async (prompt: string, style: string) => {
  try {
    const finalPrompt = `Architectural mood board for ${style} style. Keywords: ${prompt}. Professional, high-end, inspiring.`;
    const response = await safeGenerateContent({
      model: 'gemini-2.5-flash-image',
      contents: finalPrompt,
    });
    for (const part of response.candidates[0].content.parts) { 
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`; 
    }
    return null;
  } catch (error) { return null; }
};

export const estimateProjectCost = async (scope: string, region: string) => {
  try {
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: `Estimate the project cost for: ${scope} in the region: ${region}. Provide a range and key cost drivers.`,
    });
    return response.text;
  } catch (error) { return "Unable to calculate cost estimate at this time."; }
};

export const analyzeTechnicalPlan = async (base64Image: string, lang: Language) => {
  try {
    const prompt = lang === 'ar' 
      ? "قم بتحليل هذا المخطط الفني. استخرج الأخطاء، الأبعاد الرئيسية، وملاحظات التنفيذ."
      : "Analyze this technical blueprint. Extract errors, key dimensions, and implementation notes.";
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: prompt }] },
    });
    return response.text;
  } catch (error) { return "Technical plan analysis failed."; }
};

export const describeVisualImage = async (base64Image: string, lang: Language) => {
  try {
    const prompt = lang === 'ar' ? "صف هذه الصورة المعمارية بالتفصيل." : "Describe this architectural image in detail.";
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: prompt }] },
    });
    return response.text;
  } catch (error) { return "Description failed."; }
};

export const detectVisualColors = async (base64Image: string, lang: Language) => {
  try {
    const prompt = lang === 'ar' ? "استخرج لوحة الألوان من هذه الصورة." : "Extract the color palette from this image.";
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: prompt }] },
    });
    return response.text;
  } catch (error) { return "Color detection failed."; }
};

export const generateArticleOutline = async (title: string, lang: Language) => {
  try {
    const prompt = `Create a structured outline for an architectural article titled: "${title}"`;
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) { return null; }
};

export const getDecorCoWriterExpansion = async (content: string, style: string, lang: Language) => {
  try {
    const prompt = `Expand on the following architectural text using a ${style} perspective: "${content}"`;
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) { return null; }
};

export const generateArchitecturalCitations = async (content: string) => {
  try {
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 3 relevant architectural citations or book references for this text: "${content}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              source: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) { return []; }
};

export const generateIPNeuralFingerprint = async (content: string, author: string) => {
  try {
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a unique neural IP fingerprint for this content by ${author}: "${content.substring(0, 100)}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fingerprint: { type: Type.STRING },
            hash: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const getSemanticRecommendations = async (content: string, lang: Language) => {
  try {
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on this content, suggest 3 related architectural topics: "${content.substring(0, 300)}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              similarityScore: { type: Type.NUMBER }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) { return []; }
};

export const refineDictatedText = async (text: string, lang: Language) => {
  try {
    const prompt = `Refine this dictated architectural text for clarity and professional tone: "${text}"`;
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) { return text; }
};

export const performEngineerMatchmaking = async (brief: string, lang: Language) => {
  try {
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: `Match an engineer to this brief: "${brief}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            matchScore: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            suggestedExperts: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const verifyProfessionalIdentity = async (base64Image: string, context: string) => {
  try {
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: `Verify this professional ID/License for: ${context}` }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: { type: Type.BOOLEAN },
            detectedName: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
            expiryDate: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const performSmartSearch = async (query: string, lang: Language) => {
  try {
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a semantic architectural search for: "${query}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedStyle: { type: Type.STRING },
            suggestedBudget: { type: Type.STRING },
            relatedProjects: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const visualSearchAnalysis = async (base64Image: string, lang: Language) => {
  try {
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: "Analyze this image to find similar architectural styles and budgets." }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedStyle: { type: Type.STRING },
            suggestedBudget: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const getSearchSuggestions = async (query: string, lang: Language) => {
  try {
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide search suggestions for: "${query}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) { return []; }
};

export const generateMarketReport = async (region: Region, lang: Language) => {
  try {
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a market report for architectural trends in: ${region}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            investmentHotspots: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const analyzeSEOGaps = async (keywords: string[], lang: Language) => {
  try {
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze SEO keyword gaps for these topics: ${keywords.join(", ")}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            missingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            competitorScore: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const getPredictiveInsights = async (region: Region, lang: Language) => {
  try {
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide 2026 predictive design insights for: ${region}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trends: { type: Type.ARRAY, items: { type: Type.STRING } },
            growthFactor: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const getMultiLangSEO = async (topic: string, targets: string[]) => {
  try {
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate SEO metadata for "${topic}" in these languages: ${targets.join(", ")}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              lang: { type: Type.STRING },
              title: { type: Type.STRING },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) { return []; }
};

export const calculateNeuralReputation = async (context: string) => {
  try {
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: `Calculate a neural reputation score for an architect with this profile: "${context}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reputationScore: { type: Type.NUMBER },
            feedback: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const getLocalSEOData = async (city: string, lang: Language) => {
  try {
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide localized architectural SEO data for the city: ${city}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            h1Header: { type: Type.STRING },
            metaDescription: { type: Type.STRING },
            schemaKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            localContext: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const analyzeColorPsychology = async (params: {
  spaceType: string;
  goal: string;
  ageGroup: string;
  lighting: string;
  country: string;
}, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? `حلل سيكولوجية الألوان للمساحة التالية:
         - نوع المساحة: ${params.spaceType}
         - الهدف النفسي: ${params.goal}
         - الفئة العمرية: ${params.ageGroup}
         - الإضاءة الطبيعية: ${params.lighting}
         - السياق الثقافي: ${params.country}
         
         المطلوب تقرير مفصل يتضمن:
         1. الألوان المقترحة مع شرح سبب اختيار كل لون.
         2. التأثير النفسي المتوقع على المستخدمين.
         3. إحصائيات سلوكية فعلية ونتائج دراسات علمية (مثل دراسات UBC حول الإبداع).
         4. تأثير اللون على قرار الشراء والإنتاجية أو التركيز.
         5. تحذيرات أو ملاحظات هامة (إن وجدت).`
      : `Analyze color psychology for the following space:
         - Space Type: ${params.spaceType}
         - Psychological Goal: ${params.goal}
         - Age Group: ${params.ageGroup}
         - Natural Lighting: ${params.lighting}
         - Cultural Context: ${params.country}
         
         Required detailed report including:
         1. Suggested colors with explanation for each choice.
         2. Expected psychological impact on users.
         3. Actual behavioral statistics and scientific study results (e.g., UBC studies on creativity).
         4. Impact of color on purchase decisions and productivity or focus.
         5. Important warnings or notes (if any).`;

    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedColors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  colorName: { type: Type.STRING },
                  hexCode: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  energyLevel: { type: Type.STRING, description: "High, Medium, or Low" },
                  metrics: {
                    type: Type.OBJECT,
                    properties: {
                      focus: { type: Type.NUMBER, description: "0-100" },
                      relaxation: { type: Type.NUMBER, description: "0-100" },
                      spaciousness: { type: Type.NUMBER, description: "0-100" }
                    }
                  }
                }
              }
            },
            psychologicalImpact: { type: Type.STRING },
            behavioralStats: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  stat: { type: Type.STRING },
                  value: { type: Type.STRING },
                  source: { type: Type.STRING }
                }
              }
            },
            scientificStudies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  studyName: { type: Type.STRING },
                  finding: { type: Type.STRING },
                  institution: { type: Type.STRING }
                }
              }
            },
            purchaseImpact: { type: Type.STRING },
            productivityImpact: { type: Type.STRING },
            warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
            summary: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const generatePlanVisual = async (description: string) => {
  try {
    const prompt = `Architectural floor plan or visual blueprint based on: ${description}. Clear, technical, black and white schematic.`;
    const response = await safeGenerateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
    });
    for (const part of response.candidates[0].content.parts) { 
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`; 
    }
    return null;
  } catch (error) { return null; }
};

export const analyzeBrandColors = async (base64Image: string, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? "حلل الهوية البصرية في هذه الصورة. استخرج الألوان الأساسية والثانوية، وحلل الشخصية التجارية المتوقعة وتأثيرها النفسي."
      : "Analyze the visual identity in this image. Extract primary and secondary colors, analyze the expected brand personality and its psychological impact.";
    
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            primaryColors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  hex: { type: Type.STRING },
                  percentage: { type: Type.NUMBER },
                  psychology: { type: Type.STRING }
                }
              }
            },
            secondaryColors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  hex: { type: Type.STRING },
                  percentage: { type: Type.NUMBER },
                  psychology: { type: Type.STRING }
                }
              }
            },
            brandPersonality: { type: Type.STRING },
            impactScore: { type: Type.NUMBER },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const suggestProfessionalColorDistribution = async (brandAnalysis: any, spaceContext: string, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? `بناءً على تحليل العلامة التجارية التالي: ${JSON.stringify(brandAnalysis)}، اقترح توزيعاً احترافياً للألوان في المساحة التالية: "${spaceContext}".`
      : `Based on the following brand analysis: ${JSON.stringify(brandAnalysis)}, suggest a professional color distribution for this space: "${spaceContext}".`;

    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              zone: { type: Type.STRING },
              suggestedColors: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    hex: { type: Type.STRING },
                    ratio: { type: Type.STRING }
                  }
                }
              },
              reasoning: { type: Type.STRING },
              visualImpact: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) { return []; }
};

export const measureBrandCustomerImpact = async (brandAnalysis: any, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? `حلل التأثير المتوقع لهذه الألوان التجارية على سلوك العملاء: ${JSON.stringify(brandAnalysis)}.`
      : `Analyze the expected impact of these brand colors on customer behavior: ${JSON.stringify(brandAnalysis)}.`;

    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              metric: { type: Type.STRING },
              impact: { type: Type.STRING },
              percentage: { type: Type.NUMBER },
              description: { type: Type.STRING }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) { return []; }
};

export const analyzeCulturalColorPsychology = async (region: string, country: string, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? `حلل سيكولوجية الألوان الثقافية لمنطقة ${region} ودولة ${country}. ركز على الدلالات الدينية والاجتماعية والرمزية المحلية.`
      : `Analyze the cultural color psychology for the ${region} region and ${country}. Focus on religious, social, and local symbolic meanings.`;
    
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            region: { type: Type.STRING },
            country: { type: Type.STRING },
            colorMeanings: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  color: { type: Type.STRING },
                  hex: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                  symbolism: { type: Type.STRING }
                }
              }
            },
            religiousContext: { type: Type.STRING },
            socialNorms: { type: Type.STRING },
            designRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const getSmartColorConsultation = async (params: {
  projectType: string;
  area: string;
  lighting: string;
  ageGroup: string;
  goal: string;
  base64Image?: string;
}, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? `بصفتك مستشار ألوان ذكي، قدم توصية ألوان متكاملة بناءً على:
         - نوع المشروع: ${params.projectType}
         - المساحة: ${params.area}
         - الإضاءة: ${params.lighting}
         - الفئة العمرية: ${params.ageGroup}
         - الهدف: ${params.goal}
         ${params.base64Image ? 'حلل الصورة المرفقة للفراغ وادمجها في التوصية.' : ''}
         
         يجب أن تتضمن التوصية لوحة ألوان متناسقة، تحليل مكاني، ورؤى تعلم آلي (ML Insights).`
      : `As a Smart Color Consultant, provide a comprehensive color recommendation based on:
         - Project Type: ${params.projectType}
         - Area: ${params.area}
         - Lighting: ${params.lighting}
         - Age Group: ${params.ageGroup}
         - Goal: ${params.goal}
         ${params.base64Image ? 'Analyze the attached space image and integrate it into the recommendation.' : ''}
         
         The recommendation must include a harmonized palette, spatial analysis, and ML insights.`;

    const contents = params.base64Image 
      ? { parts: [{ inlineData: { data: params.base64Image, mimeType: 'image/jpeg' } }, { text: prompt }] }
      : prompt;

    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedPalette: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  hex: { type: Type.STRING },
                  ratio: { type: Type.STRING },
                  psychology: { type: Type.STRING }
                }
              }
            },
            spatialAnalysis: {
              type: Type.OBJECT,
              properties: {
                lightingImpact: { type: Type.STRING },
                areaOptimization: { type: Type.STRING },
                ageSuitability: { type: Type.STRING }
              }
            },
            psychologicalAlignment: { type: Type.STRING },
            mlInsights: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const analyzeNeuroDesign = async (colorPalette: string[], lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? `حلل التأثير العصبي (Neuro-Design) للوحة الألوان التالية: ${colorPalette.join(", ")}.
         المطلوب تقرير يتضمن:
         1. تأثير الطول الموجي لكل لون على الدماغ.
         2. علاقة الألوان بمعدل ضربات القلب (BPM).
         3. تأثير الإضاءة الدافئة مقابل الباردة على هذه الألوان عصبياً.
         4. تحليل مستوى التحفيز العصبي ونوع موجات الدماغ السائدة (Alpha, Beta, etc.).`
      : `Analyze the Neuro-Design impact of the following color palette: ${colorPalette.join(", ")}.
         Required report including:
         1. Wavelength effect of each color on the brain.
         2. Relationship of colors with heart rate (BPM).
         3. Effect of warm vs. cold lighting on these colors neurally.
         4. Analysis of neural stimulation levels and dominant brain wave types (Alpha, Beta, etc.).`;

    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            wavelengthEffect: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  color: { type: Type.STRING },
                  wavelength: { type: Type.STRING },
                  brainImpact: { type: Type.STRING },
                  neuralFrequency: { type: Type.STRING }
                }
              }
            },
            heartRateImpact: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  colorRange: { type: Type.STRING },
                  bpmChange: { type: Type.STRING },
                  physiologicalState: { type: Type.STRING }
                }
              }
            },
            lightingNeuroEffect: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  melatoninImpact: { type: Type.STRING },
                  circadianRhythmEffect: { type: Type.STRING },
                  cognitivePerformance: { type: Type.STRING }
                }
              }
            },
            neuralStimulationLevels: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  range: { type: Type.STRING },
                  stimulationScore: { type: Type.NUMBER },
                  dominantBrainWave: { type: Type.STRING },
                  recommendedTask: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const calculateVisualFatigue = async (colors: string[], lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? `احسب مؤشر الإجهاد البصري لمجموعة الألوان التالية: ${colors.join(", ")}.
         حلل التباين، السطوع، وتداخل الألوان وتأثيرها على العين البشرية لفترات طويلة.`
      : `Calculate the Visual Fatigue Index for the following color palette: ${colors.join(", ")}.
         Analyze contrast, brightness, and color clashing and their impact on the human eye over long periods.`;

    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fatigueScore: { type: Type.NUMBER },
            riskLevel: { type: Type.STRING },
            detectedIssues: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            contrastRatio: { type: Type.STRING },
            readabilityScore: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const generateSmartPalette = async (params: {
  baseColor?: string;
  mood: string;
  usage: string;
}, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? `قم بتوليد لوحة ألوان ذكية بناءً على:
         - اللون الأساسي: ${params.baseColor || 'تلقائي'}
         - الحالة المزاجية: ${params.mood}
         - الاستخدام: ${params.usage}
         المطلوب لوحة متناسقة مع تحليل إمكانية الوصول.`
      : `Generate a smart color palette based on:
         - Base Color: ${params.baseColor || 'Auto'}
         - Mood: ${params.mood}
         - Usage: ${params.usage}
         Required a harmonized palette with accessibility analysis.`;

    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            palette: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  hex: { type: Type.STRING },
                  psychology: { type: Type.STRING },
                  usage: { type: Type.STRING }
                }
              }
            },
            harmonyType: { type: Type.STRING },
            accessibilityCheck: { type: Type.BOOLEAN },
            contrastMatrix: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  colors: { type: Type.ARRAY, items: { type: Type.STRING } },
                  score: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const getFunctionalColorMatrix = async (params: {
  spaceType: string;
  goal: string;
  activityLevel: string;
  lighting: string;
}, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? `بصفتك خبير في سيكولوجية الألوان، قم بإنشاء مصفوفة وظيفية (Functional Matrix) تربط بين:
         - نوع الفراغ: ${params.spaceType}
         - الهدف النفسي: ${params.goal}
         - مستوى النشاط: ${params.activityLevel}
         - شدة الإضاءة: ${params.lighting}
         
         قدم أفضل نطاق لوني (Best Color Range) مع توضيح التشبع، درجة الحرارة، وأكواد الألوان، بالإضافة إلى نصائح تصميمية.`
      : `As a color psychology expert, create a Functional Matrix linking:
         - Space Type: ${params.spaceType}
         - Psychological Goal: ${params.goal}
         - Activity Level: ${params.activityLevel}
         - Lighting Intensity: ${params.lighting}
         
         Provide the best color range with saturation, temperature, hex codes, and design tips.`;

    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            spaceType: { type: Type.STRING },
            psychologicalGoal: { type: Type.STRING },
            activityLevel: { type: Type.STRING },
            lightingIntensity: { type: Type.STRING },
            bestColorRange: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                saturation: { type: Type.STRING },
                temperature: { type: Type.STRING },
                hexCodes: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            designTips: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const analyzeColorIntelligence = async (base64Image: string, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? "حلل ذكاء الألوان في هذه الغرفة. استخرج درجة حرارة اللون، التوازن، ونسبة التشبع، وقدم اقتراحات تحسين ذكية."
      : "Analyze the color intelligence in this room. Extract color temperature, balance, and saturation ratio, and provide smart improvement suggestions.";
    
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            temperature: {
              type: Type.OBJECT,
              properties: {
                value: { type: Type.STRING },
                description: { type: Type.STRING },
                kelvinEstimate: { type: Type.NUMBER }
              }
            },
            balance: {
              type: Type.OBJECT,
              properties: {
                score: { type: Type.NUMBER },
                status: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            },
            saturation: {
              type: Type.OBJECT,
              properties: {
                level: { type: Type.NUMBER },
                status: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            },
            detectedColors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  hex: { type: Type.STRING },
                  percentage: { type: Type.NUMBER }
                }
              }
            },
            smartImprovements: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const auditGlobalScaling = async (logs: string, lang: Language) => {
  try {
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: `Audit this infrastructure log for global scalability: "${logs}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scalingFactor: { type: Type.NUMBER },
            bottlenecks: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const generateArchitectureReport = async (lang: Language) => {
  try {
    const prompt = lang === 'ar' ? "أنشئ تقريراً هندسياً مفصلاً عن حالة البنية التحتية للمنصة." : "Generate a detailed engineering report on platform infrastructure status.";
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) { return null; }
};

export const auditMonitoringSystem = async (logs: string, lang: Language) => {
  try {
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these service logs and provide a health audit: ${logs}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            systemHealthScore: { type: Type.NUMBER },
            serviceHealth: { type: Type.OBJECT, properties: { auth: { type: Type.NUMBER }, msg: { type: Type.NUMBER }, search: { type: Type.NUMBER } } },
            criticalBottlenecks: { type: Type.ARRAY, items: { type: Type.STRING } },
            optimizationPlan: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const auditFinancialSystem = async (logs: string, lang: Language) => {
  try {
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze these financial transaction logs for ACID compliance: ${logs}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            acidComplianceScore: { type: Type.NUMBER },
            eventBusHealth: { type: Type.NUMBER },
            summary: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const getSpatialOrientation = async (activeTab: string, elementCount: number, lang: Language) => {
  try {
    const prompt = `Provide a short spatial orientation summary for a user on the "${activeTab}" tab with ${elementCount} interactive elements.`;
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) { return "Orientation unavailable."; }
};

export const explainComplexity = async (term: string, lang: Language) => {
  try {
    const prompt = `Explain the following architectural term simply: "${term}"`;
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) { return "Explanation unavailable."; }
};

export const summarizeArchitecturalContent = async (content: string, lang: Language) => {
  try {
    const prompt = `Provide a concise 2-sentence summary of this architectural content: "${content}"`;
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) { return "Summary unavailable."; }
};

export const describeDataStructure = async (data: string, lang: Language) => {
  try {
    const prompt = `Describe this data structure narratively for accessibility purposes: "${data}"`;
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) { return "Data description unavailable."; }
};

export const validateSupplierModel = async (modelMetadata: string, lang: Language) => {
  try {
    const prompt = lang === 'ar' 
      ? `قم بفحص جودة النموذج ثلاثي الأبعاد بناءً على البيانات التالية: ${modelMetadata}. قيم الدقة، عدد المثلثات، وتوافق الخامات مع معايير PBR.`
      : `Audit the quality of a 3D model based on this metadata: ${modelMetadata}. Evaluate resolution, triangle count, and PBR material compatibility.`;

    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            qualityScore: { type: Type.NUMBER },
            isPBRCompliant: { type: Type.BOOLEAN },
            optimizationRequired: { type: Type.BOOLEAN },
            suggestedCompressionRatio: { type: Type.STRING },
            status: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const generateARStatusReport = async (lang: Language) => {
  try {
    const prompt = lang === 'ar' 
      ? "أكتب تقريرًا تنفيذيًا موجزًا واحترافيًا عن حالة قسم الواقع المعزز (AR) في منصة DecorGlobal. ركز على دقة التتبع المكاني، سرعة الاستجابة 12ms، وتوافق المعايير العالمية."
      : "Write a concise professional executive report on the AR Department status in DecorGlobal. Focus on spatial tracking precision, 12ms latency, and global standards compliance.";
    
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return response.text;
  } catch (error) { return null; }
};

export const analyzeARPlacement = async (assetName: string, roomContext: string, lang: Language) => {
  try {
    const prompt = lang === 'ar' 
      ? `حلل وضع قطعة الأثاث "${assetName}" في سياق الغرفة التالي: "${roomContext}". 
         المطلوب:
         1. تحليل توزيع الأثاث.
         2. كشف الازدحام (نعم/لا).
         3. اقتراح مكان بديل أفضل.
         4. تحليل مسارات الحركة (آمنة/ضيقة).
         5. تقييم التصميم النهائي.`
      : `Analyze the placement of "${assetName}" in this room context: "${roomContext}". 
         Required: 
         1. Distribution analysis.
         2. Overcrowding detection (Yes/No).
         3. Suggest better alternative location.
         4. Movement path analysis (Safe/Tight).
         5. Final design evaluation score.`;

    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            distribution: { type: Type.STRING },
            overcrowdingAlert: { type: Type.STRING },
            alternativeLocation: { type: Type.STRING },
            movementSafety: { type: Type.STRING },
            designScore: { type: Type.NUMBER },
            logicSummary: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const analyzeUserTaste = async (interactions: string[], lang: Language): Promise<string[]> => {
  try {
    const prompt = `Analyze these previous architectural style requests and extract a concise list of design preference keywords (e.g., "warm woods", "biophilic", "sharp geometric"): ${interactions.join(", ")}`;
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (e) { return []; }
};

export const analyzeModelPerformance = async (usageLogs: any[], lang: Language) => {
  try {
    const prompt = `Analyze these AI generation logs and provide optimization suggestions for the architectural engine. Logs: ${JSON.stringify(usageLogs)}`;
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            optimizationScore: { type: Type.NUMBER },
            topStyles: { type: Type.ARRAY, items: { type: Type.STRING } },
            engineSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            learningStatus: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const analyzeColorConflicts = async (colors: { name: string, hex: string }[], lang: Language) => {
  try {
    const prompt = `Analyze these colors for potential conflicts: ${JSON.stringify(colors)}.
    Identify:
    1. Strong psychological contradictions (e.g., colors that evoke clashing emotions).
    2. Visual noise/confusion.
    3. Potential eye strain (e.g., high contrast vibrating colors).
    For each conflict, provide a description and a suggested alternative color (name and hex).
    Provide the response in both English and Arabic.`;

    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            conflicts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING, description: "Psychological, Visual Noise, or Eye Strain" },
                  description: { type: Type.STRING },
                  descriptionAr: { type: Type.STRING },
                  severity: { type: Type.STRING, description: "Low, Medium, High" },
                  affectedColors: { type: Type.ARRAY, items: { type: Type.STRING } },
                  suggestedAlternative: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      hex: { type: Type.STRING },
                      reason: { type: Type.STRING },
                      reasonAr: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            overallSafetyScore: { type: Type.NUMBER, description: "0-100" }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const analyzePersonality = async (answers: { question: string, answer: string }[], lang: Language) => {
  try {
    const prompt = `Analyze the user's personality based on these quiz answers: ${JSON.stringify(answers)}.
    Determine if they are Analytical, Creative, Social, or Calm.
    Provide a description in both English and Arabic, a suggested color palette (3 colors with hex codes), and 3 key personality traits.`;

    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, description: "Analytical, Creative, Social, or Calm" },
            description: { type: Type.STRING },
            descriptionAr: { type: Type.STRING },
            suggestedPalette: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  hex: { type: Type.STRING }
                }
              }
            },
            traits: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const generateHighQualityRoomDesign = async (base64Image: string, style: string, budget: string, country: string, preferences?: UserPreferences) => {
  const aiPro = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const personalizationContext = preferences ? 
      `User Lifestyle: ${preferences.lifestyle}. Specific Taste Keywords: ${preferences.tasteProfile.join(", ")}. Ensure design is culturally compatible with ${preferences.country}.` : '';
    
    const prompt = `Hyper-realistic architectural masterpiece, 4K Ultra-HD resolution, cinematic global illumination, ray-traced shadows, ultra-detailed textures. Design Style: ${style}, Geographic Region: ${country}, Project Budget Context: ${budget}. ${personalizationContext} Only masterpiece quality for professional architects.`;
    
    const response = await aiPro.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "4K"
        }
      }
    });
    for (const part of response.candidates[0].content.parts) { 
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`; 
    }
    return null;
  } catch (error) { 
    throw error;
  }
};

export const generateRoomRedesign = async (base64Image: string, style: string, budget: string, country: string, variationIndex: number = 0, preferences?: UserPreferences) => {
  try {
    const personalizationContext = preferences ? 
      `Lifestyle focus: ${preferences.lifestyle}. Personal taste: ${preferences.tasteProfile.join(", ")}. Cultural context: ${preferences.country}.` : '';

    const prompt = `Architectural redesign, style: ${style}, budget: ${budget}, location: ${country}. ${personalizationContext} High-end cinematic visualization. Variant ${variationIndex + 1}`;
    const response = await safeGenerateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: prompt }] },
    });
    for (const part of response.candidates[0].content.parts) { 
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`; 
    }
    return null;
  } catch (error) { return null; }
};

export const generateAIVoiceNarration = async (text: string, lang: Language) => {
  try {
    const prompt = lang === 'ar' ? `اقرأ النص التالي بنبرة معمارية احترافية وهادئة: ${text}` : `Read the following architectural text in a professional, calm voice: ${text}`;
    const response = await safeGenerateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: lang === 'ar' ? 'Puck' : 'Kore' } } },
      },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) { return null; }
};

export const analyzeRoomEngineering = async (base64Image: string, lang: Language) => {
  try {
    const prompt = lang === 'ar' 
      ? "قم بإجراء تحليل هندسي ومعماري عميق لهذه الغرفة. استخرج بدقة: نوع الغرفة، الأثاث الموجود، الميزات المعمارية، لوحة الألوان، وتحليل الإضاءة."
      : "Perform a deep architectural analysis. Extract: room type, furniture, features, color palette, and lighting.";
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roomType: { type: Type.STRING },
            existingFurniture: { type: Type.ARRAY, items: { type: Type.STRING } },
            architecturalFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
            colorPalette: { type: Type.ARRAY, items: { type: Type.STRING } },
            lightingAnalysis: { type: Type.STRING },
            detectedDefects: { type: Type.ARRAY, items: { type: Type.STRING } },
            estimatedDimensions: { type: Type.OBJECT, properties: { area: { type: Type.STRING }, ceilingHeight: { type: Type.STRING } } },
            currentStyle: { type: Type.STRING },
            technicalReport: { type: Type.STRING },
            swotAnalysis: { type: Type.OBJECT, properties: { strengths: { type: Type.ARRAY, items: { type: Type.STRING } }, weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }, opportunities: { type: Type.ARRAY, items: { type: Type.STRING } } } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const analyzeDesignQualityMetrics = async (base64Image: string, lang: Language) => {
  try {
    const prompt = lang === 'ar' 
      ? "حلل جودة الصورة المعمارية التالية بدقة 4K. قيم المعايير التالية من 1 إلى 100: توازن الإضاءة (HDR)، دقة الخامات، التماثل الهيكلي، دقة الوضوح البصري، ومدى تماسك الألوان."
      : "Analyze architectural quality at 4K resolution. Score (1-100): Luminous Balance (HDR), Material Texture Fidelity, Structural Integrity, Visual Resolution Grade, and Chroma Consistency.";
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/png' } }, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            lighting: { type: Type.NUMBER },
            textures: { type: Type.NUMBER },
            integrity: { type: Type.NUMBER },
            resolution: { type: Type.NUMBER },
            summary: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

export const refineRoomDesign = async (base64Image: string, editPrompt: string, lang: Language) => {
  try {
    const finalPrompt = lang === 'ar' 
      ? `قم بتعديل التصميم المعماري في هذه الصورة بناءً على الطلب التالي: ${editPrompt}. 
         أمثلة للتعديلات المطلوبة: تغيير ألوان الجدران، تغيير مقاسات قطع الأثاث بنسبة مئوية محددة، استبدال الخامات (مثل الرخام)، أو إضافة أنظمة إضاءة جديدة (مثل الإضاءة المخفية).
         حافظ على النسب الهندسية والأبعاد الأصلية ولكن طبق التعديلات بدقة سينمائية واحترافية.`
      : `Refine the architectural design in this image based on: ${editPrompt}. 
         Handle specific requests like changing wall colors, scaling furniture by percentage, replacing materials (e.g., Carrara marble), or adding new lighting systems (e.g., hidden ceiling lighting).
         Maintain geometric proportions and original dimensions but apply changes with cinematic and professional precision.`;
    const response = await safeGenerateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: finalPrompt }] },
    });
    for (const part of response.candidates[0].content.parts) { 
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`; 
    }
    return null;
  } catch (error) { return null; }
};

export const generateProfessionalTechnicalPlans = async (base64Image: string, style: string, country: string, budget: string, lang: Language) => {
  try {
    const prompt = lang === 'ar' 
      ? `قم بإنشاء تقرير هندسي تنفيذي شامل لهذا التصميم (${style}) في (${country}). 
         المطلوب بدقة: 
         1. حساب أبعاد مليمترية لكافة العناصر.
         2. تحليل مسارات الحركة وتدفق المستخدم.
         3. حساب توزيع الإضاءة الطبيعية والصناعية (Lux/Lumen).
         4. قائمة مواد تفصيلية للمقاولين تشمل المواصفات وتقدير زمني للتنفيذ.
         5. كشف الأخطاء الهندسية أو التعارضات الإنشائية.`
      : `Generate a comprehensive executive engineering report for this design (${style}) in (${country}). 
         Required: 
         1. Millimetric dimensions for all elements.
         2. Circulation path and user flow analysis.
         3. Natural and artificial lighting distribution calculation (Lux/Lumen).
         4. Detailed contractor material list with specs and execution timeline.
         5. Engineering error detection and structural conflicts.`;
         
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: prompt }] },
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            millimetricDimensions: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT, 
                properties: { 
                  element: { type: Type.STRING }, 
                  width: { type: Type.STRING }, 
                  depth: { type: Type.STRING }, 
                  height: { type: Type.STRING } 
                } 
              } 
            },
            circulationPaths: { type: Type.ARRAY, items: { type: Type.STRING } },
            lightingMap: { 
              type: Type.OBJECT, 
              properties: { 
                naturalIntensity: { type: Type.STRING }, 
                artificialLayout: { type: Type.ARRAY, items: { type: Type.STRING } },
                suggestedLuxLevels: { type: Type.STRING }
              } 
            },
            materialList: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT, 
                properties: { 
                  item: { type: Type.STRING }, 
                  specification: { type: Type.STRING }, 
                  quantity: { type: Type.STRING },
                  estimatedPrice: { type: Type.STRING },
                  suggestedSupplier: { type: Type.STRING }
                } 
              } 
            },
            executionTimeline: { 
              type: Type.OBJECT, 
              properties: {
                phase1: { type: Type.STRING },
                phase2: { type: Type.STRING },
                phase3: { type: Type.STRING },
                totalDuration: { type: Type.STRING }
              }
            },
            engineeringErrors: { type: Type.ARRAY, items: { type: Type.STRING } },
            executiveSummary: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

/**
 * AI Engineering Gateway: Visual & Text Drawing Understanding Engine.
 */
export const analyzeEngineeringVisuals = async (base64Image: string, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? "قم بتحليل هذا الرسم الهندسي بصرياً ونصياً. استخرج العناصر الإنشائية، المعمارية، والكهربائية المكتشفة. قدم تقريراً مفصلاً يشمل الأبعاد والنصوص المكتشفة."
      : "Analyze this engineering drawing visually and textually. Extract detected structural, architectural, and electrical elements. Provide a detailed report including dimensions and detected text.";
    
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedElements: { type: Type.ARRAY, items: { type: Type.STRING } },
            textExtraction: { type: Type.ARRAY, items: { type: Type.STRING } },
            structuralIntegrity: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

/**
 * AI Engineering Gateway: ICC Compliance Analysis.
 */
export const checkICCCompliance = async (base64Image: string, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? "حلل مدى امتثال هذا الرسم لكود البناء الدولي (ICC). ركز على المتطلبات الإنشائية، المساحات، والوصول."
      : "Analyze this drawing's compliance with the International Code Council (ICC). Focus on structural requirements, spaces, and accessibility.";
    
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            complianceScore: { type: Type.NUMBER },
            violations: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidenceScore: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

/**
 * AI Engineering Gateway: NFPA Safety Standards Analysis.
 */
export const checkNFPASafety = async (base64Image: string, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? "حلل معايير السلامة في هذا الرسم بناءً على معايير NFPA (الجمعية الوطنية للحماية من الحرائق). ركز على مخارج الطوارئ، أنظمة الرش، وكاشفات الدخان."
      : "Analyze safety standards in this drawing based on NFPA (National Fire Protection Association) standards. Focus on emergency exits, sprinkler systems, and smoke detectors.";
    
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            safetyScore: { type: Type.NUMBER },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            mitigationSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidenceScore: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

/**
 * AI Engineering Gateway: Clash Detection Engine (MEP vs Structural).
 */
export const detectEngineeringClashes = async (base64Image: string, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? "قم بإجراء كشف تعارض (Clash Detection) بين الأنظمة المعمارية والإنشائية والكهربائية (MEP) في هذا الرسم."
      : "Perform Clash Detection between architectural, structural, and electrical (MEP) systems in this drawing.";
    
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            clashesFound: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  location: { type: Type.STRING },
                  severity: { type: Type.STRING }
                }
              }
            },
            summary: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

/**
 * AI Engineering Gateway: Intelligent Correction Suggestions.
 */
export const suggestEngineeringCorrections = async (base64Image: string, errors: string[], lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? `بناءً على الأخطاء المكتشفة: ${errors.join(", ")}، اقترح حلولاً هندسية دقيقة وتصحيحات للرسم.`
      : `Based on the detected errors: ${errors.join(", ")}, suggest precise engineering solutions and corrections for the drawing.`;
    
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            corrections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  issue: { type: Type.STRING },
                  solution: { type: Type.STRING },
                  technicalSpec: { type: Type.STRING }
                }
              }
            },
            confidenceScore: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

/**
 * AI Engineering Gateway: Accreditation Readiness Engine.
 * Generates a report formatted for official submission.
 */
export const generateAccreditationReport = async (base64Image: string, projectDetails: any, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? `قم بإنشاء تقرير "جاهزية للاعتماد" رسمي لهذا المشروع. التفاصيل: ${JSON.stringify(projectDetails)}. 
         يجب أن يشمل التقرير: ملخص تنفيذي، جدول الامتثال للأكواد، مراجعة السلامة، وتوقيع الذكاء الاصطناعي المعتمد.`
      : `Generate an official "Accreditation Readiness" report for this project. Details: ${JSON.stringify(projectDetails)}. 
         The report must include: Executive Summary, Code Compliance Table, Safety Review, and AI Certified Signature.`;
    
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reportId: { type: Type.STRING },
            executiveSummary: { type: Type.STRING },
            complianceChecklist: { type: Type.ARRAY, items: { type: Type.STRING } },
            officialNotes: { type: Type.STRING },
            readinessScore: { type: Type.NUMBER },
            confidenceScore: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

/**
 * AI Engineering Gateway: Pre-implementation Risk Assessment.
 */
export const assessEngineeringRisk = async (base64Image: string, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? "قم بتقييم مخاطر المشروع قبل التنفيذ بناءً على هذا الرسم. حلل المخاطر الإنشائية، البيئية، والتشغيلية."
      : "Assess project risks before implementation based on this drawing. Analyze structural, environmental, and operational risks.";
    
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING }, // Low, Medium, High, Critical
            riskFactors: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT, 
                properties: { 
                  category: { type: Type.STRING }, 
                  description: { type: Type.STRING }, 
                  impact: { type: Type.STRING } 
                } 
              } 
            },
            mitigationStrategy: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

/**
 * AI Engineering Gateway: Initial Cost Analysis based on Design Optimization.
 */
export const analyzeDesignCost = async (base64Image: string, budget: string, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? `حلل التكلفة المبدئية لهذا التصميم بناءً على الميزانية المرصودة: ${budget}. اقترح تحسينات لتقليل التكلفة دون المساس بالجودة.`
      : `Analyze initial costs for this design based on the budget: ${budget}. Suggest optimizations to reduce cost without compromising quality.`;
    
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: prompt }] },
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            estimatedTotal: { type: Type.STRING },
            costBreakdown: { type: Type.ARRAY, items: { type: Type.STRING } },
            optimizationSavings: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidenceScore: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

/**
 * AI Engineering Gateway: Sustainability Analysis (LEED/USGBC).
 */
export const analyzeSustainabilityLEED = async (base64Image: string, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? "حلل استدامة هذا المشروع وفقاً لمعايير LEED (USGBC). ركز على كفاءة الطاقة، المواد المستدامة، وجودة البيئة الداخلية."
      : "Analyze the sustainability of this project according to LEED (USGBC) standards. Focus on energy efficiency, sustainable materials, and indoor environmental quality.";
    
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: base64Image, mimeType: 'image/jpeg' } }, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sustainabilityScore: { type: Type.NUMBER },
            leedLevel: { type: Type.STRING }, // Certified, Silver, Gold, Platinum
            greenFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvementAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidenceScore: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

/**
 * AI Engineering Gateway: Self-Learning Engine.
 * Learns from past project data to improve current analysis.
 */
export const learnFromPastProjects = async (currentDrawing: string, pastProjectsData: any[], lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? `استخدم بيانات المشاريع السابقة: ${JSON.stringify(pastProjectsData)} لتحسين تحليل هذا الرسم الحالي. حدد الأنماط المتكررة والأخطاء الشائعة التي يمكن تجنبها.`
      : `Use past projects data: ${JSON.stringify(pastProjectsData)} to improve the analysis of this current drawing. Identify recurring patterns and common errors to avoid.`;
    
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: currentDrawing, mimeType: 'image/jpeg' } }, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            learnedInsights: { type: Type.ARRAY, items: { type: Type.STRING } },
            accuracyImprovement: { type: Type.STRING },
            suggestedPatterns: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidenceScore: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

/**
 * AI Engineering Gateway: Autodesk & Software Integration Interface.
 */
export const syncWithEngineeringSoftware = async (software: string, drawingData: string, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? `قم بإنشاء واجهة تكامل لمزامنة هذا الرسم مع برنامج ${software}. حدد الطبقات، العناصر، والبيانات الوصفية المتوافقة.`
      : `Create an integration interface to sync this drawing with ${software}. Identify compatible layers, elements, and metadata.`;
    
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ inlineData: { data: drawingData, mimeType: 'image/jpeg' } }, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            syncStatus: { type: Type.STRING },
            compatibleElements: { type: Type.ARRAY, items: { type: Type.STRING } },
            softwareVersion: { type: Type.STRING },
            apiEndpoint: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

/**
 * AI Engineering Gateway: BIM Full File Processing (IFC/RVT).
 */
export const processBIMFile = async (fileName: string, fileType: string, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? `قم بتحليل ملف BIM من نوع ${fileType} المسمى ${fileName}. تأكد من سلامة البيانات الوصفية (Metadata) والعلاقات المكانية.`
      : `Analyze BIM file of type ${fileType} named ${fileName}. Ensure metadata integrity and spatial relationships.`;
    
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            processingStatus: { type: Type.STRING },
            elementCount: { type: Type.NUMBER },
            dataLossRisk: { type: Type.STRING },
            bimStandard: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

/**
 * AI Engineering Gateway: Public API Key Generation & Management.
 */
export const generateEngineeringAPIKey = async (firmName: string, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? `قم بتوليد مفتاح API عام لشركة ${firmName}. حدد نطاقات الوصول (Scopes) والحدود التقنية.`
      : `Generate a public API key for ${firmName}. Define access scopes and technical limits.`;
    
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            apiKey: { type: Type.STRING },
            scopes: { type: Type.ARRAY, items: { type: Type.STRING } },
            expiryDate: { type: Type.STRING },
            documentationUrl: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

/**
 * AI Engineering Gateway: Municipal Systems Linkage.
 */
export const linkMunicipalSystems = async (municipality: string, projectData: any, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? `قم بإنشاء بروتوكول ربط مع أنظمة بلدية ${municipality} لهذا المشروع. التفاصيل: ${JSON.stringify(projectData)}.`
      : `Create a linkage protocol with ${municipality} municipal systems for this project. Details: ${JSON.stringify(projectData)}.`;
    
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            linkStatus: { type: Type.STRING },
            requiredPermits: { type: Type.ARRAY, items: { type: Type.STRING } },
            submissionPortal: { type: Type.STRING },
            nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

/**
 * AI Engineering Gateway: Commercial Subscription & Pricing Model.
 */
export const generateCommercialModel = async (firmType: string, projectVolume: string, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? `قم بإنشاء نموذج اشتراك تجاري ونظام تسعير لشركة من نوع ${firmType} بحجم مشاريع ${projectVolume}. اقترح باقات (Pro, Enterprise) ونظام تسعير حسب المساحة.`
      : `Create a commercial subscription model and pricing system for a ${firmType} firm with project volume ${projectVolume}. Suggest tiers (Pro, Enterprise) and area-based pricing.`;
    
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subscriptionTiers: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  price: { type: Type.STRING },
                  features: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              } 
            },
            areaPricing: { type: Type.STRING },
            roiEstimate: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

/**
 * AI Engineering Gateway: Strategic Partnerships & Academic Linkage.
 */
export const manageEngineeringPartnerships = async (partnerType: string, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? `قم بإنشاء مقترح شراكة استراتيجية مع ${partnerType}. حدد مجالات التعاون البحثي والتبادل التقني.`
      : `Create a strategic partnership proposal with ${partnerType}. Define areas for research collaboration and technical exchange.`;
    
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            partnershipLevel: { type: Type.STRING },
            collaborationAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
            benefits: { type: Type.ARRAY, items: { type: Type.STRING } },
            nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

/**
 * AI Engineering Gateway: IP Protection & Algorithm Documentation.
 */
export const documentEngineeringIP = async (algorithmName: string, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? `قم بإنشاء وثيقة حماية ملكية فكرية لخوارزمية ${algorithmName}. حدد الابتكارات التقنية والأسس الرياضية المحمية.`
      : `Create an IP protection document for the ${algorithmName} algorithm. Define technical innovations and protected mathematical foundations.`;
    
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ipStatus: { type: Type.STRING },
            innovationPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            legalFramework: { type: Type.STRING },
            protectionLevel: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};

/**
 * AI Engineering Gateway: Investment Readiness & ROI Analysis.
 */
export const analyzeInvestmentReadiness = async (projectData: any, lang: Language) => {
  try {
    const prompt = lang === 'ar'
      ? `قم بتحليل الجاهزية الاستثمارية لهذا المشروع الهندسي. احسب العائد على الاستثمار (ROI) المتوقع بناءً على تحسينات الذكاء الاصطناعي.`
      : `Analyze the investment readiness of this engineering project. Calculate expected ROI based on AI optimizations.`;
    
    const response = await safeGenerateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            investmentScore: { type: Type.NUMBER },
            roiPercentage: { type: Type.STRING },
            marketPotential: { type: Type.STRING },
            investorAttractiveness: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) { return null; }
};
