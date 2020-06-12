import React, { FC, useContext } from "react";
import { List, Button } from "semantic-ui-react";
import { IActivity } from "../../app/models/activity";
import { Link } from "react-router-dom";
import { RootStoreContext } from "../../app/stores/rootStore";
import { observer } from "mobx-react-lite";

interface IProps {
  activity: IActivity;
}
const ActivityListItem: FC<IProps> = ({ activity }) => {
  const rootStore = useContext(RootStoreContext);
  const { deleteActivity } = rootStore.activityStore;
  return (
    <List.Item>
      <List.Content floated="right">
        <Button.Group>
          <Button negative onClick={(e) => deleteActivity(e, activity.id)}>
            Delete
          </Button>

          <Button positive as={Link} to={`/activity/${activity.id}`}>
            View Status
          </Button>
        </Button.Group>
      </List.Content>
      <List.Icon name="file alternate" size="huge" verticalAlign="middle" />
      <List.Content>
        <List.Header as={Link} to={`/activity/${activity.id}`}>
          {activity.id}
        </List.Header>
        <List.Description as="a">Name: {activity.name}</List.Description>
        <List.Description as="a">Status: {activity.status}</List.Description>
        <List.Description as="a">Result: {activity.result}</List.Description>
      </List.Content>
    </List.Item>
  );
};

export default observer(ActivityListItem);
