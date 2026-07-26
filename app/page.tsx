import SynthwaveHero from "@/components/SynthwaveHero";
import HowItWorks from "@/components/HowItWorks";
import FeatureOverview from "@/components/FeatureOverview";
import { getActiveCampaigns } from "@/lib/data";

export default async function Home() {
  const campaigns = await getActiveCampaigns();

  return (
    <>
      <SynthwaveHero />
      <HowItWorks />
      <FeatureOverview campaigns={campaigns} />
    </>
  );
}
