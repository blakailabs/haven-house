# Haven House Platform

A comprehensive facility management platform for Haven House, designed to streamline resident directory management, bed tracking, staff checklists, and compliance.

## 🚀 Infrastructure
- **Frontend:** Next.js 15 (App Router)
- **Styling:** Vanilla CSS + Tailwind
- **Backend:** Firebase (Auth, Firestore, Storage)
- **Deployment:** Netlify
- **CI/CD:** GitHub Actions / Netlify Webhooks

## 🛠️ Setup
1. Clone the repository: `git clone https://github.com/blakailabs/haven-house`
2. Install dependencies: `npm install`
3. Configure environment variables in `.env`:
   - Copy `.env.example` to `.env`
   - Fill in your Firebase credentials
4. Run locally: `npm run dev`

## 📊 Key Features
- **Admin Dashboard:** Real-time stats on occupancy and tasks.
- **Bed Management:** Visual tracking of bed status (Occupied, Available, Maintenance).
- **Resident Directory:** Centralized resident profiles and compliance status.
- **House Manager Checklists:** Digitized daily/weekly compliance tasks.
- **Resident Portal:** Mobile-optimized access for residents to submit forms and check chores.

## 📁 Repository Structure
- `src/app`: Page routes and layouts.
- `src/components`: Reusable UI components.
- `src/context`: React Context for Auth and Global State.
- `src/lib`: Utility functions and Firebase configuration.
- `data/`: Mock data for development and testing.

## 📝 Deployment
Deploys automatically to Netlify on every push to the `master` branch.
URL: [https://haven-house.netlify.app](https://haven-house.netlify.app)
