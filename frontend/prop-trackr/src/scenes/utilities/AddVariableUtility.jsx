import { 
        Box, 
        Button, 
        IconButton, 
        Typography, 
        useTheme, 
        TextField, 
        MenuItem, 
        Checkbox, 
        FormControlLabel
} from "@mui/material";

import { Formik } from "formik";
import * as yup from "yup";
import { tokens } from "../../theme";
import Header from "../../components/Header";

import { BASE_URL } from "../../config";
import { useSnackbar } from 'notistack';

import { useState, useEffect } from "react";

import React from 'react'

const AddVariableUtility = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [unitData, setunitData] = useState('');
    const [propertyData, setPropertyData] = useState('');

    const [selectedUtility, setSelectedUtility] = useState('');
    const [latestUtilities, setLatestUtilities] = useState([]);

    const [arrayOfObjects, setArrayOfObjects] = useState([]);

    const [values, setValues] = useState({}); // State to manage Textfield values

    // Function to handle change in Textfield value
    const handleChange = (event, index) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
    };

    // Function to clear Textfield value
    const clearTextFieldValue = (index) => {
        // Update the state to clear the value of the Textfield
        setValues({ ...values, [`currentReading${index}`]: '' });
    };

    // Function to create the array of objects
    const createArrayOfObjects = () => {
        let newArray = [];
        document.querySelectorAll('.unit-container').forEach((unitContainer, index) => {
            const unitId = unitContainer.dataset.unitId;
            const property = unitContainer.dataset.property;
            const utilityItem = unitContainer.dataset.utilityItem;
            const currentReading = document.getElementById(`currentReading${index}`).value;

            let newObj = {
                unit: unitId,
                property: property,
                utility_item: utilityItem,
                amount: "0.00",
                current_reading: currentReading || 'No data',
                month: "January",
                previous_reading: "0.00",
                is_variable: true,
            };
    
            newArray.push(newObj);
        });
        setArrayOfObjects(newArray);
    };
    



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

    const showUnitUtilities = (utilityItem) => {
        setSelectedUtility(utilityItem);
        // Filter the latest utility for each unit that matches the selected utility
        const latestUtilitiesForSelectedUtility = unitData.map(unit => {
            const utilitiesForSelectedUtility = unit.utilities.filter(utility => utility.utility_item === utilityItem);
            return {
                unitIdOrName: unit.unit_id_or_name,
                latestUtility: utilitiesForSelectedUtility.length > 0 ? utilitiesForSelectedUtility[utilitiesForSelectedUtility.length - 1] : null
            };
        });
        setLatestUtilities(latestUtilitiesForSelectedUtility);

        const textFields = document.querySelectorAll('.current-reading-input');
        textFields.forEach(textField => {
            textField.value = 0;
        });
    };
    


    const bulkCreateUtilities = async (values) => {
        try {
            if (!arrayOfObjects || arrayOfObjects.length === 0) {
                throw new Error('Array of objects is empty or does not exist');
            }

            console.log('Data to be sent to API:', arrayOfObjects);
    
            const res = await fetch(`${BASE_URL}/property/utilities/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(arrayOfObjects), // Send the arrayOfObjects as the body data
            });
    
            if (!res.ok) {
                // Handle HTTP errors
                throw new Error('Failed to create utilities: ' + res.status);
            }
    
            // If successful, show success message
            showSuccessMessage();
        } catch (error) {
            console.error('Error creating utilities:', error.message);
            // If error occurs, show failure message
            showFailureMessage();
        }
    };
    

  return (
    <div>
        <Box style={{marginLeft: "20px"}}>
            <Header title="Add a Variable Utility"/>
            <Formik
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
                <form>
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
                            <MenuItem value="Water" onClick={() => showUnitUtilities("Water")}>Water</MenuItem>
                            <MenuItem value="Electricity" onClick={() => showUnitUtilities("Electricity")}>Electricity</MenuItem>
                        </TextField>

                    </Box>

                    <Box
                        sx={{
                            width: '95%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px'
                        }}
                    >
                        {unitData && unitData.length > 0 ? (
                            unitData.map((unit, index) => (
                                <Box 
                                    key={unit.id}
                                    sx={{
                                        display: 'flex',
                                        gap: "20px"
                                    }}
                                    className="unit-container"
                                    data-unit-id={unit.id}
                                    data-property={unit.property}
                                    data-utility-item={selectedUtility}
                                >
                                    <Typography>
                                        {unit.unit_id_or_name}
                                    </Typography>
                                    {latestUtilities.map(item => (
                                        item.unitIdOrName === unit.unit_id_or_name && (
                                            <Typography key={`${item.unitIdOrName}-latest`}>
                                                Latest {selectedUtility}: {item.latestUtility ? item.latestUtility.current_reading : 'No data'}
                                            </Typography>
                                        )
                                    ))}
                                    
                                    <TextField
                                        fullWidth
                                        variant="filled"
                                        type="number"
                                        label="Current Reading *"
                                        onBlur={handleBlur}
                                        className="current-reading-input"
                                        onChange={handleChange}
                                        value={values[`currentReading${index}`]}
                                        name={`currentReading${index}`}
                                        error={!!touched[`currentReading${index}`] && !!errors[`currentReading${index}`]}
                                        helperText={touched[`currentReading${index}`] && errors[`currentReading${index}`]}
                                        id={`currentReading${index}`}
                                    />
                                </Box>
                            ))
                        ) : (
                            <Typography>No unit data available</Typography>
                        )}
                    </Box>

                    <Button onClick={createArrayOfObjects}>Create Array of Objects</Button>
                    


                    <Button onClick={() => clearTextFieldValue(0)}>Clear Textfield</Button>

                </form>
                )}
            </Formik>

            <Button variant="contained" color="primary" onClick={bulkCreateUtilities}>
                Create Utilities
            </Button>

            {arrayOfObjects.length > 0 && (
                <div>
                    <h2>Array of Objects:</h2>
                    <pre>{JSON.stringify(arrayOfObjects, null, 2)}</pre>
                </div>
            )}
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
    property: "",
    unitIdOrName: "",
    utilityItem: "",
    amount: null,
    currentReading: null,
    month: "",
    previousReading: null,
    isVariable: true,
};




export default AddVariableUtility