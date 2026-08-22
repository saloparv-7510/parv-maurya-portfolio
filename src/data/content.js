/* ============================================================================
 *  content.js  —  SINGLE SOURCE OF TRUTH
 *  ---------------------------------------------------------------------------
 *  ⭐ THIS IS THE ONLY FILE YOU NEED TO EDIT to update the portfolio.
 *  Every section below maps 1:1 to a component in /src/components.
 *
 *  QUICK CUSTOMISATION CHECKLIST
 *   1. `profile.photo`   → drop your photo in /public/images and point here
 *   2. `socials`         → replace the placeholder "#" URLs with real links
 *   3. `projects[].links`→ add your GitHub repo + live demo URLs
 *   4. `projects[].image`→ add a screenshot to /public/images (optional —
 *                          an animated mockup is shown when it's empty)
 * ========================================================================== */

/* ---------------------------------------------------------------- PROFILE -- */
export const profile = {
  name: 'Parv Maurya',
  firstName: 'Parv',
  initials: 'PM',
  title: 'Computer Science Student | Java & Web Developer | Networking Enthusiast',
  tagline: 'Building digital experiences with code, creativity and technology.',
  location: 'Chiragaon, Varanasi, Uttar Pradesh, India',
  email: 'parvmaurya552@gmail.com',
  available: true, // toggles the "Open to opportunities" pill in the hero

  // ⭐ PROFILE PHOTO — put e.g. profile.jpg in /public/images and set:
  //    photo: '/images/profile.jpg'
  //    Leave as null to show the animated monogram avatar instead.
  photo: null,

  // Roles cycled by the typing animation in the hero
  roles: ['Java Developer', 'Web Developer', 'Android Developer', 'Networking Enthusiast'],

  // ⭐ RESUME — put your PDF in /public and set e.g. '/Parv-Maurya-Resume.pdf'
  resume: null,
}

/* ---------------------------------------------------------------- SOCIALS -- */
/* ⭐ Replace every '#' with your real profile URL. Set `enabled: false`
   to hide one without deleting it. */
export const socials = [
  {
    id: 'github',
    label: 'GitHub',
    handle: '@saloparv-7510',
    url: 'https://github.com/saloparv-7510',
    enabled: true,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: 'in/parv-maurya-4a34a9273',
    url: 'https://www.linkedin.com/in/parv-maurya-4a34a9273',
    enabled: true,
  },
  {
    id: 'twitter',
    label: 'X / Twitter',
    handle: '@parv_maurya',
    url: 'https://x.com/parv_maurya',
    enabled: true,
  },
  // Not linked yet — flip `enabled` to true once you add a real URL.
  { id: 'instagram', label: 'Instagram', handle: '@parvmaurya', url: '#', enabled: false },
]

/* ------------------------------------------------------------- NAVIGATION -- */
export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

/* ------------------------------------------------------------------ ABOUT -- */
export const about = {
  eyebrow: 'About me',
  heading: 'Curious by default, engineer by practice.',
  paragraphs: [
    'I am a Computer Science student with knowledge of Java, Web Development, Android Development and Computer Networking. I enjoy learning new technologies, building practical projects and turning ideas into things people can actually use.',
    'Most of what I know came from building — FASHION-VISTA, a full-stack e-commerce platform with a customer storefront, an admin console and a delivery-partner portal that I built with a team of four as my final-year major project, a real-time Android chat app, and hands-on networking labs where a wrong subnet mask teaches you more than a chapter ever could.',
    'My goal is to grow professionally, gain real-world experience and contribute to meaningful technology projects alongside people who care about the craft.',
  ],
  // Small stat tiles rendered beside the bio.
  // ⭐ Keep this at exactly 4 items — the grid is 2×2 on mobile, 1×4 on desktop.
  //    Decimal values (e.g. '7.8') animate correctly in the CountUp component.
  stats: [
    { value: '7.8', label: 'CGPA · First Division' },
    { value: '3', label: 'Major & featured projects' },
    { value: '85', label: 'Cisco networking score' },
    { value: '3', label: 'Trainings & internships' },
  ],
  // The three "how I work" cards
  pillars: [
    {
      icon: 'Code2',
      title: 'Build to learn',
      body: 'I pick a concept, then ship something small with it. Firebase Auth made sense once OTP login actually worked on my own device.',
    },
    {
      icon: 'Network',
      title: 'Understand the layer below',
      body: 'Knowing how a packet reaches a server changes how you write the app that sends it. Networking is my favourite lens on software.',
    },
    {
      icon: 'Sparkles',
      title: 'Care about the detail',
      body: 'Clean structure, readable code, and interfaces that feel considered. The last 10% is what people remember.',
    },
  ],
}

