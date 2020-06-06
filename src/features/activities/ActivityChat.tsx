import React, { FC, Fragment, useContext, useEffect, useState } from 'react'
import { IActivity, IUpdateActivityStatus } from '../../app/models/activity'
import { Header, Segment, Divider } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore'
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { HubConnectionBuilder, HubConnectionState, LogLevel, HubConnection } from '@microsoft/signalr';

interface DetailsParams {
    id: string
}
const ActivityChat: FC<RouteComponentProps<DetailsParams>> = ({ match, history }) => {
    const rootStore = useContext(RootStoreContext)
    const { loadActivity, updateActivityStatus } = rootStore.activityStore;
    const { token } = rootStore.commonStore;

    const [activity, setActivity] = useState<IActivity | null>(null)
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('')
    const [hubConnection, setHubConnection] = useState<HubConnection>();

    // Set the Hub Connection on mount.
    useEffect(() => {
        if (match.params.id) {
            setLoading(true)
            loadActivity(match.params.id)
                .then(activity => setActivity(activity!))
                .finally(() => setLoading(false));

            const createHubConnection = async (boardId: string) => {

                // Build new Hub Connection, url is currently hard coded.
                const hubConnect = new HubConnectionBuilder()
                    .withUrl(process.env.REACT_APP_API_CHAT_URL!, {
                        accessTokenFactory: () => token!
                    })
                    .configureLogging(LogLevel.Information)
                    .withAutomaticReconnect()
                    .build();

                try {
                    await hubConnect.start()
                    console.log('Connection successful!')

                    // Bind event handlers to the hubConnection.
                    hubConnect.on("ActivityProgress", (percentage: number) => {

                        if (percentage % 5 === 0) {
                            const activityStatus: IUpdateActivityStatus = {
                                id: boardId,
                                percentage: percentage
                            }
                            updateActivityStatus(activityStatus).then(activity => setActivity(activity!));
                        }

                        if (percentage === 100) {
                            setStatus("Finished!")
                        }
                        else {
                            setStatus(`${percentage}%`)
                        }
                    })

                    if (hubConnect.state === HubConnectionState.Connected) {
                        hubConnect.invoke('AssociateJob', boardId).catch((err: Error) => {
                            return console.error('inside AssociateJob error', err.toString());
                        });
                    }
                }
                catch (err) {
                    alert(err);
                    console.log('Error while establishing connection: ' + { err })
                }
                setHubConnection(hubConnect);
            }
            createHubConnection(match.params.id);

        }
        // return () => {
        //     if (hubConnection !== undefined) {
        //         hubConnection!.stop();
        //     }

        // }

        return () => {
            console.log('Cleanup called')
            hubConnection?.stop();
        }

    }, [loadActivity, match.params.id, token, updateActivityStatus]);

    return (
        <Fragment>
            {loading === false && activity !== null &&
                (
                    <Fragment>
                        <Header
                            as='h2'
                            content={activity!.id}
                            subheader={activity!.name}
                        />
                        <Segment attached>
                            Current Status : {activity!.status}
                        </Segment>
                        <Segment attached>
                            Activity Result : {activity!.result}
                        </Segment>
                        <Divider horizontal>Status By SignalR (Messages received to this activity)</Divider>
                        <div>Activity Status : {status}</div>
                    </Fragment>
                )
            }
        </Fragment>
    )
}

export default observer(ActivityChat)
