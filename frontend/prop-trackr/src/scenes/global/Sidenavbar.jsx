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
      <MenuItem
        active={selected === title}
        style={{
          color: colors.grey[400]
        }}
        onClick={() => setSelected(title)}
        icon={icon}
      >
        <Typography>{title}</Typography>
        <Link to={to} />
      </MenuItem>
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
        <Box style={{ display: 'flex', height: '100%', minHeight: '400px', }}>
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
                  if (level === 0)
                    return {
                      color: active ? colors.grey[900] : colors.grey[400],
                      backgroundColor: active ? '#eecef9' : undefined,
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
                <Item
                    title="Dashboard"
                    to="/"
                    icon={<HomeOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />

                <Typography
                    variant="h6"
                    color={colors.grey[300]}
                    sx={{ m: "15px 0 5px 20px" }}
                >
                    Data
                </Typography>

                <Item
                    title="Manage Team"
                    to="/team"
                    icon={<PeopleOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />


                <SubMenu
                    active={true}
                    label="Charts"
                    icon={<ContactsOutlinedIcon />}
                    rootStyles={{
                        ['& > .' + menuClasses.button]: {
                            backgroundColor: '#eaabff',
                            color: '#9f0099',
                            '&:hover': {
                                backgroundColor: '#eecef9',
                            },
                            '&:active': {
                                backgroundColor: '#000'
                            }
                        },
                        ['.' + menuClasses.subMenuContent]: {
                          backgroundColor: '#fbedff',
                        },
                      }}
                    
                >
                    <MenuItem > Pie charts</MenuItem>
                    <MenuItem > Line charts</MenuItem>
                    <MenuItem > Bar charts</MenuItem>
                </SubMenu>

                <Item
                    title="Invoices Balances"
                    to="/invoices"
                    icon={<ReceiptOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />

                <Typography
                    variant="h6"
                    color={colors.grey[300]}
                    sx={{ m: "15px 0 5px 20px" }}
                >
                    Pages
                </Typography>

                <Item
                    title="Profile Form"
                    to="/form"
                    icon={<PersonOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />

                <Item
                    title="Calendar"
                    to="/calendar"
                    icon={<CalendarTodayOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />
                <Item
                    title="FAQ Page"
                    to="/faq"
                    icon={<HelpOutlineOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />

                <Typography
                    variant="h6"
                    color={colors.grey[300]}
                    sx={{ m: "15px 0 5px 20px" }}
                >
                    Charts
                </Typography>

                <Item
                    title="Bar Chart"
                    to="/bar"
                    icon={<BarChartOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />

                <Item
                    title="Pie Chart"
                    to="/pie"
                    icon={<PieChartOutlineOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />

                <Item
                    title="Line Chart"
                    to="/line"
                    icon={<TimelineOutlinedIcon />}
                    selected={selected}
                    setSelected={setSelected}
                />

                <Item
                    title="Geography Chart"
                    to="/geography"
                    icon={<MapOutlinedIcon />}
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