/* ------------------------------------------------------- ACADEMIC DETAILS -- */
/* Rendered as the summary strip at the top of the Education section.
   ⭐ Update these three tiles when your result changes. `value` runs through
   the CountUp component, so decimals like '7.8' are fine. */
export const academics = {
  eyebrow: 'Academic details',
  summary:
    'Final-year B.Tech Computer Science student at AKTU Lucknow, graduating in 2026 with a First Division standing. Formal study is where the fundamentals came from — the rest came from building on top of them.',
  highlights: [
    { value: '2026', label: 'B.Tech final year', hint: 'Computer Science · AKTU' },
    { value: '7.8', label: 'Current CGPA', hint: 'Out of 10.0' },
    { value: 'First', label: 'Division', hint: 'First Division standing' },
  ],
}

/* -------------------------------------------------------------- EDUCATION -- */
/* `period` is the year chip, `status` the badge beside it — keep `period` to
   dates only so the two chips don't both say "Completed".
   `current: true` marks the in-progress entry (pulsing dot + spinner).
   `grade` is optional — omit it and no result chip is rendered. */
export const education = [
  {
    degree: 'B.Tech — Computer Science',
    institution: 'Dr. A.P.J. Abdul Kalam Technical University, Lucknow (AKTU)',
    period: '2023 — 2026',
    status: 'Final Year',
    current: true,
    grade: 'CGPA 7.8 · First Division',
    note: 'Core computer science, data structures, databases and computer networks. Final-year major project: FASHION-VISTA, a full-stack e-commerce platform built in a team of four.',
  },
  {
    degree: 'Diploma',
    institution: 'Board of Technical Education, Uttar Pradesh',
    period: '2023',
    status: 'Completed',
    note: 'Foundation in programming, electronics and applied computing.',
  },
  {
    degree: 'Intermediate (12th)',
    institution: 'UP Board',
    period: '2020',
    status: 'Completed',
    note: 'Science stream — physics, chemistry and mathematics.',
  },
  {
    degree: 'High School (10th)',
    institution: 'UP Board',
    period: '2018',
    status: 'Completed',
    note: 'Where the first line of code happened.',
  },
]

/* ------------------------------------------------------------------ SKILLS -- */
/* `level` (0–100) only drives the visual meter — tune it to feel honest. */
export const skillGroups = [
  {
    id: 'language',
    title: 'Programming Language',
    icon: 'Coffee',
    accent: 'accent',
    skills: [{ name: 'Java', level: 85 }],
  },
  {
    id: 'web',
    title: 'Web Technologies',
    icon: 'Globe',
    accent: 'iris',
    skills: [
      { name: 'JavaScript', level: 82 },
      { name: 'HTML5', level: 92 },
      { name: 'CSS3', level: 88 },
      { name: 'Bootstrap', level: 84 },
      { name: 'React.js', level: 78 },
    ],
  },
  {
    id: 'database',
    title: 'Database',
    icon: 'Database',
    accent: 'accent',
    skills: [
      { name: 'MySQL', level: 80 },
      { name: 'SQL', level: 82 },
    ],
  },
  {
    id: 'tools',
    title: 'Development Tools',
    icon: 'Wrench',
    accent: 'iris',
    skills: [
      { name: 'Visual Studio', level: 78 },
      { name: 'VS Code', level: 90 },
      { name: 'XAMPP', level: 76 },
    ],
  },
  {
    id: 'extra',
    title: 'Additional Technology',
    icon: 'Zap',
    accent: 'accent',
    skills: [{ name: 'AJAX', level: 75 }],
  },
  {
    id: 'os',
    title: 'Operating Systems',
    icon: 'MonitorSmartphone',
    accent: 'iris',
    skills: [
      { name: 'Windows', level: 90 },
      { name: 'Linux', level: 72 },
    ],
  },
]

