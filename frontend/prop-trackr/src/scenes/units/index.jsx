import { Box, Button, IconButton, Typography, useTheme, Card, CardContent, TextField, MenuItem, useMediaQuery } from "@mui/material";
import Header from "../../components/Header";
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import MuiAccordion from '@mui/material/Accordion';
import { styled } from '@mui/material/styles';


import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";

import { Link } from 'react-router-dom';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import Divider from '@mui/material/Divider';

import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TuneIcon from '@mui/icons-material/Tune';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { BASE_URL } from "../../config";

import { Formik } from "formik";
import * as yup from "yup";
import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';

import React from 'react'


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

const Units = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const [openBackdrop, setOpenBackdrop] = useState(true);
  const [unitData, setunitData] = useState('');

  const handleClose = () => {
      setOpenBackdrop(false);
  };

  const navigate = useNavigate();

  const handleGoBack = () => {
      navigate(-1);
  };


  useEffect(() => {
    const fetchUnitData = async () => {
        try {
            // Make a GET request to fetch user landlord data
            const res = await fetch(`${BASE_URL}/property/units`, {
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

            const fetchedUnitData = await res.json();

            // Check for specific error cases in the response data
            if (!Array.isArray(fetchedUnitData)) {
                throw new Error('Received invalid data from server');
            }

            console.log(fetchedUnitData);
            setunitData(fetchedUnitData); // Set property data in state

        } catch (error) {
            // Handle any errors that occur during the request
            console.error('Error fetching user property data:', error);
            alert('Failed to fetch user property status');
        } finally {
            setOpenBackdrop(false); // Close the backdrop regardless of success or failure
        }
    };

    fetchUnitData(); // Call the fetch function when the component mounts

}, []);

  const handleFormSubmit = (values) => {
      console.log(values);
  };

  let processedunitData;
  // Preprocess UnitData to update 'occupied' field
  if (Array.isArray(unitData)) {
    processedunitData = unitData.map(unit => ({
        ...unit,
        occupied: unit.occupied ? 'Yes' : 'No',
    }));
} else if (typeof unitData === 'object') {
    processedunitData = [{
        ...unitData,
        occupied: unitData.occupied ? 'Yes' : 'No',
    }];
} else {
    processedunitData = [];
}

const columns = [
  { 
      field: 'id', 
      headerName: 'ID', 
      width: 100,
      renderCell: (params) => (
          <Link to={`/view-unit/${params.row.id}`}>
              {params.value}
          </Link>
      ),
  },
  { field: 'unit_id_or_name', headerName: 'Unit ID/Name', width: 200 },
  { field: 'property_name', headerName: 'Property', width: 200 },
  { field: 'occupied', headerName: 'Occupied', width: 150 },
  { field: 'rent_amount', headerName: 'Rent Amount', width: 150 },
  { field: 'tax_rate', headerName: 'Tax Rate', width: 150 },
];


  const properties = [
    {
      value: 'property1',
      label: 'Property 1',
    },
    {
      value: 'property2',
      label: 'Property 2',
    },
    {
      value: 'property3',
      label: 'Property 3',
    },
    {
      value: 'property4',
      label: 'Property 4',
    },
    {
      value: 'property5',
      label: 'Property 5',
    },
  ];



  return (
        <Box
            sx={{
              marginLeft: "20px",
            }}
        >
          <Header title="Units" subtitle="Welcome to the units page" />

          <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                    width: "95%",
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
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { sx: 'flex-start', sm: 'flex-end'}
                  }}
                >
                    <Link to="/add-unit" style={{ textDecoration: 'none' }}>
                        <Button 
                            variant="contained" 
                            startIcon={<AddIcon />}
                        >
                            <Typography>
                                Add a Unit
                            </Typography>
                        </Button>
                    </Link>
                </Box>
            </Box>

          <Accordion variant="outlined" sx={{ width: '95%'}}>
              <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
              >
                  Total Units
              </AccordionSummary>
              <AccordionDetails
                sx={{

                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row'},
                  gap: '20px'

                }}
              >
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
                              {unitData.length}
                          </Typography>
                      </CardContent>
                  </Card>

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
                              {unitData.length}
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

          <Accordion 
            sx={{
              maxWidth: "95%",
              marginTop: "10px",
              marginBottom: "20px"
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px"
                }}
              >
                <TuneIcon /> 
                <Typography>Filters</Typography>
              </Box>

            </AccordionSummary>
            <AccordionDetails>
              <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={checkoutSchema}
                >
                    {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    setFieldValue,
                    }) => (
                    <form 
                      onSubmit={handleSubmit}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '20px',
                          alignItems: 'flex-start',
                        }}
                      >
                        <TextField
                            sx={{
                              width: isSmallScreen ? '100%' : '50%',
                            }}
                            select
                            label="Select a Property"
                            defaultValue="EUR"
                            variant="filled"
                          >
                            {properties.map((option) => (
                              <MenuItem key={option.value} value={option.value}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </TextField>

                        <FormControlLabel
                          fullWidth 
                          control={<Checkbox defaultChecked />} 
                          label="Show vacant units" 
                        />
                      </Box>
                    </form>
                    )}
                </Formik>
            </AccordionDetails>
          </Accordion>

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

            <DataGrid
                sx={{
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
                rows={processedunitData} 
                columns={columns} 
            />
          </Box>
        </Box>
  )
}

// Define the validation schema using Yup
const checkoutSchema = yup.object().shape({
  companyName: yup.string().nullable(),
  notes: yup.string().nullable(),
});
  

// Define the initial values for the form fields
const initialValues = {
  propertyName: "",
  numberOfUnits: "",
};

export default Units