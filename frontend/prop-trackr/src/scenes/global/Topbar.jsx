import { Box, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext } from "../../theme";
import { useSidebar } from "../../components/SidebarContext";
import { useSidebarToggle } from "../../components/SidebarToggleContext";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

const Topbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { setToggled } = useSidebarToggle();
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  return (
    <Box 
      display="flex" 
      justifyContent="space-between" 
      p={1}
    >
      {/* collapse menu */}
      {isSmallScreen && (
      <Box>
        <IconButton onClick={() => setToggled((prev) => !prev)}>
          <MenuOutlinedIcon />
        </IconButton>
      </Box>
      )}
      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <NotificationsOutlinedIcon />
        </IconButton>
        <IconButton>
          <SettingsOutlinedIcon />
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;