/* ------------------------------------------------------- NETWORKING SKILLS -- */
/* Rendered as an interactive node graph. `group` colours the node. */
export const networkingSkills = [
  { name: 'OSI Model', group: 'model', blurb: 'Seven layers, from physical media up to the application.' },
  { name: 'TCP/IP Model', group: 'model', blurb: 'The four-layer stack the internet actually runs on.' },
  { name: 'IPv4 Addressing', group: 'addressing', blurb: 'Classes, subnetting and mask arithmetic.' },
  { name: 'IPv6 Addressing', group: 'addressing', blurb: '128-bit addressing, notation and abbreviation rules.' },
  { name: 'DHCP', group: 'services', blurb: 'DORA — Discover, Offer, Request, Acknowledge.' },
  { name: 'DNS Basics', group: 'services', blurb: 'Resolution flow, record types and hierarchy.' },
  { name: 'Routing', group: 'infra', blurb: 'How traffic finds a path between separate networks.' },
  { name: 'Switching Fundamentals', group: 'infra', blurb: 'MAC learning, frame forwarding and broadcast domains.' },
  { name: 'Wireless & Mobile Networks', group: 'infra', blurb: 'Access points, SSIDs and mobile connectivity.' },
  { name: 'Network Media', group: 'physical', blurb: 'Copper, fibre and wireless transmission characteristics.' },
  { name: 'Network Topologies', group: 'physical', blurb: 'Star, mesh, bus and hybrid designs.' },
  { name: 'Network Troubleshooting', group: 'ops', blurb: 'ping, ipconfig, tracert and a methodical approach.' },
]

/* --------------------------------------------------------- CERTIFICATIONS -- */
export const certifications = [
  {
    id: 'cisco',
    org: 'Cisco Networking Academy',
    title: 'Networking Basics',
    kind: 'Certification',
    // A score renders the animated progress ring on the card
    score: 85,
    scoreLabel: 'Advanced Level',
    meta: 'Knowledge Check completed',
    period: null,
    location: null,
    topics: [
      'Communication Principles',
      'IPv4 and IPv6 Addressing',
      'Routing Between Networks',
      'Transport Layer',
      'Application Layer',
      'DHCP',
      'Network Testing Utilities',
    ],
    featured: true,
  },
  {
    id: 'techpile',
    org: 'Techpile Technology Pvt. Ltd.',
    title: '2 Months Summer & Winter Training',
    kind: 'Training',
    score: null,
    scoreLabel: null,
    meta: 'Focused on latest IT technologies',
    period: 'July 2022 — September 2022',
    location: 'Lucknow',
    topics: ['Latest IT Technologies'],
    featured: false,
  },
  {
    id: 'ibm',
    org: 'IBM',
    title: 'Technology Internship',
    kind: 'Internship',
    score: null,
    scoreLabel: null,
    meta: 'Approximately 1 month',
    period: null,
    location: null,
    topics: ['Web Development', 'Application Development'],
    featured: false,
  },
]

