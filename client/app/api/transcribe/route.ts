import { ai } from "../evaluate/route";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const base64Audio = body.audio;

		if (!base64Audio) {
			return Response.json(
				{ error: "No audio data provided" },
				{ status: 400 }
			);
		}

		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: [
				{
					inlineData: {
						mimeType: "audio/webm",
						data: base64Audio,
					},
				},
				"Transcribe this interview answer. Return only the transcribed text, nothing else.",
			],
		});

		const transcript = response.text || "";

		return Response.json({
			transcript,
		});
	} catch (error) {
		console.error("Transcription error:", error);
		return Response.json(
			{ error: "Transcription failed", transcript: "" },
			{ status: 500 }
		);
	}
}
