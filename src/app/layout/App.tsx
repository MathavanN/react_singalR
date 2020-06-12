import React, { Fragment, FC, useContext, useEffect } from "react";
import ModalContainer from "../common/modals/ModalContainer";
import { ToastContainer } from "react-toastify";
import {
  RouteComponentProps,
  withRouter,
  Route,
  Switch,
} from "react-router-dom";
import { RootStoreContext } from "../stores/rootStore";
import { observer } from "mobx-react-lite";
import Home from "../../features/home/Home";
import ActivityDashboard from "../../features/activities/ActivityDashboard";
import { Container } from "semantic-ui-react";
import ActivityChat from "../../features/activities/ActivityChat";
import NotFound from "./NotFound";
import NavBar from "../../features/nav/NavBar";
import { LoadingComponent } from "./LoadingComponent";
import PrivateRoute from "./PrivateRoute";

const App: FC<RouteComponentProps> = () => {
  const rootStore = useContext(RootStoreContext);
  const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
  const { getUser } = rootStore.userStore;
  useEffect(() => {
    if (token) {
      getUser().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
    }
  }, [token, getUser, setAppLoaded]);

  if (!appLoaded)
    return <LoadingComponent content="Loading SignalR Demo App" />;
  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer position="bottom-right" />
      <NavBar />
      <Route path="/" exact component={Home} />
      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            <Container style={{ marginTop: "5em" }}>
              <Switch>
                <PrivateRoute
                  path="/activities"
                  exact
                  component={ActivityDashboard}
                />
                <PrivateRoute
                  path="/activity/:id"
                  exact
                  component={ActivityChat}
                />
                <Route component={NotFound} />
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