/* ---------------------------------------------------------------- PROJECTS -- */
export const projects = [
  {
    id: 'fashion-vista',
    index: '01',
    name: 'FASHION-VISTA',
    kind: 'Major Project · Full-Stack E-Commerce',
    mockup: 'browser',
    year: '2026',
    // ⭐ Optional. Set for team projects and it renders beside the year.
    //    Leave it off (or null) on solo projects and the badge is omitted.
    team: '4 members',
    tagline:
      'A three-panel e-commerce platform: customer storefront, admin console, and a dedicated delivery-partner portal.',
    summary:
      'FASHION-VISTA is an end-to-end online fashion store built as our B.Tech final-year major project. It runs three connected surfaces over a single PHP + MySQL core: a customer storefront (browse, cart, wishlist, reviews, checkout, live tracking), an admin console (catalogue, customers, orders, analytics, delivery partners), and a delivery-partner portal with its own login where riders take jobs and move each order through the delivery lifecycle. Seventeen MySQL tables back it, and every status change is written to an append-only event log.',
    tech: [
      'React 18',
      'TypeScript',
      'Tailwind CSS',
      'shadcn/ui',
      'React Query',
      'PHP',
      'MySQL',
      'JWT Auth',
      'Zod',
      'Vitest',
    ],
    features: [
      'Customer storefront — catalogue, categories and product detail pages',
      'Server-side cart, wishlist and multiple saved addresses',
      'Checkout with COD, card and UPI payment options',
      'Product reviews with image upload',
      'Live order tracking with a full status timeline',
      'JWT authentication with email verification and password reset',
      'Admin dashboard with order and sales analytics',
      'Admin — manage products, customers, orders and mail settings',
      'Delivery partner management with vehicle, licence and rating records',
      'Assign any order to a specific delivery partner',
      'Dedicated delivery-partner portal with its own login and job list',
      'Six-stage delivery lifecycle: assigned → pickup scheduled → picked up → out for delivery → delivered / failed',
      'Automatic delivery notifications and an append-only order status audit trail',
      'Zod schema validation on the client, prepared statements on the server',
    ],
    highlights: [
      {
        title: 'Three panels, one API',
        body: 'The storefront, the admin console and the delivery-partner portal are separate React surfaces over the same PHP API and MySQL schema. An order created at checkout is the exact row an admin assigns and a rider marks delivered — no syncing, no duplicate state, one source of truth.',
      },
      {
        title: 'Delivery is its own domain, not a status field',
        body: 'Partners are a first-class entity with their own credentials, sessions table and dashboard, plus vehicle, licence, rating and delivery-count records. Giving riders real authentication instead of hiding the feature inside the admin panel is what turned "who is delivering what" into a single join.',
      },
      {
        title: 'Status as an event log',
        body: 'Instead of overwriting one column, every transition appends to an order status events table with actor, location and timestamp, alongside a JSON location history. That is what lets the customer tracking page and the admin dashboard tell exactly the same story — and makes any delivery auditable after the fact.',
      },
      {
        title: 'Built as a team of four',
        body: 'Work split across the storefront, the admin console, the PHP API layer and the database schema. TypeScript types shared across the front end became the contract we agreed on early, which is what let four people work in parallel without breaking each other.',
      },
    ],
    // ⭐ ADD YOUR LINKS HERE (set to null to hide the button)
    links: { github: null, demo: null },
    // ⭐ ADD A SCREENSHOT: '/images/fashion-vista.png' (null = animated mockup)
    image: null,
    accent: 'iris',
  },
  {
    id: 'whatsapp-clone',
    index: '02',
    name: 'WhatsApp Chat Clone',
    kind: 'Android Application',
    // `mockup` decides which animated showcase renders: 'phone' | 'browser'
    mockup: 'phone',
    // Optional. Add the year you built it (e.g. '2025') and it appears beside
    // the project kind; leave it null and that line is simply omitted.
    year: null,
    tagline: 'A real-time messaging app built on Firebase, from auth to delivered message.',
    summary:
      'A native Android chat application that handles the full messaging lifecycle — account creation, multiple authentication methods, and live message sync between devices through Firebase Firestore.',
    tech: ['Java', 'Android', 'XML', 'Firebase'],
    features: [
      'Real-time communication between devices',
      'Real-time text messaging',
      'Firebase Firestore integration',
      'User registration',
      'Login system',
      'Firebase Authentication',
      'Email and password authentication',
      'Phone authentication using OTP',
    ],
    // What I actually learned — good interview talking points
    highlights: [
      {
        title: 'Live sync without polling',
        body: 'Firestore snapshot listeners push new messages to every open device, so the UI updates without a refresh or a timer.',
      },
      {
        title: 'Two auth paths, one session',
        body: 'Email/password and phone OTP both resolve into the same Firebase user, which keeps the rest of the app auth-agnostic.',
      },
      {
        title: 'Structured for scale',
        body: 'Messages are stored per-conversation rather than in a single flat collection, keeping reads cheap as history grows.',
      },
    ],
    // ⭐ ADD YOUR LINKS HERE (set to null to hide the button)
    links: { github: null, demo: null },
    // ⭐ ADD A SCREENSHOT: '/images/whatsapp-clone.png' (null = animated mockup)
    image: null,
    accent: 'accent',
  },
  {
    id: 'food-delivery',
    index: '03',
    name: 'Food Delivery Website',
    kind: 'Web Application',
    mockup: 'browser',
    year: null, // Optional — see the note on the project above.
    tagline: 'A responsive food ordering interface with a component-driven React front end.',
    summary:
      'A food delivery web experience covering the browsing-to-cart journey — menu categories, dish cards, quantity handling and a running order total — built with reusable React components and a mobile-first layout.',
    tech: ['HTML', 'CSS', 'JavaScript', 'React.js'],
    features: [
      'Component-driven React interface',
      'Category and menu browsing',
      'Interactive dish cards with quantity controls',
      'Live cart total calculation',
      'Responsive, mobile-first layout',
      'Reusable UI components and clean file structure',
    ],
    highlights: [
      {
        title: 'State that stays honest',
        body: 'Cart quantities live in one place and every total is derived from that state, so the displayed price can never drift from the items.',
      },
      {
        title: 'Composable by design',
        body: 'Dish cards, category chips and the cart panel are independent components — the same pieces rebuild any page of the site.',
      },
      {
        title: 'Mobile-first, not mobile-last',
        body: 'The layout was designed at the smallest breakpoint first, then given room to breathe on larger screens.',
      },
    ],
    links: { github: null, demo: null },
    image: null,
    accent: 'amber',
  },
]

