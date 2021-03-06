# React Application to demo SignalR

### Dependency
- VS Code
- Node (12.16.2)
- API/SignalR implementation - checkout my [ASP.NET CORE SingalR API Sample Implementation](https://github.com/MathavanN/asp_net_core_signalR)

### Run
- Open the React project in VS Code
- Install the required packages, use "npm install"
- Run the above downloaded [ASP.NET CORE SingalR API Sample Implementation](https://github.com/MathavanN/asp_net_core_signalR) project
- Copy the URL of API
- Go to React project and find ".env.development" file.
- Modify the URL
- Run the React Application by "npm start"
- Default users added to the API project (bob@test.com, jane@test.com, tom@test.com) with password "Pa$$w0rd"
- Use any of the user login details
- Create a new activity, right side youo can see the reply from SignalR (regardless of user)
- Along with the list of activity, there two buttons. Delete/View Status
- Click on View Status, go to the activity details page, where you can see the SignalR reply for that particular activity.
- Single SingalR connection used.

### Current Issues in React Application
- ~~If a client disconnect, the SignalR connection is not stopping.~~ (fixed)
- ~~If a client disconnect and reconnect, it will create multiple SignalR connections.~~ (fixed)
