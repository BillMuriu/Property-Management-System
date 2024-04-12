import { Box, Button, IconButton, Typography, useTheme, TextField, MenuItem, Checkbox, FormControlLabel, CircularProgress, Backdrop} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { tokens } from "../../theme";
import Header from "../../components/Header";

import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useSnackbar } from 'notistack';

import { BASE_URL } from "../../config";

import React from 'react'

import { Link, useNavigate } from 'react-router-dom';

const UpdateUnit = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [unitData, setunitData] = useState('');
    const [initialValues, setInitialValues] = useState(null);
    const [propertyData, setPropertyData] = useState('');

    const navigate = useNavigate();

    const [openBackdrop, setOpenBackdrop] = useState(true);

    const handleCloseBackdrop = () => {
        setOpenBackdrop(false);
    };

    const { id } = useParams();
    console.log('Property ID:', id);

    const { enqueueSnackbar } = useSnackbar();

    const showSuccessMessage = () => {
        enqueueSnackbar('Unit was updated successfully', { 
          variant: 'success', 
          autoHideDuration: 2000, 
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
        });
    };

    const showFailureMessage = () => {
        enqueueSnackbar('Oops! something went wrong', { 
          variant: 'error', 
          autoHideDuration: 2000, 
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
        });
    };


    // Define the validation schema using Yup
    const checkoutSchema = yup.object().shape({
        property: yup.string().required("Property is required"), // Assuming property is a foreign key to Property model
        unitIdOrName: yup.string().required("Unit ID or Name is required"),
        rentAmount: yup.number().required("Rent amount is required"),
        occupied: yup.boolean().required("Occupied status is required"),
        taxRate: yup.number().nullable().typeError("Tax rate must be a number"), // Assuming taxRate is a decimal field
        notes: yup.string().nullable(),
    });

    useEffect(() => {
        setOpenBackdrop(true);
        const fetchunitData = async () => {
            try {
                // Make a GET request to fetch a particular property instance by ID
                const res = await fetch(`${BASE_URL}/property/units/${id}`, {
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
    
                const fetchedunitData = await res.json();
    
                // Check for specific error cases in the response data
                if (!fetchedunitData) {
                    throw new Error('Received invalid data from server');
                }
    
                console.log(fetchedunitData);
                setunitData(fetchedunitData);
                setOpenBackdrop(false);
    
            } catch (error) {
                // Handle any errors that occur during the request
                console.error('Error fetching user property data:', error);
            } 
        };
    
        fetchunitData();
    
    }, [id]);

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
            }
        };
    
        fetchPropertyData(); // Call the fetch function when the component mounts
    
    }, []);
    
    useEffect(() => {
        if (unitData) {
            setInitialValues({
                property: unitData.property, // Initial value for property
                unitIdOrName: unitData.unit_id_or_name,
                rentAmount: unitData.rent_amount,
                occupied: unitData.occupied, // Assuming occupied is a boolean field
                taxRate: unitData.tax_rate,
                notes: unitData.notes,
            });
        }

    }, [unitData]);
    
    const handleFormSubmit = async (values) => {
        try {
            const res = await fetch(`${BASE_URL}/property/units/update/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'property': values.property,
                    'unit_id_or_name': values.unitIdOrName,
                    'rent_amount': values.rentAmount,
                    'occupied': values.occupied,
                    'tax_rate': values.taxRate,
                    'notes': values.notes
                }),
            });
    
            // Check for network errors
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
    
            if (res.ok) {
                showSuccessMessage();
                res.json().then(data => {
                    console.log(data.id);
                    navigate(`/view-unit/${data.id}`);
                }).catch(error => {
                    console.error('Error parsing JSON:', error);
                });
            } else {
                // Handle other success responses
                console.log('Unexpected response:', res.json());
            }
    
        } catch (error) {
            console.error('Error updating property:', error);
            showFailureMessage();
        }
    };

    // const handleFormSubmit = (values) => {
    //     console.log(values);
    // };
  return (
    <div>
        <Box style={{marginLeft: "20px"}}>
            <Header title={unitData.unit_id_or_name}/>


            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
                onClick={handleCloseBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>


            {initialValues ? (<Formik
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
                <form onSubmit={handleSubmit}>
                    <Box
                        maxWidth="92%"
                        display="flex"
                        flexDirection="column"
                        gap="20px"
                    >
                        {propertyData.length > 0 && (
                            <TextField
                                fullWidth
                                variant="filled"
                                select
                                label="Property *"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.property}
                                name="property"
                                error={!!touched.property && !!errors.property}
                                helperText={touched.property && errors.property}
                            >
                                {propertyData.map(property => (
                                    <MenuItem 
                                        key={property.id} 
                                        value={property.id} 
                                        sx={{ 
                                            color: 'inherit', 
                                            backgroundColor: 'inherit', 
                                            fontWeight: 'normal',
                                            '&:hover': { // Apply hover styles when the mouse is over the MenuItem
                                                color: 'blue',
                                                backgroundColor: 'lightgray',
                                                fontWeight: 'bold',
                                            }
                                        }}
                                    >
                                        {property.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}

                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Unit ID or Name *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.unitIdOrName}
                            name="unitIdOrName"
                            error={!!touched.unitIdOrName && !!errors.unitIdOrName}
                            helperText={touched.unitIdOrName && errors.unitIdOrName}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label="Rent Amount *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.rentAmount}
                            name="rentAmount"
                            error={!!touched.rentAmount && !!errors.rentAmount}
                            helperText={touched.rentAmount && errors.rentAmount}
                        />

                        <FormControlLabel
                            sx={{
                                width: "150px"
                            }}
                            control={
                                <Checkbox
                                    checked={values.occupied}
                                    onChange={handleChange}
                                    name="occupied"
                                    color="primary"
                                />
                            }
                            label="Occupied *"
                            onBlur={handleBlur}
                            error={!!touched.occupied && !!errors.occupied}
                            helperText={touched.occupied && errors.occupied}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label="Tax Rate"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.taxRate}
                            name="taxRate"
                            error={!!touched.taxRate && !!errors.taxRate}
                            helperText={touched.taxRate && errors.taxRate}
                        />

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            variant="filled"
                            type="text"
                            label="Notes (optional)"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.notes}
                            name="notes"
                            error={!!touched.notes && !!errors.notes}
                            helperText={touched.notes && errors.notes}
                        />
                    </Box>
                    <Box display="flex" justifyContent="end" mt="20px" mr="75px" mb="300px">
                        <Button type="submit" variant="contained">
                            Update
                        </Button>
                    </Box>
                </form> 
                )}
            </Formik> ) : (
            <p>Loading...</p>
        )}
        </Box>
    </div>
  )
}




export default UpdateUnit