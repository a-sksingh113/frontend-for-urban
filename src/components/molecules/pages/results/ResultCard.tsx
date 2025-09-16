import * as React from "react";
import { Card, Heading, Button } from "@/components/atoms";
import { Badge } from "@/components/atoms";
import type { Pro } from "@/types/results";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { FileText, Phone, MapPin, CheckIcon, Star } from "lucide-react";
import { formatDistance } from "@/lib/formatDistance";

type Props = Pro;

export function ResultCard({
  id,
  imageUrl,
  name,
  rating,
  isOpen,
  tel,
  bookHref,
  distanceKm,
  totalRating,
}: Props) {
  console.log(bookHref);
  return (
    <article aria-labelledby={`${id}-name`}>
      <Card
        className={cn(
          // ✅ equal heights in grid
          "h-full flex flex-col",
          "overflow-hidden rounded-2xl border border-slate-200 shadow-sm p-0",
          "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-blue-100"
        )}
      >
        {/* Top image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
              className="object-cover object-center"
              priority={false}
            />
          ) : null}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col grow">
          <div className="mb-2 flex items-start justify-between gap-3">
            <Heading
              as="h4"
              id={`${id}-name`}
              className="leading-snug tracking-tight line-clamp-2"
            >
              {name}
            </Heading>

            <span className="shrink-0">
              {isOpen !== null ? (
                <Badge variant={isOpen ? "success" : "neutral"}>
                  <CheckIcon className="inline-block h-3.5 w-3.5" />
                  {isOpen ? "Available" : "Unavailable"}
                </Badge>
              ) : null}
            </span>
          </div>

          {/* Rating + distance */}
          <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="font-medium text-slate-800 flex items-baseline gap-1">
                <span>{Number.isFinite(rating) ? rating.toFixed(1) : "—"}</span>
                <span className="text-slate-400">/</span>
                <span>{totalRating}</span>
              </span>
            </span>
            {typeof distanceKm === "number" && (
              <>
                <span className="text-slate-300">|</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {formatDistance(distanceKm)}
                </span>
              </>
            )}
          </div>

          {/* CTAs */}
          <div className="mt-auto flex items-center gap-3">
            {bookHref ? (
              <Button asChild className="flex-1">
                <Link
                  href={bookHref}
                  aria-label={`Get quote from ${name}`}
                  className="inline-flex items-center justify-center gap-2"
                >
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  <span>Get Quote</span>
                </Link>
              </Button>
            ) : (
              <Button className="flex-1" disabled aria-disabled="true">
                <FileText className="h-4 w-4 mr-2" aria-hidden="true" />{" "}
                <span>Get Quote</span>
              </Button>
            )}

            {tel ? (
              <Button variant="secondary" asChild className="flex-1">
                <a
                  href={`tel:${tel}`}
                  aria-label={`Call ${name} now`}
                  className="inline-flex items-center justify-center gap-2"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  <span>Call Now</span>
                </a>
              </Button>
            ) : (
              <Button
                variant="secondary"
                className="flex-1"
                disabled
                aria-disabled="true"
              >
                <Phone className="h-4 w-4 mr-2" aria-hidden="true" />
                <span>Call Now</span>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </article>
  );
}
