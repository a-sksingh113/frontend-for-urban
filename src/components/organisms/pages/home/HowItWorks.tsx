import * as React from "react";
import { Heading, Text } from "@/components/atoms";
import MaxWidthWrapper from "@/components/layout/MaxWidthWrapper";
import Step from "@/components/molecules/pages/home/Step";
import { CameraIcon, PhoneIcon, PinIcon } from "@/components/atoms/icons";

export function HowItWorks() {
  const heading = "How It Works";
  const subheading = "Get matched with trusted pros in three simple steps";
  const sectionId = "how-it-works-heading";
  const subId = "how-it-works-sub";

  return (
    <section
      className={`py-6 md:py-10`}
      aria-labelledby={sectionId}
      aria-describedby={subId}
      role="region"
    >
      <MaxWidthWrapper>
        <div className="text-center">
          <Heading as="h2" id={sectionId}>
            {heading}
          </Heading>
          <Text muted className="mx-auto max-w-prose mt-3">
            {subheading}
          </Text>
        </div>
        <ol className="mt-6 grid auto-rows-fr grid-cols-1 gap-4 md:mt-8 md:grid-cols-3">
          <Step
            index={1}
            title="Snap a Photo"
            body="Take a quick photo of what needs fixing or describe your project."
            icon={<CameraIcon />}
          />
          <Step
            index={2}
            title="Drop Location"
            body="Enter your postcode to find professionals in your local area."
            icon={<PinIcon />}
          />
          <Step
            index={3}
            title="Get Ranked Pros"
            body="Receive 3 vetted matches ranked by rating and response time."
            icon={<PhoneIcon />}
          />
        </ol>
      </MaxWidthWrapper>
    </section>
  );
}
