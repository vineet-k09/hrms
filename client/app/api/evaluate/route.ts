import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
	const body = await req.json();

	const prompt = `
You are a senior interviewer.

Evaluate:

${JSON.stringify(body.responses)}

Return JSON:
{
  "overall_score":0,
  "technical_score":0,
  "communication_score":0,
  "strengths":[],
  "weaknesses":[],
  "recommendation":""
}
`;

	const response = await ai.models.generateContent({
		model: "gemini-2.5-flash",
		contents: prompt,
	});

	return Response.json({
		result: response.text,
	});
}
