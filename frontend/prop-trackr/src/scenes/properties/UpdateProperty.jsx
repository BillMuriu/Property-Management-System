import { Box, Button, IconButton, Typography, useTheme, TextField, MenuItem} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";

import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useSnackbar } from 'notistack';
// import useMediaQuery from "@mui/material/useMediaQuery";
import { tokens } from "../../theme";
import Header from "../../components/Header";

import { BASE_URL } from "../../config";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import React from 'react'

const UpdateProperty = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const { id } = useParams();
    console.log('Property ID:', id);

    const { enqueueSnackbar } = useSnackbar();

    const showSuccessMessage = () => {
        enqueueSnackbar('Property was updated successfully', { 
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

    const [propertyData, setPropertyData] = useState('');
    const [initialValues, setInitialValues] = useState(null);



    
    // Define the validation schema using Yup
    const checkoutSchema = yup.object().shape({
        propertyName: yup.string().required("Name is required"),
        numberOfUnits: yup.number().required("Number of units is required"),
        city: yup.string().required("City is required"),
        waterRate: yup.number().nullable(),
        electricityRate: yup.number().nullable(),
        rentPenaltyType: yup.string().nullable(),
        rentPenaltyAmount: yup.number().nullable(),
        rentPenaltyPercentage: yup.number().nullable(),
        taxRate: yup.number().nullable(),
        managementFee: yup.number().nullable(),
        streetName: yup.string().nullable(),
        companyName: yup.string().nullable(),
        notes: yup.string().nullable(),
    });
        

    useEffect(() => {
        const fetchPropertyData = async () => {
            try {
                // Make a GET request to fetch a particular property instance by ID
                const res = await fetch(`${BASE_URL}/property/${id}`, {
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
                if (!fetchedPropertyData) {
                    throw new Error('Received invalid data from server');
                }
    
                console.log(fetchedPropertyData);
                setPropertyData(fetchedPropertyData);
    
            } catch (error) {
                // Handle any errors that occur during the request
                console.error('Error fetching user property data:', error);
            } 
        };
    
        fetchPropertyData();
    
    }, [id]);
    
    useEffect(() => {
        if (propertyData) {
            setInitialValues({
                propertyName: propertyData.name,
                numberOfUnits: propertyData.number_of_units,
                city: propertyData.city,
                waterRate: propertyData.water_rate,
                electricityRate: propertyData.electricity_rate,
                rentPenaltyType: propertyData.rent_penalty_type,
                rentPenaltyAmount: propertyData.rent_penalty_amount,
                rentPenaltyPercentage: propertyData.rent_penalty_percentage,
                taxRate: propertyData.tax_rate,
                managementFee: propertyData.management_fee,
                streetName: propertyData.street_name,
                companyName: propertyData.company_name,
                notes: propertyData.notes,
            });
        }
    }, [propertyData]);
    
    const handleFormSubmit = async (values) => {
        try {
            const res = await fetch(`${BASE_URL}/property/update/${id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'name': values.propertyName,
                    'city': values.city,
                    'company_name': values.companyName,
                    'electricity_rate': values.electricityRate,
                    'management_fee': values.managementFee,
                    'notes': values.notes,
                    'number_of_units': values.numberOfUnits,
                    'rent_penalty_amount': values.rentPenaltyAmount,
                    'rent_penalty_percentage': values.rentPenaltyPercentage,
                    'rent_penalty_type': values.rentPenaltyType,
                    'street_name': values.streetName,
                    'tax_rate': values.taxRate,
                    'water_rate': values.waterRate,
                }),
            });
    
            // Check for network errors
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
    
            showSuccessMessage();
            // Optionally, you can perform additional actions here after successful update
    
        } catch (error) {
            console.error('Error updating property:', error);
            showFailureMessage();
        }
    };
    

    const rentPenaltyOptions = [
        {
          value:'rentPenaltyAmount',
          label: 'Fixed Amount',
        },
        {
          value: 'rentPenaltyPercentage',
          label: 'Rent Percentage',
        },
      ];



  return (
    <div>
        <Box style={{marginLeft: "20px"}}>
            <Header title="Update the {} Property"/>
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
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Property Name *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.propertyName}
                            name="propertyName"
                            error={!!touched.propertyName && !!errors.propertyName}
                            helperText={touched.propertyName && errors.propertyName}
                        />
                        <TextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label="Number of Units *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.numberOfUnits}
                            name="numberOfUnits"
                            error={!!touched.numberOfUnits && !!errors.numberOfUnits}
                            helperText={touched.numberOfUnits && errors.numberOfUnits}
                        />
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="City"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.city}
                            name="city"
                            error={!!touched.city && !!errors.city}
                            helperText={touched.city && errors.city}
                            sx={{ gridColumn: "span 4" }}
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
                                    type="number"
                                    label="Water Rate (optional)"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.waterRate}
                                    name="waterRate"
                                    error={!!touched.waterRate && !!errors.waterRate}
                                    helperText={touched.waterRate && errors.waterRate}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label="Electricity Rate (optional)"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.electricityRate}
                                    name="electricityRate"
                                    error={!!touched.electricityRate && !!errors.electricityRate}
                                    helperText={touched.electricityRate && errors.electricityRate}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    select
                                    label="Rent Penalty Type (optional)"
                                    onBlur={handleBlur}
                                    onChange={(e) => {
                                        handleChange(e);
                                        // Clear the rent penalty amount or percentage when the type changes
                                        setFieldValue("rentPenaltyAmount", "");
                                        setFieldValue("rentPenaltyPercentage", "");
                                    }}
                                    value={values.rentPenaltyType}
                                    name="rentPenaltyType"
                                    error={!!touched.rentPenaltyType && !!errors.rentPenaltyType}
                                    helperText={touched.rentPenaltyType && errors.rentPenaltyType}
                                >
                                    {rentPenaltyOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>

                                {values.rentPenaltyType === 'rentPenaltyAmount' && (
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="number"
                                        label="Rent Penalty Amount (optional)"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.rentPenaltyAmount}
                                        name="rentPenaltyAmount"
                                        error={!!touched.rentPenaltyAmount && !!errors.rentPenaltyAmount}
                                        helperText={touched.rentPenaltyAmount && errors.rentPenaltyAmount}
                                    />
                                )}

                                {values.rentPenaltyType === 'rentPenaltyPercentage' && (
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="number"
                                        label="Rent Penalty Percentage (optional)"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.rentPenaltyPercentage}
                                        name="rentPenaltyPercentage"
                                        error={!!touched.rentPenaltyPercentage && !!errors.rentPenaltyPercentage}
                                        helperText={touched.rentPenaltyPercentage && errors.rentPenaltyPercentage}
                                    />
                                )}
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label="Tax Rate (optional)"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.taxRate}
                                    name="taxRate"
                                    error={!!touched.taxRate && !!errors.taxRate}
                                    helperText={touched.taxRate && errors.taxRate}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label="Management Fee (optional)"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.managementFee}
                                    name="managementFee"
                                    error={!!touched.managementFee && !!errors.managementFee}
                                    helperText={touched.managementFee && errors.managementFee}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Street Name (optional)"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.streetName}
                                    name="streetName"
                                    error={!!touched.streetName && !!errors.streetName}
                                    helperText={touched.streetName && errors.streetName}
                                />
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Company Name (optional)"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.companyName}
                                    name="companyName"
                                    error={!!touched.companyName && !!errors.companyName}
                                    helperText={touched.companyName && errors.companyName}
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

                            </AccordionDetails>
                        </Accordion>
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




export default UpdateProperty
