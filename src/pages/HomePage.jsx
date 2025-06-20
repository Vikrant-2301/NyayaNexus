import About from "@/components/blocks/Home/about";
import Banner from "@/components/blocks/Home/Banner";
import BlogList from "@/components/blocks/Home/bloglist";
import { Contact } from "@/components/blocks/Home/contact";
import { FeaturesSectionWithHoverEffects } from "@/components/blocks/Home/features";

function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Main content */}
      <div className="relative z-10">
        <Banner />
        <About />
        <FeaturesSectionWithHoverEffects />
        <BlogList />
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
