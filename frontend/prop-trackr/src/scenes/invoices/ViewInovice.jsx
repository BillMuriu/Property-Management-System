import { Box, Button, IconButton, Typography, useTheme, TextField, MenuItem, CircularProgress, Backdrop} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
// import useMediaQuery from "@mui/material/useMediaQuery";
import { tokens } from "../../theme";
import Header from "../../components/Header";

import React from 'react'

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import Divider from '@mui/material/Divider';

import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useSnackbar } from 'notistack';

import { BASE_URL } from "../../config";

import { Link, useNavigate } from 'react-router-dom';

const ViewInvoice = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [openBackdrop, setOpenBackdrop] = useState(true);
    const handleCloseBackdrop = () => {
        setOpenBackdrop(false);
    };

    
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    };

    const [invoiceData, setInvoiceData] = useState('');
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
        invoiceDate: yup.date().required("Invoice date is required"),
        invoiceStatus: yup.string().required("Invoice status is required"),
        itemName: yup.string().nullable(),
        amount: yup.number().nullable(),
        description: yup.string().nullable(),
    });

    useEffect(() => {
        const fetchInvoiceData = async () => {
            try {
                // Make a GET request to fetch user landlord data
                const res = await fetch(`${BASE_URL}/financials/invoices/${id}/`, {
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
    
                const fetchedInvoiceData = await res.json();
                console.log(fetchedInvoiceData);
                setInvoiceData(fetchedInvoiceData); // Set property data in state
    
            } catch (error) {
                // Handle any errors that occur during the request
                console.error('Error fetching user property data:', error);
                alert('Failed to fetch maintenance data status');
            }
        };
    
        fetchInvoiceData(); // Call the fetch function when the component mounts
    
    }, [id]);

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

    useEffect(() => {
        if (invoiceData) {
            setInitialValues({
                property: invoiceData.property, // Initial value for property
                tenant: invoiceData.tenant,
                invoice_date: invoiceData.invoice_date,
                item_name: invoiceData.item_name,
                invoice_status: invoiceData.invoice_status,
                description: invoiceData.description,
                amount: invoiceData.amount,
            });
    
            // Call fetchUnitData with the property ID
            fetchTenantData(invoiceData.property);
        }
    }, [invoiceData]);

    const handleFormSubmit = async (values) => {
        try {
            const res = await fetch(`${BASE_URL}/financials/invoices/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "invoice_date": values.invoice_date,
                    "invoice_status": values.invoice_status,
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
            {tenantData && (
                 <Header title={`Invoice  - ${invoiceData.id}`}/>
            )}

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
                        sx={{
                            width: '95%',
                            display: "flex",
                            justifyContent: {sx: 'flex-start', sm: 'flex-end'},
                            gap: "10px",
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
                                display: "flex",
                                justifyContent: {sx: 'flex-start', sm: 'flex-end'},
                                gap: "10px",
                                width: { xs: '100%', sm: '50%' },
                            }}
                        >
                            <Link to="/add-invoice" style={{ textDecoration: 'none' }}>
                                <Button variant="contained" startIcon={<AddIcon />}>Add an invoice</Button>
                            </Link>
                        </Box>

                        
                    </Box>


                    <Box
                        maxWidth="95%"
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
                                InputProps={{
                                    readOnly: true,
                                }}
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
                            type="date"
                            // label="Invoice Date *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.invoice_date}
                            name="invoice_date"
                            error={!!touched.invoice_date && !!errors.invoice_date}
                            helperText={touched.invoice_date && errors.invoice_date}
                            InputProps={{
                                readOnly: true,
                            }}
                        />

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
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                        
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Item Name *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.item_name}
                            name="invoice_status"
                            error={!!touched.item_name && !!errors.item_name}
                            helperText={touched.item_name && errors.item_name}
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    

                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Invoice Status *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.invoice_status}
                            name="invoice_status"
                            error={!!touched.invoice_status && !!errors.invoice_status}
                            helperText={touched.invoice_status && errors.invoice_status}
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
                            label="description (optional)"
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



                    </Box>
                    
                    
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "95%",
                            mt: 3,
                            marginBottom: "30px"
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
                        
                        <Button
                            component={Link}
                            to={`/update-invoice/${id}`}
                            variant="contained"
                        >
                            Edit
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

export default ViewInvoice