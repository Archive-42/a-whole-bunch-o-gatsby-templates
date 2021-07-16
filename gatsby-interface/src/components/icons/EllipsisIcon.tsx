import React from "react"
import IconSkeleton from "./IconSkeleton"
import { IconProps } from "./types"

export default function EllipsisIcon(props: IconProps) {
  return (
    <IconSkeleton {...props} iconName="EllipsisIcon" applyColorToStroke={false}>
      <filter id="EllipsisIcon__filter" x="0" y="0" width="100%" height="100%">
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.1"></feFuncA>
        </feComponentTransfer>
      </filter>
      <circle
        cx="12"
        cy="12"
        r="10"
        style={{ filter: `url(#EllipsisIcon__filter)` }}
      />
      <circle cx="6.5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="17.5" cy="12" r="2" />
    </IconSkeleton>
  )
}
