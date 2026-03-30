import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface CampaignState {
  campaignType: string;
  targetAudience: string;
  tone: string;
  productInfo: string;
}

export interface CampaignResponse {
  status: "success" | "clarification_needed";
  updatedState: CampaignState;
  message: string; // The question to ask or the success message
  campaign?: {
    subjectLines: string[];
    previewText: string;
    emailBody: string;
    callToAction: string;
    supportingVisuals: string[];
  };
}

export async function processCampaignInput(
  userInput: string,
  currentState: CampaignState
): Promise<CampaignResponse> {
  const prompt = `
    You are an AI Email Marketing Campaign Builder. 
    Your goal is to collect exactly 4 pieces of information from the user before generating a campaign:
    1. campaign type
    2. target audience
    3. tone
    4. product or service

    INTERACTION FLOW:
    - Start with: "Hello! I am your Campaign Buddy. What would you like help with today?"
    - Ask for required details ONE AT A TIME.
    - Do NOT proceed until all information is collected.
    - Do NOT make assumptions.

    CURRENT STATE:
    - campaign type: ${currentState.campaignType || "Missing"}
    - target audience: ${currentState.targetAudience || "Missing"}
    - tone: ${currentState.tone || "Missing"}
    - product or service: ${currentState.productInfo || "Missing"}

    USER INPUT: "${userInput}"

    TASK:
    1. Parse the USER INPUT to update the CURRENT STATE.
    2. If any of the 4 fields are still missing or vague, set status to "clarification_needed".
    3. In "message", ask for the NEXT missing piece of information. Ask for details ONE AT A TIME.
    4. ONLY if ALL 4 fields are present and clear, set status to "success" and generate the campaign.

    STRICT GENERATION RULES (Only for "success" status):
    - Subject Lines: exactly 3 varied, attention-grabbing options.
    - Preview Text: exactly 1 complete sentence that supports the subject lines.
    - Email Body: 3–5 sentences minimum. Structure: Intro -> Value -> Explanation -> Closing.
    - Call to Action: exactly 1 clear action phrase.
    - Supporting Visuals: exactly 2 ideas that reinforce the message.
    - No section can be empty, blank, or contain placeholders.
    - Do NOT invent customer names, metrics, or false claims. Keep content realistic.
    - CRITICAL: If any section is missing or too short, you MUST regenerate it internally before outputting the final JSON.

    REQUIRED OUTPUT STRUCTURE (STRICT ORDER):
    1. Subject Lines
    2. Preview Text
    3. Email Body
    4. Call to Action
    5. Supporting Visuals

    FEW-SHOT EXAMPLE (Clarification):
    User: "I want to promote a sale."
    Output: {
      "status": "clarification_needed",
      "updatedState": { "campaignType": "Sale Promotion", "targetAudience": "", "tone": "", "productInfo": "" },
      "message": "Hello! I am your Campaign Buddy. What would you like help with today? (Wait, I see you want a sale promotion). Great! Who is the target audience for this sale?"
    }

    FEW-SHOT EXAMPLE (Success):
    User: "It's for university students, 20% off clothing, playful tone."
    (Assuming other fields were already partially known or provided here)
    Output: {
      "status": "success",
      "updatedState": { ... },
      "message": "Excellent! Here is your complete email campaign:",
      "campaign": { ... }
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
            status: { type: Type.STRING, enum: ["success", "clarification_needed"] },
            updatedState: {
              type: Type.OBJECT,
              properties: {
                campaignType: { type: Type.STRING },
                targetAudience: { type: Type.STRING },
                tone: { type: Type.STRING },
                productInfo: { type: Type.STRING },
              },
              required: ["campaignType", "targetAudience", "tone", "productInfo"],
            },
            message: { type: Type.STRING },
            campaign: {
              type: Type.OBJECT,
              properties: {
                subjectLines: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "Exactly 3 subject lines."
                },
                previewText: { 
                  type: Type.STRING,
                  description: "Exactly 1 complete sentence."
                },
                emailBody: { 
                  type: Type.STRING,
                  description: "3-5 sentences minimum."
                },
                callToAction: { 
                  type: Type.STRING,
                  description: "1 clear action phrase."
                },
                supportingVisuals: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "Exactly 2 visual ideas."
                },
              },
              required: ["subjectLines", "previewText", "emailBody", "callToAction", "supportingVisuals"],
            },
          },
          required: ["status", "updatedState", "message"],
        },
      },
    });

    return JSON.parse(response.text || "{}") as CampaignResponse;
  } catch (error) {
    console.error("Error processing campaign input:", error);
    throw error;
  }
}
