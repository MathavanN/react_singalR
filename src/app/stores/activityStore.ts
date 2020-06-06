import { RootStore } from "./rootStore";
import { observable, action, runInAction } from "mobx";
import { IActivity, ICreateActivity, IUpdateActivityStatus } from "../models/activity";
import agent from "../api/agent";
import { SyntheticEvent } from "react";
import history from '../../history'

export default class ActivityStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore
    }

    @observable activities: IActivity[] = [];
    @observable activity: IActivity | null = null
    @observable loadingInitial = false;
    @observable progressStatus: string = ""
    @observable submitting = false;
    @observable target = "";

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
            history.push(`/activity/${activity.id}`)
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
                console.log(this.activities.length)
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