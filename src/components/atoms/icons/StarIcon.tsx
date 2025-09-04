import * as React from "react";

type Props = React.SVGProps<SVGSVGElement>;

export default function StarIcon(props: Props) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M10 2.5l2.36 4.78 5.28.77-3.82 3.72.9 5.26L10 14.96l-4.72 2.47.9-5.26L2.36 8.05l5.28-.77L10 2.5z" />
    </svg>
  );
}
