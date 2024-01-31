// SidebarToggleContext.js
import React, { createContext, useContext, useState } from 'react';

const SidebarToggleContext = createContext();

export const useSidebarToggle = () => useContext(SidebarToggleContext);

export const SidebarToggleProvider = ({ children }) => {
  const [toggled, setToggled] = useState(false);

  return (
    <SidebarToggleContext.Provider value={{ toggled, setToggled }}>
      {children}
    </SidebarToggleContext.Provider>
  );
};
