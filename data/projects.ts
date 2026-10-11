import type { Project } from "@/lib/types";

/**
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  PROJECT TRUTH — nothing here is invented.                            │
 * └───────────────────────────────────────────────────────────────────────┘
 *
 * • Stack entries describe what the project was actually built with.
 * • `github` / `live` are `null` unless a real URL exists — the UI renders a
 *   disabled "link coming soon" state instead of a fabricated href.
 * • No metrics, no invented screenshots, no fake dates. `media` points at
 *   abstract placeholder artwork in `/public/images/projects`; drop a real
 *   screenshot at the documented path and it is used automatically.
 *
 * Labels marked TODO(you) are the only things worth double-checking against
 * your own repositories — the codebase deliberately never guesses.
 */
export const projects: Project[] = [
  {
    id: "ai-code-reviewer",
    index: 1,
    title: "AI Code Reviewer",
    category: "AI Tooling",
    role: "Full-stack · AI integration",
    description:
      "Paste a snippet, get a structured review. A three-tier app — React + Vite client, Express API, OpenRouter models — that streams model feedback back as review notes instead of a wall of text.",
    caseStudy: {
      context:
        "Reviewing your own code is the weakest link in solo learning: you re-read what you meant to write. I wanted a second opinion on demand — one that returns actionable notes on correctness, readability and edge cases rather than a generic paragraph.",
      approach: [
        "Split the system into three parts with one job each: a Vite + React client for the editor experience, an Express service that owns validation and prompt construction, and OpenRouter as the model gateway so the provider can be swapped without touching the UI.",
        "Prompts are assembled server-side from a fixed review rubric, which keeps prompt logic out of the browser and makes the output shape predictable for the client to parse.",
        "Loading, error and empty states are treated as first-class UI: a review request that fails shows the provider message instead of a spinner that never ends.",
      ],
      features: [
        "Paste-or-type code input with language context",
        "Server-side prompt construction against a fixed review rubric",
        "Model-agnostic responses via the OpenRouter API",
        "Explicit loading / error / empty states in the client",
        "Environment-based key handling — no secrets in the browser bundle",
      ],
      notes:
        "Next steps: streaming responses token-by-token, a diff-aware review mode, and persisted review history once there is a database behind it.",
    },
    tech: ["React", "Vite", "Node.js", "Express", "OpenRouter API", "REST"],
    media: {
      src: "/images/projects/ai-code-reviewer.svg",
      alt: "Abstract placeholder artwork for the AI Code Reviewer project",
      width: 1600,
      height: 1000,
      caption: "Placeholder artwork — replace with a real screenshot.",
    },
    github: { url: null, label: "Repository" },
    live: { url: null, label: "Live demo" },
    status: "shipped",
    featured: true,
  },
  {
    id: "ai-learning-assistant",
    index: 2,
    title: "AI Learning Assistant",
    category: "AI Tooling",
    role: "Full-stack · Document processing & retrieval",
    description:
      "A MERN study companion that ingests your own documents and answers questions about them, using retrieval to ground responses in the uploaded material.",
    caseStudy: {
      context:
        "Generic chatbots answer from the whole internet and cite nothing. For studying, the useful assistant is the one that answers *from your notes* and can point back at the passage it used.",
      approach: [
        "Built on the MERN stack: React front-end, Express API, MongoDB for users, documents and conversation state.",
        "An ingestion pipeline extracts text from uploaded documents, splits it into overlapping chunks and stores the chunks alongside their source metadata so any answer can be traced back.",
        "Retrieval happens before generation: the most relevant chunks for a question are selected and passed to the model as context, which is what makes the answer specific instead of plausible.",
      ],
      features: [
        "Document upload with server-side text extraction",
        "Chunking with source metadata retained for citations",
        "Retrieval-augmented answers grounded in uploaded material",
        "Conversation history persisted in MongoDB",
        "Authenticated user sessions around the document store",
      ],
      notes:
        "The honest limitation: retrieval quality is the whole product. Chunk size and overlap tuning is where most of the remaining work lives.",
    },
    tech: ["MongoDB", "Express", "React", "Node.js", "Document Processing", "RAG"],
    media: {
      src: "/images/projects/ai-learning-assistant.svg",
      alt: "Abstract placeholder artwork for the AI Learning Assistant project",
      width: 1600,
      height: 1000,
      caption: "Placeholder artwork — replace with a real screenshot.",
    },
    github: { url: null, label: "Repository" },
    live: { url: null, label: "Live demo" },
    status: "shipped",
  },
  {
    id: "bank-transaction-api",
    index: 3,
    title: "Bank Transaction API",
    category: "Backend",
    role: "Backend · API design & security",
    description:
      "A REST backend for accounts and money movement: JWT-protected routes, Mongoose schemas for accounts and transactions, and ledger-safe transfer logic.",
    caseStudy: {
      context:
        "Banking is the classic case where the interesting work is invisible: the balance is easy, keeping it correct when two transfers race is the actual problem.",
      approach: [
        "Modelled the domain with Mongoose: users, accounts and an immutable transaction log, so a balance is always derivable from entries rather than being a single mutable number.",
        "Authentication is stateless and explicit — JWT issued on login, verified by middleware, with the account owner enforced on every route instead of trusting a client-supplied id.",
        "Input validation and centralised error handling sit in front of the database so invalid payloads fail with a predictable status and shape.",
      ],
      features: [
        "JWT authentication with protected route middleware",
        "Mongoose schemas for users, accounts and transactions",
        "Transfer endpoint with balance checks and atomic ordering",
        "Centralised validation and error-response formatting",
        "Route separation between auth, accounts and transactions",
      ],
      notes:
        "What I would add next in a real deployment: idempotency keys on transfers, Mongo sessions/transactions, and integration tests around concurrent debits.",
    },
    tech: ["Node.js", "Express", "MongoDB", "Mongoose", "JWT", "REST"],
    media: {
      src: "/images/projects/bank-transaction-api.svg",
      alt: "Abstract placeholder artwork for the Bank Transaction API project",
      width: 1600,
      height: 1000,
      caption: "Placeholder artwork — replace with real API or dashboard capture.",
    },
    github: { url: null, label: "Repository" },
    live: { url: null, label: "Live demo" },
    status: "shipped",
  },
  {
    id: "touch-free-hill-climb",
    index: 4,
    title: "Touch-Free Hill Climb Game",
    category: "Machine Learning",
    role: "Computer vision · Game control",
    description:
      "Drive a hill-climb racer with your hands, no controller. MediaPipe tracks hand landmarks from the webcam; the gesture map is translated into throttle and brake input for the game loop.",
    caseStudy: {
      context:
        "Webcam-controlled interfaces are usually demos that fall apart the moment you move. The goal here was a control scheme that stays playable: latency low enough to feel connected, and inputs that never stick on.",
      approach: [
        "MediaPipe hand tracking produces landmark coordinates per frame; the landmarks are converted into a small set of intentional gestures rather than raw angles, which keeps input stable between frames.",
        "A mapping layer turns recognised gestures into the same discrete inputs a keyboard would send, so the game logic itself stays untouched and testable.",
        "Debouncing sits between tracking and control — a gesture has to hold briefly before it registers, which removes the flicker you get from noisy single-frame detections.",
      ],
      features: [
        "Real-time hand-landmark tracking from the webcam",
        "Gesture-to-input mapping layer decoupled from game logic",
        "Debounced recognition to prevent input chatter",
        "Frame-by-frame loop that keeps rendering and tracking independent",
        "Keyboard fallback so the game is always playable",
      ],
      notes:
        "Tracking accuracy is entirely dependent on lighting and camera position — the most useful next step is on-screen feedback showing what the model currently sees.",
    },
    // TODO(you): confirm the exact game/render library you used (Pygame is the
    // common choice, but this file should only claim what the repo actually has).
    tech: ["Python", "MediaPipe", "OpenCV", "Machine Learning", "Pygame"],
    media: {
      src: "/images/projects/touch-free-hill-climb.svg",
      alt: "Abstract placeholder artwork for the Touch-Free Hill Climb Game project",
      width: 1600,
      height: 1000,
      caption: "Placeholder artwork — replace with a gameplay still.",
    },
    github: { url: null, label: "Repository" },
    live: { url: null, label: "Live demo" },
    status: "shipped",
  },
  {
    id: "crafton-bags-ecommerce",
    index: 5,
    title: "Crafton Bags E-commerce",
    category: "Commerce",
    role: "Full-stack · Storefront",
    description:
      "A storefront for a bag brand: product catalogue, cart flow and checkout-shaped UI, built to practise the parts of commerce that are not glamorous — state, totals and inventory awareness. The interface is complete; the payment and inventory layer is still ahead.",
    caseStudy: {
      context:
        "A catalogue is a list; a store is a state machine. Cart, quantities, totals and availability all have to agree with each other on every interaction.",
      approach: [
        "Product data is treated as the single source of truth and consumed through one access layer, so the grid, the detail view and the cart all read the same shape.",
        "Cart state is centralised and derived — totals and counts are computed, never stored — which removes a whole class of desync bugs.",
        "The interface follows the brand: restrained product cards, generous whitespace and a persistent cart summary rather than a modal interruption.",
      ],
      features: [
        "Catalogue grid with individual product views",
        "Centralised cart with derived totals and quantities",
        "Persistent cart summary and quantity controls",
        "Responsive product layout with image-led cards",
        "Component structure ready to be pointed at a real commerce API",
      ],
      notes:
        "Currently front-end focused with local state; the next milestone is a payments provider and real inventory behind an API.",
    },
    // TODO(you): confirm this list against the repository — only the front-end
    // stack is described in the case study above.
    tech: ["React", "JavaScript", "CSS", "Responsive design"],
    media: {
      src: "/images/projects/crafton-bags-ecommerce.svg",
      alt: "Abstract placeholder artwork for the Crafton Bags E-commerce project",
      width: 1600,
      height: 1000,
      caption: "Placeholder artwork — replace with a storefront capture.",
    },
    github: { url: null, label: "Repository" },
    live: { url: null, label: "Live demo" },
    status: "shipped",
  },
];

export const featuredProjects = projects.filter((project) => project.featured);
export const projectCount = projects.length;

export function getProject(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

export function getProjectIds(): string[] {
  return projects.map((project) => project.id);
}
