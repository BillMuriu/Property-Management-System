import { Box, Button, IconButton, Typography, useTheme, Card, CardContent } from "@mui/material";
import Header from "../../components/Header";
import { PropertyData } from "../../mock-data/propertydata/propertydata";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";



import React from 'react'

const Properties = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const columns = [
        { field: 'id', headerName: 'ID', width: 100 },
        { field: 'name', headerName: 'Name', width: 200 },
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
                        Total Properties: {PropertyData.length}
                    </Typography>
                    <Typography variant="body1" component="div">
                        Total Vacancies: 20
                    </Typography>
                </CardContent>
            </Card>
            <Box
                m="40px 0 0 0"
                height="75vh"
                overflow-x='hidden'
            >
                <DataGrid
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
                    checkboxSelection 
                    rows={PropertyData} 
                    columns={columns} 
                />
            </Box>
        </Box>
    )
}

export default Properties