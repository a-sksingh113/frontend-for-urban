import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import {
  HeroHeadline,
  HeroPrimaryCTA,
} from "@/components/molecules/pages/home";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#fafafa] text-gray-900">
      <div
        aria-hidden
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
          repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.1) 0, rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 20px),
        repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.1) 0, rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 20px)
        `,
          backgroundSize: "40px 40px",
        }}
      />
      <MaxWidthWrapper>
        <div className="relative z-10 flex flex-col gap-5 py-6 md:py-20">
          <HeroHeadline
            title={
              <>
                Instantly Find Trusted
                <br className="hidden md:block" />
                Local Pros <span className="text-blue-600">
                  Fix Anything
                </span>{" "}
                in
                <br className="hidden md:block" /> under 30 seconds
              </>
            }
            subtitle="Connect with verified professionals in your area. Snap, drop location, get matched with top-rated pros instantly."
          />
          <div className="space-y-3.5">
            <HeroPrimaryCTA label="Start Matching" href="/start" />
            {/* <HeroSecondaryCTA /> */}
          </div>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
