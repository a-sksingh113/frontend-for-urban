import * as React from "react";
import type { User } from "@/types/user";
import { Field } from "./Field";
import { MapPin, Map } from "lucide-react";

type Props = { user: User };

export function ProfileAddress({ user }: Props) {
  const locationLine = [user.city, user.state, user.country]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="grid gap-5">
      <Field
        icon={<MapPin className="w-4.5 h-4.5" />}
        label="Location"
        value={locationLine || undefined}
      />
      <Field
        icon={<Map className="w-4.5 h-4.5" />}
        label="ZIP / Postcode"
        value={user.zipCode || undefined}
      />
    </div>
  );
}
