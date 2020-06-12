import React, { useContext, Fragment } from "react";
import { RootStoreContext } from "../../app/stores/rootStore";
import { List, Message, Header } from "semantic-ui-react";
import ActivityListItem from "./ActivityListItem";
import { observer } from "mobx-react-lite";

const ActivityList = () => {
  const rootStore = useContext(RootStoreContext);
  const { activities } = rootStore.activityStore;
  const { user } = rootStore.userStore;
  return (
    <Fragment>
      {activities.length === 0 ? (
        <Message warning>
          <Message.Header>
            {user!.userName}, there are no activities.
          </Message.Header>
          <p>Please create a new activity.</p>
        </Message>
      ) : (
        <Fragment>
          <Header
            as="h2"
            icon
            textAlign="center"
            style={{ marginBottom: "3em" }}
          >
            <Header.Content>Activities by {user!.displayName}</Header.Content>
          </Header>
          <List divided relaxed="very">
            {activities.map((activity) => (
              <ActivityListItem key={activity.id} activity={activity} />
            ))}
          </List>
        </Fragment>
      )}
    </Fragment>
  );
};

export default observer(ActivityList);
