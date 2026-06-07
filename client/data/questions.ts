import { questionSchema } from "@/app/types";

export const questions: questionSchema[] = [
	{
		id: "Q001",
		topic: "AI Fundamentals",
		difficulty: "medium",
		importance: 10,
		question:
			"What is one limitation of large language models in production systems and how would you reduce its impact?",
		keywords: ["hallucination", "RAG", "validation", "grounding"],
		expectation: "Discuss hallucinations and practical mitigation methods.",
	},
	{
		id: "Q002",
		topic: "AI Fundamentals",
		difficulty: "medium",
		importance: 9,
		question:
			"Suppose an LLM gives incorrect answers despite having access to company documents. What could be going wrong?",
		keywords: ["retrieval", "chunking", "embedding", "context"],
		expectation:
			"Candidate should connect retrieval quality with answer quality.",
	},
	{
		id: "Q003",
		topic: "AI Fundamentals",
		difficulty: "medium",
		importance: 8,
		question:
			"How would you evaluate whether a RAG pipeline is actually improving answer quality?",
		keywords: ["evaluation", "precision", "recall", "ground truth"],
		expectation: "Discuss metrics, benchmarks, and user feedback.",
	},

	{
		id: "Q004",
		topic: "Machine Learning",
		difficulty: "easy",
		importance: 8,
		question:
			"A model performs well on training data but poorly on unseen data. What is happening and how would you address it?",
		keywords: ["overfitting", "regularization", "cross validation"],
		expectation: "Explain overfitting and prevention techniques.",
	},
	{
		id: "Q005",
		topic: "Machine Learning",
		difficulty: "medium",
		importance: 8,
		question: "Why might adding more features decrease model performance?",
		keywords: ["curse of dimensionality", "noise", "feature selection"],
		expectation: "Discuss irrelevant features and dimensionality challenges.",
	},
	{
		id: "Q006",
		topic: "Machine Learning",
		difficulty: "medium",
		importance: 7,
		question: "When would you choose a tree-based model over a neural network?",
		keywords: ["xgboost", "random forest", "tabular data"],
		expectation: "Compare strengths of both approaches.",
	},

	{
		id: "Q007",
		topic: "System Design",
		difficulty: "medium",
		importance: 9,
		question:
			"Design a service that receives interview audio and returns a transcript within a few seconds.",
		keywords: ["streaming", "websocket", "speech to text", "latency"],
		expectation: "Discuss architecture and performance considerations.",
	},
	{
		id: "Q008",
		topic: "System Design",
		difficulty: "medium",
		importance: 9,
		question:
			"What changes would you make if transcript requests suddenly increased from 100 users to 100,000 users?",
		keywords: ["scaling", "load balancing", "queue", "autoscaling"],
		expectation: "Focus on distributed systems concepts.",
	},
	{
		id: "Q009",
		topic: "System Design",
		difficulty: "hard",
		importance: 8,
		question:
			"Would you process interview recordings synchronously or asynchronously? Why?",
		keywords: ["queue", "worker", "background jobs", "latency"],
		expectation: "Discuss tradeoffs and architecture choices.",
	},

	{
		id: "Q010",
		topic: "Backend Development",
		difficulty: "easy",
		importance: 7,
		question: "What problem does JWT solve in web applications?",
		keywords: ["authentication", "token", "stateless"],
		expectation: "Explain authentication and stateless sessions.",
	},
	{
		id: "Q011",
		topic: "Backend Development",
		difficulty: "medium",
		importance: 8,
		question:
			"What security concerns should you consider when storing JWTs in a frontend application?",
		keywords: ["xss", "cookies", "local storage", "security"],
		expectation: "Discuss secure storage and attacks.",
	},
	{
		id: "Q012",
		topic: "Backend Development",
		difficulty: "medium",
		importance: 8,
		question:
			"How would you implement role-based access control for an HR management system?",
		keywords: ["rbac", "authorization", "permissions"],
		expectation: "Explain roles, permissions, and middleware.",
	},

	{
		id: "Q013",
		topic: "Data Structures and Algorithms",
		difficulty: "easy",
		importance: 7,
		question:
			"You need to check if a username already exists millions of times per day. Which data structure would you use and why?",
		keywords: ["hash table", "lookup", "complexity"],
		expectation: "Discuss O(1) lookups.",
	},
	{
		id: "Q014",
		topic: "Data Structures and Algorithms",
		difficulty: "medium",
		importance: 7,
		question:
			"When would a priority queue be a better choice than a standard queue?",
		keywords: ["heap", "priority queue", "scheduling"],
		expectation: "Identify suitable use cases.",
	},
	{
		id: "Q015",
		topic: "Data Structures and Algorithms",
		difficulty: "medium",
		importance: 8,
		question:
			"How would you find the top 10 most frequently asked interview questions from a dataset of one million records?",
		keywords: ["heap", "frequency map", "optimization"],
		expectation: "Discuss frequency counting and heaps.",
	},

	{
		id: "Q016",
		topic: "AI Applications",
		difficulty: "medium",
		importance: 9,
		question:
			"How would you build an AI interviewer that can ask relevant follow-up questions?",
		keywords: ["context", "memory", "conversation", "agent"],
		expectation: "Discuss conversation state and context retention.",
	},
	{
		id: "Q017",
		topic: "AI Applications",
		difficulty: "medium",
		importance: 9,
		question:
			"How would you prevent an AI interviewer from repeatedly asking similar questions?",
		keywords: ["memory", "tracking", "question bank"],
		expectation: "Explain state management and filtering.",
	},
	{
		id: "Q018",
		topic: "AI Applications",
		difficulty: "hard",
		importance: 10,
		question:
			"How would you score candidate responses automatically while minimizing AI bias?",
		keywords: ["evaluation", "bias", "rubric", "fairness"],
		expectation: "Discuss structured rubrics and calibration.",
	},

	{
		id: "Q019",
		topic: "Database Design",
		difficulty: "easy",
		importance: 7,
		question:
			"What factors would make you choose SQL over NoSQL for an employee management platform?",
		keywords: ["postgresql", "transactions", "relations"],
		expectation: "Compare database models.",
	},
	{
		id: "Q020",
		topic: "Database Design",
		difficulty: "medium",
		importance: 8,
		question:
			"A query that previously took 50ms now takes 5 seconds. What would you investigate first?",
		keywords: ["index", "query plan", "optimization"],
		expectation: "Identify performance bottlenecks.",
	},
	{
		id: "Q021",
		topic: "Database Design",
		difficulty: "medium",
		importance: 8,
		question:
			"How would you store interview transcripts so they remain searchable at scale?",
		keywords: ["full text search", "vector database", "indexing"],
		expectation: "Discuss search architecture.",
	},

	{
		id: "Q022",
		topic: "Software Engineering",
		difficulty: "medium",
		importance: 8,
		question:
			"Describe a feature you would refactor after it reaches production and starts receiving heavy traffic.",
		keywords: ["refactoring", "performance", "maintainability"],
		expectation: "Evaluate engineering judgment.",
	},
	{
		id: "Q023",
		topic: "Software Engineering",
		difficulty: "medium",
		importance: 9,
		question:
			"How would you debug a bug that only appears in production and cannot be reproduced locally?",
		keywords: ["logging", "monitoring", "observability"],
		expectation: "Discuss systematic debugging.",
	},
	{
		id: "Q024",
		topic: "Software Engineering",
		difficulty: "hard",
		importance: 9,
		question:
			"What metrics would you track for an AI interview platform after deployment?",
		keywords: ["latency", "accuracy", "retention", "errors"],
		expectation: "Discuss technical and business metrics.",
	},
	{
		id: "Q025",
		topic: "Software Engineering",
		difficulty: "hard",
		importance: 10,
		question:
			"Imagine your AI interviewer starts giving inconsistent scores to equally skilled candidates. How would you investigate and fix the issue?",
		keywords: ["evaluation", "consistency", "bias", "testing"],
		expectation: "Discuss root cause analysis, calibration, and validation.",
	},
	{
		id: "Q026",
		topic: "LLM Engineering",
		difficulty: "medium",
		importance: 9,
		question:
			"Why might increasing the context window not always improve answer quality?",
		keywords: ["context window", "attention", "noise", "relevance"],
		expectation:
			"Explain context dilution, irrelevant information, and attention limitations.",
	},
	{
		id: "Q027",
		topic: "LLM Engineering",
		difficulty: "medium",
		importance: 8,
		question: "When would you choose RAG instead of fine-tuning an LLM?",
		keywords: ["rag", "fine tuning", "knowledge updates", "cost"],
		expectation:
			"Compare dynamic knowledge retrieval against model retraining.",
	},
	{
		id: "Q028",
		topic: "LLM Engineering",
		difficulty: "hard",
		importance: 10,
		question:
			"A RAG system retrieves relevant documents but still produces poor answers. What are three possible causes?",
		keywords: ["retrieval", "prompting", "chunking", "context"],
		expectation:
			"Investigate retrieval quality, chunk size, prompt design, and ranking.",
	},
	{
		id: "Q029",
		topic: "LLM Engineering",
		difficulty: "hard",
		importance: 9,
		question:
			"How would you measure hallucination rates in a production chatbot?",
		keywords: ["evaluation", "hallucination", "benchmarking", "ground truth"],
		expectation: "Discuss testing datasets and evaluation strategies.",
	},
	{
		id: "Q030",
		topic: "LLM Engineering",
		difficulty: "medium",
		importance: 8,
		question: "Why are embeddings useful in semantic search systems?",
		keywords: ["embeddings", "vector search", "similarity", "retrieval"],
		expectation: "Explain semantic representations and similarity matching.",
	},

	{
		id: "Q031",
		topic: "Prompt Engineering",
		difficulty: "easy",
		importance: 7,
		question:
			"Why does prompt wording significantly affect LLM output quality?",
		keywords: ["prompting", "instructions", "context", "reasoning"],
		expectation: "Discuss instruction following and context interpretation.",
	},
	{
		id: "Q032",
		topic: "Prompt Engineering",
		difficulty: "medium",
		importance: 8,
		question:
			"How would you design prompts to ensure answers follow a strict JSON format?",
		keywords: ["json", "structured output", "validation", "schema"],
		expectation: "Explain formatting constraints and output validation.",
	},
	{
		id: "Q033",
		topic: "Prompt Engineering",
		difficulty: "medium",
		importance: 8,
		question:
			"What are the risks of giving an LLM excessive instructions in a single prompt?",
		keywords: ["prompt complexity", "instruction conflict", "token usage"],
		expectation: "Discuss ambiguity, conflicts, and reduced reliability.",
	},
	{
		id: "Q034",
		topic: "Prompt Engineering",
		difficulty: "hard",
		importance: 9,
		question:
			"How would you test whether a prompt improvement actually improved performance?",
		keywords: ["evaluation", "ab testing", "benchmark", "metrics"],
		expectation: "Explain controlled testing approaches.",
	},
	{
		id: "Q035",
		topic: "Prompt Engineering",
		difficulty: "medium",
		importance: 8,
		question:
			"What techniques would you use to reduce prompt injection attacks?",
		keywords: ["security", "prompt injection", "validation", "guardrails"],
		expectation: "Discuss filtering, system prompts, and tool restrictions.",
	},

	{
		id: "Q036",
		topic: "AI System Design",
		difficulty: "medium",
		importance: 9,
		question:
			"Design an AI interview platform that supports both voice and text interviews.",
		keywords: ["architecture", "voice", "chat", "scalability"],
		expectation: "Discuss services, APIs, storage, and processing.",
	},
	{
		id: "Q037",
		topic: "AI System Design",
		difficulty: "hard",
		importance: 10,
		question:
			"How would you design a follow-up question engine that adapts to candidate responses?",
		keywords: ["conversation state", "memory", "agent", "reasoning"],
		expectation: "Explain contextual question generation.",
	},
	{
		id: "Q038",
		topic: "AI System Design",
		difficulty: "hard",
		importance: 9,
		question: "How would you reduce latency in a voice-based AI interviewer?",
		keywords: ["streaming", "stt", "tts", "latency"],
		expectation: "Discuss parallel processing and streaming architectures.",
	},
	{
		id: "Q039",
		topic: "AI System Design",
		difficulty: "medium",
		importance: 8,
		question:
			"How would you store conversation history while keeping costs under control?",
		keywords: ["storage", "compression", "summarization", "memory"],
		expectation: "Discuss summarization and retention strategies.",
	},
	{
		id: "Q040",
		topic: "AI System Design",
		difficulty: "hard",
		importance: 10,
		question:
			"How would you architect a multi-tenant AI platform where each company has its own private knowledge base?",
		keywords: ["multi tenancy", "security", "rag", "isolation"],
		expectation: "Discuss tenant isolation and secure retrieval.",
	},

	{
		id: "Q041",
		topic: "MLOps",
		difficulty: "medium",
		importance: 8,
		question: "What is model drift and how would you detect it in production?",
		keywords: ["drift", "monitoring", "distribution", "production"],
		expectation: "Explain performance degradation and monitoring.",
	},
	{
		id: "Q042",
		topic: "MLOps",
		difficulty: "medium",
		importance: 8,
		question: "Why should machine learning models be versioned?",
		keywords: ["versioning", "reproducibility", "deployment"],
		expectation: "Discuss rollback and experiment tracking.",
	},
	{
		id: "Q043",
		topic: "MLOps",
		difficulty: "hard",
		importance: 9,
		question:
			"How would you safely deploy a new model without affecting all users immediately?",
		keywords: ["canary deployment", "ab testing", "rollout"],
		expectation: "Discuss deployment strategies and risk mitigation.",
	},

	{
		id: "Q044",
		topic: "Backend Scalability",
		difficulty: "medium",
		importance: 8,
		question: "Why would you introduce Redis into a backend architecture?",
		keywords: ["cache", "redis", "latency", "performance"],
		expectation: "Explain caching use cases and tradeoffs.",
	},
	{
		id: "Q045",
		topic: "Backend Scalability",
		difficulty: "medium",
		importance: 9,
		question: "How would you handle 10,000 simultaneous websocket connections?",
		keywords: ["websocket", "scaling", "load balancing", "realtime"],
		expectation: "Discuss infrastructure and resource management.",
	},
	{
		id: "Q046",
		topic: "Backend Scalability",
		difficulty: "hard",
		importance: 9,
		question:
			"What happens if multiple servers update the same record at the same time?",
		keywords: ["race condition", "locking", "consistency"],
		expectation: "Explain concurrency challenges.",
	},

	{
		id: "Q047",
		topic: "Distributed Systems",
		difficulty: "medium",
		importance: 8,
		question: "Why are message queues useful in large-scale systems?",
		keywords: ["queue", "rabbitmq", "kafka", "asynchronous"],
		expectation: "Discuss decoupling and scalability.",
	},
	{
		id: "Q048",
		topic: "Distributed Systems",
		difficulty: "hard",
		importance: 9,
		question:
			"What tradeoffs exist between consistency and availability in distributed systems?",
		keywords: ["cap theorem", "consistency", "availability"],
		expectation: "Explain CAP theorem concepts.",
	},
	{
		id: "Q049",
		topic: "Distributed Systems",
		difficulty: "hard",
		importance: 8,
		question:
			"How would you ensure a task is processed exactly once in a distributed system?",
		keywords: ["idempotency", "deduplication", "reliability"],
		expectation: "Discuss practical implementation techniques.",
	},

	{
		id: "Q050",
		topic: "Software Engineering",
		difficulty: "hard",
		importance: 10,
		question:
			"An AI interviewer receives poor user feedback despite technically correct answers. What metrics and investigations would you perform?",
		keywords: ["ux", "feedback", "evaluation", "analytics"],
		expectation: "Assess both technical and user experience dimensions.",
	},
];
