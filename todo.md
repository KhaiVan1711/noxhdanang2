# NOXH Đà Nẵng GIS - Project TODO

## Database & Backend
- [x] Finalize database schema with all required tables (projects, investors, wards, amenities, pricing, images)
- [x] Create seed script with realistic Da Nang NOXH project data
- [x] Implement backend procedures: list, filter, getById, KPI calculations, CRUD operations
- [x] Add admin-only procedures for project/investor/ward management
- [ ] Write vitest tests for critical backend functions

## Frontend - Core Features
- [x] Set up Vietnamese UI text and constants
- [x] Create GIS Map component with Leaflet, marker clustering, and color-coded pins
- [x] Build Project List sidebar with search and filters
- [x] Implement Project Card component with key information display
- [x] Create Dashboard KPI component showing total projects, units, status breakdown
- [x] Build Project Detail modal/drawer with full information view

## Frontend - Project Details
- [x] Implement image gallery in detail view
- [x] Display pricing tiers table
- [x] Show nearby amenities list
- [x] Display investor contact information
- [x] Show construction progress bar and completion date

## Frontend - Admin Panel
- [x] Create admin-only route protection
- [x] Build admin dashboard layout
- [x] Implement CRUD UI for projects management
- [x] Implement CRUD UI for investors management
- [x] Implement CRUD UI for wards management
- [ ] Add image upload and management for projects
- [ ] Add amenities and pricing tier management

## Frontend - Mobile & UX
- [ ] Implement responsive mobile layout
- [ ] Add toggle between list and map view on mobile
- [ ] Ensure touch-friendly interactions
- [ ] Test on various screen sizes
- [ ] Add loading states and error handling throughout

## Design & Polish
- [ ] Choose and implement color scheme (professional, civic-appropriate)
- [ ] Set up typography and spacing system
- [ ] Add animations and transitions (Framer Motion)
- [ ] Ensure Vietnamese text displays correctly
- [ ] Add empty states and no-results messaging
- [ ] Polish hover and focus states

## Testing & Deployment
- [ ] Test map interactions and marker clustering
- [ ] Test filtering and search functionality
- [ ] Test admin CRUD operations
- [ ] Test mobile responsiveness
- [ ] Verify Vietnamese text rendering
- [ ] Test authentication and admin access control
- [ ] Create final checkpoint and prepare for deployment
