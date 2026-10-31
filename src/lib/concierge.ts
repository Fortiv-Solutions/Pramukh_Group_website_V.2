import { projects, type Project } from "@/content/projects";
import { offices, site, stats, telHref, whatsappHref, officialLinks } from "@/content/site";

/**
 * The Pramukh concierge: a scripted assistant that answers only from the site's verified content
 * (projects, offices, company facts). Anything it cannot answer from that, such as prices,
 * availability or visits, is handed to the sales team on WhatsApp or by phone. No invented figures.
 */
export type Link = { label: string; href: string; external?: boolean };
export type Reply = { text: string; links?: Link[]; chips?: string[] };

export const STARTER_CHIPS = ["Ongoing projects", "Projects in Surat", "3 BHK homes", "Commercial spaces", "Office contacts", "Book a site visit"];

const CITIES = ["Surat", "Vapi", "Silvassa", "Daman"] as const;

const projectLine = (p: Project) => `${p.name}, ${p.locality !== p.city ? `${p.locality}, ` : ""}${p.city}: ${p.configuration}${p.status ? ` (${p.status.toLowerCase()})` : ""}.`;
const projectLinks = (list: Project[]): Link[] => list.slice(0, 4).map((p) => ({ label: p.name, href: p.href, external: true }));
const handoff: Link = { label: "Chat on WhatsApp", href: whatsappHref(), external: true };

const has = (q: string, words: string[]) => words.some((w) => q.includes(w));

export function respond(input: string): Reply {
  const q = ` ${input.toLowerCase().replace(/[^a-z0-9.+ ]/g, " ").replace(/\s+/g, " ")} `;

  if (has(q, [" hi ", " hello ", " hey ", " namaste ", " good morning ", " good evening "]))
    return { text: "Hello, and welcome to Pramukh Group. How can I help you today?", chips: STARTER_CHIPS };

  // Prices, availability, visits, brochures: always the sales team (carrying the project, if named).
  const named = projects.find((p) => q.includes(p.name.toLowerCase()));
  if (has(q, ["price", "cost", "rate", "budget", "emi", "loan", "availab", "visit", "book", "brochure", "floor plan", "sample flat", "possession date"]))
    return {
      text: `Prices, availability and site visits${named ? ` for ${named.name}` : ""} are handled personally by our sales team, so you always get current, accurate details. Message them on WhatsApp or call your nearest office.`,
      links: [
        named ? { label: "Chat on WhatsApp", href: whatsappHref(`Hello Pramukh Group, I would like details on ${named.name}.`), external: true } : handoff,
        ...offices.map((o) => ({ label: `Call ${o.city}`, href: telHref(o.phone) })),
      ],
    };

  // A specific project by name.
  if (named)
    return {
      text: `${named.name} is in ${named.locality !== named.city ? `${named.locality}, ` : ""}${named.city}: ${named.configuration}${named.status ? `, ${named.status.toLowerCase()}` : ""}. ${named.description}`,
      links: [{ label: `Explore ${named.name}`, href: named.href, external: true }, { label: "Ask about availability", href: whatsappHref(`Hello Pramukh Group, I am interested in ${named.name}.`), external: true }],
    };

  // BHK configuration.
  const bhk = q.match(/(\d(?:\.\d)?)\s*bhk/);
  if (bhk) {
    const n = bhk[1];
    const list = projects.filter((p) => p.configuration.toLowerCase().includes(n));
    if (list.length)
      return { text: `Projects with ${n} BHK homes:\n${list.map(projectLine).join("\n")}`, links: projectLinks(list), chips: ["Book a site visit", "Office contacts"] };
    return { text: `I couldn't find a featured project listing ${n} BHK homes. Our sales team can tell you about every option.`, links: [handoff] };
  }

  // Commercial.
  if (has(q, ["commercial", "office space", "shop", "showroom", "retail", "cafe", "restaurant", "business"])) {
    const list = projects.filter((p) => p.category === "Commercial");
    return { text: `Commercial spaces:\n${list.map(projectLine).join("\n")}`, links: projectLinks(list), chips: ["Book a site visit"] };
  }

  // A city.
  const city = CITIES.find((c) => q.includes(` ${c.toLowerCase()}`));
  if (city && !has(q, ["office", "address", "contact", "phone", "call", "email"])) {
    const list = projects.filter((p) => p.city === city);
    const more = city === "Daman" ? "" : `\nThe full list, including completed projects, is on the ${city} page.`;
    return {
      text: `Projects in ${city}:\n${list.map(projectLine).join("\n")}${more}`,
      links: [...projectLinks(list), ...(city === "Daman" ? [] : [{ label: `All ${city} projects`, href: officialLinks[city.toLowerCase() as "surat"], external: true }])],
    };
  }

  // Contact.
  if (has(q, ["office", "address", "contact", "phone", "call", "email", "number", "location", "where are you"])) {
    const o = city ? offices.filter((x) => x.city === city) : offices;
    return {
      text: o.map((x) => `${x.city}: ${x.lines.join(" ")} Phone ${x.phone}. Email ${x.email}.`).join("\n"),
      links: o.map((x) => ({ label: `Call ${x.city}`, href: telHref(x.phone) })),
    };
  }

  // Ongoing / all projects.
  if (has(q, ["project", "ongoing", "new launch", "property", "properties", "apartment", "flat", "home", "residential", "penthouse", "bungalow"])) {
    const list = projects.filter((p) => p.category === "Residential");
    return { text: `Some of our residential projects:\n${list.slice(0, 8).map(projectLine).join("\n")}`, links: projectLinks(list), chips: ["Projects in Surat", "Projects in Vapi", "Projects in Silvassa", "Commercial spaces"] };
  }

  // Company.
  if (has(q, ["about", "history", "founder", "since", "who are", "pramukh", "company", "experience", "trust"]))
    return {
      text: `Pramukh Group was established in ${site.established}, formerly known as ${site.formerName}, by ${site.founder}, to provide quality construction, deliver what is promised on time and offer value for money. ${stats.map((s) => `${s.value.toLocaleString("en-IN")}${s.suffix} ${s.label.toLowerCase()}`).join(", ")}.`,
      links: [{ label: "Our story", href: officialLinks.about, external: true }],
    };

  if (has(q, ["ownership", "philosophy", "quality", "value", "promise"]))
    return {
      text: "We stand by All-in Ownership™: owning every detail of every project, without compromise, from concept to completion and beyond. Development, construction and operations work as one.",
    };

  if (has(q, ["thank", "thanks", "great", "ok", "okay"])) return { text: "You're welcome. Is there anything else I can help you with?", chips: STARTER_CHIPS };

  return {
    text: "I can help with our projects by city or BHK type, commercial spaces, office contacts and the Pramukh story. For anything else, our team is happy to help on WhatsApp.",
    links: [handoff],
    chips: STARTER_CHIPS,
  };
}
