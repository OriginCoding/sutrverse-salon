# SutrVerse Salon Management System

A full-stack salon booking and management system built using Next.js, Prisma, and PostgreSQL.

---

## 🚀 Features

### 👤 Customer (Public)

* Select stylist and date
* View real-time available slots
* Book appointment (no login required)
* Prevents double booking

### 💇 Staff (Walk-in)

* Add walk-in customers instantly
* Automatically assigns next available slot

### 📊 Admin Dashboard (Demo)

* View today's bookings
* Estimated revenue
* Stylist utilization
* Appointment list

---

## 🧠 Tech Stack

* Next.js 15 (App Router)
* TypeScript
* Prisma ORM
* PostgreSQL (Neon)
* Tailwind CSS

---

## ⚙️ Key Design Decisions

* **UTC Time Storage:** Stored in UTC, displayed in local timezone (IST)
* **Slot Generation:** 30-minute intervals (9 AM – 10 PM)
* **Double Booking Prevention:** Unique constraint on (stylistId, startsAt)
* **MVP Scope:** No authentication, simplified pricing

---

## 📌 Notes for Reviewers

* Use **Book Appointment** to create bookings
* Use **Walk-in (Staff Only)** to simulate manual entries
* Use **Admin Dashboard (Demo)** to view data

---

## 🏁 Goal

Focus on clean architecture, system design, and real-world trade-offs instead of overengineering.
