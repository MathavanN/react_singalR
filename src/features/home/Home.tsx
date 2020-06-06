import React, { useContext, Fragment } from 'react'
import { Button, Segment, Container, Header } from "semantic-ui-react";
import { RootStoreContext } from '../../app/stores/rootStore';
import LoginForm from '../user/LoginForm';
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom';

const Home = () => {
    const token = window.localStorage.getItem("jwt")
    const rootStore = useContext(RootStoreContext)
    const { user, isLoggedIn } = rootStore.userStore;
    const { openModal } = rootStore.modalStore;
    return (

        <Segment textAlign="center" vertical className="masthead">
            <Container text>
                {isLoggedIn && user && token ?
                    (
                        <Fragment>
                            <Header
                                as="h2"
                                content={`Welcome back ${user.displayName}`}
                            />
                            <Button as={Link} to="/activities" size="huge"> Go to activities! </Button>
                        </Fragment>
                    ) :
                    (
                        <Fragment>
                            <Button
                                onClick={() => openModal(<LoginForm />)}
                                size="huge"
                                primary
                            > Login
                        </Button>
                        </Fragment>
                    )
                }
            </Container >
        </Segment >
    )
}

export default observer(Home)
