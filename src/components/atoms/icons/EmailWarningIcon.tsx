import * as React from "react";

type Props = React.SVGProps<SVGSVGElement> & { size?: number };

export default function EmailWarningIcon({
  size = 20,
  className,
  ...props
}: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        d="M12 10V13"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M12 16V15.9888"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <path
        d="M10.2518 5.147L3.6508 17.0287C2.91021 18.3618 3.87415 20 5.39912 20H18.6011C20.126 20 21.09 18.3618 20.3494 17.0287L13.7484 5.147C12.9864 3.77538 11.0138 3.77538 10.2518 5.147Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
