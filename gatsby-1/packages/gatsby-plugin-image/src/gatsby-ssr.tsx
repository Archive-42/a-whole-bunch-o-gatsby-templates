import * as React from "react"
import { oneLine } from "common-tags"
import cssNanoMacro from "../macros/cssnano.macro"
import terserMacro from "../macros/terser.macro"
import { RenderBodyArgs } from "gatsby"

const generateHtml = (
  str: string
): React.DOMAttributes<Element>["dangerouslySetInnerHTML"] => {
  return {
    __html: oneLine(str),
  }
}

export function onRenderBody({ setHeadComponents }: RenderBodyArgs): void {
  setHeadComponents([
    <style
      key="gatsby-image-style"
      dangerouslySetInnerHTML={generateHtml(cssNanoMacro`
  .gatsby-image-wrapper {
    position: relative;
    overflow: hidden;
  }
  .gatsby-image-wrapper img {
    bottom: 0;
    height: 100%;
    left: 0;
    margin: 0;
    max-width: none;
    padding: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: 100%;
    object-fit: cover;
  }
  .gatsby-image-wrapper [data-main-image] {
    opacity: 0;
    transform: translateZ(0px);
    transition: opacity 250ms linear;
    will-change: opacity;
  }
  .gatsby-image-wrapper-constrained {
    display: inline-block;
    vertical-align: top;
  }
    `)}
    />,
    <noscript
      key="gatsby-image-style-noscript"
      dangerouslySetInnerHTML={generateHtml(
        `<style>` +
          cssNanoMacro`
  .gatsby-image-wrapper noscript [data-main-image] {
    opacity: 1 !important;
  }
  .gatsby-image-wrapper [data-placeholder-image] {
    opacity: 0 !important;
  }
  ` +
          `</style>`
      )}
    />,
    <script
      key="gatsby-image-style-script"
      type="module"
      dangerouslySetInnerHTML={generateHtml(terserMacro`
  const hasNativeLazyLoadSupport = typeof HTMLImageElement !== "undefined" && "loading" in HTMLImageElement.prototype;
  if (hasNativeLazyLoadSupport) {
    document.body.addEventListener('load', function gatsbyImageNativeLoader(e) {
      // if image is not tagged with Main Image we bail
      if (typeof e.target.dataset["mainImage"] === 'undefined') {
        return
      }

      // if a main image does not have a ssr tag, we know it's not the first run anymore
      if (typeof e.target.dataset["gatsbyImageSsr"] === 'undefined') {
        return;
      }


      const target = e.target;

      let imageWrapper = null;
      let parentElement = target;
      while (imageWrapper === null && parentElement) {
        if (typeof parentElement.parentNode.dataset["gatsbyImageWrapper"] !== "undefined") {
          imageWrapper = parentElement.parentNode;
        }
        parentElement = parentElement.parentNode;
      }
      const placeholder = imageWrapper.querySelector("[data-placeholder-image]");

      const img = new Image();
      img.src = target.currentSrc;
      // We decode the img through javascript so we're sure the blur-up effect works
      img.decode()
        .catch(() => {
          // do nothing
        })
        .then(() => {
          target.style.opacity = 1;
          if (placeholder) {
            placeholder.style.opacity = 0;
            placeholder.style.transition = "opacity 500ms linear";
          }
        })
    }, true)
  }
    `)}
    />,
  ])
}
