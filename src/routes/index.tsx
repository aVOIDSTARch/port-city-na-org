import { Title, Meta } from "@solidjs/meta";
import Hero from "~/components/Hero";

export default function Home() {
  return (
    <main class="h-screen w-screen overflow-hidden bg-brand-background text-brand-text font-sans">
      <Title>Port City Area of Narcotics Anonymous</Title>
      <Meta name="description" content="Welcome to the Port City Area of Narcotics Anonymous. Find meetings, events, and resources for recovery in Wilmington, NC and surrounding areas." />
      
      <Hero />
    </main>
  );
}
