// src/Pages/About.tsx

// Import section components from their dedicated folders
import AboutHero from "../Components/about/AboutHero.tsx";
import AboutIntroGoals from "../Components/about/AboutIntroGoals.tsx";
import AboutFeatures from "../Components/about/AboutFeatures.tsx";
import AboutTechnologies from "../Components/about/AboutTechnologies.tsx";
import AboutTeam from "../Components/about/AboutTeam.tsx";
import AboutFooter from "../Components/about/AboutFooter.tsx";

/**
 * About page for TriviaHub.
 * Renders a structured overview of the platform, team, technologies, and features.
 */
export default function About(){
  return (
    <main className="container py-5">
      <AboutHero />
      <AboutIntroGoals />
      <AboutFeatures />
      <AboutTechnologies />
      <AboutTeam />
      <AboutFooter />
    </main>
  );
}