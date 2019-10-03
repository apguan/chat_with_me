import React from "react";
import styled from "styled-components";

const Container = styled.nav`
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  background-color: #7758c6;
  width: 100%;
  height: 80px;
  position: fixed;
  top: 0;
`;

const Navbar = () => {
  return <Container></Container>;
};

export default Navbar;
