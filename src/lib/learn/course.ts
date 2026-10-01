export type QuizQuestion = { q: string; options: string[]; answer: number };
export type Module = {
  id: string;
  title: string;
  minutes: number;
  lesson: string[];
  simple: string;
  examples: string[];
  terms: { term: string; meaning: string }[];
  practice: string;
  quiz: QuizQuestion[];
};

export const COURSE = {
  id: "ai-fundamentals",
  title: "AI Fundamentals — Beginner to Practical",
  description:
    "A structured, beginner-friendly course that takes you from 'What is AI?' to building your first small AI project.",
};

export const MODULES: Module[] = [
  {
    id: "intro-to-ai",
    title: "Introduction to AI",
    minutes: 10,
    lesson: [
      "Artificial Intelligence (AI) is the field of building computer systems that can do tasks which normally need human intelligence — understanding language, recognising images, making decisions or solving problems.",
      "Most AI today is 'narrow AI': it is very good at one kind of task, like translating text or recommending videos, but it does not truly understand the world the way people do.",
      "AI systems learn patterns from data. The quality of the data strongly decides how useful, fair and accurate the system becomes.",
    ],
    simple:
      "AI is like teaching a computer by showing it many examples, so it can make a good guess the next time it sees something similar.",
    examples: [
      "UPI apps flagging unusual transactions as possible fraud.",
      "Google Maps predicting traffic on your route to college.",
      "Voice assistants understanding Hindi or English commands.",
    ],
    terms: [
      { term: "Artificial Intelligence", meaning: "Computer systems doing tasks that need human-like intelligence." },
      { term: "Narrow AI", meaning: "AI designed for one specific task." },
      { term: "Data", meaning: "Examples and information an AI learns patterns from." },
    ],
    practice: "Write down three apps on your phone that you think use AI, and what task they do.",
    quiz: [
      { q: "Most AI used today is best described as…", options: ["Narrow AI", "Conscious AI", "Magic"], answer: 0 },
      { q: "AI systems mainly learn from…", options: ["Electricity", "Data", "Screens"], answer: 1 },
      { q: "Which is an example of AI?", options: ["A calculator adding numbers", "Fraud detection in UPI apps", "A light switch"], answer: 1 },
    ],
  },
  {
    id: "ai-ml-dl",
    title: "AI vs ML vs Deep Learning",
    minutes: 10,
    lesson: [
      "AI is the big umbrella: any technique that makes machines act intelligently.",
      "Machine Learning (ML) is a part of AI where systems learn from data instead of being given every rule by hand.",
      "Deep Learning is a part of ML that uses large neural networks with many layers. It powers modern speech recognition, image recognition and chatbots.",
    ],
    simple: "Think of three circles inside each other: AI is the biggest, ML sits inside it, and Deep Learning sits inside ML.",
    examples: [
      "Rule-based chess program — AI, but not ML.",
      "Spam filter that learns from marked emails — ML.",
      "Face unlock on your phone — Deep Learning.",
    ],
    terms: [
      { term: "Machine Learning", meaning: "Learning patterns from data instead of hand-written rules." },
      { term: "Deep Learning", meaning: "ML using many-layered neural networks." },
      { term: "Rule-based system", meaning: "A program that follows rules written by people." },
    ],
    practice: "Draw the three nested circles and place one example of your own in each.",
    quiz: [
      { q: "Deep Learning is a part of…", options: ["Machine Learning", "Hardware", "Networking"], answer: 0 },
      { q: "A spam filter that learns from your choices is…", options: ["Not AI", "Machine Learning", "A database"], answer: 1 },
      { q: "Which is the broadest term?", options: ["Deep Learning", "Machine Learning", "Artificial Intelligence"], answer: 2 },
    ],
  },
  {
    id: "ml-basics",
    title: "Machine Learning Basics",
    minutes: 12,
    lesson: [
      "In supervised learning, the model learns from labelled examples — for example, house details with their prices.",
      "In unsupervised learning, the model finds groups or patterns in data without labels — like grouping customers by shopping habits.",
      "Data is usually split into a training set (to learn) and a test set (to check how well it works on new data). A model that memorises training data but fails on new data is 'overfitting'.",
    ],
    simple: "Supervised = learning with an answer key. Unsupervised = finding groups on your own.",
    examples: [
      "Predicting crop yield from rainfall and soil data (supervised).",
      "Grouping shoppers on an e-commerce site (unsupervised).",
      "Predicting exam scores from study hours (supervised).",
    ],
    terms: [
      { term: "Label", meaning: "The correct answer attached to a training example." },
      { term: "Training set", meaning: "Data used to teach the model." },
      { term: "Overfitting", meaning: "Memorising training data and doing badly on new data." },
    ],
    practice: "Think of one problem in your city that could use supervised learning. What would the labels be?",
    quiz: [
      { q: "Learning from labelled examples is…", options: ["Supervised learning", "Unsupervised learning", "Overfitting"], answer: 0 },
      { q: "The test set is used to…", options: ["Train faster", "Check performance on new data", "Store labels"], answer: 1 },
      { q: "Grouping customers without labels is…", options: ["Supervised", "Unsupervised", "Deep learning only"], answer: 1 },
    ],
  },
  {
    id: "neural-networks",
    title: "Neural Networks",
    minutes: 12,
    lesson: [
      "A neural network is made of layers of small units called neurons. Each neuron takes numbers in, multiplies them by weights, adds them and passes the result on.",
      "During training, the network compares its guess with the correct answer and slightly adjusts its weights to reduce the error. Repeating this many times is how it learns.",
      "More layers let the network learn more complex patterns — from edges, to shapes, to whole faces in an image.",
    ],
    simple: "A neural network is a team of tiny calculators passing notes forward, and fixing their notes a little every time they get the answer wrong.",
    examples: [
      "Recognising handwritten digits on cheques.",
      "Detecting diseases in crop leaf photos.",
      "Converting speech to text.",
    ],
    terms: [
      { term: "Neuron", meaning: "A small unit that combines inputs using weights." },
      { term: "Weight", meaning: "A number showing how important an input is." },
      { term: "Layer", meaning: "A group of neurons working at the same step." },
    ],
    practice: "Explain to a friend, in two sentences, how a network 'learns from mistakes'.",
    quiz: [
      { q: "During training, a network adjusts its…", options: ["Weights", "Screen", "Battery"], answer: 0 },
      { q: "More layers usually help learn…", options: ["Simpler patterns only", "More complex patterns", "Nothing"], answer: 1 },
      { q: "A neuron combines inputs using…", options: ["Weights", "Passwords", "Colours"], answer: 0 },
    ],
  },
  {
    id: "generative-ai",
    title: "Generative AI",
    minutes: 10,
    lesson: [
      "Generative AI creates new content — text, images, audio, code or video — based on patterns learned from large amounts of data.",
      "It does not copy one example; it produces new output that looks similar to what it has learned.",
      "Generative AI can make mistakes or invent facts ('hallucinations'), so its output should always be checked.",
    ],
    simple: "Normal AI answers 'what is this?'. Generative AI answers 'make me something new'.",
    examples: [
      "Writing a first draft of a college application email.",
      "Creating a poster image from a text description.",
      "Generating practice questions from your notes.",
    ],
    terms: [
      { term: "Generative AI", meaning: "AI that creates new content." },
      { term: "Hallucination", meaning: "Confident but incorrect or invented output." },
      { term: "Model", meaning: "The trained system that produces outputs." },
    ],
    practice: "Use the Saathiya assistant to generate 3 quiz questions on a topic you know well, then check them.",
    quiz: [
      { q: "Generative AI mainly…", options: ["Creates new content", "Only deletes files", "Charges phones"], answer: 0 },
      { q: "A 'hallucination' is…", options: ["A correct answer", "Invented or wrong output", "A type of image"], answer: 1 },
      { q: "Generative AI output should be…", options: ["Trusted blindly", "Checked", "Ignored"], answer: 1 },
    ],
  },
  {
    id: "llms",
    title: "Large Language Models",
    minutes: 12,
    lesson: [
      "A Large Language Model (LLM) is a deep learning model trained on huge amounts of text to predict the next piece of text, called a token.",
      "By predicting tokens one after another, LLMs can answer questions, summarise, translate and write code.",
      "LLMs have a 'context window' — a limit on how much text they can consider at once — and their knowledge can be out of date.",
    ],
    simple: "An LLM is a very advanced autocomplete that has read a lot of text.",
    examples: [
      "Chat assistants answering study questions.",
      "Translating a notice from English to Hindi.",
      "Summarising a long PDF into key points.",
    ],
    terms: [
      { term: "Token", meaning: "A small piece of text, like a word or part of a word." },
      { term: "Context window", meaning: "How much text the model can look at at once." },
      { term: "LLM", meaning: "Large Language Model trained on lots of text." },
    ],
    practice: "Ask the assistant the same question in Hindi and English and compare the answers.",
    quiz: [
      { q: "LLMs work by predicting the next…", options: ["Token", "Image", "Password"], answer: 0 },
      { q: "The context window is…", options: ["A screen size", "How much text the model considers at once", "A browser tab"], answer: 1 },
      { q: "LLM knowledge can be…", options: ["Always current", "Out of date", "Perfect"], answer: 1 },
    ],
  },
  {
    id: "prompt-engineering",
    title: "Prompt Engineering",
    minutes: 10,
    lesson: [
      "A prompt is the instruction you give an AI model. Clear prompts give better results.",
      "Good prompts include a role, the task, context, the format you want and any limits. Example: 'You are a patient teacher. Explain photosynthesis to a Class 8 student in 5 bullet points.'",
      "Giving examples in the prompt ('few-shot prompting') and asking the model to think step by step often improves answers.",
    ],
    simple: "Talk to AI like you brief a helpful friend: who they are, what you need, and how you want it.",
    examples: [
      "'Summarise these notes in 5 points for revision.'",
      "'Give me 3 MCQs with answers on Newton's laws.'",
      "'Explain this in simple Hindi.'",
    ],
    terms: [
      { term: "Prompt", meaning: "The instruction given to an AI model." },
      { term: "Few-shot prompting", meaning: "Including examples in the prompt." },
      { term: "Output format", meaning: "The shape you want the answer in, like a table or list." },
    ],
    practice: "Rewrite a vague prompt like 'tell me about AI' into a clear one with role, task and format.",
    quiz: [
      { q: "Which prompt is clearer?", options: ["'AI?'", "'Explain AI to a Class 9 student in 4 bullet points'", "'Tell stuff'"], answer: 1 },
      { q: "Few-shot prompting means…", options: ["Giving examples", "Using fewer words", "Asking twice"], answer: 0 },
      { q: "A good prompt usually includes…", options: ["Role, task and format", "Only emojis", "Nothing"], answer: 0 },
    ],
  },
  {
    id: "ai-ethics",
    title: "AI Ethics & Safety",
    minutes: 10,
    lesson: [
      "AI can be biased if its training data is unfair or incomplete, leading to unfair decisions for some groups.",
      "Privacy matters: avoid sharing personal data like Aadhaar numbers, passwords or OTPs with AI tools.",
      "Deepfakes and AI-generated misinformation are growing risks. Verify important information from trusted sources, and be transparent when you use AI in your work.",
    ],
    simple: "Use AI responsibly: be fair, protect privacy, check facts and be honest about using it.",
    examples: [
      "A hiring model favouring one group because of biased past data.",
      "Fake videos of public figures spread on social media.",
      "Students citing AI output without checking it.",
    ],
    terms: [
      { term: "Bias", meaning: "Unfair patterns in data or decisions." },
      { term: "Deepfake", meaning: "AI-generated fake image, audio or video of a real person." },
      { term: "Privacy", meaning: "Keeping personal information protected." },
    ],
    practice: "List three types of personal information you should never paste into an AI tool.",
    quiz: [
      { q: "Bias in AI often comes from…", options: ["Unfair training data", "Fast internet", "Dark mode"], answer: 0 },
      { q: "You should share your OTP with AI tools…", options: ["Always", "Never", "Only at night"], answer: 1 },
      { q: "A deepfake is…", options: ["A fake AI-generated media of a person", "A deep sea fish", "A password type"], answer: 0 },
    ],
  },
  {
    id: "ai-agents",
    title: "AI Agents — Introduction",
    minutes: 10,
    lesson: [
      "An AI agent is a system that uses an AI model to plan steps and take actions toward a goal, such as searching, using tools or filling forms.",
      "Agents work in a loop: understand the goal, plan, act using tools, observe the result, and repeat until done.",
      "Because agents can take actions, they need clear limits, human oversight and careful permissions.",
    ],
    simple: "A chatbot talks. An agent talks and also does tasks for you, step by step.",
    examples: [
      "An assistant that books a train ticket after confirming with you.",
      "A study agent that finds sources, summarises them and makes notes.",
      "A support agent that checks order status in a system.",
    ],
    terms: [
      { term: "Agent", meaning: "AI that plans and takes actions toward a goal." },
      { term: "Tool", meaning: "An ability the agent can use, like search or a calculator." },
      { term: "Human oversight", meaning: "A person reviewing or approving the agent's actions." },
    ],
    practice: "Write the steps an agent would take to plan a one-week study timetable for you.",
    quiz: [
      { q: "Unlike a simple chatbot, an agent can…", options: ["Take actions using tools", "Only say hello", "Charge your phone"], answer: 0 },
      { q: "The agent loop includes…", options: ["Plan, act, observe", "Sleep, eat, repeat", "Copy, paste"], answer: 0 },
      { q: "Agents need…", options: ["No limits", "Clear limits and oversight", "Your passwords"], answer: 1 },
    ],
  },
  {
    id: "beginner-project",
    title: "Beginner AI Project",
    minutes: 15,
    lesson: [
      "Project: build a 'Smart Study Helper' using prompts only — no coding needed.",
      "Step 1: Pick a chapter you are studying. Step 2: Ask the Saathiya assistant to summarise it in 5 points. Step 3: Ask for 5 quiz questions with answers. Step 4: Ask for a 3-day revision plan.",
      "Step 5: Check every answer with your textbook and note any mistakes the AI made. This review step is what makes it a real AI project — you are testing and improving the system.",
    ],
    simple: "You will combine summary, quiz and plan prompts into one helpful study routine — and check it like a real AI engineer.",
    examples: [
      "Science chapter → summary + quiz + revision plan.",
      "History chapter → timeline + key terms.",
      "English poem → meaning + questions.",
    ],
    terms: [
      { term: "Workflow", meaning: "A series of steps combined to reach a goal." },
      { term: "Evaluation", meaning: "Checking how correct and useful AI output is." },
      { term: "Iteration", meaning: "Improving prompts based on results." },
    ],
    practice: "Complete the five project steps for one chapter and note one mistake the AI made.",
    quiz: [
      { q: "Why check AI answers against your textbook?", options: ["To evaluate accuracy", "To waste time", "No reason"], answer: 0 },
      { q: "Improving prompts based on results is…", options: ["Iteration", "Deletion", "Encryption"], answer: 0 },
      { q: "This project needs coding?", options: ["Yes, a lot", "No, prompts only", "Only in C++"], answer: 1 },
    ],
  },
];

export const ROADMAP = [
  { id: "beginner", title: "AI Beginner", text: "Start your journey — curiosity is enough.", course: false },
  { id: "fundamentals", title: "AI Fundamentals", text: "Complete the 10-module fundamentals course.", course: true },
  { id: "python", title: "Python", text: "Learn the main programming language of AI.", course: false },
  { id: "ml", title: "Machine Learning", text: "Train and evaluate your own models.", course: false },
  { id: "dl", title: "Deep Learning", text: "Build neural networks for images and text.", course: false },
  { id: "genai", title: "Generative AI", text: "Work with models that create content.", course: false },
  { id: "prompting", title: "Prompt Engineering", text: "Design reliable prompts and workflows.", course: false },
  { id: "projects", title: "AI Projects", text: "Ship practical projects end to end.", course: false },
  { id: "advanced", title: "Advanced AI", text: "Agents, fine-tuning and responsible deployment.", course: false },
] as const;
