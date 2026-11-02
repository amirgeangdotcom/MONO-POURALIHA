export type Lesson = { id: string; title: string; minutes: number; summary: string };
export type Course = {
  id: string; title: string; category: string; level: "Beginner" | "Intermediate" | "Advanced";
  weeks: number; price: string; image: string; blurb: string; outcomes: string[]; lessons: Lesson[];
};

const L = (id: string, title: string, minutes: number, summary: string): Lesson => ({ id, title, minutes, summary });

export const courses: Course[] = [
  {
    id: "web-design", title: "Web Design for Clients", category: "Design", level: "Beginner", weeks: 8, price: "$0 to start",
    image: "/images/hero-side-1.png",
    blurb: "Go from blank canvas to a polished, client-ready website using real briefs.",
    outcomes: ["Design responsive layouts in Figma", "Present work and handle feedback", "Hand off to developers cleanly"],
    lessons: [
      L("wd1", "How freelance design work really flows", 18, "Briefs, scope, timelines and the first call."),
      L("wd2", "Layout, grid and hierarchy", 32, "Build pages that guide the eye."),
      L("wd3", "Type and colour systems", 28, "Pick a palette and pairing in under an hour."),
      L("wd4", "Designing a landing page end to end", 45, "A full project from wireframe to final."),
      L("wd5", "Presenting and revising", 22, "Win approval without endless rounds."),
    ],
  },
  {
    id: "frontend-dev", title: "Front-end Development", category: "Development", level: "Intermediate", weeks: 12, price: "$0 to start",
    image: "/images/hero-side-2.png",
    blurb: "HTML, CSS, JavaScript and React, taught through sites you could sell.",
    outcomes: ["Ship accessible, responsive sites", "Work with APIs and state", "Deploy and maintain client projects"],
    lessons: [
      L("fd1", "Semantic HTML and accessibility", 30, "Structure that works for everyone."),
      L("fd2", "Modern CSS layouts", 35, "Flexbox, grid and fluid type."),
      L("fd3", "JavaScript you will actually use", 40, "DOM, events, fetch and async."),
      L("fd4", "React fundamentals", 50, "Components, props and state."),
      L("fd5", "Deploying and handing over", 25, "Hosting, domains and documentation."),
      L("fd6", "Capstone: build a client site", 60, "Brief to launch, reviewed by a mentor."),
    ],
  },
  {
    id: "copywriting", title: "Copywriting & Content", category: "Writing", level: "Beginner", weeks: 6, price: "$0 to start",
    image: "/images/hero-side-3.png",
    blurb: "Write web copy, emails and case studies that clients pay for.",
    outcomes: ["Write clear, persuasive copy", "Run a discovery interview", "Price and package writing services"],
    lessons: [
      L("cw1", "Voice, tone and audience", 20, "Find the way a brand sounds."),
      L("cw2", "Headlines and hooks", 24, "Earn the first five seconds."),
      L("cw3", "Landing page copy", 35, "Structure that converts."),
      L("cw4", "Email sequences", 30, "Welcome, nurture and sell."),
    ],
  },
  {
    id: "freelance-business", title: "Freelance Business Foundations", category: "Business", level: "Beginner", weeks: 4, price: "Free",
    image: "/images/hero-side-4.png",
    blurb: "Pricing, contracts, invoicing and finding your first paying clients.",
    outcomes: ["Set rates with confidence", "Write a simple contract", "Build a repeatable pipeline"],
    lessons: [
      L("fb1", "Choosing a niche", 18, "Specialise so clients can find you."),
      L("fb2", "Pricing and proposals", 28, "Quote value, not hours."),
      L("fb3", "Contracts and getting paid", 26, "Protect yourself and your cash flow."),
      L("fb4", "Finding clients", 32, "Outreach, referrals and platforms."),
    ],
  },
  {
    id: "ux-research", title: "UX Research & Product Thinking", category: "Design", level: "Intermediate", weeks: 6, price: "$0 to start",
    image: "/images/interior-view.png",
    blurb: "Interview users, map journeys and turn insight into decisions.",
    outcomes: ["Plan and run interviews", "Synthesise findings", "Communicate results to stakeholders"],
    lessons: [
      L("ux1", "Research planning", 22, "Questions worth asking."),
      L("ux2", "Interviews and usability tests", 38, "Run sessions that surface truth."),
      L("ux3", "Synthesis and reporting", 34, "Turn notes into decisions."),
    ],
  },
  {
    id: "data-analytics", title: "Data Analytics for Freelancers", category: "Data", level: "Advanced", weeks: 10, price: "$0 to start",
    image: "/images/rusted-metal.png",
    blurb: "Clean data, build dashboards and tell stories clients can act on.",
    outcomes: ["Wrangle messy data", "Build clear dashboards", "Present insights to non-technical clients"],
    lessons: [
      L("da1", "Spreadsheets to SQL", 40, "Query real datasets."),
      L("da2", "Cleaning and modelling data", 42, "Make data trustworthy."),
      L("da3", "Dashboards that get read", 36, "Chart choices and layout."),
      L("da4", "Presenting insights", 24, "Tell the story."),
    ],
  },
  {
    id: "sewing-fashion", title: "Sewing & Fashion Design for Clients", category: "Sewing", level: "Beginner", weeks: 8, price: "$0 to start",
    image: "/images/5b3bdb95-fac7-4d22-aa97-98b5d547b2db.png",
    blurb: "Learn pattern making and garment sewing, then take custom orders from real clients.",
    outcomes: ["Draft patterns and sew garments", "Take measurements and fit clients", "Price and sell custom orders"],
    lessons: [
      L("sw1", "Tools, fabrics and machine basics", 24, "Set up your machine and pick the right fabric."),
      L("sw2", "Measuring and pattern drafting", 36, "Turn body measurements into a pattern."),
      L("sw3", "Sewing a complete garment", 48, "From cutting to finishing seams."),
      L("sw4", "Alterations and fitting", 30, "Adjust clothes to fit real clients."),
      L("sw5", "Selling custom orders", 22, "Pricing, photos and taking orders online."),
    ],
  },
  {
    id: "architecture-drafting", title: "Architectural Drawing & 3D Visualisation", category: "Architecture", level: "Intermediate", weeks: 10, price: "$0 to start",
    image: "/images/09ffa8fd-cdd1-453f-9aa2-d6c702a1f4b5.png",
    blurb: "Produce plans, sections and 3D renders that clients and builders can understand.",
    outcomes: ["Draw clear floor plans and sections", "Model and render spaces in 3D", "Present design concepts to clients"],
    lessons: [
      L("ar1", "Reading briefs and site constraints", 22, "Turn a client's needs into a design plan."),
      L("ar2", "Plans, sections and elevations", 40, "Technical drawing that builders can follow."),
      L("ar3", "3D modelling basics", 45, "Build a simple house model step by step."),
      L("ar4", "Rendering and presentation boards", 35, "Light, materials and storytelling."),
    ],
  },
  {
    id: "painting-illustration", title: "Painting & Illustration for Commissions", category: "Painting", level: "Beginner", weeks: 8, price: "$0 to start",
    image: "/images/painting-line.png",
    blurb: "Build your painting skills and sell commissions, prints and custom artwork.",
    outcomes: ["Paint with confidence in colour and composition", "Photograph and present your artwork", "Price and sell commissions"],
    lessons: [
      L("pa1", "Materials, colour and mixing", 26, "Choose paints and mix a balanced palette."),
      L("pa2", "Composition and drawing basics", 32, "Plan paintings that hold the eye."),
      L("pa3", "Painting a finished piece", 50, "Take one artwork from sketch to final."),
      L("pa4", "Photographing and selling your art", 24, "Show your work online and find buyers."),
    ],
  },
  {
    id: "electronics-arduino", title: "Electronics & Arduino Projects", category: "Electronics", level: "Beginner", weeks: 10, price: "$0 to start",
    image: "/images/040e36b1-d16f-474b-a712-a9979e6ab479.png",
    blurb: "Learn circuits, soldering and Arduino by building devices you could sell or repair.",
    outcomes: ["Read schematics and build circuits", "Solder and test electronic boards", "Program simple Arduino devices"],
    lessons: [
      L("el1", "Voltage, current and basic circuits", 30, "Understand the rules every circuit follows."),
      L("el2", "Soldering and using a multimeter", 34, "Build and test reliable connections."),
      L("el3", "Arduino programming basics", 45, "Make sensors and LEDs respond to code."),
      L("el4", "Building a client prototype", 55, "From a request to a working device."),
      L("el5", "Repair and troubleshooting", 28, "Find faults in real boards."),
    ],
  },
];

