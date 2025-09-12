import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/atoms";
import { Edit, Lock } from "lucide-react";

export function ProfileActions() {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <Button asChild className="font-normal">
        <Link href="/edit-profile">
          <Edit className="mr-2 w-5 h-5" />
          Edit Profile
        </Link>
      </Button>
      <Button asChild variant="secondary" className="font-normal">
        <Link href="/change-password">
          <Lock className="mr-2 w-5 h-5" />
          Change Password
        </Link>
      </Button>
    </div>
  );
}
