import { Box, Button, IconButton, Typography, useTheme, TextField, MenuItem, Checkbox, FormControlLabel} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
// import useMediaQuery from "@mui/material/useMediaQuery";
import { tokens } from "../../theme";
import Header from "../../components/Header";

import { BASE_URL } from "../../config";
import { useSnackbar } from 'notistack';

import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';


import React from 'react'

const AddUnit = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [propertyData, setPropertyData] = useState('');

    const navigate = useNavigate();

    const { enqueueSnackbar } = useSnackbar();

    const showSuccessMessage = () => {
        enqueueSnackbar('Unit was created successfully', { 
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
          autoHideDuration: 3000, 
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
        });
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
            }
        };
    
        fetchPropertyData(); // Call the fetch function when the component mounts
    
    }, []);

    const handleFormSubmit = async (values) => {
        try {
            const res = await fetch(`${BASE_URL}/property/units/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'unit_id_or_name': values.unitIdOrName,
                    'rent_amount': values.rentAmount,
                    'occupied': values.occupied,
                    'tax_rate': values.taxRate,
                    'notes': values.notes,
                    'property': values.property,
                }),
            });
    
            if (!res.ok) {
                // Handle HTTP errors
                throw new Error('Failed to create property: ' + res.status);
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
            console.error('Error creating property:', error.message);
            showFailureMessage()
        }
    };
  return (
    <div>
        <Box style={{marginLeft: "20px"}}>
            <Header title="Add a unit"/>
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
                        <Button type="submit" color="secondary" variant="contained">
                            Create New User
                        </Button>
                    </Box>
                </form>
                )}
            </Formik>
        </Box>
    </div>
  )
}


// Define the validation schema using Yup
const checkoutSchema = yup.object().shape({
    property: yup.number().required("Property is required"), // Assuming property is a foreign key to Property model
    unitIdOrName: yup.string().required("Unit ID or Name is required"),
    rentAmount: yup.number().required("Rent amount is required"),
    occupied: yup.boolean().required("Occupied status is required"),
    taxRate: yup.number().nullable().typeError("Tax rate must be a number"), // Assuming taxRate is a decimal field
    notes: yup.string().nullable(),
});

// Define the initial values for the form fields
const initialValues = {
    property: "", // Initial value for property
    unitIdOrName: "",
    rentAmount: "",
    occupied: false, // Assuming occupied is a boolean field
    taxRate: null,
    notes: "",
};





export default AddUnit
