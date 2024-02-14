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

const ViewExpense = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [expenseData, setexpenseData] = useState('');
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
    const expenseSchema = yup.object().shape({
        property: yup.string().required("Property is required"),
        unitIdOrName: yup.string().required("Unit ID or Name is required"),
        amount: yup.number().required("Amount is required"),
        paymentMethod: yup.string().required("Payment Method is required"),
        expenseCategory: yup.string().required("Expense Category is required"),
        expenseDate: yup.date().required("Expense Date is required"),
        notes: yup.string().nullable(),
        status: yup.string().nullable(),
        fileUpload: yup.mixed().nullable(), // Assuming fileUpload is optional
    });


    useEffect(() => {
        const fetchExpenseData = async () => {
            try {
                // Make a GET request to fetch user landlord data
                const res = await fetch(`${BASE_URL}/financials/expenses/${id}/`, {
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
    
                const fetchedExpenseData = await res.json();
                console.log(fetchedExpenseData);
                setexpenseData(fetchedExpenseData); // Set property data in state
    
            } catch (error) {
                // Handle any errors that occur during the request
                console.error('Error fetching user property data:', error);
                alert('Failed to fetch maintenance data status');
            }
        };
    
        fetchExpenseData(); // Call the fetch function when the component mounts
    
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
        if (expenseData) {
            setInitialValues({
                property: expenseData.property,
                unitIdOrName: expenseData.unit,
                amount: expenseData.amount,
                paymentMethod: expenseData.payment_method,
                expenseCategory: expenseData.expense_category,
                expenseDate: expenseData.expense_date,
                status: expenseData.status,
                notes: expenseData.notes,
                fileUpload: expenseData.file_upload,
            });
    
            // Call fetchUnitData with the property ID
            fetchUnitData(expenseData.property);
        }
    }, [expenseData]);

    const handleFormSubmit = async (values) => {
        try {
            const res = await fetch(`${BASE_URL}/financials/expenses/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "amount": values.amount,
                    "payment_method": values.paymentMethod,
                    "expense_category": values.expenseCategory,
                    "expense_date": values.expenseDate,
                    "status": values.status,
                    "notes": values.notes,
                    "file_upload": null,
                    "property": values.property,
                    "unit": values.unitIdOrName,
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
            <Header title="Add an expense"/>
            {initialValues ? (<Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={expenseSchema}
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
                            type="text"
                            label="Payment Method *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.paymentMethod}
                            name="paymentMethod"
                            error={!!touched.paymentMethod && !!errors.paymentMethod}
                            helperText={touched.paymentMethod && errors.paymentMethod}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Expense Category *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.expenseCategory}
                            name="expenseCategory"
                            error={!!touched.expenseCategory && !!errors.expenseCategory}
                            helperText={touched.expenseCategory && errors.expenseCategory}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            type="date"
                            label="Expense Date *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.expenseDate}
                            name="expenseDate"
                            error={!!touched.expenseDate && !!errors.expenseDate}
                            helperText={touched.expenseDate && errors.expenseDate}
                            InputLabelProps={{ shrink: true }}
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

                        <TextField
                            fullWidth
                            variant="filled"
                            type="file"
                            label="File Upload"
                            onChange={(event) => {
                                setFieldValue("fileUpload", event.currentTarget.files[0]);
                            }}
                            name="fileUpload"
                            error={!!touched.fileUpload && !!errors.fileUpload}
                            helperText={touched.fileUpload && errors.fileUpload}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ inputProps: { accept: 'image/*' } }} // Specify file types here
                        />

                    </Box>
                    <Box display="flex" justifyContent="end" mt="20px" mr="75px" mb="300px">
                        {/* <Button type="submit" color="secondary" variant="contained">
                            Create New User
                        </Button> */}
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


export default ViewExpense
