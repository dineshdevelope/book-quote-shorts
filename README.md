# 📚 Book Quote Shorts  

A small full-stack MERN application that displays short quotes or snippets from books, built as part of the **Notion Press interview task**.  
The app is inspired by the concept of **reels/shorts** but tailored for book lovers — enabling smooth navigation through quotes with transitions.  

---

## 🚀 Features  

### Core Features  
- 📖 Display short quotes/snippets from books  
- ✍️ Show **quote text**, **author name**, and **book title**  
- ⏭ Navigate through quotes by **clicking/tapping** or auto-play  
- 🎞 Smooth transitions (**slide/fade**) between quotes  

### Bonus Features  
- ❤️ Simple **“Like” button** for interaction  
- 📤 Basic **share mock-up**  
- 📱 **Responsive layout** with Tailwind CSS  
- 🧹 Clean and structured MERN code, scalable for future improvements  

---

## 🛠️ Tech Stack  

- **Frontend:** React.js, Tailwind CSS  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose)  
- **State Management:** React Hooks  
- **Animations/Transitions:** CSS transitions / Framer Motion (if used)  
- **Deployment:** Vercel (Frontend) + Vercel (Backend) + MongoDB Atlas  

---

## 📂 Folder Structure  

```bash
book-quote-shorts/
│── backend/              # Express.js + MongoDB API
│   ├── models/           # Mongoose models (Quote schema)
│   ├── routes/           # API routes
│   ├── controllers/      # Business logic
│   └── server.js         # App entry point
│
│── frontend/             # React + Tailwind client
│   ├── src/  
│   │   ├── components/   # Reusable UI components  
│   │   ├── pages/        # Page-level components  
│   │   ├── data/         # Quotes data (if static or fetched)  
│   │   ├── App.js        # Main app logic  
│   │   └── index.js      # Entry point  
│   └── public/           # Static assets  
│
│── package.json          # Project metadata and scripts  
│── README.md             # Project documentation  
