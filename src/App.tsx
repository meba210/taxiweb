import Layouts from './Components/layout';
import AdminDashboard from './Pages/AdminDashboard';
import Dispachers from './Pages/Dispachers';
import HomePage from './Pages/HomePage';
import Routess from './Pages/Routes';
import StationAdmins from './Pages/StationAdmins';
import Stations from './Pages/Stations';
//import LoginPage from './Pages/LoginPage';
import StationsAdminDashboard from './Pages/StationsAdminDashboard';
import TaxiAssignment from './Pages/TaxiAssignment';

import './index.css'
import { BrowserRouter,Routes,Route } from 'react-router-dom';
function App() {
  

  return (
    <>
    <BrowserRouter>
    
      <Routes>
  <Route path='/' element={<HomePage/>} />

  <Route path='/admin' element={<Layouts role='admin' />}>
          <Route index element={<AdminDashboard />} />
          <Route  path='/admin/Stations' index element={<Stations/>} />
           <Route  path='/admin/StationAdmins' index element={<StationAdmins/>} />
        </Route>
   <Route path='/stationAdmin' element={<Layouts role='stationAdmin'/>}>
          <Route index element={<StationsAdminDashboard/>} />
              <Route  path='/stationAdmin/Routes' index element={<Routess/>} />
            <Route  path='/stationAdmin/Dispachers' index element={<Dispachers/>} />
              <Route  path='/stationAdmin/TaxiAssignment' index element={<TaxiAssignment/>} />
        </Route>
</Routes>
    </BrowserRouter>
 

</>
  )
}

export default App
