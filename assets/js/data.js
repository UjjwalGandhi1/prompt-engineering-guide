// --- Data Layer (Source Material Integration) ---
// Note: reportData is static and trusted.
const reportData = {
    categories: [
        {
            id: "foundational",
            title: "Foundational Techniques",
            icon: "🏗️",
            description: "The building blocks of prompt engineering. These techniques dictate how much context and guidance you provide to the model before asking for an answer.",
            insight: "Start here. Most tasks only require these basics. The key differentiator is the number of examples provided (Zero, One, or Few) which drastically steers model behavior.",
            chartData: [2, 8, 9, 1, 9], // Complexity, Reliability, Speed, Cost, Creativity
            techniques: [
                {
                    id: "zero-shot",
                    title: "Zero-Shot Prompting",
                    definition: "Instructing the LLM to perform a task without providing any examples, relying solely on its pre-trained knowledge.",
                    bestUse: "Simple queries, general knowledge, basic sentiment analysis.",
                    mechanism: "The model relies on its internal weights and 'world view' to answer. No in-context learning is used.",
                    exampleInput: "Classify the sentiment of the following text as Positive, Neutral, or Negative: 'The service was slow, but the food was delicious.'",
                    exampleOutput: "Sentiment: Negative (leaning Neutral due to mixed feedback, but primary complaint is service).",
                    complexity: "Low"
                },
                {
                    id: "one-shot",
                    title: "One-Shot Prompting",
                    definition: "Providing a single example alongside the request to clarify the desired format, style, or logic.",
                    bestUse: "When the model needs a nudge to understand a specific output structure or unique format.",
                    mechanism: "Provides a template pattern. The model sees 'Input A -> Output B' and infers it should do 'Input C -> Output D'.",
                    exampleInput: "Convert the following currency based on the format:\nInput: 100 USD to EUR\nOutput: €92.50\n\nInput: 50 GBP to JPY\nOutput:",
                    exampleOutput: "¥9,500.00",
                    complexity: "Low-Mid"
                },
                {
                    id: "few-shot",
                    title: "Few-Shot Prompting",
                    definition: "Including multiple input-output examples (usually 3-5) within the context window to help the model learn patterns.",
                    bestUse: "Complex tasks requiring precise formatting, nuanced classification, or mimicking a specific tone.",
                    mechanism: "In-Context Learning (ICL). The model adjusts its probability distribution based on the provided examples.",
                    exampleInput: "Extract company and ticker:\n1. 'Apple released a new phone.' -> Apple (AAPL)\n2. 'Microsoft updates Windows.' -> Microsoft (MSFT)\n3. 'Tesla stock rises.' -> Tesla (TSLA)\n4. 'Google announces AI features.' ->",
                    exampleOutput: "Google (GOOGL)",
                    complexity: "Mid"
                }
            ]
        },
        {
            id: "reasoning",
            title: "Reasoning Enhancement",
            icon: "🧠",
            description: "Techniques designed to help the model 'think' before it speaks. Essential for math, logic puzzles, coding, and complex analysis where intuition fails.",
            insight: "LLMs are probabilistic, not logical. These techniques force a linear logical structure onto the generation process, significantly reducing calculation and logic errors.",
            chartData: [7, 9, 5, 4, 3], // Complexity, Reliability, Speed, Cost, Creativity
            techniques: [
                {
                    id: "cot",
                    title: "Chain-of-Thought (CoT)",
                    definition: "Guiding the AI to outline its reasoning steps before providing a final answer.",
                    bestUse: "Multi-step arithmetic, logic problems, debugging code.",
                    mechanism: "Decomposes the problem. By generating intermediate tokens, the model gives itself more 'compute time' to resolve dependencies.",
                    exampleInput: "Q: Roger has 5 tennis balls. He buys 2 more cans of tennis balls. Each can has 3 tennis balls. How many does he have now?\nA: Let's think step by step.",
                    exampleOutput: "Roger starts with 5 balls.\nHe buys 2 cans.\nEach can has 3 balls, so 2 * 3 = 6 balls.\nTotal balls = 5 + 6 = 11.\nThe answer is 11.",
                    complexity: "Mid"
                },
                {
                    id: "self-ask",
                    title: "Self-Ask Decomposition",
                    definition: "Breaking down a complex query into smaller sub-questions that the model answers sequentially.",
                    bestUse: "Fact-checking or answering questions combining distinct knowledge pieces.",
                    mechanism: "Splits a multi-hop question into single-hop questions.",
                    exampleInput: "Who lived longer, Muhammad Ali or Bruce Lee?",
                    exampleOutput: "Step 1: Find Muhammad Ali's age.\n- Born 1942, Died 2016. Age: 74.\nStep 2: Find Bruce Lee's age.\n- Born 1940, Died 1973. Age: 32.\nStep 3: Compare.\n- 74 > 32.\nAnswer: Muhammad Ali lived longer.",
                    complexity: "High"
                },
                {
                    id: "step-back",
                    title: "Step-Back Prompting",
                    definition: "Encouraging the model to abstract specific details to find high-level concepts or principles before answering.",
                    bestUse: "Science questions or abstract reasoning where details distract.",
                    mechanism: "Abstraction followed by application. Prevents getting lost in the weeds.",
                    exampleInput: "Instead of answering immediately, first identify the physics principle governing this problem, then solve it.\n\nProblem: A ball is thrown...",
                    exampleOutput: "Principle: The problem is governed by Newton's Second Law of Motion and Projectile Motion kinematics.\n\nSolution: [Detailed calculation based on identified principles...]",
                    complexity: "Mid-High"
                },
                {
                    id: "tree-of-thoughts",
                    title: "Tree of Thoughts (ToT)",
                    definition: "A framework where the AI branches out multiple possible 'thoughts' or solutions, evaluates them, and selects the best path.",
                    bestUse: "Strategic planning, creative writing, puzzles like Sudoku.",
                    mechanism: "Search algorithm (BFS/DFS) applied to prompt generation. It explores multiple futures.",
                    exampleInput: "Plan a mystery novel. Generate 3 possible motives for the killer, evaluate which is most compelling, and proceed.",
                    exampleOutput: "Path A (Jealousy): Standard, clichéd.\nPath B (Financial): Solid, but dry.\nPath C (Mistaken Identity): High drama, tragic irony.\n\nSelection: Path C.\n\nDeveloping Path C...",
                    complexity: "Very High"
                }
            ]
        },
        {
            id: "structure",
            title: "Structure & Format",
            icon: "📐",
            description: "Techniques for controlling the shape, tone, and format of the output. Crucial for integrating LLMs into software pipelines.",
            insight: "In production, the format of the answer is often as important as the answer itself. These techniques ensure the output is machine-readable (JSON, XML) or role-compliant.",
            chartData: [4, 8, 8, 2, 5],
            techniques: [
                {
                    id: "meta-prompting",
                    title: "Meta Prompting",
                    definition: "Prompting the LLM to create or improve prompts for itself or other models.",
                    bestUse: "When you don't know how to phrase a request; building 'Prompt Optimizer' tools.",
                    mechanism: "Using the model's linguistic understanding to optimize instructions.",
                    exampleInput: "Create a prompt that would make an AI act as an expert fitness coach for a beginner.",
                    exampleOutput: "Generated Prompt: 'You are an elite fitness coach with 20 years of experience. Your client is a complete beginner. Create a non-intimidating, step-by-step 15-minute workout plan. Use encouraging language.'",
                    complexity: "High"
                },
                {
                    id: "system-messages",
                    title: "System Messages (Persona)",
                    definition: "Setting high-level behavior, tone, and rules in the 'System' role.",
                    bestUse: "Role-playing, enforcing security, defining JSON output.",
                    mechanism: "Sets the prior probability distribution for the entire conversation.",
                    exampleInput: "System: You are a grumpy medieval blacksmith. You only speak in Old English.\nUser: Make me a sword.",
                    exampleOutput: "Aye, ye want a blade, do ye? It'll cost ye five silver pieces and a week o' waitin'. The forge is cold today.",
                    complexity: "Low"
                },
                {
                    id: "template-filling",
                    title: "Template Filling",
                    definition: "Creating a rigid skeleton with placeholders for the AI to fill.",
                    bestUse: "Standardized reports, emails, database entries.",
                    mechanism: "Constrained generation. The model focuses only on the variable content.",
                    exampleInput: "You are an HR assistant. Fill in: Dear [Name], Thank you for applying to [Role]. [Status].",
                    exampleOutput: "Dear Sarah,\nThank you for applying to Senior Developer.\nWe would like to invite you for an interview.",
                    complexity: "Low"
                }
            ]
        },
        {
            id: "quality",
            title: "Quality & Reliability",
            icon: "🛡️",
            description: "Methods to reduce hallucinations and ensure the model is telling the truth or knows when it doesn't know.",
            insight: "LLMs are confident liars. Quality control techniques force the model to second-guess itself or provide metadata about its own certainty.",
            chartData: [5, 10, 6, 5, 2],
            techniques: [
                {
                    id: "self-consistency",
                    title: "Self-Consistency",
                    definition: "Asking the same question multiple times and selecting the most frequent answer.",
                    bestUse: "Fact-checking, logic puzzles with one correct answer.",
                    mechanism: "Majority voting. Statistical path verification.",
                    exampleInput: "Run the math problem 3 times. Output the most common answer.",
                    exampleOutput: "Run 1: 42\nRun 2: 42\nRun 3: 45\n\nConsensus Answer: 42",
                    complexity: "Mid"
                },
                {
                    id: "calibrated-confidence",
                    title: "Calibrated Confidence",
                    definition: "Asking the model to provide a confidence score (0-100%) alongside its answer.",
                    bestUse: "Determining if a model is hallucinating.",
                    mechanism: "Introspection (simulated). Low confidence often correlates with errors.",
                    exampleInput: "Answer and provide a confidence score: 'What represents the color blue in hex?'",
                    exampleOutput: "Answer: #0000FF\nConfidence: 99%",
                    complexity: "Low"
                }
            ]
        },
        {
            id: "context",
            title: "Context & Retrieval",
            icon: "🗄️",
            description: "Techniques for managing external information and large documents. The basis for RAG (Retrieval Augmented Generation).",
            insight: "An LLM's knowledge cutoff is a major limitation. These techniques inject fresh or private data into the prompt to ground the model's response.",
            chartData: [6, 9, 7, 3, 4],
            techniques: [
                {
                    id: "rag",
                    title: "Information Retrieval (RAG)",
                    definition: "Providing specific documents and instructing to answer *only* using that info.",
                    bestUse: "Private policy QA, news summarization.",
                    mechanism: "Grounding. Restricts the model to the provided context window.",
                    exampleInput: "Context: 'Project Alpha is delayed by 2 weeks due to supply chain.'\nQuestion: What is the status of Project Alpha?",
                    exampleOutput: "Project Alpha is delayed by 2 weeks. (Source: Context)",
                    complexity: "Mid"
                },
                {
                    id: "context-expansion",
                    title: "Context Expansion (5 Ws)",
                    definition: "Forcing analysis through: Who, What, Where, When, Why, How.",
                    bestUse: "Comprehensive summaries.",
                    mechanism: "Structured extraction ensures no aspect is missed.",
                    exampleInput: "Analyze the article using the 5 Ws.",
                    exampleOutput: "Who: The President.\nWhat: Signed a new bill.\nWhere: The Oval Office.\nWhen: Yesterday.\nWhy: To improve infrastructure.",
                    complexity: "Low-Mid"
                }
            ]
        },
        {
            id: "advanced",
            title: "Advanced Production",
            icon: "🚀",
            description: "Architectural patterns for building autonomous agents and complex applications.",
            insight: "At this level, prompt engineering becomes 'Flow Engineering'. It involves coordinating multiple models or prompt stages to achieve a complex goal.",
            chartData: [9, 8, 4, 8, 9],
            techniques: [
                {
                    id: "prompt-chaining",
                    title: "Prompt Chaining",
                    definition: "Breaking a task into a sequence of prompts; output of one is input for next.",
                    bestUse: "Writing books, complex data pipelines.",
                    mechanism: "Sequential processing. Reduces context load per step.",
                    exampleInput: "Step 1: Outline the blog post.\nStep 2: Write Section 1 based on outline...",
                    exampleOutput: "[Step 1 Output: Outline]\n[Step 2 Input: Using Outline, write Intro...]\n[Step 2 Output: Full Intro text...]",
                    complexity: "High"
                },
                {
                    id: "multi-agent",
                    title: "Multi-Agent Orchestration",
                    definition: "Using a controller to coordinate multiple 'agent' personas (Researcher, Writer, Editor).",
                    bestUse: "Software dev, academic papers.",
                    mechanism: "Distributed cognition. Specialization yields better results.",
                    exampleInput: "Agent A (Researcher): Find facts on Solar Energy.\nAgent B (Writer): Write article using A's facts.\nAgent C (Editor): Critique B's work.",
                    exampleOutput: "Researcher: [Facts]\nWriter: [Draft]\nEditor: [Critique: Tone is too academic]\nWriter: [Revised Draft]",
                    complexity: "Very High"
                }
            ]
        }
    ]
};
