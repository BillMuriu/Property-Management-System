import { Box, Button, useTheme, TextField, MenuItem,} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
// import useMediaQuery from "@mui/material/useMediaQuery";
import { tokens } from "../../theme";
import Header from "../../components/Header";

import { BASE_URL } from "../../config";
import { useSnackbar } from 'notistack';

import { useState, useEffect } from "react";

import React from 'react'

const AddUtility = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [unitData, setunitData] = useState('');
    const [propertyData, setPropertyData] = useState('');

    const { enqueueSnackbar } = useSnackbar();

    const showSuccessMessage = () => {
        enqueueSnackbar('Utility was created successfully', { 
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
                const res = await fetch(`${BASE_URL}/property`, {
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


    const handleFormSubmit = async (values) => {
        try {
            const res = await fetch(`${BASE_URL}/property/utilities/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'property': values.property,
                    'unit': values.unitIdOrName,
                    'utility_item': values.utilityItem,
                    'amount': values.amount,
                    'current_reading': values.currentReading,
                    'month': values.month,
                    'previous_reading': values.previousReading,
                    'is_variable': values.isVariable,
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
            <Header title="Add a Utility"/>
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
                            select
                            label="Utility Item *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.utilityItem}
                            name="utilityItem"
                            error={!!touched.utilityItem && !!errors.utilityItem}
                            helperText={touched.utilityItem && errors.utilityItem}
                        >
                            <MenuItem value="Water">Water</MenuItem>
                            <MenuItem value="Electricity">Electricity</MenuItem>
                            <MenuItem value="Garbage">Garbage</MenuItem>
                            <MenuItem value="Security">Security</MenuItem>
                            <MenuItem value="Internet">Internet</MenuItem>
                            <MenuItem value="Cleaning">Cleaning</MenuItem>
                            <MenuItem value="Service">Service</MenuItem>
                            <MenuItem value="Parking">Parking</MenuItem>
                        </TextField>

                        <TextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label="Amount *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.amount}
                            name="amount"
                            error={!!touched.amount && !!errors.amount}
                            helperText={touched.amount && errors.amount}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label="Current Reading *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.currentReading}
                            name="currentReading"
                            error={!!touched.currentReading && !!errors.currentReading}
                            helperText={touched.currentReading && errors.currentReading}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            select
                            label="Month *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.month}
                            name="month"
                            error={!!touched.month && !!errors.month}
                            helperText={touched.month && errors.month}
                        >
                            <MenuItem value="January">January</MenuItem>
                            <MenuItem value="February">February</MenuItem>
                            <MenuItem value="March">March</MenuItem>
                            <MenuItem value="April">April</MenuItem>
                            <MenuItem value="May">May</MenuItem>
                            <MenuItem value="June">June</MenuItem>
                            <MenuItem value="July">July</MenuItem>
                            <MenuItem value="August">August</MenuItem>
                            <MenuItem value="September">September</MenuItem>
                            <MenuItem value="October">October</MenuItem>
                            <MenuItem value="November">November</MenuItem>
                            <MenuItem value="December">December</MenuItem>
                        </TextField>

                        <TextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label="Previous Reading"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.previousReading}
                            name="previousReading"
                            error={!!touched.previousReading && !!errors.previousReading}
                            helperText={touched.previousReading && errors.previousReading}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            select
                            label="Variable Status *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.isVariable}
                            name="isVariable"
                            error={!!touched.isVariable && !!errors.isVariable}
                            helperText={touched.isVariable && errors.isVariable}
                        >
                            <MenuItem value={true}>True</MenuItem>
                            <MenuItem value={false}>False</MenuItem>
                        </TextField>


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
    property: yup.string().required("Property is required"),
    unitIdOrName: yup.string().required("Unit ID or Name is required"),
    utilityItem: yup.string().required("Utility item is required"),
    amount: yup.number().nullable().typeError("Amount must be a number"),
    currentReading: yup.number().nullable().typeError("Current reading must be a number"),
    month: yup.string().required("Month is required"),
    previousReading: yup.number().nullable().typeError("Previous reading must be a number"),
    isVariable: yup.boolean().required("Variable status is required"),
});

// Define the initial values for the form fields
const initialValues = {
    property: "", // Initial value for property
    unitIdOrName: "",
    utilityItem: "", // Initial value for utilityItem
    amount: null, // Initial value for amount
    currentReading: null, // Initial value for currentReading
    month: "", // Initial value for month
    previousReading: null, // Initial value for previousReading
    isVariable: true, // Initial value for isVariable
};




export default AddUtility
