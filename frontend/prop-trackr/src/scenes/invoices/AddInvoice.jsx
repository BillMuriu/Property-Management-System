import { Box, Button, IconButton, Typography, useTheme, TextField, MenuItem, CircularProgress, Backdrop} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
// import useMediaQuery from "@mui/material/useMediaQuery";
import { tokens } from "../../theme";
import Header from "../../components/Header";

import React from 'react'

import { BASE_URL } from "../../config";
import { useSnackbar } from 'notistack';

import { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';

const AddInvoice = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [tenantData, setTenantData] = useState('');
    const [propertyData, setPropertyData] = useState('');

    const { enqueueSnackbar } = useSnackbar();

    const [openBackdrop, setOpenBackdrop] = useState(true);
    const handleCloseBackdrop = () => {
        setOpenBackdrop(false);
    };

    const navigate = useNavigate();

    const showSuccessMessage = () => {
        enqueueSnackbar('Invoice was created successfully', { 
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
        setOpenBackdrop(true);
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
                setOpenBackdrop(false);
            }
        };
    
        fetchPropertyData(); // Call the fetch function when the component mounts
    
    }, []);


    const fetchTenantData = async (propertyId) => {
        setOpenBackdrop(true);
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
        } finally {
            setOpenBackdrop(false);
        }
    };

    const handleMenuItemClick = (propertyId) => {
        fetchTenantData(propertyId);
    };


    const handleFormSubmit = async (values) => {
        try {
            const res = await fetch(`${BASE_URL}/financials/invoices/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    "invoice_date": values.invoiceDate,
                    "invoice_status": values.invoiceStatus,
                    "item_name": values.itemName,
                    "amount": values.amount,
                    "description": values.description,
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
                res.json().then(data => {
                    console.log(data.id);
                    navigate(`/view-invoice/${data.id}`);
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
            <Header title="Add an invoice"/>


            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
                onClick={handleCloseBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>


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
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            label="Invoice Date *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.invoiceDate}
                            name="invoiceDate"
                            error={!!touched.invoiceDate && !!errors.invoiceDate}
                            helperText={touched.invoiceDate && errors.invoiceDate}
                        />

                        <TextField
                            fullWidth
                            select
                            variant="filled"
                            label="Item Name *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.itemName}
                            name="itemName"
                            error={!!touched.itemName && !!errors.itemName}
                            helperText={touched.itemName && errors.itemName}
                        >
                            <MenuItem value="rent">Rent</MenuItem>
                            <MenuItem value="opening_balance">Opening Balance</MenuItem>
                            <MenuItem value="vat">VAT</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                            <MenuItem value="rent_deposit">Rent Deposit</MenuItem>
                            <MenuItem value="water_deposit">Water Deposit</MenuItem>
                            <MenuItem value="electricity_deposit">Electricity Deposit</MenuItem>
                            <MenuItem value="contract_charges">Contract Charges</MenuItem>
                            <MenuItem value="other_deposit">Other Deposit</MenuItem>
                        </TextField>

                        <TextField
                            fullWidth
                            variant="filled"
                            label="Amount *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.amount}
                            name="amount"
                            type="number" // Set the input type to 'number' to enforce numeric input
                            error={!!touched.amount && !!errors.amount}
                            helperText={touched.amount && errors.amount}
                        />
                                                

                        <TextField
                            fullWidth
                            select
                            variant="filled"
                            label="Invoice Status *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.invoiceStatus}
                            name="invoiceStatus"
                            error={!!touched.invoiceStatus && !!errors.invoiceStatus}
                            helperText={touched.invoiceStatus && errors.invoiceStatus}
                        >
                            <MenuItem value="draft">Draft</MenuItem>
                            <MenuItem value="open">Open</MenuItem>
                            <MenuItem value="credit-note">Credit Note</MenuItem>
                        </TextField>

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            variant="filled"
                            type="text"
                            label="Description (optional)"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.description}
                            name="description"
                            error={!!touched.description && !!errors.description}
                            helperText={touched.description && errors.description}
                        />



                    </Box>
                    <Box display="flex" justifyContent="end" mt="20px" mr="75px" mb="300px">
                        <Button type="submit" variant="contained">
                            Submit
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
    tenant: yup.string().required("Tenant is required"),
    invoiceDate: yup.date().required("Invoice date is required"),
    invoiceStatus: yup.string().required("Invoice status is required"),
    itemName: yup.string().nullable(),
    amount: yup.number().nullable(),
    description: yup.string().nullable(),
});


// Define the initial values for the form fields
const initialValues = {
    property: '', // Initial value for property is empty
    tenant: '',
    invoiceDate: '',
    invoiceStatus: '',
    itemName: '',
    amount: null, // Initial value for amount is null
    description: '',
};




export default AddInvoice
