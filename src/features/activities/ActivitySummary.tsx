import React, { useContext, Fragment } from "react";
import { RootStoreContext } from "../../app/stores/rootStore";
import { List, Label, Header } from "semantic-ui-react";
import { observer } from "mobx-react-lite";

const ActivitySummary = () => {
  const rootStore = useContext(RootStoreContext);
  const { getAllActivityStatus } = rootStore.activityStore;

  return (
    <Fragment>
      <Header as="h2" icon textAlign="center" style={{ marginTop: "0.5em" }}>
        <Header.Content>Status from all activities</Header.Content>
      </Header>
      {getAllActivityStatus.map((status) => (
        <List.Item key={status.id}>
          <List.Content>
            <List.Header as="a">
              Activity{" "}
              <Label basic color="blue">
                {status.activityId}
              </Label>{" "}
              by{" "}
              <Label basic color="green">
                {status.userName}
              </Label>
            </List.Header>
            <List.Description>{`Status: ${status.percentage}%`}</List.Description>
          </List.Content>
        </List.Item>
      ))}
    </Fragment>
  );
};

export default observer(ActivitySummary);
