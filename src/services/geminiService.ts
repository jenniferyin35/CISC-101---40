import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface CampaignResult {
  status: "success" | "clarification_needed";
  clarification_question?: string;
  campaign?: {
    subjectLines: string[];
    previewText: string;
    emailBody: string;
    callToAction: string;
    supportingVisuals: string[];
  };
}

export async function generateCampaign(
  campaignType: string,
  targetAudience: string,
  tone: string,
  productInfo: string
): Promise<CampaignResult> {
  const prompt = `
    You are an AI Email Marketing Campaign Generator.
    Your task is to create a complete email campaign based on the following user input:
    - Campaign Type: ${campaignType}
    - Target Audience: ${targetAudience}
    - Tone: ${tone}
    - Product or Service Information: ${productInfo}

    RULES:
    1. If the input is vague, incomplete, or instructions conflict, set status to "clarification_needed" and provide a "clarification_question".
    2. If the input is sufficient, set status to "success" and generate the campaign.
    3. The campaign MUST have exactly these five sections in this order:
       - Subject Lines (attention-grabbing and varied)
       - Preview Text (supports subject line)
       - Email Body (introduction -> value -> explanation -> closing)
       - Call to Action (clear next step)
       - Supporting Visuals (reinforce message)
    4. Do NOT invent customer names, specific metrics, purchase history, or company data.
    5. Ensure outputs are realistic and appropriate.
    6. Keep the response concise and readable.

    FEW-SHOT EXAMPLE:
    Input: "Promote a 20% off sale for a clothing brand targeting university students"
    Output: {
      "status": "success",
      "campaign": {
        "subjectLines": ["20% Off Everything — This Week Only", "Student Deals You Don’t Want to Miss", "Your Wardrobe Upgrade Starts Now"],
        "previewText": "Save on your favorite styles before the sale ends.",
        "emailBody": "Hi there,\n\nLooking to refresh your wardrobe without breaking the bank? For a limited time, enjoy 20% off all items. Whether you're heading to class or going out with friends, we’ve got styles that fit every moment. Don’t wait — this offer ends soon.",
        "callToAction": "Shop Now",
        "supportingVisuals": ["Image of students wearing casual outfits", "Sale banner with '20% Off'"]
      }
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: {
              type: Type.STRING,
              description: "Whether the campaign was successfully generated or if clarification is needed.",
              enum: ["success", "clarification_needed"],
            },
            clarification_question: {
              type: Type.STRING,
              description: "The question to ask the user if more information is needed.",
            },
            campaign: {
              type: Type.OBJECT,
              properties: {
                subjectLines: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "A list of subject lines.",
                },
                previewText: {
                  type: Type.STRING,
                  description: "The preview text for the email.",
                },
                emailBody: {
                  type: Type.STRING,
                  description: "The main body of the email.",
                },
                callToAction: {
                  type: Type.STRING,
                  description: "The call to action text.",
                },
                supportingVisuals: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Suggestions for supporting visuals.",
                },
              },
              required: ["subjectLines", "previewText", "emailBody", "callToAction", "supportingVisuals"],
            },
          },
          required: ["status"],
        },
      },
    });

    return JSON.parse(response.text || "{}") as CampaignResult;
  } catch (error) {
    console.error("Error generating campaign:", error);
    throw error;
  }
}
