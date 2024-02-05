import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
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
        <Box style={{marginLeft: "20px"}}>
            <Header title="Properties" subtitle="Welcome to the Properties page" />
            <Box
                m="40px 0 0 0"
                height="75vh" 
            >
                <DataGrid checkboxSelection rows={PropertyData} columns={columns} />
            </Box>
        </Box>
    )
}

export default Properties