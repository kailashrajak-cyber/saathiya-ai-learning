// Original beginner-friendly practice content for the AI Fundamentals course.

export type ConceptQ = { q: string; explanation: string };
export type McqQ = { q: string; options: string[]; answer: number; explanation: string };
export type PromptTask = { task: string; tips: string[] };
export type Scenario = { situation: string; question: string; explanation: string };

export const CONCEPTS: ConceptQ[] = [
  {
    q: "In your own words, what is Artificial Intelligence (AI)?",
    explanation:
      "AI is the field of building computer systems that can do tasks that usually need human intelligence — like understanding language, recognising images or making decisions.",
  },
  {
    q: "How is Machine Learning (ML) different from normal programming?",
    explanation:
      "In normal programming, a person writes exact rules. In machine learning, the computer learns patterns from examples (data) and builds its own rules.",
  },
  {
    q: "What does Deep Learning use to learn patterns?",
    explanation:
      "Deep learning uses neural networks with many layers. Each layer learns slightly more complex features — for example edges, then shapes, then whole faces in an image.",
  },
  {
    q: "What makes Generative AI different from other AI?",
    explanation:
      "Generative AI creates new content — text, images, audio or code — based on patterns it learned, instead of only classifying or predicting.",
  },
  {
    q: "Why is training data important for an AI model?",
    explanation:
      "A model learns only from its data. If the data is poor, incomplete or biased, the model's answers will also be poor or biased.",
  },
];

export const MCQS: McqQ[] = [
  {
    q: "Which of these is an example of AI in daily life?",
    options: ["A calculator adding numbers", "UPI app detecting a suspicious payment", "A light switch", "A paper notebook"],
    answer: 1,
    explanation: "Fraud detection learns patterns of normal and unusual payments — that is AI. A calculator just follows fixed rules.",
  },
  {
    q: "Machine learning is best described as…",
    options: ["Computers learning patterns from data", "Robots with feelings", "Writing every rule by hand", "Storing files in the cloud"],
    answer: 0,
    explanation: "ML systems improve at a task by learning from examples rather than from hand-written rules.",
  },
  {
    q: "Deep learning is a type of…",
    options: ["Database", "Machine learning", "Web browser", "Spreadsheet formula"],
    answer: 1,
    explanation: "Deep learning is a subset of machine learning that uses multi-layer neural networks.",
  },
  {
    q: "A chatbot that writes a new poem is an example of…",
    options: ["Generative AI", "A search index", "A firewall", "Data compression"],
    answer: 0,
    explanation: "Creating new text is what generative AI does.",
  },
  {
    q: "What is a 'hallucination' in AI?",
    options: ["A visual effect", "When AI gives confident but false information", "A type of dataset", "A faster processor"],
    answer: 1,
    explanation: "AI models can produce answers that sound right but are wrong. Always verify important facts.",
  },
  {
    q: "Which helps reduce bias in an AI model?",
    options: ["Using fewer examples", "Using diverse, balanced training data", "Hiding the data", "Making the model bigger only"],
    answer: 1,
    explanation: "Diverse and balanced data helps the model treat different groups more fairly.",
  },
  {
    q: "A 'prompt' is…",
    options: ["The AI's hardware", "The instruction or question you give the AI", "A kind of virus", "The model's training data"],
    answer: 1,
    explanation: "A prompt is your input. Clear prompts usually get clearer answers.",
  },
  {
    q: "Supervised learning uses…",
    options: ["Labelled examples", "No data at all", "Only images", "Random guessing"],
    answer: 0,
    explanation: "In supervised learning, each training example comes with the correct answer (label).",
  },
];

export const PROMPT_TASKS: PromptTask[] = [
  {
    task: "Ask an AI to explain photosynthesis to a Class 6 student who finds science difficult.",
    tips: ["Mention the audience (Class 6, beginner)", "Ask for simple words or an everyday example", "Set a length, e.g. 5 short points"],
  },
  {
    task: "Ask an AI to make a 7-day study plan for your upcoming maths exam.",
    tips: ["Give the topics and exam date", "Say how many hours you can study daily", "Ask for a table or day-wise format"],
  },
  {
    task: "Ask an AI to help you write a polite email to your teacher asking for an extension.",
    tips: ["Explain the reason briefly", "Ask for a polite, formal tone", "Mention the new date you want"],
  },
];

export const SCENARIOS: Scenario[] = [
  {
    situation: "Your phone's photo app automatically groups pictures of the same family member together.",
    question: "Which AI concept is being used here?",
    explanation:
      "This is image recognition using deep learning. The model learned facial features from many examples and groups similar faces.",
  },
  {
    situation: "An AI chatbot tells you a historical date confidently, but your textbook says something different.",
    question: "What should you do?",
    explanation:
      "AI can 'hallucinate'. Check trusted sources like your textbook or teacher. Use AI as a helper, not as the final authority.",
  },
  {
    situation: "A hiring tool trained mostly on past male applicants starts rating women lower.",
    question: "What problem is this, and how could it be fixed?",
    explanation:
      "This is bias from unbalanced training data. It can be reduced with more diverse data, regular fairness checks and human review.",
  },
];

export const CATEGORIES = [
  { id: "concept", title: "Concept Practice", description: "Short questions on AI, ML, Deep Learning and Generative AI." },
  { id: "mcq", title: "MCQ Practice", description: "5 multiple-choice questions with explanations and a final score." },
  { id: "prompt", title: "Prompt Engineering", description: "Write your own prompt for a real-world task and get guidance." },
  { id: "scenario", title: "Real-World Scenarios", description: "Decide what AI concept applies or what you would do." },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];
