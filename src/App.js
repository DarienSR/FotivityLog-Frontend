
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout';
import Landing from './components/Landing';
import FotivityLog from './components/FotivityLog';
import Login from './components/authentication/Login';
import Signup from './components/authentication/Signup';
import PersistLogin from './components/authentication/PersistLogin';
import Prefetch from './components/authentication/Prefetch';

// Sessions and Dashboard
import SessionList from './components/sessions/SessionList';
import EditSession from './components/sessions/EditSession';
import NewSession from './components/sessions/NewSession';
import Dashboard from './components/dashboard/Dashboard';

// Users
import User from './components/users/User';
import EditUser from './components/users/EditUser';

// Project and Schedule
import Schedule from './components/schedule//ui/Schedule';
import CreateTask from './components/task/CreateTask';
import CreateScheduledTask from "./components/schedule/ui/CreateScheduledTask"
import { Project } from './components/dnd/Project';
import ProjectList from './components/projects/ProjectList';
import CreateProject from './components/projects/CreateProject';
import EditTask from './components/task/EditTask';
import ViewDay from './components/schedule/ui/ViewDay';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}> 
        <Route index element={ <Landing /> } />
        <Route path="login" element={ <Login /> } />
        <Route path="signup">
          <Route index element={<Signup />} />
        </Route>

          <Route element={<PersistLogin />}>
            <Route element={<Prefetch />}>
              {/* Protected route: logged in user */}
              <Route path="log" element={<FotivityLog />}>
                <Route path="dashboard">
                  <Route index element={<Dashboard />} />
                </Route>

                <Route path="user">
                  <Route index element={<User />} />
                  <Route path="edit/:id" element={<EditUser />} />
                </Route>

                <Route path="sessions">
                  <Route index element={<SessionList />} />
                  <Route path="edit/:id" element={<EditSession />} />
                  <Route path="new" element={<NewSession />} />
                </Route>

                <Route path="schedule">
                  <Route index element={<Schedule />} />
                  <Route path="timeline/:date" element={<ViewDay />} />
                  <Route path="task/create" element={<CreateScheduledTask />} />
                </Route>


                <Route path="projects">
                  <Route index element={<ProjectList />} />
                  <Route path=":id" element={<Project />} />
                  <Route path="create" element={<CreateProject />} />
                  <Route path="task/:id/new" element={<CreateTask />} />
                </Route>

                <Route path="tasks">
                  <Route path="view" element={<EditTask />} />
                </Route>
                {/* <Route path="admin" element={<AdminDashboard />}>
                  <Route path="site-analytics">
                    // daily users
                    // server load
                    // memeory

                  </Route>

                  <Route path="user-analytics">
                    // user average number of sessions 
                    // user location
                    // user time spent
                    // number of  users
                      // number of paid
                      // number of free
                    
                  </Route>
                  <Route path="user-controls">
                    
                  </Route>
                </Route> */}
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
