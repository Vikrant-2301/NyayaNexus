import About from "@/components/blocks/Home/about";
import Activities from "@/components/blocks/Home/activities";

import Banner from "@/components/blocks/Home/Banner";
import Collab from "@/components/blocks/Home/collab";
import { Contact } from "@/components/blocks/Home/contact";
import { FeaturesSectionWithHoverEffects } from "@/components/blocks/Home/features";
import Speakers from "@/components/blocks/Home/speakers";

import Venue from "@/components/blocks/Home/venue";

function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Main content */}
      <div className="relative z-10">
        <Banner />
        <About />
        <FeaturesSectionWithHoverEffects />
        {/* <Activities /> */}
        {/* <Speakers /> */}
        {/* <Venue /> */}
        {/* <Collab /> */}
        <Contact />
      </div>
    </div>
  );
}

export default HomePage;
