import type { MediaKey } from "./media";

/**
 * Project facts from the official project and city pages on pramukh.com.
 * `status` is only set where a city page publishes it.
 */
export type City = "Surat" | "Vapi" | "Silvassa" | "Daman";
export type Category = "Residential" | "Commercial";

export type Project = {
  slug: string;
  name: string;
  city: City;
  locality: string;
  category: Category;
  configuration: string;
  status?: string;
  headline?: string;
  description: string;
  href: string;
  image: MediaKey;
  detail?: MediaKey;
};

const official = (slug: string) => `https://pramukh.com/${slug}.html`;

export const projects: Project[] = [
  {
    slug: "one-tapi",
    name: "One Tapi",
    city: "Surat",
    locality: "Piplod",
    category: "Residential",
    configuration: "Riverside 5 BHK residences & penthouses",
    status: "Ongoing",
    headline: "Wonders are many. Marvel is just one.",
    description:
      "Set on the banks of the Tapi in an ambience like a rainforest, One Tapi gives every window an uninterrupted view of the river and the city.",
    href: official("one-tapi"),
    image: "one-tapi/hero",
    detail: "one-tapi/night",
  },
  {
    slug: "agastya",
    name: "Agastya",
    city: "Surat",
    locality: "Vesu",
    category: "Residential",
    configuration: "4 BHK apartments",
    status: "Ongoing",
    headline: "An epitome of luxury.",
    description:
      "Created and curated so every element makes a mark of its own. More than a 4 BHK apartment: a home that brings peace, divinity and comfort.",
    href: official("agastya"),
    image: "agastya/hero",
    detail: "agastya/night",
  },
  {
    slug: "revanta",
    name: "Revanta",
    city: "Surat",
    locality: "Vesu",
    category: "Residential",
    configuration: "3 BHK luxury apartments",
    status: "Ongoing",
    headline: "Indulge in the finesse of living.",
    description:
      "Lavishly planned 3 BHK homes, with amenities that bring alive the spirit of living to the fullest and planning that keeps you close to nature.",
    href: official("revanta"),
    image: "revanta/hero",
  },
  {
    slug: "aranya-iii",
    name: "Aranya III",
    city: "Surat",
    locality: "Godadara",
    category: "Residential",
    configuration: "Exclusive 3 BHK apartments",
    status: "Ongoing",
    description:
      "Custom-designed rooms and wide views. Every part of the building radiates carefully chosen luxury.",
    href: official("aranya-iii"),
    image: "aranya-iii/night",
  },
  {
    slug: "orbit-5",
    name: "Orbit 5",
    city: "Surat",
    locality: "Vesu",
    category: "Commercial",
    configuration: "Offices, showrooms, cafés & restaurants",
    status: "Ongoing",
    description:
      "After four previous Orbit developments, a combination of contemporary workplaces, modern showrooms, lively eateries and a homely café.",
    href: official("orbit-5"),
    image: "orbit-5/hero",
    detail: "orbit-5/tower",
  },
  {
    slug: "zenith",
    name: "Zenith",
    city: "Surat",
    locality: "Vesu",
    category: "Commercial",
    configuration: "Showrooms, offices, cafés & restaurants",
    status: "Ongoing",
    headline: "A new benchmark in commercial real estate.",
    description:
      "A blend of modern showrooms, contemporary offices and vibrant cafés, where innovation, style and strategic accessibility meet.",
    href: official("zenith"),
    image: "zenith/hero",
    detail: "zenith/tower",
  },
  {
    slug: "aristo",
    name: "Aristo",
    city: "Vapi",
    locality: "Chala",
    category: "Residential",
    configuration: "3, 4 & 5 BHK apartments",
    status: "Ready to move",
    headline: "A home where luxury can be lived.",
    description:
      "Homes that define unspoken luxury, surrounded by tranquillity in Chala, with grand amenities and close attention to detail.",
    href: official("aristo"),
    image: "aristo/hero",
  },
  {
    slug: "vedanta",
    name: "Vedanta",
    city: "Vapi",
    locality: "New Chala",
    category: "Residential",
    configuration: "3 & 4 BHK apartments",
    status: "Ready to move",
    headline: "A worthy address for you.",
    description:
      "Open spaces, greenery and sit-outs designed around every member of the family, set apart from the pace of the city.",
    href: official("vedanta"),
    image: "vedanta/hero",
  },
  {
    slug: "green-county",
    name: "Green County",
    city: "Vapi",
    locality: "Nr. Gunjan Area",
    category: "Residential",
    configuration: "3 & 4 BHK ultra-luxurious apartments",
    status: "Ongoing",
    headline: "Land of the greens.",
    description:
      "The aroma of wet soil, soft green grass, birdsong and blooming flowers. The poetry of nature, set around 3 and 4 BHK homes.",
    href: official("green-county"),
    image: "green-county/hero",
    detail: "green-county/entrance",
  },
  {
    slug: "shivanta",
    name: "Shivanta",
    city: "Silvassa",
    locality: "Samarvani",
    category: "Residential",
    configuration: "2–3 BHK apartments",
    status: "Under construction",
    description:
      "A 2–3 BHK haven surrounded by lush greens, where sleek interiors and expansive balconies meet good connectivity.",
    href: official("shivanta"),
    image: "shivanta/hero",
  },
  {
    slug: "yogi-woods",
    name: "Yogi Woods",
    city: "Silvassa",
    locality: "Ring Road",
    category: "Residential",
    configuration: "2–3 BHK apartments",
    status: "Ongoing",
    headline: "Luxury in the heart of nature.",
    description:
      "Peaceful 2 and 3 BHK homes amid lush greenery, away from the hustle of the city.",
    href: official("yogi-woods"),
    image: "yogi-woods/hero",
  },
  {
    slug: "swagat",
    name: "Swagat",
    city: "Silvassa",
    locality: "Nr. Lions English School",
    category: "Residential",
    configuration: "1.5–2 BHK apartments",
    status: "Ready possession",
    description: "Well-planned 1.5 and 2 BHK apartments, ready for possession in Silvassa.",
    href: official("swagat"),
    image: "swagat/hero",
  },
  {
    slug: "marina-bay",
    name: "Marina Bay",
    city: "Daman",
    locality: "Daman",
    category: "Residential",
    configuration: "Studio, 1 & 2 BHK apartments",
    description: "Studio, 1 and 2 BHK apartments in Daman.",
    href: official("marina-bay"),
    image: "marina-bay/hero",
  },
];

export const bySlug = (slug: string) => {
  const p = projects.find((x) => x.slug === slug);
  if (!p) throw new Error(`Unknown project ${slug}`);
  return p;
};

/** Numbered showcase (section 07). */
export const showcase = ["one-tapi", "agastya", "zenith", "green-county"].map(bySlug);
