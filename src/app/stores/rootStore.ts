import { createContext } from "react";
import { configure } from "mobx";
import UserStore from "./userStore";
import CommonStore from "./commonStore";
import ModalStore from "./modalStore";
import ActivityStore from "./activityStore";

configure({ enforceActions: 'always' })

export class RootStore {
    userStore: UserStore
    commonStore: CommonStore
    modalStore: ModalStore;
    activityStore: ActivityStore

    constructor() {
        this.userStore = new UserStore(this)
        this.commonStore = new CommonStore(this)
        this.modalStore = new ModalStore(this)
        this.activityStore = new ActivityStore(this)
    }
}

export const RootStoreContext = createContext(new RootStore())