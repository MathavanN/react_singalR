import React, { useContext, Fragment, useEffect } from 'react'
import { RootStoreContext } from '../../app/stores/rootStore'
import { observer } from 'mobx-react-lite'
import { List, Grid, Button } from 'semantic-ui-react'
import { LoadingComponent } from '../../app/layout/LoadingComponent'
import { ICreateActivity } from '../../app/models/activity'
import { Link } from 'react-router-dom'

const ActivityDashboard = () => {
    const rootStore = useContext(RootStoreContext)
    const { user } = rootStore.userStore;
    const { activities, loadingInitial, loadActivities, createActivity, deleteActivity } = rootStore.activityStore;

    useEffect(() => {
        if (user !== null)
            loadActivities(user!.userName);
    }, [loadActivities, user]);

    const handleCreatActivity = () => {
        const tempActivity: ICreateActivity = {
            name: "Test"
        }
        createActivity(tempActivity);
    }
    if (loadingInitial)
        return <LoadingComponent content="Loading activities" />

    return (
        <Fragment>
            <Grid>
                <Grid.Column width={10}>
                    {
                        activities && (
                            <List divided relaxed>
                                {activities.map(activity => (
                                    <List.Item key={activity.id}>
                                        <List.Content floated='right'>
                                            <Button.Group>
                                                <Button onClick={(e) => deleteActivity(e, activity.id)}>Delete</Button>

                                                <Button
                                                    as={Link} to={`/activity/${activity.id}`}>View Status</Button>
                                            </Button.Group>

                                        </List.Content>
                                        <List.Icon name='github' size='large' verticalAlign='middle' />
                                        <List.Content>
                                            <List.Header as='a'>{activity.id}</List.Header>
                                            <List.Description as='a'>Name: {activity.name}</List.Description>
                                            <List.Description as='a'>Status: {activity.status}</List.Description>
                                            <List.Description as='a'>Result: {activity.result}</List.Description>
                                        </List.Content>
                                    </List.Item>
                                ))}
                            </List>
                        )
                    }
                    <Button primary onClick={handleCreatActivity}>CreateActivity</Button>
                </Grid.Column>
                <Grid.Column width={6}>
                </Grid.Column>
            </Grid>

        </Fragment>

    )
}

export default observer(ActivityDashboard)
