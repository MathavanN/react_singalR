import React, { useContext } from "react";
import { Menu, Container, Dropdown, Image } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { RootStoreContext } from "../../app/stores/rootStore";

const NavBar = () => {
  const rootStore = useContext(RootStoreContext);
  const { user, logout } = rootStore.userStore;
  return (
    <Menu fixed="top">
      <Container>
        <Menu.Item header as={NavLink} exact to="/">
          <img
            src="/assets/logo.png"
            alt="logo"
            style={{ marginRight: "10px" }}
          />
          Activities
        </Menu.Item>

        <Menu.Item name="Activities" as={NavLink} to="/activities" />
        {user && (
          <Menu.Item position="right">
            <Image avatar spaced="right" src="/assets/user.png" />
            <Dropdown pointing="top left" text={user.displayName}>
              <Dropdown.Menu>
                <Dropdown.Item onClick={logout} text="Logout" icon="power" />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        )}
      </Container>
    </Menu>
  );
};

export default NavBar;
