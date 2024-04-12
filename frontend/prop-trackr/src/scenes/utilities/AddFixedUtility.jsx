import { 
    Box, 
    Button,
    Typography, 
    useTheme, 
    TextField, 
    MenuItem, 
    Table, 
    TableHead, 
    TableBody, 
    TableRow, 
    TableCell,
    Modal,
    CircularProgress,
    Backdrop

} from "@mui/material";

import { Formik } from "formik";
import * as yup from "yup";
import { tokens } from "../../theme";
import Header from "../../components/Header";

import { BASE_URL } from "../../config";
import { useSnackbar } from 'notistack';

import { useState, useEffect } from "react";

import React from 'react'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 5,
    p: 4,
};

const formatDate = (dateString) => {
// Create a new Date object from the dateString
const date = new Date(dateString);
const monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
];

// Extract day, month, and year from the date object
const day = date.getDate();
const monthIndex = date.getMonth();
const year = date.getFullYear();
return `${day} ${monthNames[monthIndex]} ${year}`;
};

const AddFixedUtility = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [openBackdrop, setOpenBackdrop] = useState(true);

    const handleCloseBackdrop = () => {
        setOpenBackdrop(false);
    };


    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const [unitData, setunitData] = useState([]);
    const [propertyData, setPropertyData] = useState('');

    const [utilityData, setUtilityData] = useState([]);
    const [bulkInvoices, setBulkInvoices] = useState([]);




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
            } finally {
                setOpenBackdrop(false); // Close the backdrop regardless of success or failure
            }
        };

        fetchPropertyData(); // Call the fetch function when the component mounts

    }, []);





    const fetchUnitData = async (propertyId) => {
        try {
            setOpenBackdrop(true);
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
        } finally {
            setTimeout(() => {
                setOpenBackdrop(false); // Close the backdrop regardless of success or failure
            }, 2000); 
        }
    };



    const handleMenuItemClick = (propertyId) => {
        fetchUnitData(propertyId);
    };

    const bulkCreateUtilities = async (values) => {
        try {
            let newArray = [];

            if (Array.isArray(unitData) && unitData.length > 0) {
                unitData.forEach((unit) => {
                    const unitId = unit.id.toString();
                    const property = unit.property.toString();

                    // const utilityItem = values.utilityItem;
            
                    let newObj = {
                        unit: unitId,
                        property: property,
                        utility_item: "Water",
                        amount: "0.00",
                        current_reading: "0.00",
                        month: "January",
                        previous_reading: "0.00",
                        is_variable: false,
                    };
            
                    newArray.push(newObj);
                });
            } else {
                console.error("unitData is empty or not an array");
            }

            console.log('Data to be sent to API:', newArray);

            const res = await fetch(`${BASE_URL}/property/utilities/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newArray), // Send the arrayOfObjects as the body data
            });

            if (!res.ok) {
                // Handle HTTP errors
                throw new Error('Failed to create utilities: ' + res.status);
            }

            if (res.ok) {
                showSuccessMessage();
                const data = await res.json();
                console.log(data);
                setUtilityData(data);
                handleOpenModal();
            } else {
                // Handle other success responses
                console.log('Unexpected response:', res.json());
            }

        } catch (error) {
            console.error('Error creating utilities:', error.message);
            // If error occurs, show failure message
            showFailureMessage();
        }
    };


    const transformUtilityDataToBulkInvoices = () => {
        if (!utilityData || utilityData.length === 0) {
            // If utilityData does not exist or is empty, do nothing
            return;
        }

        const transformedData = utilityData
            .filter(item => item.tenant) // Filter out items without a tenant
            .map(item => {
                return {
                    property: item.property,
                    tenant: item.tenant.id,
                    invoice_date: item.created_at,
                    invoice_status: 'open',
                    item_name: item.utility_item?.toLowerCase(),
                    amount: parseFloat(item.amount),
                    description: `Monthly ${item.utility_item} invoice`,
                    utility: item.id
                };
            });

        // Log the transformed data
        console.log('Transformed Data:', transformedData);

        // Set the transformed data into bulkInvoices state
        setBulkInvoices(transformedData);
    };


    const bulkCreateInvoices = async (values) => {
        try {
            if (!bulkInvoices || bulkInvoices.length === 0) {
                throw new Error('Array of objects is empty or does not exist');
            }

            console.log('Data to be sent to API:', bulkInvoices);

            const res = await fetch(`${BASE_URL}/financials/invoices/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bulkInvoices), // Send the arrayOfObjects as the body data
            });

            if (!res.ok) {
                // Handle HTTP errors
                throw new Error('Failed to create utilities: ' + res.status);
            }

            if (res.ok) {
                showSuccessMessage();
                res.json().then(data => {
                    console.log(data);
                }).catch(error => {
                    console.error('Error parsing JSON:', error);
                });
            } else {
                // Handle other success responses
                console.log('Unexpected response:', res.json());
            }

            
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

            

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{ ...style, '@media (max-width: 600px)': { width: '80%', height: '50%' } }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Create bulk invoices
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2, mb: 2 }}>
                        Do you want to create invoices for all the utilities you've just created?
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Button 
                            onClick={() => {
                                bulkCreateInvoices();
                                handleCloseModal();
                            }} 
                            variant="contained" 
                            color="primary"
                            sx={{
                                marginRight: "10px",
                            }}
                        >
                            Create Bulk Invoices
                        </Button>

                        <Button variant="outlined" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                    </Box>

                </Box>
            </Modal>

            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
                onClick={handleCloseBackdrop}
            >
                <CircularProgress color="inherit" />
            </Backdrop>


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
                            <MenuItem value="Water">Water</MenuItem>
                            <MenuItem value="Electricity">Garbage</MenuItem>
                        </TextField>

                    </Box>


                    <Box
                        sx={{
                            width: '95%',
                            marginTop: '20px'
                        }}
                    >
                                     
                    </Box>

                </form>
                )}
            </Formik>

            <Button variant="contained" color="primary" onClick={bulkCreateUtilities}>
                Create Utilities
            </Button>

            {/* {arrayOfObjects.length > 0 && (
                <div>
                    <h2>Array of Objects:</h2>
                    <pre>{JSON.stringify(arrayOfObjects, null, 2)}</pre>
                </div>
            )} */}


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

export default AddFixedUtility