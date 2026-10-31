import { video, type MediaKey } from "./media";

/**
 * ⚠ MOCK DATA, for layout only. These are NOT real customer testimonials.
 * pramukh.com publishes none. Before launch, replace every entry with a real, verified and
 * permissioned quote (name, project and wording approved by the customer), or remove the section.
 * The two video stories play the site's aerial film as a stand-in: swap in the customer's own clip and
 * a frame from it as the poster.
 */
export const TESTIMONIALS_ARE_MOCK = true;

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  project: string;
  city: string;
  /** Video story: the card shows the poster and a short pull quote, and plays the clip in a lightbox. */
  video?: { src: string; poster: MediaKey };
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "From the first site visit to the day we received our keys, every promise was kept. The quality of construction shows in the details, and possession was right on schedule.",
    name: "Rakesh Desai",
    role: "Homeowner",
    project: "Vedanta",
    city: "Vapi",
  },
  {
    quote: "Every visit, the site looked exactly as promised in the brochure.",
    name: "Priya Joshi",
    role: "Homeowner",
    project: "One Tapi",
    city: "Surat",
    video: { src: video.heroAerial.medium, poster: "one-tapi/garden" },
  },
  {
    quote:
      "We compared several developers in Vesu. Pramukh was the only one that walked us through every specification openly. That transparency is why we chose Agastya.",
    name: "Nisha Mehta",
    role: "Homeowner",
    project: "Agastya",
    city: "Surat",
  },
  {
    quote:
      "Our showroom at Orbit has been open for three years. The building is maintained beautifully and the team still answers the phone the same day.",
    name: "Hardik Patel",
    role: "Business owner",
    project: "Orbit",
    city: "Vapi",
  },
  {
    quote:
      "The greenery around our home in Silvassa feels like a resort. My parents walk the gardens every morning. It is exactly the peaceful life we were looking for.",
    name: "Kavita Rathod",
    role: "Homeowner",
    project: "Yogi Woods",
    city: "Silvassa",
  },
  {
    quote:
      "As an NRI buyer I was worried about managing everything from abroad. Regular construction updates and photos made the whole process effortless.",
    name: "Sameer Shah",
    role: "NRI homeowner",
    project: "Aristo",
    city: "Vapi",
  },
  {
    quote: "We moved in on the date we were given, not a week later.",
    name: "Manoj Patel",
    role: "Homeowner",
    project: "Swarit",
    city: "Vapi",
    video: { src: video.heroAerial.medium, poster: "swarit/street" },
  },
  {
    quote:
      "Three generations of our family now live in Pramukh homes. That says everything about the trust this group has earned in Vapi over the years.",
    name: "Jayesh Bhanushali",
    role: "Homeowner",
    project: "Green County",
    city: "Vapi",
  },
];

/** Image beside the heading (a real Pramukh project). */
export const voicesImage: MediaKey = "green-county/entrance";
