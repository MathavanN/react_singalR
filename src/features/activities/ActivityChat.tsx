import React, { FC, Fragment, useContext, useEffect, useState } from "react";
import { Segment, Divider } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";

interface DetailsParams {
  id: string;
}
const ActivityChat: FC<RouteComponentProps<DetailsParams>> = ({ match }) => {
  const rootStore = useContext(RootStoreContext);
  const {
    loadActivity,
    connectToGroup,
    stopHubConnection,
    details,
    activity,
  } = rootStore.activityStore;
  const { token } = rootStore.commonStore;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (match.params.id) {
      setLoading(true);
      loadActivity(match.params.id).finally(() => setLoading(false));

      connectToGroup(match.params.id);
    }
    return () => {
      stopHubConnection();
    };
  }, [loadActivity, match.params.id, token, connectToGroup, stopHubConnection]);

  return (
    <Fragment>
      {loading === false && activity !== null && (
        <Fragment>
          <Segment inverted size="massive" color="teal">
            {`Activity Id: ${activity!.id}`}
          </Segment>

          <Segment inverted size="huge" color="teal">
            {`Activity Name: ${activity!.name}`}
          </Segment>

          <Segment color="yellow">Current Status : {activity!.status}</Segment>
          <Segment color="yellow">Activity Result : {activity!.result}</Segment>
          <Divider horizontal>
            Status By SignalR (Messages received to this activity)
          </Divider>
          <div>Activity Status : {details}</div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default observer(ActivityChat);
