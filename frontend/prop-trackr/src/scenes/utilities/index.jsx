import { Box, Button, IconButton, Typography, useTheme, Card, CardContent, TextField, MenuItem, useMediaQuery, CircularProgress } from "@mui/material";
import Header from "../../components/Header";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Backdrop from '@mui/material/Backdrop';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import MuiAccordion from '@mui/material/Accordion';
import { styled } from '@mui/material/styles';

import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TuneIcon from '@mui/icons-material/Tune';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Divider from '@mui/material/Divider';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { Link } from 'react-router-dom';

import { BASE_URL } from "../../config";
import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

import { Formik } from "formik";
import * as yup from "yup";
import React from 'react'

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const Utilities = () => {

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const [openBackdrop, setOpenBackdrop] = useState(true);
  const [utilityData, setUtilityData] = useState([]);
  const [bulkInvoices, setBulkInvoices] = useState([]);

  const [loading, setLoading] = useState({});

  const handleClose = () => {
      setOpenBackdrop(false);
  };

  const navigate = useNavigate();

  const handleGoBack = () => {
      navigate(-1);
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





    const fetchUtilityData = async () => {
      try {
          // Make a GET request to fetch user landlord data
          const res = await fetch(`${BASE_URL}/property/utilities/`, {
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

          const fetchedUtilityData = await res.json();

          // Check for specific error cases in the response data
          if (!Array.isArray(fetchedUtilityData)) {
              throw new Error('Received invalid data from server');
          }

          console.log(fetchedUtilityData);
          setUtilityData(fetchedUtilityData); // Set property data in state

      } catch (error) {
          // Handle any errors that occur during the request
          console.error('Error fetching user property data:', error);
          alert('Failed to fetch user property status');
      } finally {
          setOpenBackdrop(false); // Close the backdrop regardless of success or failure
      }
  };


  useEffect(() => {
    fetchUtilityData(); // Call the fetch function when the component mounts

  }, []);





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






const createSingleInvoice = async (utilityId) => {
  try {
      if (!bulkInvoices || bulkInvoices.length === 0) {
          throw new Error('Array of objects is empty or does not exist');
      }

      // Find the corresponding utility data based on the utilityId
      const selectedUtility = bulkInvoices.find(item => item.utility === utilityId);

      if (!selectedUtility) {
          throw new Error(`Utility with id ${utilityId} not found`);
      }

      console.log('Data to be sent to API:', selectedUtility);

      const res = await fetch(`${BASE_URL}/financials/invoices/`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedUtility), // Send the selected utility's data as the body data
      });

      if (!res.ok) {
          // Handle HTTP errors
          throw new Error('Failed to create invoice: ' + res.status);
      }

      // If request is successful, show success message
      showSuccessMessage();
      fetchUtilityData(); 

      // Parse response data
      const data = await res.json();
      console.log(data);

  } catch (error) {
      console.error('Error creating invoice:', error.message);
      // If error occurs, show failure message
      showFailureMessage();
  }
};







  const handleFormSubmit = (values) => {
      console.log(values);
  };


  const columns = [
    { field: 'created_at', headerName: 'Date', width: 100 },
    { field: 'property_name', headerName: 'Property', width: 100},
    { field: 'unit_id_or_name', headerName: 'Unit ID/Name', width: 100},


    {
        field: 'invoice',
        headerName: 'Invoice',
        width: 200,
        renderCell: (params) => {
            const invoiceData = params.value;
            const utilityData = params.row;

            const handleCreateInvoice = async (event) => {
              event.stopPropagation();
              const utilityId = utilityData.id;
              setLoading(prevLoading => ({ ...prevLoading, [utilityId]: true }));
              await createSingleInvoice(utilityId);
              setLoading(prevLoading => ({ ...prevLoading, [utilityId]: false }));
            };


            if (invoiceData) {
                // If invoice exists, display invoice details
                return (
                    <Link to={`/view-invoice/${invoiceData.id}`}>
                        {invoiceData.id}
                    </Link>
                );
            } else {
                return (


                  <Button 
                    variant="filled"
                    disabled={loading[utilityData.id]}
                    sx={{
                      width: '60%',
                      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
                    }}
                    onClick={handleCreateInvoice}
                  >
                    {loading[utilityData.id] ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <Typography sx={{ fontSize: '12px' }}>
                        Create an invoice
                      </Typography>
                    )}
                  </Button>


                );
            }
        },
    },



    { field: 'utility_item', headerName: 'Utility Item', width: 100 },
    { field: 'current_reading', headerName: 'Current Reading', width: 100 },
    { field: 'previous_reading', headerName: 'Previous Reading', width: 100 },
];



  const properties = [
    {
      value: 'property1',
      label: 'Property 1',
    },
    {
      value: 'property2',
      label: 'Property 2',
    },
    {
      value: 'property3',
      label: 'Property 3',
    },
    {
      value: 'property4',
      label: 'Property 4',
    },
    {
      value: 'property5',
      label: 'Property 5',
    },
  ];

  return (
    <Box
        sx={{
          marginLeft: "20px",
        }}
    >
            <Header title="Utilities"/>


            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "10px",
                    width: "95%",
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
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { sx: 'flex-start', sm: 'flex-end'}
                  }}
                >
                    <Link to="/add-maintenance" style={{ textDecoration: 'none' }}>
                        <Button 
                            variant="contained" 
                            startIcon={<AddIcon />}
                        >
                            <Typography>
                                Add a Maintenance Issue
                            </Typography>
                        </Button>
                    </Link>
                </Box>
            </Box>

            <Accordion variant="outlined" sx={{ width: '95%'}}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                  Total Maintenance issues
                </AccordionSummary>
                <AccordionDetails
                  sx={{

                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row'},
                    gap: '20px'

                  }}
                >
                    <Card
                        sx={{
                            width: { xs: '95%', sm: '200px' },
                            padding: 2,
                        }}
                        variant="outlined"
                    >
                        <CardContent
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography variant="h5" component="div" gutterBottom>
                                Total Properties
                            </Typography>
                            <Divider sx={{ width: '10%', backgroundColor: colors.grey[800], marginBottom: '10px', marginTop: '10px' }} />
                            <Typography variant="h3" component="div" style={{ fontWeight: 'bold' }}>
                                {utilityData.length}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card
                        sx={{
                            width: { xs: '95%', sm: '200px' },
                            padding: 2,
                        }}
                        variant="outlined"
                    >
                        <CardContent
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography variant="h5" component="div" gutterBottom>
                                Total Properties
                            </Typography>
                            <Divider sx={{ width: '10%', backgroundColor: colors.grey[800], marginBottom: '10px', marginTop: '10px' }} />
                            <Typography variant="h3" component="div" style={{ fontWeight: 'bold' }}>
                                {utilityData.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </AccordionDetails>
            </Accordion>


            
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={openBackdrop}
                onClick={handleClose}
            ></Backdrop>



            <Accordion
              sx={{
                maxWidth: "95%",
                marginTop: "10px",
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px"
                  }}
                >
                  <TuneIcon /> 
                  <Typography>Filters</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
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
                      <form 
                        onSubmit={handleSubmit}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '20px',
                            alignItems: 'flex-start',
                          }}
                        >
                          <TextField
                              sx={{
                                width: isSmallScreen ? '100%' : '50%',
                              }}
                              select
                              label="Select a Property"
                              defaultValue="EUR"
                              variant="filled"
                            >
                              {properties.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </TextField>

                          <Box>
                            <Typography>Status</Typography>
                            <FormControlLabel
                              fullWidth 
                              control={<Checkbox defaultChecked />} 
                              label="Open" 
                            />
                            <FormControlLabel
                              fullWidth 
                              control={<Checkbox defaultChecked />} 
                              label="In progress"  
                            />
                            <FormControlLabel
                              fullWidth 
                              control={<Checkbox defaultChecked />} 
                              label="Closed" 
                            />
                          </Box>
                        </Box>
                      </form>
                      )}
                  </Formik>
              </AccordionDetails>
            </Accordion>

            <Divider
              sx={{
                  marginTop: '20px',
                  width: '95%',
              }} 
            />



            <Box
                m="20px 0 0 0"
                height="75vh"
                overflow-x='hidden'
                sx={{
                  maxWidth: '100%',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        width:'95%',
                    }}
                  >
                    <IconButton aria-label="delete" size="large">
                        <DeleteIcon sx={{ fontSize: '28px' }} />
                    </IconButton>
                </Box>


                <DataGrid
                    sx={{
                        width: '95%',
                        '& .MuiDataGrid-virtualScroller::-webkit-scrollbar': {
                            width: '10px',
                        },
                        '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-track': {
                            background: colors.grey[700],
                        },
                        '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb': {
                            backgroundColor: colors.primary[600],
                            borderRadius: '5px',
                        },
                        '& .MuiDataGrid-virtualScroller::-webkit-scrollbar-thumb:hover': {
                        background: '#555',
                        },
                    }}
                    checkboxSelection 
                    rows={utilityData} 
                    columns={columns} 
                />
            </Box>
        </Box>
  )
}

const checkoutSchema = yup.object().shape({
  companyName: yup.string().nullable(),
  notes: yup.string().nullable(),
});
  

// Define the initial values for the form fields
const initialValues = {
  propertyName: "",
  numberOfUnits: "",
};
export default Utilities