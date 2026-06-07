'use client';
// export default function Interview() {
// 	return <></>
// }
import { questions as qs } from "@/data/questions";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import {
	answers,
	questionSchema,
	SpeechRecognitionConstructor,
	SpeechRecognition,
	SpeechRecognitionEvent,
	SpeechRecognitionErrorEvent,
} from "@/app/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

declare global {
	interface Window {
		SpeechRecognition: SpeechRecognitionConstructor;
		webkitSpeechRecognition: SpeechRecognitionConstructor;
	}
}

export default function Interview() {
	const questions = useMemo(() => generateInterview(qs), []);
	console.log("qs", qs);
	console.log("generated questions", questions);

	const [currentIndex, setCurrentIndex] = useState(0);
	const [answers, setAnswers] = useState<answers[]>([]);
	const [isListening, setIsListening] = useState(false);
	const [interimTranscript, setInterimTranscript] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [interviewComplete, setInterviewComplete] = useState(false);

	const answersRef = useRef<answers[]>([]);
	const startedAtRef = useRef(new Date());
	const recognitionRef = useRef<SpeechRecognition | null>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const questionStartTimeRef = useRef<number>(0);
	const streamRef = useRef<MediaStream | null>(null);

	const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
		audio: true,
	});

	// Initialize speech recognition
	useEffect(() => {
		const setupInterview = async () => {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: true,
				});

				streamRef.current = stream;

				if (videoRef.current) {
					videoRef.current.srcObject = stream;
				}

				// Setup speech recognition
				const SpeechRecognition =
					window.SpeechRecognition || window.webkitSpeechRecognition;
				if (SpeechRecognition) {
					const recognition = new SpeechRecognition();
					recognition.continuous = true;
					recognition.interimResults = true;
					recognition.lang = "en-US";

					recognition.onstart = () => {
						setIsListening(true);
						questionStartTimeRef.current = Date.now();
						startRecording();
					};

					recognition.onresult = (event: SpeechRecognitionEvent) => {
						let interim = "";
						for (let i = event.results.length - 1; i >= 0; i--) {
							const transcript = event.results[i][0].transcript;
							if (event.results[i].isFinal) {
								// Final result received
							} else {
								interim += transcript;
							}
						}
						setInterimTranscript(interim);
					};

					recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
						console.error("Speech recognition error:", event.error);
						setIsListening(false);
					};

					recognition.onend = () => {
						setIsListening(false);
					};

					recognitionRef.current = recognition;
				}
			} catch (err) {
				console.error("Failed to setup interview:", err);
			}
		};

		setupInterview();

		return () => {
			streamRef.current?.getTracks().forEach((track) => track.stop());
			recognitionRef.current?.abort();
		};
	}, [startRecording]);

	// Auto-start first question
	useEffect(() => {
		if (questions.length > 0 && currentIndex === 0 && answers.length === 0) {
			setTimeout(() => askQuestion(), 500);
		}
	}, [questions]);

	// Handle media blob when recording stops
	useEffect(() => {
		if (mediaBlobUrl && !isListening) {
			transcribeAudio(mediaBlobUrl);
		}
	}, [mediaBlobUrl, isListening]);

	function generateInterview(allQuestions: questionSchema[]) {
		const elig = allQuestions.filter((q) => q.importance >= 5);

		if (elig.length === 0) {
			console.warn("No eligible questions found");
			return [];
		}

		const count = Math.min(elig.length, Math.floor(Math.random() * 6) + 5);

		return [...elig]
			.sort(() => Math.random() - 0.5)
			.slice(0, count);
	}

	async function transcribeAudio(blobUrl: string) {
		try {
			const blob = await fetch(blobUrl).then((res) => res.blob());
			const base64Audio = await blobToBase64(blob);
			const response = await fetch("/api/transcribe", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					audio: base64Audio,
				}),
			});

			if (!response.ok) throw new Error("Transcription failed");

			const data = await response.json();
			const transcript = data.transcript || "";

			saveAnswer(transcript);
			proceedToNextQuestion();
		} catch (error) {
			console.error("Transcription error:", error);
			proceedToNextQuestion();
		}
	}

	function blobToBase64(blob: Blob): Promise<string> {
		return new Promise((resolve) => {
			const reader = new FileReader();
			reader.onloadend = () => {
				const base64String = reader.result as string;
				resolve(base64String.split(",")[1]);
			};
			reader.readAsDataURL(blob);
		});
	}

	function askQuestion() {
		if (currentIndex >= questions.length) {
			completeInterview();
			return;
		}

		const question = questions[currentIndex];
		console.log("Asking question:", question.question);

		startListening();
	}

	function startListening() {
		if (!recognitionRef.current) return;

		setInterimTranscript("");
		recognitionRef.current.start();

		// Auto-stop listening after 30 seconds
		setTimeout(() => {
			stopListening();
		}, 30000);
	}

	function stopListening() {
		if (!recognitionRef.current) return;

		recognitionRef.current.stop();
		stopRecording();
		setIsListening(false);
	}

	function saveAnswer(transcript: string) {
		const question = questions[currentIndex];
		const duration = (Date.now() - questionStartTimeRef.current) / 1000;

		const answer: answers = {
			questionId: question.id,
			question: question.question,
			transcript,
			duration,
		};

		answersRef.current.push(answer);
		setAnswers([...answersRef.current]);
	}

	function proceedToNextQuestion() {
		// Async speech-to-text is already running, so move to next question immediately
		const nextIndex = currentIndex + 1;

		if (nextIndex >= questions.length) {
			completeInterview();
		} else {
			setCurrentIndex(nextIndex);
			setTimeout(() => askQuestion(), 1000);
		}
	}

	async function completeInterview() {
		setInterviewComplete(true);
	}

	async function submitInterview() {
		setIsSubmitting(true);
		try {
			// First evaluate the responses using Next.js API
			const evaluateResponse = await fetch("/api/evaluate", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					responses: answersRef.current,
				}),
			});

			if (!evaluateResponse.ok) throw new Error("Evaluation failed");

			const evaluationData = await evaluateResponse.json();
			const evaluation = JSON.parse(evaluationData.result);

			// Then submit to FastAPI backend
			const submitResponse = await fetch(`${API_URL}/interview/submit`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					interviewId: crypto.randomUUID(),
					startedAt: startedAtRef.current,
					completedAt: new Date(),
					answers: answersRef.current,
					evaluation,
				}),
			});

			if (!submitResponse.ok) throw new Error("Submit failed");

			console.log("Interview submitted successfully");
			alert("Interview completed! Results submitted.");
		} catch (error) {
			console.error("Submit failed:", error);
			alert("Failed to submit interview. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	}

	if (interviewComplete) {
		return (
			<div className="p-8 max-w-2xl mx-auto">
				<div className="bg-green-100 border border-green-400 rounded-lg p-6">
					<h2 className="text-2xl font-bold mb-4">Interview Complete!</h2>
					<p className="mb-4">
						You have answered {answers.length} questions.
					</p>
					<div className="space-y-2 mb-6">
						{answers.map((answer, idx) => (
							<div key={idx} className="bg-white p-3 rounded">
								<p className="font-semibold text-sm">
									Q{idx + 1}: {answer.question}
								</p>
								<p className="text-gray-600 text-sm mt-1">
									{answer.transcript.substring(0, 100)}...
								</p>
							</div>
						))}
					</div>
					<button
						onClick={submitInterview}
						disabled={isSubmitting}
						className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded"
					>
						{isSubmitting ? "Submitting..." : "Submit Results"}
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="p-8 max-w-2xl mx-auto suppressHydrationWarning">
			<div className="bg-white rounded-lg shadow-lg p-6">
				<div className="mb-4">
					<h2 className="text-2xl font-bold">
						Question {Math.min(currentIndex + 1, questions.length)} /{" "}
						{questions.length}
					</h2>
					<div className="w-full bg-gray-200 rounded-full h-2 mt-2">
						<div
							className="bg-blue-500 h-2 rounded-full"
							style={{
								width: `${(currentIndex / questions.length) * 100}%`,
							}}
						></div>
					</div>
				</div>

				<p className="text-lg mb-6 font-semibold">
					{questions[currentIndex]?.question}
				</p>

				<div className="mb-6">
					{isListening ? (
						<div className="bg-red-100 border-2 border-red-500 rounded-lg p-4">
							<div className="flex items-center gap-2 mb-2">
								<div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
								<span className="font-semibold">Listening...</span>
							</div>
							<p className="text-gray-700 italic">
								{interimTranscript || "Waiting for your response..."}
							</p>
						</div>
					) : (
						<button
							onClick={startListening}
							className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
						>
							Start Speaking
						</button>
					)}
				</div>

				{isListening && (
					<button
						onClick={stopListening}
						className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold"
					>
						Stop Speaking
					</button>
				)}

				<div className="mt-6">
					<h3 className="font-semibold mb-2">Answers Recorded: {answers.length}</h3>
					<div className="space-y-2">
						{answers.map((answer, idx) => (
							<div
								key={idx}
								className="bg-gray-100 p-2 rounded text-sm text-gray-700"
							>
								Q{idx + 1}: {answer.transcript.substring(0, 50)}...
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
