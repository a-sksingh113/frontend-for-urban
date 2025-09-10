import * as React from "react";

type Props = React.SVGProps<SVGSVGElement> & { size?: number };

export default function VerifySealIcon({
  size = 14,
  className,
  ...props
}: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M8.38 12L10.79 14.42L15.62 9.58"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M10.75 2.45c.69-.59 1.82-.59 2.52 0l1.58 1.36c.3.26.86.47 1.26.47h1.7a2.43 2.43 0 0 1 2.43 2.43v1.7c0 .39.21.96.47 1.26l1.36 1.58c.59.69.59 1.82 0 2.52l-1.36 1.58c-.26.3-.47.86-.47 1.26v1.7a2.43 2.43 0 0 1-2.43 2.43h-1.7c-.39 0-.96.21-1.26.47l-1.58 1.36c-.7.59-1.83.59-2.53 0l-1.58-1.36c-.3-.26-.86-.47-1.26-.47H6.18A2.43 2.43 0 0 1 3.75 17.81v-1.71c0-.39-.21-.96-.47-1.26L1.92 13.26c-.58-.69-.58-1.84 0-2.53l1.36-1.58c.26-.31.47-.87.47-1.27V6.2c0-1.06.87-1.93 1.93-1.93h1.73c.39 0 .96-.22 1.26-.47l1.58-1.35Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
