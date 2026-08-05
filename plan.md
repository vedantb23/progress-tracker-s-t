# Execution Plan

## Phase 1: Database & Backend Core (Hours 1-4)
1. Initialize a Node/Express project.
2. Connect to MongoDB using Mongoose.
3. Create Mongoose schemas based on the README.
4. Build RESTful endpoints:
    *   `GET /api/projects` - List all projects.
    *   `GET /api/projects/:id/dashboard` - Fetch aggregated stats, weightages, and chart data for a specific project.
    *   `GET /api/projects/:id/items?category=xyz` - Fetch items for the tabular view.
    *   `PUT /api/items/:id` - Update `executedQuantity` of a specific item.
5. Seed the database with sample data reflecting the Taldih Siding S&T Works (Indoor, Outdoor, Cables, Telecom).
*Wait for user testing via Postman/cURL before proceeding.*

## Phase 2: Frontend Scaffold & Project Hub (Hours 4-8)
1. Initialize React via Vite with Tailwind CSS.
2. Set up React Router for navigation (`/` for Hub, `/project/:id` for Dashboard).
3. Build the generic Layout wrapper (Navbar with Railway/Project logo, Light theme styling, slate-50 background).
4. Build the Home Page: Grid of project cards showing Project Name, Location, and a simple progress bar. Clicking a card navigates to `/project/:id`.
*Wait for user UI review.*

## Phase 3: Analytics Dashboard (Hours 8-16)
1. Install `recharts`.
2. Build the Dashboard view for a specific project.
3. Implement a "Refresh Data" button at the top right (triggers refetch of API).
4. Build the top row: 4 gauge charts or simple stat cards showing overall % for Indoor, Outdoor, Cables, Telecom.
5. Build the middle row: A Pie chart for Weightage Distribution.
6. Build the bottom rows: Responsive Bar Charts for each category. X-axis: Item Description. Y-axis: Quantity. Two bars per item: Scope (Orange) and Executed (Blue).
*Wait for user chart review.*

## Phase 4: Editable Tabular Interface (Hours 16-24)
1. Create a tabbed navigation under the Dashboard (Tabs: Overview, Indoor, Outdoor, Cables, Telecom).
2. Build the Data Table component mimicking Excel columns:
    `S.No | Description | UOM | Scope Qty | Executed Qty (Editable) | Balance | % Progress | Weightage | Earned %`
3. Make the `Executed Qty` cell an input field. On blur or enter, it should calculate the new values instantly on the frontend, highlight the row briefly, and dispatch a `PUT` request to the backend.
4. Implement the **Pace-Flagging** innovation: Add a visual red dot or subtle red row background if the item's % Progress is severely lagging behind the project timeline.
*Wait for final user testing.*