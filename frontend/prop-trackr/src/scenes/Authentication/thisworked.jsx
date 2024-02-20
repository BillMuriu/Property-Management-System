import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoutes from "./utils/PrivateRoutes";
import { useLocation } from 'react-router-dom';

import { Routes, Route, Router } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidenavbar from "./scenes/global/Sidenavbar";
import Dashboard from "./scenes/dashboard";


import Login from "./scenes/Authentication";
import Unauthorized from "./scenes/unauthorized";

import Expenses from "./scenes/expenses";
import RecordExpense from "./scenes/expenses/RecordExpense";
import UpdateExpense from "./scenes/expenses/UpdateExpense";
import ViewExpense from "./scenes/expenses/ViewExpense";

import Properties from "./scenes/properties";
import AddProperty from "./scenes/properties/CreateProperty";
import ViewProperty from "./scenes/properties/ViewProperty";
import UpdateProperty from "./scenes/properties/UpdateProperty";

import Units from "./scenes/units";
import AddUnit from "./scenes/units/CreateUnit";
import ViewUnit from "./scenes/units/ViewUnit";
import UpdateUnit from "./scenes/units/UpdateUnit";

import Maintenance from "./scenes/maintenance";
import AddMaintenance from "./scenes/maintenance/AddMaintenance";
import ViewMaintenanceIssue from "./scenes/maintenance/ViewMaintenanceIssue";
import UpdateIssue from "./scenes/maintenance/UpdateIssue";

import Tenants from "./scenes/tenants";
import AddTenant from "./scenes/tenants/AddTenant";
import UpdateTenant from "./scenes/tenants/UpdateTenant";
import ViewTenant from "./scenes/tenants/ViewTenant";

import Invoices from "./scenes/invoices";
import AddInvoice from "./scenes/invoices/AddInvoice";
import UpdateInvoice from "./scenes/invoices/UpdateInvoice";
import ViewInvoice from "./scenes/invoices/ViewInovice";

import Payments from "./scenes/payments";
import AddPayment from "./scenes/payments/AddPayment";
import UpdatePayment from "./scenes/payments/UpdatePayment";
import ViewPayment from "./scenes/payments/ViewPayment";

import Bar from "./scenes/bar";


import Reports from "./scenes/reports";


import Messaging from "./scenes/messaging";
import Settings from "./scenes/settings";
import Myaccount from "./scenes/myaccount";
import Documentation from "./scenes/documentation";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { SidebarProvider } from "./components/SidebarContext";
import { SidebarToggleProvider } from "./components/SidebarToggleContext";

function App() {
  const [theme, colorMode] = useMode();
  const location = useLocation();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
        {location.pathname !== '/unauthorized' && (
        <SidebarToggleProvider>
          <SidebarProvider>
            <div className="app" style={{ position: 'relative' }}>
              <Sidenavbar />
              <main className="content">
                <Topbar />
                <AuthProvider>
                  <Routes>
                    <Route element={<PrivateRoutes allowedRoles={['admin']} />}>
                      <Route path="/" element={<Dashboard />} exact />
                    </Route>

                    <Route path="/properties" element={<Properties />} />
                    <Route path="/add-property" element={<AddProperty />} />
                    <Route path="/view-property/:id" element={<ViewProperty />} />
                    <Route path="/update-property/:id" element={<UpdateProperty />} />
                    
                    {/* Add more routes... */}
                  </Routes>
                </AuthProvider>
              </main>
            </div>
          </SidebarProvider>
        </SidebarToggleProvider>
      )}

      {/* Render Unauthorized page */}
      <Routes>
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;