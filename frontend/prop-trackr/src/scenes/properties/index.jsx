import { Box, Button, IconButton, Typography, useTheme, Card, CardContent } from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import { Link } from 'react-router-dom';

import { MockPropertyData } from "../../mock-data/propertydata/propertydata";

import Header from "../../components/Header";
import { BASE_URL } from "../../config";

import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";

import { useState, useEffect } from "react";

import React from 'react'

// Add the user's authtoken

const Properties = () => {

    const [openBackdrop, setOpenBackdrop] = useState(true);
    const [propertyData, setPropertyData] = useState('');

    const handleClose = () => {
        setOpenBackdrop(false);
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
        { field: 'id', headerName: 'ID', width: 100 },
        { 
            field: 'name', 
            headerName: 'Name', 
            width: 200,
            renderCell: (params) => (
                <Link to={`/view-property/${params.row.id}`}>
                    {params.value}
                </Link>
            ), 
        },
        { field: 'number_of_units', headerName: 'Number of Units', width: 150 },
        { field: 'city', headerName: 'City', width: 150 },
        { field: 'water_rate', headerName: 'Water Rate', width: 150 },
        { field: 'electricity_rate', headerName: 'Electricity Rate', width: 150 },
    ]

    return (
        <Box
            style={{marginLeft: "20px"}}
        >
            <Header title="Properties" subtitle="Welcome to the Properties page" />
            <Card
                sx={{
                    backgroundColor: colors.blueAccent[900],
                    maxWidth: '95%',
                    padding: 2,
                }}
                >
                <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                        Total Properties: {propertyData.length}
                    </Typography>
                    <Typography variant="body1" component="div">
                        Total Vacancies: {}
                    </Typography>
                </CardContent>
            </Card>
     

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
                onClick={handleClose}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <Box
                m="40px 0 0 0"
                height="75vh"
                overflow-x='hidden'
            >
                {propertyData.length > 0 ? (<DataGrid
                    sx={{ 
                        // overflowX: 'scroll',
                        // overflowY: 'scroll',
                        maxWidth: '95%',
                        '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                            width: '10px',
                        },
                        '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track': {
                            background: colors.grey[700],
                        },
                        '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
                            backgroundColor: colors.primary[600],
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