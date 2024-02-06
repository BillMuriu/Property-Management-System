import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidenavbar from "./scenes/global/Sidenavbar";
import Dashboard from "./scenes/dashboard";
import Expenses from "./scenes/expenses";
import Properties from "./scenes/properties";
import AddProperty from "./scenes/properties/CreateProperty";
import ViewProperty from "./scenes/properties/ViewProperty";
import UpdateProperty from "./scenes/properties/UpdateProperty";

import Units from "./scenes/units";
import AddUnit from "./scenes/units/CreateUnit";
import ViewUnit from "./scenes/units/ViewUnit";
import UpdateUnit from "./scenes/units/UpdateUnit";

import Maintenance from "./scenes/maintenance";
import Tenants from "./scenes/tenants";
import Invoices from "./scenes/invoices";
import Payments from "./scenes/payments";
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
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/add-property" element={<AddProperty />} />
                  <Route path="/view-property" element={<ViewProperty />} />
                  <Route path="/update-property" element={<UpdateProperty />} />

                  <Route path="/units" element={<Units />} />
                  <Route path="/add-unit" element={<AddUnit />} />
                  <Route path="/view-unit" element={<ViewUnit />} />
                  <Route path="/update-unit" element={<UpdateUnit />} />


                  <Route path="/maintenance" element={<Maintenance />} />
                  <Route path="/expenses" element={<Expenses />} />
                  <Route path="/tenants" element={<Tenants />} />
                  <Route path="/invoices" element={<Invoices />} />
                  <Route path="/payments" element={<Payments />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/messaging" element={<Messaging />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/myaccount" element={<Myaccount />} />
                  <Route path="/documentation" element={<Documentation />} />
                </Routes>
              </main>
            </div>
          </SidebarProvider>
        </SidebarToggleProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;