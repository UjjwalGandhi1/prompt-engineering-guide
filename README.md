# Master Guide to Prompt Engineering (2025)

A comprehensive, interactive guide to prompt engineering techniques, featuring visualizations, examples, and a quiz mode to test your knowledge.

## Features

-   **Categorized Techniques:** Explore techniques ranging from foundational basics to advanced multi-agent orchestration.
-   **Interactive Examples:** View prompt templates and output examples. Edit them in the playground to test your own variations.
-   **Search:** Quickly find techniques by name, definition, or use case.
-   **Favorites:** Bookmark techniques for quick access.
-   **Quiz Mode:** Test your understanding with an interactive quiz.
-   **Dark Mode:** Fully supported dark theme.
-   **Secure:** Built with security in mind, utilizing a strict Content Security Policy (CSP).

## Setup & Usage

This project is a static web application. You can run it locally using any static file server.

### Prerequisites

-   A web browser (Chrome, Firefox, Safari, Edge).
-   (Optional) A local server like `http-server` (Node.js) or Python's `http.server`.

### Running Locally

1.  Clone or download the repository.
2.  Open the folder in your terminal.
3.  Run a local server:

    *   **Python 3:**
        ```bash
        python3 -m http.server
        ```
    *   **Node.js (http-server):**
        ```bash
        npx http-server
        ```
4.  Open your browser and navigate to `http://localhost:8000` (or the port specified by your server).

### File Structure

```
.
├── index.html              # Main entry point
├── assets/
│   ├── css/
│   │   └── style.css       # Application styles
│   └── js/
│       ├── app.js          # Core application logic
│       ├── data.js         # Static content/data
│       ├── tailwind-config.js # Tailwind configuration
│       └── theme-init.js   # Theme initialization script
└── README.md               # Documentation
```

## Security

This application implements a **Content Security Policy (CSP)** to mitigate Cross-Site Scripting (XSS) and other code injection attacks.

-   **Script Sources:** restricted to `self`, `cdn.tailwindcss.com`, and `cdn.jsdelivr.net`.
-   **Inline Scripts:** Removed. All application logic resides in external JS files.
-   **Style Sources:** Restricted to `self`, `fonts.googleapis.com`, and `unsafe-inline` (required for Tailwind Play CDN to function).

## Technologies

-   **HTML5 / CSS3 / JavaScript (ES6+)**
-   **Tailwind CSS (via CDN):** For utility-first styling.
-   **Chart.js:** For data visualization.
-   **Phosphor Icons / Unicode:** For UI icons.

## License

MIT
