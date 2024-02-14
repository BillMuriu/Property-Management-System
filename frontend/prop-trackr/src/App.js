import { useState } from "react";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoutes from "./utils/PrivateRoutes";

import { Routes, Route, Router } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidenavbar from "./scenes/global/Sidenavbar";
import Dashboard from "./scenes/dashboard";


import Login from "./scenes/login";
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

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SidebarToggleProvider>
          <SidebarProvider>
            <div className="app" style={{ position: 'relative' }}>
              <Sidenavbar />
              <main className="content">
                <Topbar />
                <AuthProvider>
                <Routes>
                
                  <Route path="/login" element={<Login />} />
                  <Route element={<PrivateRoutes allowedRoles={['admin']} />}>
                    <Route path="/" element={<Dashboard />} exact />
                  </Route>

                  <Route exact path='/unauthorized' element={<Unauthorized/>}/>


                  <Route path="/properties" element={<Properties />} />
                  <Route path="/add-property" element={<AddProperty />} />
                  <Route path="/view-property/:id" element={<ViewProperty />} />
                  <Route path="/update-property/:id" element={<UpdateProperty />} />

                  <Route path="/units" element={<Units />} />
                  <Route path="/add-unit/" element={<AddUnit />} />
                  <Route path="/view-unit/:id" element={<ViewUnit />} />
                  <Route path="/update-unit/:id" element={<UpdateUnit />} />


                  <Route path="/maintenance" element={<Maintenance />} />
                  <Route path="/add-maintenance" element={<AddMaintenance />} />
                  <Route path="/view-maintenance-issue/:id" element={<ViewMaintenanceIssue />} />
                  <Route path="/update-issue/:id" element={<UpdateIssue />} />


                  <Route path="/tenants" element={<Tenants />} />
                  <Route path="/add-tenant" element={<AddTenant />} />
                  <Route path="/update-tenant/:id" element={<UpdateTenant />} />
                  <Route path="/view-tenant/:id" element={<ViewTenant />} />


                  <Route path="/expenses" element={<Expenses />} />
                  <Route path="/record-expense" element={<RecordExpense />} />
                  <Route path="/update-expense/:id" element={<UpdateExpense />} />
                  <Route path="/view-expense/:id" element={<ViewExpense />} />



                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/add-invoice" element={<AddInvoice />} />
                  <Route path="/update-invoice/:id" element={<UpdateInvoice />} />
                  <Route path="/view-invoice/:id" element={<ViewInvoice />} />


                  <Route path="/payments" element={<Payments />} />
                  <Route path="/add-payment" element={<AddPayment />} />
                  <Route path="/update-payment/:id" element={<UpdatePayment />} />
                  <Route path="/view-payment/:id" element={<ViewPayment />} />


                  <Route path="/reports" element={<Reports />} />
                  <Route path="/messaging" element={<Messaging />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/myaccount" element={<Myaccount />} />
                  <Route path="/documentation" element={<Documentation />} />



                  <Route path="/bar" element={<Bar />} />

                </Routes>
                </AuthProvider>
              </main>
            </div>
          </SidebarProvider>
        </SidebarToggleProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;