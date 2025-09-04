import * as React from "react";

type CameraIconProps = React.SVGProps<SVGSVGElement>;

export default function CameraIcon(props: CameraIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="h-6 w-6 fill-blue-600"
      aria-hidden="true"
      {...props}
    >
      <path d="M9 3h6l1 2h3a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h3l1-2zm3 6a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  );
}
