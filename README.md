# Al-baraa Hegaz — AI & Data Science Portfolio

> Personal portfolio website showcasing Data Science, Machine Learning, and AI Engineering projects and expertise.

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Site-gold?style=flat-square)](https://portfolio-beta-blush-pyomicf81o.vercel.app/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](#)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](#)
[![Resend](https://img.shields.io/badge/Resend-000000?style=flat-square&logo=resend&logoColor=white)](#)

**Live URL**: [portfolio-beta-blush-pyomicf81o.vercel.app](https://portfolio-beta-blush-pyomicf81o.vercel.app/)  
**Repository**: [github.com/albaraahegaz/Portfolio](https://github.com/albaraahegaz/Portfolio)

---

## Features

- **Responsive Multi-Section Layout**: Hero, Skills, Projects, Experience, Services, Career Objective, and Contact.
- **Theme Switcher**: Smooth Dark / Light mode toggle with persistent preferences stored in `localStorage`.
- **Interactive UI Effects**: Custom magnetic cursor, 3D card tilt effects, particle canvas, animated metric counters, and filterable project grid.
- **Serverless Contact Form**: Real-time message dispatch powered by Vercel Functions and Resend API.
- **Spam & Input Protection**: Hidden honeypot field (`website`), email pattern validation, character limits, and visual error/success feedback.

---

## Tech Stack

- **Frontend**: Semantic HTML5, Vanilla CSS3 (Custom Properties, Glassmorphism, Flexbox/Grid), Vanilla ES6+ JavaScript
- **Backend / Serverless**: Vercel Serverless Function (Node.js)
- **Email Service**: Resend API
- **Deployment**: Vercel

---

## Project Structure

```
Portfolio/
├── api/
│   └── contact.js       # Vercel serverless function (Resend email handler)
├── assets/              # Static images, media, and documents
├── css/
│   └── style.css        # Design system, themes, and responsive styles
├── js/
│   └── script.js        # Interactive UI logic, theme handling, and form submission
├── .gitignore
├── index.html           # Main portfolio single-page application
└── README.md
```

---

## Contact Form Workflow

1. **Submission Flow**: 
   `Form (index.html)` &rarr; `fetch POST (js/script.js)` &rarr; `/api/contact (api/contact.js)` &rarr; `Resend API`
2. **Spam & Validation**:
   - Hidden off-screen honeypot input (`website`) catches automated bots without disrupting users.
   - Server validates required fields, email format, and message payload length.
3. **Environment Variables**:
   Required in your Vercel project dashboard or `.env`:
   - `RESEND_API_KEY`: API key from [Resend](https://resend.com).
   - `CONTACT_TO_EMAIL`: Destination email address receiving form inquiries.

---

## Run Locally

Static pages can be served using any local HTTP server:

```bash
# Using Python
python -m http.server 3000

# Using Node.js
npx serve .
```

> **Note**: To test serverless API routes locally (`/api/contact`), run via the [Vercel CLI](https://vercel.com/docs/cli):
> ```bash
> vercel dev
> ```

---

## Deployment

Continuous deployment is linked with Vercel:
1. Push updates to the `main` branch on GitHub:
   ```bash
   git push origin main
   ```
2. Vercel automatically deploys the updated static assets and serverless functions.
3. Ensure `RESEND_API_KEY` and `CONTACT_TO_EMAIL` are configured in **Vercel Settings > Environment Variables**.

---

<!--
## Screenshots
![Portfolio Desktop Screenshot](./assets/screenshot-desktop.png)
![Portfolio Mobile Screenshot](./assets/screenshot-mobile.png)
-->

## Contact

- **LinkedIn**: [linkedin.com/in/al-baraa-hegaz-b6643a388/](https://www.linkedin.com/in/al-baraa-hegaz-b6643a388/)
- **Email**: [albaraahegaz@gmail.com](mailto:albaraahegaz@gmail.com)
- **GitHub**: [github.com/albaraahegaz](https://github.com/albaraahegaz/)
