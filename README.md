# 🎓 KFUEIT CGPA & SGPA Calculator

![KFUEIT CGPA Calculator Demo](preview-image.png)

A visually stunning, fully responsive SGPA & CGPA Calculator built specifically for students of **Khwaja Fareed University of Engineering & Information Technology (KFUEIT)**. This project features a futuristic "Hyper-Neon" glassmorphism aesthetic, interactive particle constellations, and an **AI-powered Transcript Scanner** to make grade calculation instant and effortless.

## ✨ Key Features

### 📄 Smart AI Transcript & PDF Scanner
- **PDF Upload Support**: Directly upload official KFUEIT semester result gazettes, portal transcripts, and CMS PDF downloads.
- **Dual-Engine Extraction**:
  - **Ultra-Fast PDF Text Layer**: Instant digital text parsing for 100% precision.
  - **AI OCR Fallback**: Built-in OCR for scanned paper documents and photocopies.
- **Photo Upload & Camera Capture**: Upload any transcript photo, camera snapshot, or portal screenshot.
- **Clipboard Paste Support**: Directly paste screenshots with `Ctrl + V` anywhere on the page.
- **Smart Data Extraction**: Automatically detects:
  - **Previous Total CGPA**
  - **Total Completed Credit Hours**
  - **Semester SGPA**
  - **Student Name**
  - **Individual Courses** (Marks, Grades, Credit Hours, and GP)
- **Flexible Workflows**:
  - **Option 1 (Previous Sem Mode)**: Import Previous CGPA & Credits with one click, then enter new/upcoming semester courses to compute updated CGPA and SGPA.
  - **Option 2 (Full Auto-fill)**: Automatically populate all scanned subjects into the calculator and calculate instantly!
- **⚡ Try Demo Test**: Test both **Demo PDF** and **Demo Photo** instantly with a single click using official KFUEIT sample records.

### 🎯 Target CGPA Planner ("What-If" Simulator)
- Input your **Desired Target CGPA** (e.g. `3.50`).
- Automatically computes the exact minimum **Semester SGPA** required across your upcoming credit hours.
- Evaluates feasibility: Shows whether the goal is achievable, suggests recommended grade targets (e.g., "Mix of A and B+"), or calculates how many future semesters at 4.00 are required.

### 🔁 Course Repeat / Grade Improvement Mode (KFUEIT Policy)
- Toggle any course as **Repeat** with a single click.
- Select the previously earned grade (e.g., `Prev: F (0.0)` or `Prev: D (1.0)`).
- Automatically replaces old grade points with new grade points in cumulative CGPA calculation without duplicating completed credit hours.

### 📥 Official Result Card Export (HD Image)
- Export your semester calculation as a high-definition branded KFUEIT provisional result card.
- Includes Student Name, SGPA & CGPA badges, complete course breakdown, academic standing, and date stamp.

### 📲 Progressive Web App (PWA) & 100% Offline Support
- **Installable Mobile & Desktop App**: Install with a single tap on Android, Windows, Mac, or iOS (Add to Home Screen).
- **Runs 100% Offline**: Integrated Service Worker (`sw.js`) caches all assets, fonts, icons, and calculation logic so students can calculate SGPA, CGPA, target plans, and generate result cards anytime, anywhere without an active internet connection.
- **Offline Mode Indicator**: Real-time status banner notifying when you are working offline.
- **App-like Experience**: Full-screen standalone mode with custom high-resolution icons (192x192, 512x512, maskable) and safe-area adjustments for modern notched smartphones.

### 📱 Senior-Grade Native Mobile Experience
- **Floating Glass Bottom Action Dock**: Native mobile navigation bar with frosted glass blur (`backdrop-filter: blur(30px)`), quick tabs (Add, Scan, Calc, Target, Scale), and an elevated pulsing hero center trigger.
- **Live GPA Mini Scorecard Pill**: Floating dynamic mini widget above the dock showing real-time SGPA and CGPA with smooth scroll-to-result tap interaction.
- **Native iOS/Android Bottom Sheets**: All modals (Target Simulator, Scale, Converter, and Scanner Review) transform into native bottom sheets with tactile grabber pills and spring slide-up animations.
- **Tactile Subject Glass Cards**: Grid transformed into neat mobile cards with automated `Course #` chip counters, touch-optimized inputs, and circular frosted delete triggers.
- **Native Haptic Vibration Feedback Engine**: Physical tactile haptic vibration (`navigator.vibrate`) on adding subjects, toggling repeats, deleting courses, and calculating results.
- **Automatic Numeric Keypad Mapping**: `inputmode="decimal"` and `inputmode="numeric"` configured across marks, credits, and CGPA inputs so smartphones open directly into the decimal numeric keypad without manual switching.

### 💡 Smart Input System
- Enter Marks (0-100) to auto-generate Grade and GPA.
- Enter Grade (e.g., A+, B) to auto-fetch the GPA.

### 🎨 Immersive UI/UX
- "Electric Aurora" Theme: Deep gradient backgrounds with neon accents.
- Glassmorphism: Frosted glass cards and containers.
- Interactive Background: Particle constellation effect that reacts to mouse movement.
- Celebration Mode: Confetti explosion for outstanding results (GPA ≥ 3.5).
- Animated Results: Count-up numbers and dynamic progress rings.
- Fully Responsive: Optimized for all devices with card transformation on mobile.

### 🛠️ Utility Tools
- **Grading Scale Modal**: View the complete marks-to-grade mapping.
- **Quick Converter**: Convert specific grades to marks (and vice-versa).

🛠️ Tech Stack

HTML5: Semantic structure.

CSS3: Advanced animations, Flexbox/Grid, CSS Variables, and Media Queries.

JavaScript (ES6+): Logic for calculation, DOM manipulation, Canvas API for particles, and event handling.

🚀 How to Run

Clone this repository or download the source code.

Simply open the index.html file in any modern web browser (Chrome, Edge, Firefox, Safari).

No installation or server required!

📸 Usage

Enter your Name (optional).

(Optional) Enter Previous CGPA and Credits if you want to calculate your cumulative GPA.

Add subjects using the + Subject button.

Input your Marks OR Grade and the Credit Hours for each subject.

Click Calculate to see your result with animations.

🎨 Customization

The project uses CSS variables for easy theming. You can modify the :root section in the <style> tag to change the color palette:

:root {
    --primary-color: #f72585;
    --accent-cyan: #4cc9f0;
    /* ... */
}


📄 License

This project is open-source and available for personal and educational use.

Designed & Developed by Ahmad Khan
