export interface Leave {
	id: string;
	employee_id: string;
	employee_name: string;
	approved_by: string | null;
	leave_type: string;
	status: "PENDING" | "APPROVED" | "REJECTED";
	start_date: string;
	end_date: string;
	reason: string;
}

export const leaveTypes = [
	{ value: "SICK", label: "Sick Leave" },
	{ value: "CASUAL", label: "Casual Leave" },
	{ value: "ANNUAL", label: "Annual Leave" },
	{ value: "UNPAID", label: "Unpaid Leave" },
];

export interface questionSchema {
	id: string;
	topic: string;
	difficulty: string;
	importance: number;
	question: string;
	keywords: string[];
	expectation: string;
}

export interface interviewResults {
	interviewId: string;
	startedAt: string;
	completedAt: string;
	answers: answers[];
}
export interface answers {
	questionId: string;
	question: string;
	transcript: string;
	duration: number;
}

export interface SpeechRecognitionEvent extends Event {
	results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
	[index: number]: SpeechRecognitionResult;
	length: number;
}

interface SpeechRecognitionResult {
	[index: number]: SpeechRecognitionAlternative;
	isFinal: boolean;
	length: number;
}

interface SpeechRecognitionAlternative {
	transcript: string;
	confidence: number;
}

export interface SpeechRecognitionErrorEvent extends Event {
	error: string;
}

export interface SpeechRecognition extends EventTarget {
	continuous: boolean;
	interimResults: boolean;
	lang: string;
	onresult: (event: SpeechRecognitionEvent) => void;
	onerror: (event: SpeechRecognitionErrorEvent) => void;
	start(): void;
	stop(): void;
	abort(): void;
}

export interface SpeechRecognitionConstructor {
	new (): SpeechRecognition;
}