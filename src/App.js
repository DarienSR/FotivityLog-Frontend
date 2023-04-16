
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout';
import Landing from './components/Landing';
import Login from './components/authentication/Login';
import FotivityLog from './components/FotivityLog';
import Dashboard from './components/dashboard/Dashboard';
import SessionList from './components/sessions/SessionList';
import User from './components/users/User';
import EditUser from './components/users/EditUser';
import Signup from './components/authentication/Signup';
import EditSession from './components/sessions/EditSession';
import NewSession from './components/sessions/NewSession';
import Prefetch from './components/authentication/Prefetch';
import PersistLogin from './components/authentication/PersistLogin';
import Organizer from './components/organizer/Organizer';
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

                <Route path="organizer">
                  <Route index element={<Organizer />} />
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
