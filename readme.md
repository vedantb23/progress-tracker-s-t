# 🛰️ Railway S&T Progress Tracker

A modern full-stack web application designed to replace static spreadsheet reporting for **Railway Signal & Telecommunication (S&T)** infrastructure projects. It features real-time analytics, Excel-like inline editable tables, category weightage distributions, dynamic pace-flagging algorithms, and instant MongoDB synchronization.

---

## 🌐 Live Application Deployment

- **Backend API (Render)**: [https://progress-tracker-s-t.onrender.com](https://progress-tracker-s-t.onrender.com)
---

## ✨ Features & Capabilities

- **📋 Project Hub (`/`)**:
  - Overview of active railway S&T projects with high-level completion gauges, schedule progress indicators, and total lagging item counts.
  - **"+ Create New Project"** modal for quickly onboarding new railway lines with automated category setup.

- **📊 Live Analytics Dashboard (`/project/:id`)**:
  - **Category Gauges**: Dynamic status cards tracking completion percentages across **Indoor Work**, **Outdoor Work**, **Cables**, and **Telecom**.
  - **Weightage Distribution Pie Chart**: Visual breakdown of category weights (Indoor 40%, Outdoor 30%, Cables 20%, Telecom 10%).
  - **Scope vs. Executed Bar Charts**: Item-by-item comparison of total target scope against real-time executed progress.
  - **Hard Refresh DB**: Manual data sync button to pull real-time database state.

- **📑 Editable Data Table (Excel-mimicking)**:
  - Tabbed category navigation (Indoor, Outdoor, Cables, Telecom).
  - **Inline Executed Qty Input**: Edit execution values directly within table cells with instant recalculations and auto-saving to MongoDB.
  - **Search & Filter**: Search items by description and filter by **"Lagging Only"**.
  - **"+ Add Item" Modal**: Add custom items to any category directly from the interface.

- **🚨 Pace-Flagging Innovation**:
  - Automatically compares timeline schedule pace ($(\text{Days Elapsed} / \text{Total Days}) \times 100$) against item execution $\%$.
  - Flagged as **Lagging (>15%)** with row highlighting and amber alert badges whenever execution lags behind schedule by more than 15%.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18 (Vite), Tailwind CSS, Recharts, Lucide Icons, React Router DOM v6, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose ORM |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 🧮 Calculation Engine & Formulas

1. **Balance Quantity**:
   $$\text{Balance} = \max(0, \text{Scope Quantity} - \text{Executed Quantity})$$

2. **Item Progress (%)**:
   $$\text{Item Progress \%} = \left(\frac{\text{Executed Quantity}}{\text{Scope Quantity}}\right) \times 100$$

3. **Category Completion (%)**:
   $$\text{Category Progress \%} = \left(\frac{\text{Total Executed Qty in Category}}{\text{Total Scope Qty in Category}}\right) \times 100$$

4. **Overall Project Progress (%)**:
   $$\text{Overall Project Progress \%} = \sum_{\text{categories}} \left( \text{Category Progress \%} \times \frac{\text{Category Overall Weightage}}{100} \right)$$
   *(Strictly bounded between 0% and 100%)*

5. **Schedule Pace & Lagging Flag**:
   $$\text{Timeline Pace \%} = \left(\frac{\text{Days Elapsed}}{\text{Total Planned Days}}\right) \times 100$$
   $$\text{Is Lagging} = (\text{Timeline Pace \%} - \text{Item Progress \%}) > 15\%$$

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/projects` | Fetch all projects with progress summaries & lagging counts |
| `POST` | `/api/projects` | Create a new project (title, location, timeline) |
| `GET` | `/api/projects/:id/dashboard` | Aggregated project stats, category completion & chart data |
| `GET` | `/api/projects/:id/items?category=...` | Fetch items for project (optional category filter) |
| `POST` | `/api/projects/:id/items` | Add a new item to a specific category |
| `PUT` | `/api/items/:id` | Update item `executedQuantity` with real-time recalculation |
| `GET` | `/api/health` | Service health check & MongoDB connection status |

---

## 💻 Local Development Setup

### 1. Clone Repository & Install Dependencies
```bash
git clone <your-repo-url>
cd progress-tracker-s&t

# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 2. Environment Variables Setup
Create `.env` in `server/`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/st_progress_tracker?retryWrites=true&w=slate
```

### 3. Seed Database (Optional)
Populate 70+ authentic S&T work items from the spreadsheet:
```bash
cd server
npm run seed
```

### 4. Run Development Servers
**Terminal 1 (Backend API - Port 5000):**
```bash
cd server
npm start
```

**Terminal 2 (Frontend Client - Port 5173):**
```bash
cd client
node "node_modules/vite/bin/vite.js" --port 5173
```

Visit `http://localhost:5173/` in your browser.

---

## 📄 License
Licensed under the [MIT License](LICENSE).