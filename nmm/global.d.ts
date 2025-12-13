import type * as ReactNamespace from "react";
import type * as ReactDOMClientNamespace from "react-dom/client";

declare global {
  const React: typeof ReactNamespace;
  const ReactDOM: typeof ReactDOMClientNamespace;

  namespace JSX {
    interface IntrinsicElements
      extends ReactNamespace.JSX.IntrinsicElements {}
    interface Element extends ReactNamespace.JSX.Element {}
    interface ElementClass extends ReactNamespace.JSX.ElementClass {}
    interface ElementAttributesProperty
      extends ReactNamespace.JSX.ElementAttributesProperty {}
    interface ElementChildrenAttribute
      extends ReactNamespace.JSX.ElementChildrenAttribute {}
    interface IntrinsicAttributes
      extends ReactNamespace.JSX.IntrinsicAttributes {}
  }
}

export {};
