import * as React from "react";
import { Badge, Rating } from "@/components/atoms";

type Props = {
  rating: number;
  isOpen: boolean;
  count?: number;
};

export function Availability({ rating, isOpen, count }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Rating value={rating} count={count} />
      <Badge variant={isOpen ? "success" : "neutral"}>
        {isOpen ? "Open now" : "Closed"}
      </Badge>
    </div>
  );
}
