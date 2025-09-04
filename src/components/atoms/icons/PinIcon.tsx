import * as React from "react";

type PinIconProps = React.SVGProps<SVGSVGElement>;

export default function PinIcon(props: PinIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-6 w-6 fill-fuchsia-600"
      {...props}
    >
      <path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
    </svg>
  );
}
