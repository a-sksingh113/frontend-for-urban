import * as React from "react";

type Props = React.SVGProps<SVGSVGElement> & { size?: number };

export default function InfoCircleIcon({
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
        d="M12 16H12.01M12 8V12M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