/* ----------------------------------------------------------------- JOURNEY -- */
export const journey = [
  {
    step: '01',
    icon: 'GraduationCap',
    title: 'Education',
    body: 'Started formal computer science study — the fundamentals that everything else attaches to.',
  },
  {
    step: '02',
    icon: 'Terminal',
    title: 'Learning Programming',
    body: 'Java first. Objects, collections and the habit of debugging my own logic instead of guessing.',
  },
  {
    step: '03',
    icon: 'Globe',
    title: 'Web Development',
    body: 'HTML, CSS and JavaScript, then Bootstrap and React — from static pages to component-driven interfaces.',
  },
  {
    step: '04',
    icon: 'Smartphone',
    title: 'Android Development',
    body: 'Took Java to mobile: XML layouts, activity lifecycle and Firebase as a live backend.',
  },
  {
    step: '05',
    icon: 'Network',
    title: 'Networking',
    body: 'Cisco Networking Academy, addressing, routing and switching — understanding the wire under the web.',
  },
  {
    step: '06',
    icon: 'FolderGit2',
    title: 'Projects',
    body: 'Shipped a real-time Android chat app and a React food-delivery interface end to end, then FASHION-VISTA — a three-panel e-commerce platform with a storefront, an admin console and a delivery-partner portal, built in a team of four.',
  },
  {
    step: '07',
    icon: 'TrendingUp',
    title: 'Professional Growth',
    body: 'Now looking for a team where I can contribute, be reviewed properly, and keep levelling up.',
  },
]

/* --------------------------------------------------------------- INTERESTS -- */
export const interests = [
  { icon: 'Film', title: 'Movies', body: 'English and Hindi cinema — good storytelling in any language.' },
  { icon: 'Zap', title: 'Badminton', body: 'Fast rallies and the fastest way to clear my head after a long build.' },
  { icon: 'Trophy', title: 'Cricket', body: 'Playing and watching. A game of patience and sudden momentum.' },
  { icon: 'Plane', title: 'Travelling', body: 'New places, new people, and a break from the screen.' },
]

/* ----------------------------------------------------------------- CONTACT -- */
export const contact = {
  heading: "Let's Build Something Amazing Together",
  body: "I'm open to internships, junior developer roles and collaborative projects. Whether you have a role in mind or just want to talk about code and networks — my inbox is open.",
  // Reply-time promise shown under the form. Set to null to hide.
  responseTime: 'Usually replies within 24 hours',
}

/* ------------------------------------------------------------------ FOOTER -- */
export const footer = {
  // ⭐ Update the year here each January (kept literal rather than using
  //    new Date() so the printed year never drifts from your resume).
  copyright: '© 2026 Parv Maurya. All Rights Reserved.',
  line: 'Designed with passion, creativity and technology.',
}
