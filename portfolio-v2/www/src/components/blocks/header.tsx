import * as React from "react"
import { Flex } from "@chakra-ui/react"
import { useLocation } from "@reach/router"
import { useDistinctCategories } from "../../hooks/use-distinct-categories"
import { Link } from "../link"
import { Navigation } from "./navigation"
import { FullWidthContainer } from "./full-width-container"
import { Spacer } from "./spacer"

const Logo: React.FC = () => (
  <Link to="/" transform="scale(1)" _hover={{ transform: `scale(1.1)` }} aria-label="lekoarts.de, Back to homepage">
    <svg
      width="35"
      height="35"
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.647 0.427197C35.7353 7.34621 63.4191 9.41513 75 9.58472L75 89.4586C72.6103 88.2715 66.397 85.8974 60.6618 85.8974C62.6838 77.4182 64.6323 57.2038 56.25 44.1798C51.2868 43.1623 38.1618 42.3483 25.3676 47.2323C29.0441 50.9631 40.2573 58.4248 55.6985 58.4248C57.9044 62.6644 61.4338 75.1119 57.9044 90.9849C57.7206 92.0024 58.4559 94.0374 62.8676 94.0374C68.3823 94.0374 72.7941 95.5636 72.7941 103.704V120.492C70.7959 122.336 62.8375 126.498 46.8965 128.56C38.7469 113.023 25.1443 103.412 17.6471 100.142C20.0368 91.8328 21.1765 70.0243 6.61764 49.2673C-7.94118 28.5103 7.9044 8.05846 17.647 0.427197ZM75 89.4586L75 9.58472C86.5809 9.41513 114.265 7.34621 132.353 0.427197C142.096 8.05846 157.941 28.5103 143.382 49.2673C128.824 70.0243 129.963 91.8328 132.353 100.142C124.856 103.412 111.253 113.023 103.104 128.56C87.1625 126.498 79.2041 122.336 77.2059 120.492V103.704C77.2059 95.5636 81.6177 94.0374 87.1324 94.0374C91.5441 94.0374 92.2794 92.0024 92.0956 90.9849C88.5662 75.1119 92.0956 62.6644 94.3015 58.4248C109.743 58.4248 120.956 50.9631 124.632 47.2323C111.838 42.3483 98.7132 43.1623 93.75 44.1798C85.3677 57.2038 87.3162 77.4182 89.3382 85.8974C83.603 85.8974 77.3897 88.2715 75 89.4586ZM50.2092 136.096C54.9807 134.31 64.5209 131.685 75 131.685L75 150C64.4118 150 55.8823 148.304 52.9412 146.947C52.3649 143.108 51.4253 139.489 50.2092 136.096ZM75 131.685L75 150C85.5882 150 94.1177 148.304 97.0588 146.947C97.6351 143.108 98.5747 139.489 99.7908 136.096C95.0193 134.31 85.4791 131.685 75 131.685Z"
        fill="currentColor"
      />
    </svg>
  </Link>
)

type HeaderProps = {
  subnavigation?: React.ReactNode
}

export const Header: React.FC<HeaderProps> = ({ subnavigation = undefined }) => {
  const categorySlugs = useDistinctCategories()
  const location = useLocation()
  const isCategoryPage = categorySlugs.includes(location.pathname)
  const variant = subnavigation ? `navigationWithSub` : `navigation`
  const height = subnavigation ? `navigationWithSubHeight` : `navigationHeight`

  return (
    <>
      <FullWidthContainer variant={isCategoryPage ? `fullBleed` : variant} height={height}>
        <Flex as="header" alignItems="center" justifyContent="space-between" py="13px">
          <Logo />
          <Navigation />
        </Flex>
        {subnavigation}
      </FullWidthContainer>
      {!isCategoryPage && <Spacer size={height} axis="vertical" />}
    </>
  )
}
