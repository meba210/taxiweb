import DispatcherDetail from './Components/DetailPages/DispacherDetalPage';
import RouteDetail from './Components/DetailPages/RoutesDetailPage';
import StationAdminDetail from './Components/DetailPages/StationAdminDetailPage';
import StationDetail from './Components/DetailPages/StationDetailPage';
import Layouts from './Components/layout';
import AdminDashboard from './Pages/AdminDashboard';
import Dispachers from './Pages/Dispachers';
import HomePage from './Pages/HomePage';
import Routess from './Pages/Routes';
import StationAdmins from './Pages/StationAdmins';
import Stations from './Pages/Stations';
import StationsAdminDashboard from './Pages/StationsAdminDashboard';
import TaxiAssignment from './Pages/TaxiAssignment';
import ChangePasswordScreen from './Pages/changePassword';
import ProtectedRoute from './middleware/ProtectedRoute';

import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/modals/Login';

import TaxiDrivers from './Pages/TaxiDrivers';
import Users from './Pages/Users';
import AdminReports from './Pages/adminReports';
import StationAdminReport from './Pages/StationAdminReport';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/auth/login"
            element={
              <Login
                isModalOpen={false}
                handleCancel={function (): void {
                  throw new Error('Function not implemented.');
                }}
              />
            }
          />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Layouts role="admin" />}>
              <Route index element={<AdminDashboard />} />
              <Route path="Stations" element={<Stations />} />
              <Route path="Stations/:id" element={<StationDetail />} />
              <Route path="StationAdmins" element={<StationAdmins />} />
              <Route
                path="StationAdmins/:id"
                element={<StationAdminDetail />}
              />
              <Route path="TaxiDrivers" element={<TaxiDrivers />} />
              <Route path="allUsers" element={<Users />} />
              <Route path="Reports" element={<AdminReports />} />
            </Route>

            <Route
              path="/stationAdmin"
              element={<Layouts role="stationAdmin" />}
            >
              <Route index element={<StationsAdminDashboard />} />
              <Route path="Routes" element={<Routess />} />
              <Route path="Routes/:id" element={<RouteDetail />} />
              <Route path="Dispachers" element={<Dispachers />} />
              <Route path="Dispachers/:id" element={<DispatcherDetail />} />
              <Route path="TaxiAssignment" element={<TaxiAssignment />} />
              <Route path="Reports" element={<StationAdminReport />} />
              <Route path="changePassword" element={<ChangePasswordScreen />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
