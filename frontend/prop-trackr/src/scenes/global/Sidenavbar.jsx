import { useState, useContext } from "react";
import { useSidebarToggle } from "../../components/SidebarToggleContext";
import { Sidebar, Menu, MenuItem, SubMenu, menuClasses } from 'react-pro-sidebar';
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";

const Item = ({ title, to, icon, selected, setSelected }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
    <Link to={to} style={{ textDecoration: 'none' }}>
        <MenuItem
          active={selected === title}
          style={{
            color: colors.grey[400],
            '&:hover': {
              backgroundColor: colors.grey[400],
              color: 'black',
            },
          }}
          onClick={() => setSelected(title)}
          icon={icon}
        >
          <Typography>{title}</Typography>
        </MenuItem>
    </Link>
    );
  };
  


const Sidenavbar = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const { toggled, setToggled } = useSidebarToggle();
    const [broken, setBroken] = useState(window.matchMedia('(max-width: 800px)').matches);
    const [collapsed, setCollapsed] = useState(false);

    const [selected, setSelected] = useState("Dashboard");

    
    return (
        <Box
            position="sticky"
            top={0}           
            zIndex={1000} 
            style={{ 
                display: 'flex', 
                height: '100%', 
                minHeight: '400px',
            }}
        >
        <Sidebar 
            collapsed={broken ? false : collapsed}
            onBackdropClick={() => setToggled(false)} 
            toggled={toggled} 
            customBreakPoint="800px" 
            onBreakPoint={setBroken}
            backgroundColor={colors.primary[700]}
        >
        <Menu 
            closeOnClick
            menuItemStyles={{
                button: ({ level, active, disabled }) => {
                  // only apply styles on first level elements of the tree
                  if (level === 0 || 1)
                    return {
                      color: active ? colors.grey[900] : colors.grey[400],
                      backgroundColor: active ? colors.primary[400] : undefined,
                      marginLeft: "5px",
                      marginRight: "5px",
                      borderRadius: "5px",
                      '&:hover': {
                        backgroundColor: colors.primary[400],
                      },
                    };
                },
              }}
        >
            {collapsed === false ? (
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
                mb="32px"
            >
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    ml="15px"
                >
                    <img
                        alt="company-logo"
                        width="50px"
                        height="50px"
                        src={`https://cdn.freebiesupply.com/logos/large/2x/react-1-logo-png-transparent.png`}
                        style={{ borderRadius: "50%" }}
                    />
                    <Typography variant="h3" color={colors.grey[100] } sx={{ marginLeft: '20px' }}>
                        ADMINIS
                    </Typography>
                </Box>
                <IconButton onClick={broken ? () => setToggled((prev) => !prev) : () => setCollapsed(!collapsed)} >
                    <MenuOutlinedIcon />
                </IconButton>
            </Box>
            ) : (
                <IconButton 
                    onClick={broken ? () => setToggled((prev) => !prev) : () => setCollapsed(!collapsed)}
                    style={{ marginLeft: '20px' }}
                     >
                    <MenuOutlinedIcon />
                </IconButton>
            )}


            <Box >
                <Typography
                    variant="h6"
                    color={colors.grey[300]}
                    sx={{ m: "15px 0 5px 20px" }}
                >
                    General
                </Typography>

                <Item
                    title="Dashboard"
                    to="/"
                    icon={<HomeOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />

                <SubMenu
                    label="Property"
                    icon={<ContactsOutlinedIcon />}
                    rootStyles={{
                        ['.' + menuClasses.subMenuContent]: {
                          backgroundColor: colors.primary[700],
                        },
                        ['.' + menuClasses.subMenuContent]: {
                            backgroundColor: colors.primary[700],
                            paddingLeft: '30px'
                          },
                      }}
                >
                    <Item
                        title="Properties"
                        to="/properties"
                        selected={selected}
                        setSelected={setSelected}
                    />
                    <Item
                        title="Units"
                        to="/units"
                        selected={selected}
                        setSelected={setSelected}
                    />
                    <Item
                        title="Maintenance"
                        to="/maintenance"
                        selected={selected}
                        setSelected={setSelected}
                    />
                    <Item
                        title="Expenses"
                        to="/expenses"
                        selected={selected}
                        setSelected={setSelected}
                    />
                </SubMenu>
                
                <SubMenu
                    label="Tenants"
                    icon={<ContactsOutlinedIcon />}
                    rootStyles={{
                        ['.' + menuClasses.subMenuContent]: {
                          backgroundColor: colors.primary[700],
                        },
                        ['.' + menuClasses.subMenuContent]: {
                            backgroundColor: colors.primary[700],
                            paddingLeft: '30px'
                          },
                      }}
                >
                    <Item
                        title="Tenants"
                        to="/tenants"
                        selected={selected}
                        setSelected={setSelected}
                    />
                    <Item
                        title="Invoices"
                        to="/invoices"
                        selected={selected}
                        setSelected={setSelected}
                    />
                    <Item
                        title="Payments"
                        to="/payments"
                        selected={selected}
                        setSelected={setSelected}
                    />
                </SubMenu>

                <Item
                    title="Financials"
                    to="/financials"
                    icon={<ReceiptOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />
                <Item
                    title="Reports"
                    to="/reports"
                    icon={<PersonOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />

                <Item
                    title="Messaging"
                    to="/messaging"
                    icon={<CalendarTodayOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />
                <Item
                    title="Admin Settings"
                    to="/settings"
                    icon={<HelpOutlineOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />

                <Typography
                    variant="h6"
                    color={colors.grey[300]}
                    sx={{ m: "15px 0 5px 20px" }}
                >
                    Extras
                </Typography>

                <Item
                    title="My account"
                    to="/myaccount"
                    icon={<BarChartOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />

                <Item
                    title="Documentation"
                    to="/documentation"
                    icon={<PieChartOutlineOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />
          </Box>
        </Menu>
        </Sidebar>
    </Box>
    )
}

export default Sidenavbar;