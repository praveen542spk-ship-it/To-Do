# Do. - Daily Task Tracker

A premium, minimalist daily task tracker designed with a sleek dark-themed aesthetic and interactive client-side functionality. Built to demonstrate clean DOM manipulation, event delegation, state management, and local data persistence.

![Aesthetic Preview](https://img.shields.io/badge/Aesthetics-Premium_Dark-c8f135?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Tech_Stack-HTML5_/_CSS3_/_JS-blue?style=for-the-badge)

---

## ✨ Key Features

- **Full CRUD Support**:
  - **Create**: Add new tasks quickly by pressing `Enter` or clicking the add button.
  - **Read**: Live, reactive rendering of the task list, updating stats in real-time.
  - **Update**: Toggle completion status, and double-click or click to edit task text inline.
  - **Delete**: Remove individual tasks, or clear all completed tasks at once.
- **Auto-Save Persistence**: Automatically syncs the task list state to `window.localStorage` so data survives browser refreshes.
- **Smart Filtering**: Seamlessly filter tasks between **All**, **Active**, and **Completed** views.
- **Real-Time Statistics**: Dynamic dashboard showing **Total**, **Active**, and **Done** task metrics.
- **Smooth UX & Animations**:
  - Inline editing with automatic **Auto-Save on Blur (focusout)**.
  - Custom animations (slide-in) when adding new tasks.
  - Responsive, modern grid-pattern layout matching neon-lime accents (`#c8f135`).

---

## 🛠️ Technology Stack

- **Markup**: Semantic HTML5 tags (`<main>`, `<header>`, `<footer>`) for accessibility and SEO.
- **Styling**: Vanilla CSS3 custom properties (variables), Flexbox layouts, keyframe animations, and modern typography imports (Syne and DM Sans from Google Fonts).
- **Behavior**: Pure Vanilla JavaScript (ES6) implementing a state-driven architecture and efficient delegated event listeners.

---

## 🚀 How to Run Locally

Since this app is built purely on client-side web technologies, there are no build steps or installations required!

1. Clone or download the repository:
   ```bash
   git clone https://github.com/praveen542spk-ship-it/To-Do.git
   ```
2. Open `index.html` directly in any web browser.
3. *Alternative (Recommended)*: Use a local development server like **Live Server** in VS Code for live reloading.

---

## 📂 Project Structure

- `index.html` - Semantic structure, layouts, and page entry point.
- `app.js` - State logic, event delegation, CRUD functions, and LocalStorage sync.
- `style.css` - Custom styling variables, layout styles, and animations.
