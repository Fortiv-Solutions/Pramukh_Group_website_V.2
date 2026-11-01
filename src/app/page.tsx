import { Preloader } from "@/components/Preloader";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { ProjectExplorer } from "@/components/sections/ProjectExplorer";
import { Build } from "@/components/sections/Build";
import { Ownership } from "@/components/sections/Ownership";
import { Showcase } from "@/components/sections/Showcase";
import { Trust } from "@/components/sections/Trust";
import { Voices } from "@/components/sections/Voices";
import { WhereWeBuild } from "@/components/sections/WhereWeBuild";
import { Enquiry } from "@/components/sections/Enquiry";
import { Footer } from "@/components/sections/Footer";
import { TextReveals } from "@/components/TextReveals";
import { ContactDock } from "@/components/ContactDock";
import { ViewCursor } from "@/components/ViewCursor";

export default function Home() {
  return (
    <>
      <Preloader />
      <Nav />
      <main id="main">
        <Hero />
        <Intro />
        <ProjectExplorer />
        <Build />
        <Trust />
        <Ownership />
        <Showcase />
        <WhereWeBuild />
        <Voices />
        <Enquiry />
      </main>
      <Footer />
      {/* Last, so reveal triggers are measured after every section has pinned. */}
      <TextReveals />
      <ContactDock />
      <ViewCursor />
    </>
  );
}
