import * as React from "react";
import { Button } from "@/components/atoms";
import { Edit, Lock } from "lucide-react";

type Props = {
  onEdit?: () => void;
  onChangePassword?: () => void;
};

export function ProfileActions({ onEdit, onChangePassword }: Props) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      <Button className="font-normal" onClick={onEdit}>
        <Edit className="mr-2 w-5 h-5" />
        Edit Profile
      </Button>

      <Button
        variant="secondary"
        className="font-normal"
        onClick={onChangePassword}
      >
        <Lock className="mr-2 w-5 h-5" />
        Change Password
      </Button>
    </div>
  );
}
