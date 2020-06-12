import React, { useContext, Fragment } from "react";
import {
  Button,
  Segment,
  Container,
  Message,
  Grid,
  Header,
} from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import LoginForm from "../user/LoginForm";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";

const Home = () => {
  const token = window.localStorage.getItem("jwt");
  const rootStore = useContext(RootStoreContext);
  const { user, isLoggedIn } = rootStore.userStore;
  const { openModal } = rootStore.modalStore;
  return (
    <Segment vertical>
      <Container text style={{ marginTop: "5em" }}>
        {isLoggedIn && user && token ? (
          <Fragment>
            <Message>
              <Message.Header>
                This is ASP.NET CORE/React based SignalR demo application
              </Message.Header>
              <Message.List>
                <Message.Item>
                  You can go to activities to create a new activity
                </Message.Item>
                <Message.Item>
                  ASP.NET Core SignalR endpoint return the status of that
                  activity.
                </Message.Item>
              </Message.List>
            </Message>
            <Grid>
              <Grid.Column textAlign="center">
                <Button as={Link} to="/activities" size="huge">
                  Go to activities!
                </Button>
              </Grid.Column>
            </Grid>
          </Fragment>
        ) : (
          <Fragment>
            <Grid>
              <Grid.Column textAlign="center">
                <Header as="h2" content="Welcome to SignalR Demo" />
                <Button
                  onClick={() => openModal(<LoginForm />)}
                  size="huge"
                  primary
                >
                  Login
                </Button>
              </Grid.Column>
            </Grid>
          </Fragment>
        )}
      </Container>
    </Segment>
  );
};

export default observer(Home);
