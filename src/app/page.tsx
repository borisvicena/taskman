import Hero from "@/components/features/landing-page/hero";
import ProblemSolution from "@/components/features/landing-page/problem-solution";
import HowItWorks from "@/components/features/landing-page/how-it-works";
import Roles from "@/components/features/landing-page/roles";
import WhyTaskMan from "@/components/features/landing-page/why-task-man";
import FinalCTA from "@/components/features/landing-page/final-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <ProblemSolution />
      <HowItWorks />
      <Roles />
      <WhyTaskMan />
      <FinalCTA />
    </>
  );
}