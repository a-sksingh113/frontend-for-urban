import * as React from "react";

export function useLockBodyScroll(locked: boolean) {
  React.useLayoutEffect(() => {
    if (!locked) return;

    const { body } = document;
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    body.style.overflow = "hidden";
    if (scrollBarWidth > 0) {
      body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [locked]);
}
