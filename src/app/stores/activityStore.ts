import { RootStore } from "./rootStore";
import { observable, action, runInAction, computed } from "mobx";
import { IActivity, ICreateActivity, IUpdateActivityStatus, IAllActivityStatus } from "../models/activity";
import agent from "../api/agent";
import { SyntheticEvent } from "react";
import { HubConnection, HubConnectionBuilder, LogLevel, HubConnectionState } from "@microsoft/signalr";
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash'

const ALL_ACTIVITY_LIMIT = 10;
export default class ActivityStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @observable activities: IActivity[] = [];
    @observable activity: IActivity | null = null
    @observable loadingInitial = false;
    @observable progressStatus: string = ""
    @observable submitting = false;
    @observable target = "";
    @observable.ref hubConnection: HubConnection | null = null;
    @observable activityStatus = new Map();
    @observable details = ''
    @observable allActivityStatus: IAllActivityStatus[] = [];

    @computed get getAllActivityStatus() {
        return _.reverse(_.takeRight(this.allActivityStatus, ALL_ACTIVITY_LIMIT))
    }

    @action createHubConnection = async () => {
        try {
            this.hubConnection = new HubConnectionBuilder()
                .withUrl(process.env.REACT_APP_API_CHAT_URL!, {
                    accessTokenFactory: () => this.rootStore.commonStore.token!
                })
                .configureLogging(LogLevel.Information)
                .build()
            await this.hubConnection.start()
            console.log('SignalR Connection state : ', this.hubConnection!.state)

            this.hubConnection.on("ReceiveStatus", (jobId: string, user: string, percentage: number) => {
                console.log("ReceiveStatus ", jobId, user, percentage)
                runInAction('receiving status for all activities', () => {
                    const activityStatus: IAllActivityStatus = {
                        id: uuidv4(),
                        activityId: jobId,
                        userName: user,
                        percentage: percentage
                    }
                    this.allActivityStatus.push(activityStatus)
                });
            })
        } catch (error) {
            console.log('Error while establishing connection: ' + { error })
        }
    }

    @action connectToGroup = async (groupId: string) => {
        if (this.hubConnection!.state === HubConnectionState.Disconnected) {
            await this.hubConnection!.start()
        }

        console.log('from connectToGroup', this.hubConnection!.state);
        if (this.hubConnection!.state === HubConnectionState.Connected) {
            try {
                console.log('Connected')
                await this.hubConnection!.invoke('AssociateJob', groupId);
            } catch (error) {
                console.error('inside AssociateJob error : ', error);
            }
        }

        this.hubConnection!.on("ActivityProgress", (percentage: number) => {
            console.log("ActivityProgress ", percentage)
            runInAction('receiving status for a activity', () => {
                if (percentage % 5 === 0) {
                    const activityStatus: IUpdateActivityStatus = {
                        id: groupId,
                        percentage: percentage
                    }
                    this.updateActivityStatus(activityStatus);
                }

                if (percentage === 100) {
                    this.details = `${groupId}-Finished!`
                }
                else {
                    this.details = `${groupId}-${percentage}%`
                }
            })
        })
    }

    @action stopHubConnection = () => {
        this.hubConnection!.stop();
    }

    @action loadActivities = async (userId: string) => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list(userId);
            runInAction("loading activities", () => {
                this.activities = activities
                this.loadingInitial = false;
            })
        }
        catch (error) {
            runInAction("loading activities error", () => {
                this.loadingInitial = false;
            })
            console.log(error);
        }
    }

    @action loadActivity = async (id: string) => {
        this.loadingInitial = true;
        try {
            const activity = await agent.Activities.details(id);
            runInAction("loading activity", () => {
                this.activity = activity
                this.loadingInitial = false;
            })
            return activity;
        }
        catch (error) {
            runInAction("loading activity error", () => {
                this.loadingInitial = false;
            })
            console.log(error);
        }
    }

    @action createActivity = async (newActivity: ICreateActivity) => {
        this.loadingInitial = true;
        try {
            const activity = await agent.Activities.create(newActivity);
            runInAction("creating activity", () => {
                this.activities.push(activity)
                this.loadingInitial = false;
            })
        } catch (error) {
            runInAction("creating activity error", () => {
                this.loadingInitial = false;
            })
            console.log(error);
        }
    }

    @action updateActivityStatus = async (activityStatus: IUpdateActivityStatus) => {
        try {
            const activity = await agent.Activities.updateStatus(activityStatus);
            runInAction("Update activity Status", () => {
                this.activity = activity
            })
            return activity;
        } catch (error) {
            console.log(error);
        }
    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id);
            runInAction("delete an activity", () => {
                this.activities = this.activities.filter(a => a.id !== id);
                this.target = ''
            })
        }
        catch (error) {
            runInAction("delete an activity error", () => {
                this.target = ''
            })
            console.log(error);
        }
    }

}