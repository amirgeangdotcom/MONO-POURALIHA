"use client";

import Link from "next/link";
import { FadeImage } from "@/components/fade-image";
import { useI18n } from "@/lib/i18n";

const features = [
  {
    image: "/images/4312e1bb-e030-4528-b6df-8a6ea69fe384.png",
    span: "col-span-2 row-span-2", // Large
  },
  {
    image: "/images/b2401fa5-4eac-465f-b1f9-014aadc182ee.png",
    span: "col-span-1 row-span-1", // Small
  },
  {
    image: "/images/dd1b32a8-3722-4ea2-8808-10d53532809d.png",
    span: "col-span-1 row-span-1", // Small
  },
  {
    image: "/images/61af06cc-84d0-4031-a0ed-76fc43b1c1e1.png",
    span: "col-span-1 row-span-2", // Tall
  },
  {
    image: "/images/249083d2-c49c-4c06-a125-376284d90c42.png",
    span: "col-span-1 row-span-1", // Small
  },
  {
    image: "/images/7638f650-8586-4403-8c13-141921a04f9d.png",
    span: "col-span-2 row-span-1", // Wide
  },
  {
    image: "/images/5b3bdb95-fac7-4d22-aa97-98b5d547b2db.png",
    span: "col-span-1 row-span-1", // Small
  },
  {
    image: "/images/634f7bae-77a5-49d0-a0ab-5271a6194e66.png",
    span: "col-span-1 row-span-2", // Tall
  },
  {
    image: "/images/09ffa8fd-cdd1-453f-9aa2-d6c702a1f4b5.png",
    span: "col-span-2 row-span-1", // Wide
  },
  {
    image: "/images/040e36b1-d16f-474b-a712-a9979e6ab479.png",
    span: "col-span-1 row-span-1", // Small
  },
];

export function FeaturedProductsSection() {
  const { t } = useI18n();
  return (
    <section id="technology" className="relative bg-background py-20 md:py-32">
      <div className="px-4 md:px-12 lg:px-20">
        <div className="mx-auto mb-12 flex w-full max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 className="max-w-xl text-4xl font-medium leading-none tracking-tighter text-foreground md:text-6xl">{t("Student work, shipped.")}</h2>
          <div className="flex items-center gap-6">
            <p className="max-w-xs text-muted-foreground">{t("Every project here started as a client brief and ended up in a student portfolio.")}</p>
            <Link href="/portfolio" className="whitespace-nowrap rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-80">{t("Build yours")}</Link>
          </div>
        </div>
        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full max-w-7xl mx-auto auto-rows-[180px] md:auto-rows-[220px]">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`relative overflow-hidden rounded-lg border border-gray-200 ${feature.span}`}
            >
              <FadeImage
                src={feature.image || "/placeholder.svg"}
                alt={t("Student portfolio project {n}", { n: index + 1 })}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