export type Project = {
  id: string; title: string; client: string; category: string; budget: string; duration: string;
  level: "Beginner" | "Intermediate" | "Advanced"; brief: string; skills: string[];
};
export const projects: Project[] = [
  { id: "p1", title: "Brand site for a local bakery", client: "Maison Levain", category: "Design", budget: "$400 stipend", duration: "3 weeks", level: "Beginner", brief: "Design a three-page site with menu, story and ordering info. Mentor feedback at each milestone.", skills: ["Figma", "Layout", "Brand"] },
  { id: "p2", title: "Booking widget for a yoga studio", client: "Still Point Studio", category: "Development", budget: "$800 stipend", duration: "4 weeks", level: "Intermediate", brief: "Build an accessible class booking widget in React that connects to a simple JSON API.", skills: ["React", "Accessibility", "API"] },
  { id: "p3", title: "Product descriptions for an outdoor shop", client: "Northtrail Gear", category: "Writing", budget: "$300 stipend", duration: "2 weeks", level: "Beginner", brief: "Write 30 product descriptions in a consistent brand voice with SEO basics.", skills: ["Copywriting", "SEO"] },
  { id: "p4", title: "Onboarding research for a fintech app", client: "Ledgerly", category: "Design", budget: "$900 stipend", duration: "5 weeks", level: "Intermediate", brief: "Run eight user interviews and deliver a findings report with prioritised recommendations.", skills: ["Interviews", "Synthesis"] },
  { id: "p5", title: "Sales dashboard for a small retailer", client: "Hollis & Co.", category: "Data", budget: "$1,000 stipend", duration: "4 weeks", level: "Advanced", brief: "Clean sales exports and build a dashboard the owner can read in two minutes.", skills: ["SQL", "Charts", "Storytelling"] },
  { id: "p6", title: "Landing page for a nonprofit campaign", client: "Open Shelf", category: "Development", budget: "$500 stipend", duration: "3 weeks", level: "Beginner", brief: "Turn an approved design into a fast, responsive landing page with a donation form.", skills: ["HTML", "CSS", "JavaScript"] },
  { id: "p7", title: "Custom dress for a boutique", client: "Atelier Noor", category: "Sewing", budget: "$350 stipend", duration: "3 weeks", level: "Beginner", brief: "Draft a pattern and sew a custom dress, with fittings and mentor feedback.", skills: ["Pattern making", "Sewing"] },
  { id: "p8", title: "Floor plans for a small café", client: "Café Lumen", category: "Architecture", budget: "$700 stipend", duration: "4 weeks", level: "Intermediate", brief: "Draw plans and a 3D view for a 40 square metre café layout.", skills: ["Floor plans", "3D modelling"] },
  { id: "p9", title: "Mural sketches for a children's library", client: "Open Shelf", category: "Painting", budget: "$450 stipend", duration: "3 weeks", level: "Beginner", brief: "Paint three colour sketches for a library wall mural, with mentor feedback on each.", skills: ["Painting", "Composition"] },
  { id: "p10", title: "Sensor circuit for a greenhouse", client: "Green Roots Farm", category: "Electronics", budget: "$600 stipend", duration: "4 weeks", level: "Intermediate", brief: "Build a soil-moisture sensor with an Arduino and document the wiring.", skills: ["Arduino", "Circuits"] },
];

