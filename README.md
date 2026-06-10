# İSTE Bell Curve Calculator | İSTE Çan Sistemi Hesaplayıcı

A modern, premium university-grade web application built specifically for **İskenderun Technical University (İSTE)** students to calculate their weighted averages, estimate letter grades, and simulate the official relative grading (bell curve) system.

![İSTE Curve App](calculator.png)

## 🚀 Features

- **Dual-Pane Tabbed Interface:** Switch instantly between the standard Average Calculator and the Bell Curve Simulator.
- **İSTE Official Regulations Enforced:** Automatically accounts for the FF rule (if average < 30 or final score < 30, it assigns an FF).
- **Bell Curve Visualization:** Beautiful, interactive normal distribution charts built with `Chart.js` to pinpoint exactly where you stand among your peers.
- **PDF Export Engine:** Download your Bell Curve analysis directly to a PDF document using `html2pdf.js`.
- **Progressive Web App (PWA):** Installable on mobile and desktop devices for offline access and native-app feel.
- **Bilingual Support:** Instantly toggle between Turkish (Default) and English.
- **Tech/AI Identity:** Cyber-themed UI with glassmorphism, responsive grid layouts, and an interactive, mouse-tracking neural-network particle background.
- **Theme Toggling:** Seamless switching between Dark Mode and Light Mode.

## 🧮 Calculations

### 1. Weighted Average
- **Midterm:** 40%
- **Final:** 60%
- *(Optional) Assignments can be included in custom weights if provided.*

### 2. Bell Curve (Relative Grading)
- **Z-Score:** `(Student Score - Class Average) / Standard Deviation`
- **T-Score:** `60 + (10 × Z)`

## 💻 Tech Stack
- **Frontend:** Semantic HTML5, CSS3 Variables (Custom Properties), Vanilla JavaScript.
- **Libraries:**
  - `Chart.js` (Interactive Data Visualization)
  - `html2pdf.js` (Client-side PDF Generation)
- **Architecture:** Local Storage for persistent data, Service Workers for PWA capabilities, Native `<canvas>` API for background animations.

## 👨‍💻 About the Developer

**Adem Can Demirci**
*Computer Engineering Student*

Passionate about exploring modern technology and building intelligent systems.
- **Interests:** Artificial Intelligence, Data Science, Software Engineering, Cyber Security.

🌍 [LinkedIn Profile](https://www.linkedin.com/in/adem-can-demircii/)

---
*© 2026 Adem Can Demirci. All Rights Reserved.*
