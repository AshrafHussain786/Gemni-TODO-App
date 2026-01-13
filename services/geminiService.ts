
import { GoogleGenAI, Type } from "@google/genai";
import { Category, Priority, AIAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeTodo = async (todoText: string): Promise<AIAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following task and categorize it into exactly one of these categories: Work, Personal, Shopping, Health, or Other. Also assign a priority (Low, Medium, or High). Task: "${todoText}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              enum: Object.values(Category),
              description: "The most relevant category for the task."
            },
            priority: {
              type: Type.STRING,
              enum: Object.values(Priority),
              description: "The perceived priority of the task."
            }
          },
          required: ["category", "priority"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    
    // Cast and validate to ensure they match our enum values exactly
    const category = Object.values(Category).includes(result.category as Category) 
      ? (result.category as Category) 
      : Category.OTHER;
      
    const priority = Object.values(Priority).includes(result.priority as Priority)
      ? (result.priority as Priority)
      : Priority.MEDIUM;

    return { category, priority };
  } catch (error) {
    console.error("Gemini AI Analysis failed:", error);
    return {
      category: Category.OTHER,
      priority: Priority.MEDIUM
    };
  }
};
