import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/LocalBuyer/Dashboard';
import Inventory from './pages/LocalBuyer/Inventory';
import CreateOrder from './pages/LocalBuyer/CreateOrder';
import Recommendations from './pages/LocalBuyer/Recommendations';
import ConfirmOrder from './pages/LocalBuyer/ConfirmOrder';
import Orders from './pages/LocalBuyer/Orders';
import Transfers from './pages/LocalBuyer/Transfers';
import Catalogue from './pages/LocalBuyer/Catalogue';
import AlertsActivity from './pages/LocalBuyer/AlertsActivity';
import Analytics from './pages/LocalBuyer/Analytics';
import CentralWarehouse from './pages/CentralWarehouse/CentralWarehouse';

import './styles/global.css';

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/create-order" element={<CreateOrder />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/confirm-order" element={<ConfirmOrder />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<Orders />} />
          <Route path="/transfers" element={<Transfers />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/alerts" element={<AlertsActivity />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/central-warehouse" element={<CentralWarehouse />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