export type Job = {
  id: string; title: string; company: string; location: string; type: "Freelance" | "Part-time" | "Full-time" | "Internship";
  remote: boolean; category: string; pay: string; posted: string; description: string; skills: string[];
};
export const jobs: Job[] = [
  { id: "j1", title: "Junior Web Designer", company: "Fieldwork Studio", location: "Berlin", type: "Freelance", remote: true, category: "Design", pay: "€35–45 / hour", posted: "2 days ago", description: "Support senior designers on client websites. Strong Figma skills and a portfolio are essential.", skills: ["Figma", "Layout"] },
  { id: "j2", title: "React Developer (Contract)", company: "Kiln Labs", location: "Remote", type: "Freelance", remote: true, category: "Development", pay: "€50–65 / hour", posted: "3 days ago", description: "Build and maintain product features on a 3-month contract with a possibility to extend.", skills: ["React", "TypeScript"] },
  { id: "j3", title: "Content Writer", company: "Greenline Media", location: "Hamburg", type: "Part-time", remote: true, category: "Writing", pay: "€25–30 / hour", posted: "1 week ago", description: "Write articles and email campaigns for sustainability brands.", skills: ["Copywriting", "SEO"] },
  { id: "j4", title: "UX Research Intern", company: "Ledgerly", location: "Berlin", type: "Internship", remote: false, category: "Design", pay: "€1,100 / month", posted: "4 days ago", description: "Join a research team, run sessions and help synthesise findings.", skills: ["Interviews", "Synthesis"] },
  { id: "j5", title: "Data Analyst", company: "Hollis & Co.", location: "Munich", type: "Full-time", remote: true, category: "Data", pay: "€48,000–56,000 / year", posted: "5 days ago", description: "Own reporting for a growing retail team using SQL and dashboards.", skills: ["SQL", "Dashboards"] },
  { id: "j6", title: "Brand Designer", company: "Atlas & Pine", location: "Remote", type: "Freelance", remote: true, category: "Design", pay: "€40–55 / hour", posted: "1 day ago", description: "Create identity systems for early-stage startups across short engagements.", skills: ["Branding", "Illustrator"] },
  { id: "j7", title: "Junior Front-end Developer", company: "Brightpath", location: "Cologne", type: "Full-time", remote: false, category: "Development", pay: "€44,000–52,000 / year", posted: "6 days ago", description: "Work in a friendly team building accessible web apps. Mentorship provided.", skills: ["JavaScript", "CSS", "React"] },
  { id: "j8", title: "Email Copywriter", company: "Northtrail Gear", location: "Remote", type: "Freelance", remote: true, category: "Writing", pay: "€30–40 / hour", posted: "3 days ago", description: "Write lifecycle and promotional emails for an outdoor retailer.", skills: ["Email", "Copywriting"] },
  { id: "j9", title: "Junior Tailor", company: "Atelier Noor", location: "Berlin", type: "Part-time", remote: false, category: "Sewing", pay: "€18–24 / hour", posted: "2 days ago", description: "Sew and alter garments for boutique clients. Basic pattern skills are essential.", skills: ["Sewing", "Alterations"] },
  { id: "j10", title: "Fashion Pattern Assistant", company: "Thread & Co.", location: "Remote", type: "Freelance", remote: true, category: "Sewing", pay: "€25–32 / hour", posted: "5 days ago", description: "Prepare digital patterns for a small clothing label.", skills: ["Pattern making", "Sewing"] },
  { id: "j11", title: "Junior Architectural Drafter", company: "Studio Nord", location: "Hamburg", type: "Full-time", remote: false, category: "Architecture", pay: "€38,000–44,000 / year", posted: "3 days ago", description: "Draw plans and sections for residential projects under a senior architect.", skills: ["Floor plans", "3D modelling"] },
  { id: "j12", title: "3D Visualiser (Freelance)", company: "Lumen Build", location: "Remote", type: "Freelance", remote: true, category: "Architecture", pay: "€35–50 / hour", posted: "1 week ago", description: "Create renders of interiors and buildings for property developers.", skills: ["3D modelling", "Rendering"] },
  { id: "j13", title: "Mural Painter", company: "Open Shelf", location: "Munich", type: "Freelance", remote: false, category: "Painting", pay: "€30–40 / hour", posted: "4 days ago", description: "Paint murals for schools and libraries from approved sketches.", skills: ["Painting", "Composition"] },
  { id: "j14", title: "Illustrator for Book Covers", company: "Pine Press", location: "Remote", type: "Freelance", remote: true, category: "Painting", pay: "€28–38 / hour", posted: "6 days ago", description: "Create hand-painted illustrations for children's book covers.", skills: ["Illustration", "Painting"] },
  { id: "j15", title: "Electronics Technician Trainee", company: "Voltix GmbH", location: "Cologne", type: "Internship", remote: false, category: "Electronics", pay: "€1,000 / month", posted: "2 days ago", description: "Learn to assemble, test and repair electronic boards in a small workshop.", skills: ["Soldering", "Circuits"] },
  { id: "j16", title: "Arduino Prototype Developer", company: "Kiln Labs", location: "Remote", type: "Freelance", remote: true, category: "Electronics", pay: "€40–55 / hour", posted: "3 days ago", description: "Build working prototypes for smart-home products using Arduino and sensors.", skills: ["Arduino", "Circuits"] },
];

export const testimonials = [
  { name: "Amara Okafor", role: "Web designer, graduate 2026", quote: "I landed my first paying client three weeks after finishing the capstone project, using the portfolio I built here." },
  { name: "Jonas Weber", role: "Front-end developer, graduate 2025", quote: "The real-world projects made all the difference. I had feedback from actual clients before I ever applied for a job." },
  { name: "Lina Park", role: "Content strategist, student", quote: "The resume builder and mentor reviews helped me turn scattered work into a story employers understood." },
];
