import React, { useContext, useEffect } from "react";
import { RootStoreContext } from "../../app/stores/rootStore";
import { observer } from "mobx-react-lite";
import { Grid, Button, Segment, Message, Container } from "semantic-ui-react";
import { LoadingComponent } from "../../app/layout/LoadingComponent";
import { ICreateActivity } from "../../app/models/activity";
import ActivityList from "./ActivityList";
import ActivitySummary from "./ActivitySummary";

const ActivityDashboard = () => {
  const rootStore = useContext(RootStoreContext);
  const { user } = rootStore.userStore;
  const {
    activities,
    loadingInitial,
    loadActivities,
    createActivity,
    createHubConnection,
    stopHubConnection,
  } = rootStore.activityStore;

  useEffect(() => {
    if (user !== null) {
      loadActivities(user!.userName);
      createHubConnection();
    }
    return () => {
      stopHubConnection();
    };
  }, [loadActivities, user, createHubConnection, stopHubConnection]);

  const handleCreatActivity = () => {
    const tempActivity: ICreateActivity = {
      name: "Test",
    };
    createActivity(tempActivity);
  };

  if (loadingInitial) return <LoadingComponent content="Loading activities" />;

  return (
    <Container style={{ marginTop: "3em" }}>
      <Grid>
        <Grid.Column width={10}>
          {activities.length === 0 ? (
            <Message warning>
              <Message.Header>
                {user!.userName}, there are no activities.
              </Message.Header>
              <p>Please create a new activity.</p>
            </Message>
          ) : (
            <Segment vertical>
              <ActivityList />
            </Segment>
          )}
          <Segment vertical color="red">
            <Button primary onClick={handleCreatActivity}>
              Create Activity
            </Button>
          </Segment>
        </Grid.Column>
        <Grid.Column width={6}>
          <ActivitySummary />
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default observer(ActivityDashboard);
