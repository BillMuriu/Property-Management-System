import { useState, useContext } from "react";
import { useSidebarToggle } from "../../components/SidebarToggleContext";
import { Sidebar, Menu, MenuItem, SubMenu, menuClasses } from 'react-pro-sidebar';
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { styled } from '@mui/material/styles';
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
import DashboardIcon from '@mui/icons-material/Dashboard';


import ApartmentIcon from '@mui/icons-material/Apartment';
import DoorFrontIcon from '@mui/icons-material/DoorFront';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import ConstructionIcon from '@mui/icons-material/Construction';

import VideoFileIcon from '@mui/icons-material/VideoFile';

import GroupsIcon from '@mui/icons-material/Groups';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentsIcon from '@mui/icons-material/Payments';

import SummarizeIcon from '@mui/icons-material/Summarize';

import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import MessageIcon from '@mui/icons-material/Message';
import SettingsIcon from '@mui/icons-material/Settings';

import useScrollbarStyles from "../../styles/scrollbarStyles";

const Item = ({ title, to, icon, selected, setSelected, setCollapsed, broken, setToggled }) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const scrollbarStyles = useScrollbarStyles();

    // Function to handle item click
    const handleClick = () => {
        if (window.innerWidth < 600) {
            if (broken) {
                // Toggle setToggled if broken
                setToggled(prev => !prev);
            } else {
                // Toggle setCollapsed if not broken
                setCollapsed(prev => !prev);
            }
        }
        setSelected(title);
    };

    return (
        <Link to={to} style={{ textDecoration: 'none' }}>
            <MenuItem
                active={selected === title}
                style={{
                    color: colors.grey[400],
                    '&:hover': {
                        backgroundColor: colors.grey[700],
                        color: 'black',
                    },
                }}
                onClick={handleClick}
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
    const [broken, setBroken] = useState(window.matchMedia('(max-width: 600px)').matches);
    const [collapsed, setCollapsed] = useState(false);

    const [selected, setSelected] = useState("Dashboard");

    const propertySubMenuActive = () => {
        return selected === "Properties" || selected === "Units" || selected === "Utilities" || selected === "Maintenance" || selected === "Property Expenses";
    };

    const tenantsSubMenuActive = () => {
        return selected === "Tenants" || selected === "Invoices" || selected === "Payments" ;
    };

    const reportsSubMenuActive = () => {
        return selected === "Property Reports" || selected === "Tenant Reports";
    };


    const StyledBox = styled(Box)`
        position: sticky;
        top: 0;
        z-index: 1000;
        display: flex;
        height: 100%;
        min-height: 400px;
        border: none;

        /* Scrollbar styles for the component inside Box */

        // dark mode
        .ps-sidebar-container.css-2oxlsg::-webkit-scrollbar-track {
            background-color: ${colors.primary[400]};
        }
        & .ps-sidebar-container.css-2oxlsg::-webkit-scrollbar-thumb {
            background-color: ${colors.primary[700]};
            border-radius: 10px;
            height: 10px;
        }

        & .ps-sidebar-container.css-2oxlsg::-webkit-scrollbar-thumb:hover {
            background-color: ${colors.primary[600]};
        }


        // light mode
        .ps-sidebar-container.css-ekzuz2::-webkit-scrollbar-track {
            background-color: ${colors.primary[400]};
        }
        & .ps-sidebar-container.css-ekzuz2::-webkit-scrollbar-thumb {
            background-color: ${colors.grey[900]};
            border-radius: 10px;
            height: 10px;
        }
        & .ps-sidebar-container.css-ekzuz2::-webkit-scrollbar-thumb:hover {
            background-color: ${colors.grey[800]};
        }
        
    `;


    
    return (
        <StyledBox
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
            backgroundColor={colors.primary[400]}
        >
        <Menu 
            closeOnClick
            menuItemStyles={{
                button: ({ level, active, disabled }) => {
                  // only apply styles on first level elements of the tree
                  if (level === 0 || 1)
                    return {
                      color: active ? colors.grey[100] : colors.grey[100],
                      backgroundColor: active ? colors.grey[800] : undefined,
                      marginLeft: "5px",
                      marginRight: "5px",
                      borderRadius: "5px",
                      '&:hover': {
                        backgroundColor: colors.grey[700],
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
                    mt="15px"
                >
                    <img
                        src={`https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcwirhyfxAvNJeD9dB14otHpV7pytmSI-4xQ&usqp=CAU`}
                        alt="company-logo"
                        
                        style={{ borderRadius: "10%", height: "32px", width: "32px" }}
                    />
                    <Typography variant="h4" color={colors.grey[100] } sx={{ marginLeft: '20px', fontWeight: 900 }}>
                        prop Track
                    </Typography>
                </Box>



                <IconButton onClick={broken ? () => setToggled((prev) => !prev) : () => setCollapsed(!collapsed)} sx={{mt: "15px"}}>
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
                    icon={<DashboardIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    broken={broken}
                    setToggled={setToggled}
                    setCollapsed={setCollapsed}
                />

                <SubMenu
                    active={propertySubMenuActive()}
                    defaultOpen={propertySubMenuActive()}
                    label="Property"
                    icon={<ApartmentIcon />}
                    rootStyles={{
                        ['& > .ps-active' + menuClasses.button]: {
                          backgroundColor: colors.primary[400],
                          '&:hover': {
                            backgroundColor: '#fff',
                          },
                        },
                        ['.' + menuClasses.subMenuContent]: {
                          backgroundColor: colors.primary[400],
                        },
                      }}
                >
                    <Item
                        title="Properties"
                        to="/properties"
                        icon={<ApartmentIcon />}
                        selected={selected}
                        setSelected={setSelected}
                        broken={broken}
                        setToggled={setToggled}
                        setCollapsed={setCollapsed}
                        sx={{
                            backgroundColor: '#fff'
                        }}
                    />
                    <Item
                        title="Units"
                        to="/units"
                        icon={<DoorFrontIcon />}
                        selected={selected}
                        setSelected={setSelected}
                        broken={broken}
                        setToggled={setToggled}
                        setCollapsed={setCollapsed}
                    />
                    <Item
                        title="Utilities"
                        to="/utilities"
                        icon={<NetworkCheckIcon />}
                        selected={selected}
                        setSelected={setSelected}
                        broken={broken}
                        setToggled={setToggled}
                        setCollapsed={setCollapsed}
                    />
                    <Item
                        title="Property Expenses"
                        to="/expenses"
                        icon={<BarChartOutlinedIcon />}
                        selected={selected}
                        setSelected={setSelected}
                        broken={broken}
                        setToggled={setToggled}
                        setCollapsed={setCollapsed}
                    />
                    <Item
                        title="Maintenance"
                        to="/maintenance"
                        icon={<ConstructionIcon />}
                        selected={selected}
                        setSelected={setSelected}
                        broken={broken}
                        setToggled={setToggled}
                        setCollapsed={setCollapsed}
                    />
                </SubMenu>
                
                <SubMenu
                    active={tenantsSubMenuActive()}
                    defaultOpen={tenantsSubMenuActive()}
                    label="Tenants"
                    icon={<GroupsIcon />}
                    rootStyles={{
                        ['& > .ps-active' + menuClasses.button]: {
                          backgroundColor: colors.primary[400],
                          '&:hover': {
                            backgroundColor: '#fff',
                          },
                        },
                        ['.' + menuClasses.subMenuContent]: {
                          backgroundColor: colors.primary[400],
                        },
                      }}
                >
                    <Item
                        title="Tenants"
                        to="/tenants"
                        icon={<GroupsIcon />}
                        selected={selected}
                        setSelected={setSelected}
                        broken={broken}
                        setToggled={setToggled}
                        setCollapsed={setCollapsed}
                    />
                    <Item
                        title="Invoices"
                        to="/invoices"
                        icon={<ReceiptIcon />}
                        selected={selected}
                        setSelected={setSelected}
                        broken={broken}
                        setToggled={setToggled}
                        setCollapsed={setCollapsed}
                    />
                    <Item
                        title="Payments"
                        to="/payments"
                        icon={<PaymentsIcon />}
                        selected={selected}
                        setSelected={setSelected}
                        broken={broken}
                        setToggled={setToggled}
                        setCollapsed={setCollapsed}
                    />
                </SubMenu>

                <SubMenu
                    active={reportsSubMenuActive()}
                    defaultOpen={reportsSubMenuActive()}
                    label="Reports"
                    icon={<ContentPasteIcon />}
                    rootStyles={{
                        ['& > .ps-active' + menuClasses.button]: {
                          backgroundColor: colors.primary[400],
                          '&:hover': {
                            backgroundColor: '#fff',
                          },
                        },
                        ['.' + menuClasses.subMenuContent]: {
                          backgroundColor: colors.primary[400],
                        },
                      }}
                >
                    <Item
                        title="Property Reports"
                        to="/property-reports"
                        icon={<SummarizeIcon />}
                        selected={selected}
                        setSelected={setSelected}
                        broken={broken}
                        setToggled={setToggled}
                        setCollapsed={setCollapsed}
                    />
                    <Item
                        title="Tenant Reports"
                        to="/tenant-reports"
                        icon={<SummarizeIcon />}
                        selected={selected}
                        setSelected={setSelected}
                        broken={broken}
                        setToggled={setToggled}
                        setCollapsed={setCollapsed}
                    />
                </SubMenu>

                <Item
                    title="Messaging"
                    to="/messaging"
                    icon={<MessageIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    broken={broken}
                    setToggled={setToggled}
                    setCollapsed={setCollapsed}
                />
                <Item
                    title="Admin Settings"
                    to="/settings"
                    icon={<SettingsIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    broken={broken}
                    setToggled={setToggled}
                    setCollapsed={setCollapsed}
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
                    broken={broken}
                    setToggled={setToggled}
                    setCollapsed={setCollapsed}
                />

                <Item
                    title="Documentation"
                    to="/documentation"
                    icon={<VideoFileIcon />}
                    selected={selected}
                    setSelected={setSelected}
                    broken={broken}
                    setToggled={setToggled}
                    setCollapsed={setCollapsed}
                />
          </Box>
        </Menu>
        </Sidebar>
    </StyledBox>
    )
}

export default Sidenavbar;