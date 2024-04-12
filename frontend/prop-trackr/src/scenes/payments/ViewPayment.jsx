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

const ViewPayment = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [paymentData, setPaymentData] = useState('');
    const [initialValues, setInitialValues] = useState(null);

    const [tenantData, setTenantData] = useState('');
    const [propertyData, setPropertyData] = useState('');

    const { id } = useParams();
    console.log('Property ID:', id);


    const { enqueueSnackbar } = useSnackbar();

    const showSuccessMessage = () => {
        enqueueSnackbar('Maintainance issue was created successfully', { 
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

    // Define the validation schema using Yup
    const checkoutSchema = yup.object().shape({
        property: yup.string().required("Property is required"),
        tenant: yup.string().required("Tenant is required"),
        paid_amount: yup.number().required("Paid amount is required"),
        payment_date: yup.date().required("Payment date is required"),
        status: yup.string().required("Status is required"),
        payment_type: yup.string().nullable(),
        description: yup.string().nullable(),
        bank_transaction_id: yup.string().nullable(),
        file_upload: yup.mixed().nullable(), // Assuming file_upload is a file field
    });

    useEffect(() => {
        const fetchPaymentData = async () => {
            try {
                // Make a GET request to fetch user landlord data
                const res = await fetch(`${BASE_URL}/financials/payments/${id}/`, {
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
    
                const fetchedpaymentData = await res.json();
                console.log(fetchedpaymentData);
                setPaymentData(fetchedpaymentData); // Set property data in state
    
            } catch (error) {
                // Handle any errors that occur during the request
                console.error('Error fetching user property data:', error);
                alert('Failed to fetch maintenance data status');
            }
        };
    
        fetchPaymentData(); // Call the fetch function when the component mounts
    
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


    const fetchTenantData = async (propertyId) => {
        try {
            // Make a GET request to fetch unit data for a specific property
            const res = await fetch(`${BASE_URL}/tenants/?property=${propertyId}`, {
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

            const fetchedTenantData = await res.json();

            console.log(fetchedTenantData);
            setTenantData(fetchedTenantData); // Set unit data in state

        } catch (error) {
            // Handle any errors that occur during the request
            console.error('Error fetching unit data:', error);
            alert('Failed to fetch unit data');
        }
    };

    const handleMenuItemClick = (propertyId) => {
        fetchTenantData(propertyId);
    };

    useEffect(() => {
        if (paymentData) {
            setInitialValues({
                property: paymentData.property,
                tenant: paymentData.tenant,
                paid_amount: paymentData.paid_amount,
                payment_date: paymentData.payment_date,
                status: paymentData.status,
                payment_type: paymentData.payment_type,
                description: paymentData.description,
                bank_transaction_id: paymentData.bank_transaction_id,
                file_upload: paymentData.file_upload,
            });
    
            // Call fetchUnitData with the property ID
            fetchTenantData(paymentData.property);
        }
    }, [paymentData]);

    const handleFormSubmit = async (values) => {
        try {
            const res = await fetch(`${BASE_URL}/financials/payments/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "paid_amount": values.paid_amount,
                    "payment_date": values.payment_date,
                    "status": values.status,
                    "payment_type": values.payment_type,
                    "description": values.description,
                    "bank_transaction_id": values.bank_transaction_id,
                    "file_upload": null,
                    "property": values.property,
                    "tenant": values.tenant
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
            <Header title="Update Payment"/>
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
                                InputProps={{
                                    readOnly: true,
                                }}
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

                        {tenantData.length > 0 && (
                            <TextField
                                fullWidth
                                variant="filled"
                                type="text"
                                select
                                label="tenant name *"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.tenant}
                                name="tenant"
                                error={!!touched.tenant && !!errors.tenant}
                                helperText={touched.tenant && errors.tenant}
                                InputProps={{
                                    readOnly: true,
                                }}
                            >
                                {tenantData.map(tenant => (
                                    <MenuItem 
                                        key={tenant.id} 
                                        value={tenant.id} 
                                        sx={{ 
                                            color: 'white', 
                                            backgroundColor: 'inherit', 
                                            fontWeight: 'normal',
                                            '&:hover': { // Apply hover styles when the mouse is over the MenuItem
                                                color: 'blue',
                                                backgroundColor: 'lightgray',
                                                fontWeight: 'bold',
                                            }
                                        }}
                                    >
                                        {tenant.first_name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}

                        <TextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label="Paid Amount *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.paid_amount}
                            name="paid_amount"
                            error={!!touched.paid_amount && !!errors.paid_amount}
                            helperText={touched.paid_amount && errors.paid_amount}
                            InputProps={{
                                readOnly: true,
                            }}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            type="date"
                            label="Payment Date *"
                            InputLabelProps={{ shrink: true }}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.payment_date}
                            name="payment_date"
                            error={!!touched.payment_date && !!errors.payment_date}
                            helperText={touched.payment_date && errors.payment_date}
                            InputProps={{
                                readOnly: true,
                            }}
                        />

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
                            InputProps={{
                                readOnly: true,
                            }}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Payment Type"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.payment_type}
                            name="payment_type"
                            error={!!touched.payment_type && !!errors.payment_type}
                            helperText={touched.payment_type && errors.payment_type}
                            InputProps={{
                                readOnly: true,
                            }}
                        />

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            variant="filled"
                            type="text"
                            label="Description"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.description}
                            name="description"
                            error={!!touched.description && !!errors.description}
                            helperText={touched.description && errors.description}
                            InputProps={{
                                readOnly: true,
                            }}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Bank Transaction ID"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.bank_transaction_id}
                            name="bank_transaction_id"
                            error={!!touched.bank_transaction_id && !!errors.bank_transaction_id}
                            helperText={touched.bank_transaction_id && errors.bank_transaction_id}
                            InputProps={{
                                readOnly: true,
                            }}
                        />

                        <input
                            type="file"
                            onChange={(event) => {
                                setFieldValue("file_upload", event.currentTarget.files[0]);
                            }}
                            onBlur={handleBlur}
                            name="file_upload"
                            accept=".pdf"
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




export default ViewPayment