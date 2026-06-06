'use client';

import { questions as qs } from "@/data/questions";
import { useEffect, useMemo, useRef, useState } from "react";
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

	const answersRef = useRef<answers[]>([]);
	const startedAtRef = useRef(new Date());
	const recognitionRef = useRef<SpeechRecognition | null>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	const isListeningRef = useRef(false);

	// --------------------------
	// Speech Recognition Setup
	// --------------------------
	useEffect(() => {
		if (typeof window === "undefined") return;

		const SpeechRecognitionConstructor =
			window.SpeechRecognition || window.webkitSpeechRecognition;

		if (!SpeechRecognitionConstructor) {
			console.error("Speech Recognition not supported");
			return;
		}

		const recognition = new SpeechRecognitionConstructor();

		recognition.continuous = false;
		recognition.interimResults = false;
		recognition.lang = "en-US";

		recognition.onresult = (event: SpeechRecognitionEvent) => {
			const transcript = event.results[0][0].transcript;
			isListeningRef.current = false;
			saveAnswer(transcript);
		};

		recognition.onerror = (err: SpeechRecognitionErrorEvent) => {
			console.error("Recognition Error:", err.error);
			isListeningRef.current = false;
		};

		recognitionRef.current = recognition;

		const timer = setTimeout(() => {
			console.log(questions)
			if (questions.length) {
				askQuestion(questions[0].question);
			}
		}, 1000);

		return () => {
			clearTimeout(timer);
			recognition.stop();
		};
	}, [questions]);

	// --------------------------
	// Camera Setup
	// --------------------------
	useEffect(() => {
		let stream: MediaStream | null = null;

		const startCamera = async () => {
			try {
				stream = await navigator.mediaDevices.getUserMedia({
					video: true,
					audio: true,
				});

				if (videoRef.current) {
					videoRef.current.srcObject = stream;
				}
			} catch (err) {
				console.error(err);
			}
		};

		startCamera();

		return () => {
			stream?.getTracks().forEach((track) => track.stop());
		};
	}, []);

	// --------------------------
	// Helpers
	// --------------------------
	
	function generateInterview(allQuestions: questionSchema[]) {
		const elig  = allQuestions.filter((q) => q.importance >= 5);

		if (elig.length === 0) {
			console.warn("No eligible questions found");
			return [];
		}

		const count = Math.min(elig.length, Math.floor(Math.random()*6) + 5)

		return [...elig]
			.sort(() => Math.random() - 0.5)
			.slice(0, count);
	}

	function askQuestion(question: string) {
		if (!window.speechSynthesis) {
			console.error("Speech Synthesis not supported");
			startListening();
			return;
		}

		window.speechSynthesis.cancel();

		const utterance = new SpeechSynthesisUtterance(question);

		utterance.rate = 1;
		utterance.pitch = 1;

		utterance.onend = () => {
			startListening();
		};

		utterance.onerror = () => {
			console.error("Speech synthesis error");
			startListening();
		};

		window.speechSynthesis.speak(utterance);
	}

	function startListening() {
		if (!recognitionRef.current || isListeningRef.current) return;
		isListeningRef.current = true;
		recognitionRef.current.start();
	}

	function saveAnswer(transcript: string) {
		const question = questions[currentIndex];

		if (!question) return;

		const answer = {
			questionId: question.id,
			question: question.question,
			transcript,
			duration: 0,
		};

		const updatedAnswers = [...answersRef.current, answer];

		answersRef.current = updatedAnswers;
		setAnswers(updatedAnswers);

		nextQuestion(updatedAnswers);
	}

	function nextQuestion(latestAnswers: answers[]) {
		const nextIndex = currentIndex + 1;

		if (nextIndex >= questions.length) {
			submitInterview(latestAnswers);
			return;
		}

		setCurrentIndex(nextIndex);

		setTimeout(() => {
			askQuestion(questions[nextIndex].question);
		}, 1000);
	}

	async function submitInterview(finalAnswers: answers[]) {
		try {
			await fetch(`${API_URL}/interview/submit`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					interviewId: crypto.randomUUID(),
					startedAt: startedAtRef.current,
					completedAt: new Date(),
					answers: finalAnswers,
				}),
			});

			console.log("Interview submitted");
		} catch (error) {
			console.error("Submit failed:", error);
		}
	}

	// --------------------------
	// Cleanup
	// --------------------------
	useEffect(() => {
		return () => {
			window.speechSynthesis?.cancel();
			recognitionRef.current?.stop();
		};
	}, []);

	return (
		<div suppressHydrationWarning>
			{/* <video ref={videoRef} autoPlay muted playsInline className="rounded-lg" /> */}

			<h2>
				Question {Math.min(currentIndex + 1, questions.length)} /{" "}
				{questions.length}
			</h2>

			<p>{questions[currentIndex]?.question}</p>

			<div>
				<h3>Answers Recorded: {answers.length}</h3>
			</div>
		</div>
	);
}
