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
    Modal
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

const AddVariableUtility = () => {
const theme = useTheme();
const colors = tokens(theme.palette.mode);

const [openModal, setOpenModal] = useState(false);
const handleOpenModal = () => setOpenModal(true);
const handleCloseModal = () => setOpenModal(false);

const [unitData, setunitData] = useState([]);
const [propertyData, setPropertyData] = useState('');

const [selectedUtility, setSelectedUtility] = useState('');
const [latestUtilities, setLatestUtilities] = useState([]);

const [arrayOfObjects, setArrayOfObjects] = useState([]);
const [utilityData, setUtilityData] = useState([]);
const [bulkInvoices, setBulkInvoices] = useState([]);

useEffect(() => {
    if (selectedUtility) {
        clearTextFields();
    }
}, [selectedUtility]);






const createArrayOfObjects = () => {
    let newArray = [];
    document.querySelectorAll('.unit-container').forEach((unitContainer, index) => {
        const unitId = unitContainer.dataset.unitId;
        const property = unitContainer.dataset.property;
        const utilityItem = unitContainer.dataset.utilityItem;
        const currentReading = document.getElementById(`currentReading${index}`).value;

        const currentReadingElement = document.getElementById(`latestReading${index}`);
        const previousReading = currentReadingElement ? currentReadingElement.value : '0.00';

        let newObj = {
            unit: unitId,
            property: property,
            utility_item: utilityItem,
            amount: "0.00",
            current_reading: currentReading || previousReading,
            month: "January",
            previous_reading: previousReading,
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


const updateTextField = (index) => {
    const currentReadingElement = document.getElementById(`latestReading${index}`);
    const initialInputValue = currentReadingElement ? currentReadingElement.value : null;

    const textField = document.getElementById(`currentReading${index}`);
    if (textField.value <= initialInputValue) {
        textField.value = initialInputValue;
    }

};


const clearTextFields = () => {
    document.querySelectorAll('.unit-container').forEach((unitContainer, index) => {
        const textField = document.getElementById(`currentReading${index}`);
        textField.value = null;
    });
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
};



const bulkCreateUtilities = async () => {
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


useEffect(() => {
    // Call transformUtilityDataToBulkInvoices whenever utilityData changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    transformUtilityDataToBulkInvoices();
}, [utilityData]);

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

        <Button variant="outlined" onClick={handleOpenModal}>Open modal</Button>

        

        <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{ ...style, '@media (max-width: 600px)': { width: '80%', height: '50%' } }}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Text in a modal
                </Typography>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
                </Typography>

                <Button 
                    onClick={() => {
                        bulkCreateInvoices();
                        handleCloseModal();
                    }} 
                    variant="contained" 
                    color="primary"
                    sx={{
                        marginLeft: '20px'
                    }}
                >
                    Create Bulk Invoices
                </Button>

            </Box>
        </Modal>


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
                        marginTop: '20px'
                    }}
                >
                    {selectedUtility && unitData && unitData.length > 0 ? (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Unit</TableCell>
                                    <TableCell>Previous Readings</TableCell>
                                    <TableCell>Current Readings</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {unitData.map((unit, index) => (
                                    <TableRow key={unit.id} 
                                        className="unit-container"
                                        data-unit-id={unit.id}
                                        data-property={unit.property}
                                        data-utility-item={selectedUtility}
                                    >
                                        <TableCell>{unit.unit_id_or_name}</TableCell>
                                        <TableCell>
                                            {latestUtilities.map(item => (
                                                item.unitIdOrName === unit.unit_id_or_name && (
                                                    <div key={`${item.unitIdOrName}-latest`}>
                                                        <Typography>
                                                            {item.latestUtility ? item.latestUtility.current_reading : ''} ({item.latestUtility ? formatDate(item.latestUtility.created_at) : 'N/A'})
                                                        </Typography>
                                                        {/* Hidden input to store the current_reading value */}
                                                        <input type="hidden" id={`latestReading${index}`} value={item.latestUtility ? item.latestUtility.current_reading : '0.00'} />
                                                    </div>
                                                )
                                            ))}
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                InputLabelProps={{
                                                    shrink: true,
                                                  }}
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
                                                onClick={() => updateTextField(index)} 
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <Typography>No unit data available</Typography>
                    )}
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px'
                    }}
                >
                    <Button variant="outlined" onClick={createArrayOfObjects}>Create Array of Objects</Button>
                    <Button variant="outlined" onClick={clearTextFields}>Clear Textfield</Button>
                </Box>

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



