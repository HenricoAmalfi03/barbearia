# Barbershop Management System - Design Guidelines

## Design Approach
**Reference-Based + Luxury Service Industry Standards**
Drawing inspiration from premium service platforms (high-end hospitality, luxury retail) combined with clean dashboard patterns from Linear and Notion for admin/barber interfaces.

## Color Palette (User Specified)
- **Primary Scheme**: Black and Gold
- **Dark Style**: Black backgrounds with gold accent buttons
- **Hierarchy**: Use gold strategically for CTAs, active states, and premium elements

## Typography System
**Font Stack**: 
- Headings: 'Playfair Display' or 'Cinzel' (serif, luxury feel) via Google Fonts
- Body: 'Inter' or 'Outfit' (clean, modern sans-serif)

**Scale**:
- Hero/H1: text-5xl md:text-6xl font-bold
- Section Headers: text-3xl md:text-4xl font-semibold  
- Subsections: text-2xl font-medium
- Body: text-base md:text-lg
- Small/Meta: text-sm

## Spacing System
**Tailwind Units**: Consistently use 4, 6, 8, 12, 16, 20 for spacing
- Component padding: p-6 to p-8
- Section spacing: py-16 md:py-20
- Card gaps: gap-6 to gap-8
- Container max-width: max-w-7xl

## Layout Structure

### Homepage
- **Hero Section**: Full-width (80vh) with customizable barbershop logo centered, elegant title typography, subtle texture or barbershop imagery background
- **Navigation Buttons Grid**: 2x2 grid on mobile (grid-cols-2), 4 columns on desktop (md:grid-cols-4), large touch-friendly buttons with icons, gold borders/accents
- **Footer**: Single row with customizable address, contact info, centered layout

### Booking Page (/agendar)
- **Multi-Step Form Flow**: 
  - Step 1: Contact info (Nome, WhatsApp) - single column, generous spacing
  - Step 2: Barber selection - Card grid (grid-cols-2 md:grid-cols-3) with profile photos
  - Step 3: Service selection - List with checkboxes, prices aligned right
  - Step 4: Date/time picker - Calendar interface + time slot buttons
  - Step 5: Confirmation - Summary card with all details
- **Progress Indicator**: Top of form, gold accent for active step
- **Form Inputs**: Large, accessible fields (h-12), clear labels above inputs

### Barber Dashboard (/barbeiro)
- **Two-Column Desktop Layout**: 
  - Left sidebar (w-64): Navigation menu, profile photo, logout
  - Right content area: Dashboard cards
- **Appointments List**: 
  - Table layout on desktop, cards on mobile
  - Each row: Client name, WhatsApp, service, time
  - Action buttons inline: Icon buttons for Compareceu (check), Não compareceu (X), Enviar mensagem (WhatsApp icon), Cancelar (trash)
- **Profile Config**: Center card (max-w-2xl), photo upload with preview, name input field

### Admin Dashboard (/admin)
- **Dashboard Grid**: Cards grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- **Each Section as Card**: Elevated cards (shadow-lg), icon + title header, action buttons below
- **Reports Table**: Full-width table, responsive scroll on mobile, export PDF button prominent (gold)
- **Forms (Add Barber, Services, Config)**: Modal overlays or dedicated pages, single column max-w-xl, clear field grouping

## Component Library

### Buttons
- **Primary (Gold)**: Solid gold background, black text, rounded-lg, px-6 py-3, hover lift effect
- **Secondary**: Gold border, transparent bg, gold text, same padding
- **Icon Buttons**: Circular or square (w-10 h-10), minimal padding, subtle hover

### Cards
- **Base**: Rounded-xl, subtle border, p-6, dark background with lighter border
- **Elevated**: shadow-xl for modals and important cards
- **Barber Profile Cards**: Aspect ratio 3:4 for photo, name below, hover scale effect

### Forms
- **Input Fields**: h-12, rounded-lg, dark bg with lighter border, focus:gold ring
- **Labels**: text-sm font-medium, mb-2, above inputs
- **Validation**: Error states with red accent, success with gold check

### Navigation
- **Main Nav (Homepage)**: Large button grid as specified
- **Dashboard Nav**: Vertical sidebar with icons + text, gold accent for active
- **Breadcrumbs**: When needed, text-sm with separators

### Data Display
- **Appointments Table**: Alternating row subtle background, clear column headers, responsive design
- **Calendar**: Grid-based, gold highlight for selected dates, disabled dates in subdued style
- **Time Slots**: Button grid, available slots in gold outline, booked slots disabled

### Modals/Overlays
- **Background**: Semi-transparent dark overlay (bg-black/80)
- **Content**: Centered card (max-w-2xl), close button top-right
- **Animations**: Fade in/scale up entrance

## Images

### Hero Section (Homepage)
- **Description**: Elegant barbershop interior or close-up of barber tools (scissors, razors) with artistic composition, professional photography, moody lighting
- **Placement**: Background of hero section (80vh), dark overlay to ensure text readability
- **Treatment**: Subtle vignette effect, slightly desaturated to maintain black/gold theme

### Barber Profile Photos
- **Description**: Professional headshots of barbers, well-lit, friendly expressions
- **Placement**: Barber selection cards in booking flow and dashboard
- **Size**: Aspect ratio 1:1 (square) or 3:4 (portrait), min 300x300px
- **Treatment**: Rounded corners (rounded-lg)

### Barbershop Logo
- **Description**: Customizable logo uploaded by admin
- **Placement**: Top center of homepage, navbar on other pages
- **Size**: Max height 120px on homepage, 60px in navbar
- **Treatment**: Maintain aspect ratio, gold accent if needed

## Responsive Behavior
- **Mobile-First**: Single column layouts, stacked navigation
- **Breakpoints**: 
  - Mobile: Default (< 768px)
  - Tablet: md: (768px+) - 2 columns where appropriate
  - Desktop: lg: (1024px+) - Full multi-column layouts, sidebars
- **Touch Targets**: Minimum 44px height for all interactive elements

## Accessibility
- **Form Labels**: Always visible, properly associated with inputs
- **Contrast**: Ensure gold on black meets WCAG AA standards
- **Focus States**: Clear gold ring on all interactive elements
- **Screen Reader**: Proper semantic HTML, aria-labels where needed

## PWA Elements
- **Install Prompt**: Subtle banner or button, gold accent
- **Loading States**: Skeleton screens in dark theme during data fetch
- **Offline Indicators**: Clear messaging when offline features limited