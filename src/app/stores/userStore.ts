import { RootStore } from "./rootStore";
import { observable, computed, action, runInAction } from "mobx";
import { IUser, IUserLogin } from "../models/user";
import agent from "../api/agent";
import history from '../../history'

export default class UserStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore
    }

    @observable user: IUser | null = null
    @observable loading = false;

    @computed get isLoggedIn() {
        return !!this.user
    }

    @action getUser = async () => {
        this.loading = true
        try {
            const user = await agent.Users.current();
            runInAction('get current user', () => {
                this.user = user;
                this.loading = false;
            })
        } catch (error) {
            console.log(error)
            runInAction('get current user', () => {
                this.user = null;
                this.loading = false;
            })
        }
    }

    @action login = async (values: IUserLogin) => {
        try {
            const user = await agent.Users.login(values);
            runInAction('login user', () => {
                this.user = user;
            })
            this.rootStore.commonStore.setToke(user.token)
            this.rootStore.modalStore.closeModal();
            history.push('/activities')

        } catch (error) {
            console.log(error)
            throw error;
        }
    }

    @action logout = () => {
        this.rootStore.commonStore.setToke(null);
        this.user = null
        history.push('/')
    }
}