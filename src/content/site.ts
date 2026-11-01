/**
 * Company facts. Every figure and statement here is taken from pramukh.com
 * (home, about-us, surat, vapi, silvassa and contact-us pages, retrieved Oct 2026).
 * Do not add figures that are not published there.
 */

export const site = {
  name: "Pramukh Group",
  shortName: "Pramukh",
  url: "https://pramukh.com",
  tagline: "A Class of Its Own",
  established: 1993,
  formerName: "PDPL Group",
  founder: "Shri. Natubhai R. Bhatu",
  description:
    "Pramukh Group has delivered residential and commercial spaces across Surat, Vapi, Silvassa and Daman since 1993. 60+ projects delivered, 17M+ sq. ft. developed.",
} as const;

export const stats = [
  { value: 60, suffix: "+", label: "Projects delivered" },
  { value: 17, suffix: "M+", label: "Sq. ft. developed" },
  { value: 13000, suffix: "+", label: "Homes built" },
  { value: 30, suffix: "+", label: "Years of trust" },
] as const;

/** Secondary figures for the trust section. */
export const pipeline = [
  { value: 20, suffix: "+", label: "Ongoing projects" },
  { value: 2.7, suffix: "M+", label: "Sq. ft. under development", decimals: 1 },
  { value: 6700, suffix: "+", label: "Homes under construction" },
] as const;

export const vision =
  "To provide premium housing and commercial spaces with high quality standards and a contemporary lifestyle, at the best affordable prices.";
export const mission =
  "To be the leader in providing the best infrastructure and eventually change the skyline of Gujarat.";
export const coreValues = [
  "Commitment",
  "Quality",
  "Timely Delivery",
  "Trust",
  "Transparency",
  "Teamwork",
  "Equality",
  "Ethics",
  "Excellence",
] as const;

/** The founder's three reasons for establishing the group (about-us page). */
export const foundingPromises = [
  { title: "Quality construction", body: "The first reason the group was founded, and still the first thing every project is measured against." },
  { title: "Delivered as promised, on time", body: "What is promised is delivered, and delivered on schedule." },
  { title: "Value for money", body: "Premium spaces offered at the best affordable prices." },
] as const;

/**
 * Leadership, from pramukh.com/team.html. Names and titles as published; bios from the same page with
 * light grammar fixes only. `linkedin` is set only where the page links a real profile.
 */
export const leaders: {
  name: string;
  title: string;
  years?: string;
  bio: string;
  image: "leaders/natubhai" | "leaders/virambhai" | "leaders/devshibhai" | "leaders/ajitbhai" | "leaders/prashant" | "leaders/raj";
  linkedin?: string;
}[] = [
  {
    name: "Mr. Natubhai R. Bhatu",
    title: "Founder & Chairman",
    bio: "A first-generation entrepreneur who has single-handedly inspired the company. He established Pramukh Group on the realisation of the potential the real estate sector possesses. Under his guidance and leadership the organisation has grown stronger, and today it can confidently be called a synonym for the finest quality.",
    image: "leaders/natubhai",
  },
  {
    name: "Mr. Virambhai R. Bhatu",
    title: "Promoter",
    bio: "Coming from a family with strong ethics and values, Virambhai is an efficient leader whose primary focus is the business and market knowledge, with complete control over construction matters.",
    image: "leaders/virambhai",
  },
  {
    name: "Mr. Devshibhai L. Bhatu",
    title: "Senior Promoter",
    years: "1969–2024",
    bio: "A visionary who was always open to learning, with a constant hunt for opportunities to grow the business. A firm believer in business ethics and values, he was a leader in its true sense.",
    image: "leaders/devshibhai",
  },
  {
    name: "Mr. Ajitbhai H. Khodbhaya",
    title: "Promoter",
    bio: "An expert in corporate finance who heads the finance and accounts department. His cross-functional experience ensures the company's finances are directed the right way.",
    image: "leaders/ajitbhai",
  },
  {
    name: "Mr. Prashant Bhatu",
    title: "Managing Director – Surat",
    bio: "Passionate about creating unique land spaces, conceiving brilliant initiatives and understanding consumer behaviour, he is naturally a strong figure in the industry. The secret to his success is being inspired by challenges and always thinking ahead.",
    image: "leaders/prashant",
    linkedin: "https://www.linkedin.com/in/prashant-bhatu-65a041111/",
  },
  {
    name: "Mr. Raj Bhatu",
    title: "Sales & Marketing Director – Vapi",
    bio: "A technocrat, entrepreneur and adventure enthusiast with a degree in civil engineering. Having held diverse roles in technology and real estate, he has deep insight into building homes of every size, and has nurtured home-grown leaders within the team.",
    image: "leaders/raj",
  },
];

export const cities = [
  {
    id: "silvassa",
    name: "Silvassa",
    note: "Where the group began in 1993. A long-standing developer offering residents a comfortable, peaceful and convenient lifestyle.",
  },
  {
    id: "vapi",
    name: "Vapi",
    note: "Beyond well-planned homes, the group named and developed an entire area of the city: New Chala.",
  },
  {
    id: "surat",
    name: "Surat",
    note: "Present for 13 years and among the city's trusted developers, with 17 ongoing projects across residential, commercial, industrial and hospitality.",
  },
  {
    id: "daman",
    name: "Daman",
    note: "Home to Marina Bay, the group's development of studio, 1 and 2 BHK apartments.",
  },
] as const;

