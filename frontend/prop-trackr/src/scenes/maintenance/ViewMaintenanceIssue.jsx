import { Box, Button, IconButton, Typography, useTheme, TextField, MenuItem, Checkbox, FormControlLabel} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
// import useMediaQuery from "@mui/material/useMediaQuery";
import { tokens } from "../../theme";
import Header from "../../components/Header";

import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useSnackbar } from 'notistack';

import { BASE_URL } from "../../config";

import React from 'react'

const ViewMaintenanceIssue = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [maintenanceData, setMaintenanceData] = useState('');
    const [initialValues, setInitialValues] = useState(null);

    const [unitData, setunitData] = useState('');
    const [propertyData, setPropertyData] = useState('');

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
        property: yup.string().required("Property is required"),
        unitIdOrName: yup.string().required("Unit ID or Name is required"),
        status: yup.string().required("Status is required"),
        category: yup.string().required("Category is required"),
        shortDescription: yup.string().nullable(),
        expenseAmount: yup.number().nullable().typeError("Expense amount must be a number"),
    });


    useEffect(() => {
        const fetchMaintenanceData = async () => {
            try {
                // Make a GET request to fetch user landlord data
                const res = await fetch(`${BASE_URL}/property/maintenance/${id}/`, {
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
    
                const fetchedMaintenanceData = await res.json();
                console.log(fetchedMaintenanceData);
                setMaintenanceData(fetchedMaintenanceData); // Set property data in state
    
            } catch (error) {
                // Handle any errors that occur during the request
                console.error('Error fetching user property data:', error);
                alert('Failed to fetch maintenance data status');
            }
        };
    
        fetchMaintenanceData(); // Call the fetch function when the component mounts
    
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

    const fetchUnitData = async (propertyId) => {
        try {
            // Make a GET request to fetch unit data for a specific property
            const res = await fetch(`${BASE_URL}/property/units/?property=${propertyId}`, {
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
            setunitData(fetchedUnitData); // Set unit data in state

        } catch (error) {
            // Handle any errors that occur during the request
            console.error('Error fetching unit data:', error);
            alert('Failed to fetch unit data');
        }
    };

    const handleMenuItemClick = (propertyId) => {
        fetchUnitData(propertyId);
    };

    useEffect(() => {
        if (maintenanceData) {
            setInitialValues({
                property: maintenanceData.property,
                unitIdOrName: maintenanceData.unit,
                status: maintenanceData.status,
                category: maintenanceData.category,
                shortDescription: maintenanceData.short_description,
                expenseAmount: maintenanceData.expense_amount
            });
    
            // Call fetchUnitData with the property ID
            fetchUnitData(maintenanceData.property);
        }
    }, [maintenanceData]);
    

    const handleFormSubmit = async (values) => {
        try {
            const res = await fetch(`${BASE_URL}/property/maintenance/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'status': values.status,
                    'category': values.category,
                    'short_description': values.shortDescription,
                    'image_upload': values.image_upload,
                    'expense_amount': values.expenseAmount,
                    'property': values.property,
                    'unit': values.unitIdOrName,
                }),
            });
    
            if (!res.ok) {
                // Handle HTTP errors
                throw new Error('Failed to create property: ' + res.status);
            }
    
    
            if (res.ok) {
                showSuccessMessage();
            } else {
                // Handle other success responses
                console.log('Unexpected response:', res.json());
            }
        } catch (error) {
            console.error('Error creating property:', error.message);
            showFailureMessage()
        }
    };

  return (
    <div>
        <Box style={{marginLeft: "20px"}}>
            <Header title="view maintenance issue"/>
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
                                        onClick={() => handleMenuItemClick(property.id)}
                                    >
                                        {property.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}

                        {unitData.length > 0 && (
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                select
                                label="Unit ID or Name *"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.unitIdOrName}
                                name="unitIdOrName"
                                error={!!touched.unitIdOrName && !!errors.unitIdOrName}
                                helperText={touched.unitIdOrName && errors.unitIdOrName}
                            >
                                {unitData.map(unit => (
                                    <MenuItem 
                                        key={unit.id} 
                                        value={unit.id} 
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
                                        {unit.unit_id_or_name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}

                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Status *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.status}
                            name="status"
                            error={!!touched.status && !!errors.status}
                            helperText={touched.status && errors.status}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Category *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.category}
                            name="category"
                            error={!!touched.category && !!errors.category}
                            helperText={touched.category && errors.category}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label="Expense Amount"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.expenseAmount}
                            name="expenseAmount"
                            error={!!touched.expenseAmount && !!errors.expenseAmount}
                            helperText={touched.expenseAmount && errors.expenseAmount}
                        />

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            variant="filled"
                            type="text"
                            label="Short Description (optional)"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.shortDescription}
                            name="shortDescription"
                            error={!!touched.shortDescription && !!errors.shortDescription}
                            helperText={touched.shortDescription && errors.shortDescription}
                        />

                    </Box>
                    <Box display="flex" justifyContent="end" mt="20px" mr="75px" mb="300px">
                        <Button type="submit" color="secondary" variant="contained">
                            Create New User
                        </Button>
                    </Box>
                </form>
                )}
            </Formik>) : (
            <p>Loading...</p>
        )}
        </Box>
    </div>
  )
}



export default ViewMaintenanceIssue
