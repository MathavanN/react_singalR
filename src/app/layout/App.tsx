import React, { Fragment, FC, useContext, useEffect } from 'react'
import ModalContainer from '../common/modals/ModalContainer'
import { ToastContainer } from 'react-toastify'
import { RouteComponentProps, withRouter, Route, Switch } from 'react-router-dom'
import { RootStoreContext } from '../stores/rootStore'
import { observer } from 'mobx-react-lite'
import Home from '../../features/home/Home'
import ActivityDashboard from '../../features/activities/ActivityDashboard'
import { Header, Container } from 'semantic-ui-react'
import ActivityChat from '../../features/activities/ActivityChat'
import NotFound from './NotFound'

const App: FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext)
  const { setAppLoaded, token } = rootStore.commonStore
  const { getUser, user } = rootStore.userStore;
  useEffect(() => {
    console.log(token)
    if (token) {
      getUser().finally(() => setAppLoaded())
    }
    else {
      setAppLoaded()
    }
  }, [token, getUser, setAppLoaded])
  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer position='bottom-right' />
      <Header as='h2' disabled textAlign='center'>
        Test SignalR App {user && `(Current User is ${user!.userName})`}
      </Header>

      <Container style={{ marginTop: '3em' }}>
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/activities' exact component={ActivityDashboard} />
          <Route path='/activity/:id' exact component={ActivityChat} />
          <Route component={NotFound} />
        </Switch>
      </Container>

    </Fragment>
  )
}

export default withRouter(observer(App));
