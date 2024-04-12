import { Box, Button, AccordionDetails, AccordionSummary, IconButton, Typography, useTheme, Card, CardContent } from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import MuiAccordion from '@mui/material/Accordion';
import { styled } from '@mui/material/styles';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { Link } from 'react-router-dom';

import Header from "../../components/Header";
import { BASE_URL } from "../../config";

import { DataGrid } from "@mui/x-data-grid";

import { tokens } from "../../theme";

import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import React from 'react'

// Add the user's authtoken

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} />
  ))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&::before': {
      display: 'none',
    },
  }));

const Properties = () => {

    const [openBackdrop, setOpenBackdrop] = useState(true);
    const [propertyData, setPropertyData] = useState('');

    const handleClose = () => {
        setOpenBackdrop(false);
    };

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        const fetchPropertyData = async () => {
            try {
                // Make a GET request to fetch user landlord data
                const res = await fetch(`${BASE_URL}/property/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // 'Authorization': 'Bearer ' + String(data.access)
                    },
                });
    
                // Check for network errors
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
    
                const fetchedPropertyData = await res.json();
    
                // Check for specific error cases in the response data
                if (!Array.isArray(fetchedPropertyData)) {
                    throw new Error('Received invalid data from server');
                }
    
                console.log(fetchedPropertyData);
                setPropertyData(fetchedPropertyData); // Set property data in state
    
            } catch (error) {
                // Handle any errors that occur during the request
                console.error('Error fetching user property data:', error);
                alert('Failed to fetch user property status');
            } finally {
                setOpenBackdrop(false); // Close the backdrop regardless of success or failure
            }
        };
    
        fetchPropertyData(); // Call the fetch function when the component mounts
    
    }, []);

    

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const columns = [
        { field: 'id', headerName: 'ID', width: 100, headerClassName: 'custom-header' },
        { 
            field: 'name', 
            headerName: 'Name', 
            width: 100,
            headerClassName: 'custom-header',
            renderCell: (params) => (
                <Link to={`/view-property/${params.row.id}`}>
                    {params.value}
                </Link>
            ), 
        },
        { field: 'number_of_units', headerName: 'Number of Units', width: 150, headerClassName: 'custom-header' },
        { field: 'city', headerName: 'City', width: 150, headerClassName: 'custom-header' },
        { field: 'water_rate', headerName: 'Water Rate', width: 100, headerClassName: 'custom-header' },
        { field: 'electricity_rate', headerName: 'Electricity Rate', width: 100, headerClassName: 'custom-header' },
    ];

    return (
        <Box
            style={{marginLeft: "20px"}}
        >
            <Header title="Properties"/>

            <Box
                sx={{
                    width: '95%',
                    display: "flex",
                    justifyContent: {sx: 'flex-start', sm: 'flex-end'},
                    gap: "10px",
                    marginBottom: "20px",
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                    alignItems: "center", 
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    <Link to="" style={{ textDecoration: 'none' }}>
                        <Button 
                            variant="outlined" 
                            startIcon={<ArrowBackIcon />}
                            onClick={handleGoBack} 
                        >
                            Back
                        </Button>
                    </Link>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: {sx: 'flex-start', sm: 'flex-end'},
                        gap: "10px",
                        width: { xs: '100%', sm: '50%' },
                    }}
                >
                    <Link to="/add-property" style={{ textDecoration: 'none' }}>
                        <Button 
                            variant="contained" 
                            startIcon={<AddIcon />}
                        >
                            <Typography>
                                Add a Property
                            </Typography>
                        </Button>
                    </Link>

                    <Link to="/add-unit" style={{ textDecoration: 'none' }}>
                        <Button variant="outlined">Add a Unit</Button>
                    </Link>
                </Box>
            </Box>

            <Accordion variant="outlined" sx={{ width: '95%'}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    Total Properties
                </AccordionSummary>
                <AccordionDetails>
                    <Card
                        sx={{
                            width: { xs: '95%', sm: '200px' },
                            padding: 2,
                        }}
                        variant="outlined"
                    >
                        <CardContent
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography variant="h5" component="div" gutterBottom>
                                Total Properties
                            </Typography>
                            <Divider sx={{ width: '10%', backgroundColor: colors.grey[800], marginBottom: '10px', marginTop: '10px' }} />
                            <Typography variant="h3" component="div" style={{ fontWeight: 'bold' }}>
                                {propertyData.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </AccordionDetails>
            </Accordion>


            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
                onClick={handleClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop>

            <Divider
                sx={{
                    marginTop: '20px',
                    width: '95%',
                }} 
            />

            <Box
                m="0px 0 0 0"
                height="75vh"
                overflow-x='hidden'
            >
                 <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        width:'95%',
                    }}
                 >
                    <IconButton aria-label="delete" size="large">
                        <DeleteIcon sx={{ fontSize: '28px' }} />
                    </IconButton>
                </Box>
                {propertyData.length > 0 ? (<DataGrid
                    sx={{
                        maxWidth: '95%',
                        '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                            width: '10px',
                        },
                        
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: colors.grey[900],
                        },    

                        '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track': {
                            background: colors.grey[900],
                        },
                        '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
                            backgroundColor: colors.grey[800],
                            borderRadius: '5px',
                        },
                        '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb:hover': {
                        background: '#555',
                        },
                    }}
                    rows={propertyData}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    checkboxSelection
                />) : (
                    <p>Loading...</p>
                )}
            </Box>
        </Box>
    )
}

export default Properties