import dynamic from "next/dynamic";
import React from "react";

const NoSsr = ({ children }: { children: JSX.Element }) => (
  // TOOD: Document: Why is a Fragment used.
  <React.Fragment>{children}</React.Fragment>
);

/**
 * Uses next/dynamic to disable server-side rendering for a component.
 */
export default dynamic(() => Promise.resolve(NoSsr), {
  ssr: false
});