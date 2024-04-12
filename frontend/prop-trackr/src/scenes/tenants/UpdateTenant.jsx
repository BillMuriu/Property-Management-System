import { Box, Button, IconButton, Typography, useTheme, TextField, MenuItem, CircularProgress, Backdrop} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
// import useMediaQuery from "@mui/material/useMediaQuery";
import { tokens } from "../../theme";
import Header from "../../components/Header";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useSnackbar } from 'notistack';

import { BASE_URL } from "../../config";

import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

const UpdateTenant = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [tenantData, setTenantData] = useState('');
    const [initialValues, setInitialValues] = useState(null);

    const navigate = useNavigate();

    const [openBackdrop, setOpenBackdrop] = useState(true);
    const handleCloseBackdrop = () => {
        setOpenBackdrop(false);
    };

    const [unitData, setunitData] = useState('');
    const [propertyData, setPropertyData] = useState('');

    const { id } = useParams();
    console.log('Property ID:', id);

    const { enqueueSnackbar } = useSnackbar();

    const showSuccessMessage = () => {
        enqueueSnackbar('Tenant was updated successfully', { 
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
        firstName: yup.string().required("First Name is required"),
        lastName: yup.string().required("Last Name is required"),
        phoneNumber: yup.string().required("Phone Number is required"),
        accountNumber: yup.string().nullable(),
        nationalId: yup.string().nullable(),
        email: yup.string().email("Invalid email format").nullable(),
        kraTaxPin: yup.string().nullable(),
        rentPenaltyType: yup.string().nullable(),
        rentPenaltyAmount: yup.number().nullable(),
        rentPenaltyPercentage: yup.number().nullable(),
        notes: yup.string().nullable(),
        moveInDate: yup.date().nullable(),
        moveOutDate: yup.date().nullable(),
        otherPhoneNumbers: yup.string().nullable(),
        leaseStartDate: yup.date().nullable(),
        leaseExpiryDate: yup.date().nullable(),
        leaseNotes: yup.string().nullable(),
        fileUpload: yup.string().nullable(), // Assuming file upload is a string field
    });


    useEffect(() => {
        const fetchTenantData = async () => {
            try {
                // Make a GET request to fetch user landlord data
                const res = await fetch(`${BASE_URL}/tenants/${id}/`, {
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
    
                const fetchedtenantData = await res.json();
                console.log(fetchedtenantData);
                setTenantData(fetchedtenantData); // Set property data in state
    
            } catch (error) {
                // Handle any errors that occur during the request
                console.error('Error fetching user property data:', error);
                alert('Failed to fetch maintenance data status');
            }
        };
    
        fetchTenantData(); // Call the fetch function when the component mounts
    
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
        if (tenantData) {
            setInitialValues({
                property: tenantData.property,
                unitIdOrName: tenantData.unit,
                firstName: tenantData.first_name,
                lastName: tenantData.last_name,
                phoneNumber: tenantData.phone_number,
                accountNumber: tenantData.account_number,
                nationalId: tenantData.national_id,
                email: tenantData.email,
                kraTaxPin: tenantData.kra_tax_pin,
                rentPenaltyType: tenantData.rent_penalty_type,
                rentPenaltyAmount: tenantData.rent_penalty_amount,
                rentPenaltyPercentage: tenantData.rent_penalty_percentage,
                notes: tenantData.notes,
                moveInDate: tenantData.move_in_date,
                moveOutDate: tenantData.move_out_date,
                otherPhoneNumbers: tenantData.other_phone_numbers,
                leaseStartDate: tenantData.lease_start_date,
                leaseExpiryDate: tenantData.lease_expiry_date,
                leaseNotes: tenantData.lease_notes,
                fileUpload: tenantData.file_upload,
            });
    
            // Call fetchUnitData with the property ID
            fetchUnitData(tenantData.property);
        }
    }, [tenantData]);

    const handleFormSubmit = async (values) => {
        try {
            const res = await fetch(`${BASE_URL}/tenants/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "first_name": values.firstName,
                    "last_name": values.lastName,
                    "phone_number": values.phoneNumber,
                    "account_number": values.accountNumber,
                    "national_id": values.nationalId,
                    "email": values.email,
                    "kra_tax_pin": values.kraTaxPin,
                    "rent_penalty_type": values.rentPenaltyType,
                    "rent_penalty_amount": values.rentPenaltyAmount,
                    "rent_penalty_percentage": values.rentPenaltyPercentage,
                    "notes": values.notes,
                    "move_in_date": values.moveInDate,
                    "move_out_date": values.moveOutDate,
                    "other_phone_numbers": values.phoneNumber,
                    "lease_start_date": values.leaseStartDate,
                    "lease_expiry_date": values.leaseExpiryDate,
                    "lease_notes": values.leaseNotes,
                    "file_upload": values.fileUpload,
                    "property": values.property,
                    "unit": values.unitIdOrName
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
                    navigate(`/view-tenant/${data.id}`);
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
            <Header title="Edit Tenant Data"/>
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
                            label="First Name *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.firstName}
                            name="firstName"
                            error={!!touched.firstName && !!errors.firstName}
                            helperText={touched.firstName && errors.firstName}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Last Name *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.lastName}
                            name="lastName"
                            error={!!touched.lastName && !!errors.lastName}
                            helperText={touched.lastName && errors.lastName}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Phone Number *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.phoneNumber}
                            name="phoneNumber"
                            error={!!touched.phoneNumber && !!errors.phoneNumber}
                            helperText={touched.phoneNumber && errors.phoneNumber}
                        />

                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ArrowDownwardIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                sx={{
                                    backgroundColor: colors.primary[400],
                                }}
                            >
                                <Typography>Other Items</Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{
                                    maxWidth: "100%", // Corrected colon (:) instead of equals (=)
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "20px",
                                    backgroundColor: colors.primary[400],
                                }}
                            >
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Account Number"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.accountNumber}
                                    name="accountNumber"
                                    error={!!touched.accountNumber && !!errors.accountNumber}
                                    helperText={touched.accountNumber && errors.accountNumber}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="National ID"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.nationalId}
                                    name="nationalId"
                                    error={!!touched.nationalId && !!errors.nationalId}
                                    helperText={touched.nationalId && errors.nationalId}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Email"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.email}
                                    name="email"
                                    error={!!touched.email && !!errors.email}
                                    helperText={touched.email && errors.email}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="KRA Tax Pin"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.kraTaxPin}
                                    name="kraTaxPin"
                                    error={!!touched.kraTaxPin && !!errors.kraTaxPin}
                                    helperText={touched.kraTaxPin && errors.kraTaxPin}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Rent Penalty Type"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.rentPenaltyType}
                                    name="rentPenaltyType"
                                    error={!!touched.rentPenaltyType && !!errors.rentPenaltyType}
                                    helperText={touched.rentPenaltyType && errors.rentPenaltyType}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label="Rent Penalty Amount"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.rentPenaltyAmount}
                                    name="rentPenaltyAmount"
                                    error={!!touched.rentPenaltyAmount && !!errors.rentPenaltyAmount}
                                    helperText={touched.rentPenaltyAmount && errors.rentPenaltyAmount}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label="Rent Penalty Percentage"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.rentPenaltyPercentage}
                                    name="rentPenaltyPercentage"
                                    error={!!touched.rentPenaltyPercentage && !!errors.rentPenaltyPercentage}
                                    helperText={touched.rentPenaltyPercentage && errors.rentPenaltyPercentage}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Notes"
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
                                    type="date"
                                    label="Move In Date"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.moveInDate}
                                    name="moveInDate"
                                    error={!!touched.moveInDate && !!errors.moveInDate}
                                    helperText={touched.moveInDate && errors.moveInDate}
                                    InputLabelProps={{ shrink: true }}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="date"
                                    label="Move Out Date"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.moveOutDate}
                                    name="moveOutDate"
                                    error={!!touched.moveOutDate && !!errors.moveOutDate}
                                    helperText={touched.moveOutDate && errors.moveOutDate}
                                    InputLabelProps={{ shrink: true }}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Other Phone Numbers"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.otherPhoneNumbers}
                                    name="otherPhoneNumbers"
                                    error={!!touched.otherPhoneNumbers && !!errors.otherPhoneNumbers}
                                    helperText={touched.otherPhoneNumbers && errors.otherPhoneNumbers}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="date"
                                    label="Lease Start Date"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.leaseStartDate}
                                    name="leaseStartDate"
                                    error={!!touched.leaseStartDate && !!errors.leaseStartDate}
                                    helperText={touched.leaseStartDate && errors.leaseStartDate}
                                    InputLabelProps={{ shrink: true }}
                                />
                                
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="date"
                                    label="Lease Expiry Date"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.leaseExpiryDate}
                                    name="leaseExpiryDate"
                                    error={!!touched.leaseExpiryDate && !!errors.leaseExpiryDate}
                                    helperText={touched.leaseExpiryDate && errors.leaseExpiryDate}
                                    InputLabelProps={{ shrink: true }}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Lease Notes"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.leaseNotes}
                                    name="leaseNotes"
                                    error={!!touched.leaseNotes && !!errors.leaseNotes}
                                    helperText={touched.leaseNotes && errors.leaseNotes}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="File Upload"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.fileUpload}
                                    name="fileUpload"
                                    error={!!touched.fileUpload && !!errors.fileUpload}
                                    helperText={touched.fileUpload && errors.fileUpload}
                                />

                            </AccordionDetails>
                        </Accordion>
                    </Box>
                    <Box display="flex" justifyContent="end" mt="20px" mr="75px" mb="300px">
                        <Button type="submit" variant="contained">
                            Edit tenant
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

export default UpdateTenant