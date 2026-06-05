# Do. - Advanced Productivity Dashboard & Task Manager

A premium, feature-rich, and minimalist Single Page Application (SPA) productivity dashboard. Built with a sleek dark-themed aesthetic, dynamic neon layouts, and rich interactive features like a Priority Matrix, Calendar History, Pomodoro focus tracking, and custom theme customizers.

![Aesthetics](https://img.shields.io/badge/Aesthetics-Premium_Dark-c8f135?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Tech_Stack-HTML5_/_CSS3_/_JS-blue?style=for-the-badge)
![Confetti](https://img.shields.io/badge/Confetti-Included-ff69b4?style=for-the-badge)

---

## 🚀 Key Features

The application is split into **5 Single Page Application (SPA) Views** managed with a client-side router:

### 1. 🏠 Dashboard
* **Daily Quotes Banner**: Curated motivational quotes that rotate dynamically based on the day of the year.
* **Pomodoro Focus Tracker**: Log 25-minute Pomodoro sessions and track your daily focus counts.
* **SVG Productivity Chart**: An interactive, lightweight SVG bar chart displaying task completion trends for the last 7 days.
* **Category Progress Analytics**: Sleek progress bars tracking active/completed ratio counts for each category.

### 2. 📋 Tasks List
* **Full CRUD Operations**: Create tasks with categories, priorities, notes, and due dates. Edit inline, double-click to modify, and delete with ease.
* **Subtasks Checklist**: Add nested checkable subtasks with a visual progress bar indicating completion ratio.
* **Auto-Save & Filters**: Automatic state sync to `localStorage`. Filter tasks between All, Active, and Completed, and sort by due dates or priority.

### 3. 🎯 Priority Matrix (Eisenhower 2x2 Grid)
* **Visual Reorganization**: Active tasks are categorized into four quadrants:
  * **Q1: Urgent & Important** (Do First)
  * **Q2: Not Urgent & Important** (Schedule)
  * **Q3: Urgent & Not Important** (Delegate)
  * **Q4: Not Urgent & Not Important** (Eliminate)
* **Drag-and-Drop Sorting**: Visually drag tasks between quadrants to instantly update their priority and urgency. Quadrants highlight with a glowing border on drag-over.
* **Actionable Task Rows**: Complete or delete tasks directly inside the Matrix.

### 4. 📅 Calendar History View
* **Monthly Grid View**: Navigate across months to inspect past productivity logs.
* **Neon Completion Dots**: Displays colored activity indicators on calendar dates where tasks were checked off.
* **Daily Task Inspector**: Clicking any calendar date reveals a list of all tasks completed on that specific day with category and priority badges.

### 5. ⚙️ Settings & Customization
* **Preset Themes**: Instantly switch between four custom curated styles: **Lime**, **Cyberpunk**, **Coral**, and **Ocean**.
* **HSL Color Hue Slider**: Drag a range slider (0° to 360°) to set any custom accent color across the interface.
* **Custom Username**: Set your profile name for personalized greeting headers.
* **Data Backup & Restore**: Export your tasks, categories, and calendar completion history as a JSON backup file or import existing backups.

### 🔊 Interactive Audio & Visuals
* **Synthesized Audio Chimes**: Uses the **Web Audio API** to generate a custom double-tone victory sound chime whenever a task is completed.
* **Confetti Celebration**: Spawns colorful canvas-confetti explosions on completing all tasks.

---

## 🛠️ Technology Stack

* **Markup**: Semantic HTML5 structures designed for accessibility and SEO.
* **Styling**: Vanilla CSS3 custom variables (for dynamic color themes), Flexbox/Grid layouts, and Google Fonts typography (Syne and DM Sans).
* **Behavior**: Pure Vanilla JavaScript (ES6+) with a custom client-side router, state persistence, and native HTML5 Drag-and-Drop bindings.
* **Libraries**: `canvas-confetti` (for celebrations).

---

## 🚀 How to Run Locally

Since this app is built purely on client-side web technologies, there are no build steps or installations required!

1. Clone or download the repository:
   ```bash
   git clone https://github.com/praveen542spk-ship-it/To-Do.git
   ```
2. Open `index.html` directly in any web browser.
3. *Alternative (Recommended)*: Use a local development server like **Live Server** in VS Code or run `npx http-server` for static hosting.

---

## 📂 Project Structure

* `index.html` - SPA structure, layouts, and page entry point.
* `app.js` - State logic, event delegation, Eisenhower Drag-and-Drop, Calendar calculations, Web Audio chime synthesis, and LocalStorage sync.
* `style.css` - Custom styling variables, responsive grids, themes, and glow animations.
