import * as React from "react";

type Props = React.SVGProps<SVGSVGElement>;

export default function CheckIcon(props: Props) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M7.5 13.5l-3-3 1.414-1.414L7.5 10.672l6.586-6.586L15.5 5.5 7.5 13.5z" />
    </svg>
  );
}