/**
 * The four markets shown as cards in the intro. Ongoing-project counts are from each city page on
 * pramukh.com; Daman is represented by Marina Bay, the group's project there.
 */
export const presence = [
  { city: "Silvassa", image: "city/silvassa", note: "Where the group began in 1993.", count: 12, href: "https://pramukh.com/silvassa.html" },
  { city: "Surat", image: "city/surat", note: "Thirteen years in the city, across homes, offices and hospitality.", count: 17, href: "https://pramukh.com/surat.html" },
  { city: "Vapi", image: "city/vapi", note: "The group named and developed New Chala.", count: 8, href: "https://pramukh.com/vapi.html" },
  { city: "Daman", image: "city/daman", note: "Marina Bay: studio, 1 and 2 BHK apartments.", count: undefined, href: "https://pramukh.com/marina-bay.html" },
] as const;

export const offices = [
  {
    city: "Surat",
    lines: ["10th Floor, Orbit-2,", "Beside Celestial Dreams,", "Vesu Canal Road,", "Vesu, Surat-395007."],
    phone: "+91 99789 86778",
    email: "inquiry@mypramukh.com",
  },
  {
    city: "Vapi",
    lines: ["Pramukh House,", "Vapi – Daman Main Rd,", "Chala,", "Vapi – 396191."],
    phone: "+91 74062 58000",
    email: "inquiry@pramukh.co.in",
  },
  {
    city: "Silvassa",
    lines: ["Pramukh Realty, Shop 1-4,", "Building A, Yogi Milan,", "Silvassa,", "Dadra and Nagar Haveli."],
    phone: "+91 63597 78000",
    email: "inquiry.silvassa@pramukh.co.in",
  },
] as const;

/**
 * WhatsApp chat line for the floating button. pramukh.com does not publish a WhatsApp number, so this
 * uses the Surat sales line: confirm it is on WhatsApp (or replace it) before launch. Digits only.
 */
export const whatsapp = {
  number: "919978986778",
  message: "Hello Pramukh Group, I would like to know more about your projects.",
};
export const whatsappHref = (message = whatsapp.message) =>
  `https://wa.me/${whatsapp.number}?text=${encodeURIComponent(message)}`;

export const socials = [
  { label: "Instagram", href: "https://www.instagram.com/pramukhgroup" },
  { label: "Facebook", href: "https://www.facebook.com/pramukhgroup" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/pramukh-group" },
  { label: "YouTube", href: "https://www.youtube.com/channel/UCLlceoEV2aETQqdOeFsfAVA" },
] as const;

export const nav = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "What we build", href: "#build" },
  { label: "Ownership", href: "#ownership" },
  { label: "Contact", href: "#contact" },
] as const;

/** Site credit shown in the footer. */
export const builtBy = { name: "Fortiv Solutions", href: "https://www.fortivsolutions.in" } as const;

export const officialLinks = {
  contact: "https://pramukh.com/contact-us.html",
  projects: "https://pramukh.com/projects.html",
  surat: "https://pramukh.com/surat.html",
  vapi: "https://pramukh.com/vapi.html",
  silvassa: "https://pramukh.com/silvassa.html",
  about: "https://pramukh.com/about-us.html",
} as const;

/**
 * Dropdown menu: three columns after the two-step menu reference. Counts are ongoing projects per city
 * page; "20+ ongoing" is the pramukh.com home-page figure; three offices: Surat, Vapi and Silvassa.
 */
export type MenuLink = { label: string; href: string; count?: number; badge?: string; external?: boolean };
export const menuColumns: { title: string; card: boolean; links: MenuLink[]; socials?: boolean; twoUp?: boolean }[] = [
  {
    title: "Discover",
    card: true,
    links: [
      { label: "About", href: "#about" },
      { label: "Projects", href: "#projects", badge: "20+ ongoing" },
      { label: "What we build", href: "#build" },
      { label: "Where we build", href: "#where" },
    ],
  },
  {
    title: "Ongoing by city",
    card: false,
    // Two rows of two. Daman is represented by Marina Bay (no ongoing count is published).
    links: [
      { label: "Silvassa", href: officialLinks.silvassa, count: 12, external: true },
      { label: "Vapi", href: officialLinks.vapi, count: 8, external: true },
      { label: "Surat", href: officialLinks.surat, count: 17, external: true },
      { label: "Daman", href: "https://pramukh.com/marina-bay.html", external: true },
    ],
    socials: true,
    twoUp: true,
  },
  {
    title: "Company",
    card: true,
    links: [
      { label: "All-in Ownership™", href: "#ownership" },
      { label: "Featured projects", href: "#featured" },
      { label: "Why Pramukh", href: "#trust" },
      { label: "Contact", href: "#contact", badge: "3 offices" },
    ],
  },
];

export const telHref = (phone: string) => `tel:${phone.replace(/\s/g, "")}`;
