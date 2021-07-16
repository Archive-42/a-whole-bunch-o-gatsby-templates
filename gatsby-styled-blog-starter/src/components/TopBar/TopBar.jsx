const config = require("../../utils/siteConfig");
import React from "react";
import styled, { keyframes } from "styled-components";
import Link from "gatsby-link";
import SVGelem from "../Other/SVGelem.jsx";
import { ICONS, LOGOS } from "../../utils/constants";

const Wrapper = styled.header`
  align-items: center;
  background: ${props =>
    props.navigatorIsAside || !props.navigatorIsActive
      ? props => props.theme.topBar.backgrounds.wrapperPost
      : props => props.theme.topBar.backgrounds.wrapper};
  box-shadow: ${props =>
    props.navigatorIsAside || !props.navigatorIsActive
      ? "0 1px 0px rgba(2, 2, 0, 0.05)"
      : "0 1px 1px rgba(2, 2, 0, 0.2)"};
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  height: ${props => props.theme.topBar.sizes.height}px;
  justify-content: space-between;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: all 0.6s ease;
  z-index: 1;

  @media screen and (min-width: ${props => props.theme.mediaQueryTresholds.M}) {
    height: ${props => props.theme.topBar.sizes.height + 12}px;
  }
  @media screen and (min-width: ${props => props.theme.mediaQueryTresholds.L}) {
    left: ${props =>
      props.navigatorIsAside
        ? props => props.theme.navigator.sizes.asideWidth
        : "0"};
  }
`;

const Logo = styled.span`
  display: block;
  font-size: 1em;
  font-weight: 700;
  line-height: 1;
  margin: 0.2em 0 0 1em;
  text-transform: uppercase;
  width: 240px;

  svg path {
    fill: ${props =>
      props.navigatorIsAside || !props.navigatorIsActive
        ? props => props.theme.topBar.colors.logoPost
        : props => props.theme.topBar.colors.logo};
  }
`;

const Btn = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 10px;
  transition: all 1s;

  > span {
    background: ${props => props.theme.topBar.backgrounds.icon};
    color: ${props => props.theme.topBar.colors.link};
    fill: currentColor;
    border-radius: 100%;
    display: block;
    height: 24px;
    width: 24px;
    padding: 3px;
  }

  @media screen and (min-width: ${props => props.theme.mediaQueryTresholds.M}) {
    padding: 16px;
  }
`;

const TopBar = props => (
  <Wrapper
    navigatorIsAside={props.navigatorIsAside}
    navigatorIsActive={props.navigatorIsActive}
  >
    <Logo
      navigatorIsAside={props.navigatorIsAside}
      navigatorIsActive={props.navigatorIsActive}
    >
      <Link to="/">
        <SVGelem svg={LOGOS.TOP} />
      </Link>
    </Logo>
    <Btn onClick={props.btnOnClick} aria-label="Unfold">
      <span>
        <SVGelem svg={ICONS.INFO} />
      </span>
    </Btn>
  </Wrapper>
);

export default TopBar;
