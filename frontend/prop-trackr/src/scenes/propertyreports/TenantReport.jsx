import { 
    Box, 
    Button, 
    IconButton, 
    Typography, 
    useTheme,
    TextField, 
    MenuItem,
  } from "@mui/material";
  
  import { Formik } from "formik";
  import * as yup from "yup";
  
  import { BASE_URL } from "../../config";
  
  import Header from "../../components/Header";
  import { styled } from '@mui/material/styles';
  import Table from '@mui/material/Table';
  import TableBody from '@mui/material/TableBody';
  import TableCell, { tableCellClasses } from '@mui/material/TableCell';
  import TableContainer from '@mui/material/TableContainer';
  import TableHead from '@mui/material/TableHead';
  import TableRow from '@mui/material/TableRow';
  import Paper from '@mui/material/Paper';
  
  import Accordion from '@mui/material/Accordion';
  import AccordionSummary from '@mui/material/AccordionSummary';
  import AccordionDetails from '@mui/material/AccordionDetails';
  import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
  
  import { tokens } from "../../theme";
  
  import { useState, useEffect } from "react";
  
  import React from 'react'
  
  
  
  const TenantReports = () => {
    const handleDownloadPDF = () => {
      window.open('http://127.0.0.1:8000/property/property-statements/pdf/?start_date=2024-02-17&end_date=2024-2-19', '_blank');
    };
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [propertyData, setPropertyData] = useState('');
    const [tenantData, setTenantData] = useState('');

    const [tenantStatementData, setTenantStatementData] = useState(null);
  
    const StyledTableCell = styled(TableCell)(({ theme }) => ({
      [`&.${tableCellClasses.head}`]: {
        backgroundColor: colors.primary[700],
        color: theme.palette.common.white,
      },
      [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
      },
    }));
    
    const StyledTableRow = styled(TableRow)(({ theme }) => ({
      '&:nth-of-type(odd)': {
        backgroundColor: colors.grey[900],
      },
      // hide last border
      '&:last-child td, &:last-child th': {
        border: 0,
      },
    }));
  
  
    
  
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
  
  
  
  
  
  
  const handleFormSubmit = async (values) => {
    try {
        // Log the values of the start and end dates
        console.log('Start Date:', values.startDate);
        console.log('End Date:', values.endDate);
  
        // Construct the dynamic query parameters string
        const queryParams = new URLSearchParams({
            // start_date: values.startDate,
            // end_date: values.endDate,
            tenant: values.tenant,
        }).toString();
  
        // Construct the complete URL with dynamic query parameters
        const url = `${BASE_URL}/financials/tenant-statements/?${queryParams}`;
  
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
  
        if (!res.ok) {
            // Handle HTTP errors
            throw new Error('Failed to fetch property statements: ' + res.status);
        }
  
        // Parse the response data if needed
        const data = await res.json();
  
        // Update the tenantStatementData state with the fetched data
        setTenantStatementData(data);
        console.log('Property statements:', data);
    } catch (error) {
        console.error('Error fetching property statements:', error.message);
    }
  };
  
  
    return (
      <div
        style={{
          height: '100%',
        }}
      >
        <Box style={{marginLeft: "20px"}}>
          <Header title="Tenant Report" />
        </Box>
  
        <Box 
          style={{
              marginLeft: "20px",
              height: "100%",
          }}
        >
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
                          maxWidth="95%"
                          display="flex"
                          flexDirection="column"
                          gap="20px"
                      >
                          <Box
                            sx={{
                                display: { xs: 'block', sm: 'flex' },
                                gap: '20px',
                                '& > *:not(:last-child)': {
                                  marginBottom: { xs: '20px', sm: 0 },
                                },
                              }}
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
                          </Box>
  
  
                          <Box
                            sx={{
                              display: { xs: 'block', sm: 'flex' },
                              gap: '20px',
                              '& > *:not(:last-child)': {
                                marginBottom: { xs: '20px', sm: 0 },
                              },
                            }}
                          >
                            <TextField
                                fullWidth
                                variant="filled"
                                type="date"
                                label="Start Date"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.startDate}
                                name="startDate"
                                error={!!touched.startDate && !!errors.startDate}
                                helperText={touched.startDate && errors.startDate}
                                InputLabelProps={{ shrink: true }}
                            />
  
                            <TextField
                                fullWidth
                                variant="filled"
                                type="date"
                                label="End Date *"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.endDate}
                                name="endDate"
                                error={!!touched.endDate && !!errors.endDate}
                                helperText={touched.endDate && errors.endDate}
                                InputLabelProps={{ shrink: true }}
                            />
                          </Box>
                      </Box>
                      <Box
                        sx={{
                          width: '95%',
                          display: 'flex',
                          justifyContent: 'flex-end',
                          marginTop: '20px',
                        }}
                      >
                          <Button type="submit" color="secondary" variant="contained">
                              Submit
                          </Button>
                      </Box>
                  </form>
                  )}
              </Formik>
  
              
              {tenantStatementData && (
              <Box
                sx={{
                  marginBottom: '30px',
                  maxWidth: '95%',
                  overflowX: 'auto',
                }}
              >
              
              <Button 
                variant="contained" 
                onClick={handleDownloadPDF}
                sx={{
                  marginBottom: '10px',
                }}
              >
                Download PDF
              </Button>

                <Box
                    sx={{
                        width: '100%',
                        marginBottom: '10px',
                        display: { xs: 'block', sm: 'flex' },
                        gap: '30px',
                        '& > *:not(:last-child)': {
                            marginBottom: { xs: '20px', sm: 0 },
                        },
                    }}
                    >
                    {/* <Box
                        sx={{
                        width: '100%',
                        }}
                    >
                        <h3>Summary</h3>
                        <TableContainer component={Paper}>
                        <Table aria-label="summary table">
                            <TableBody>
                            <StyledTableRow>
                                <StyledTableCell>Total Amount Paid</StyledTableCell>
                                <StyledTableCell align="right">${propertyStatementData && propertyStatementData.total_amount_paid}</StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell>Total Expenses Amount</StyledTableCell>
                                <StyledTableCell align="right">${propertyStatementData && propertyStatementData.total_expenses_amount}</StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell>Earning Before Tax</StyledTableCell>
                                <StyledTableCell align="right">${propertyStatementData && propertyStatementData.earning_before_tax}</StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell>Tax Amount</StyledTableCell>
                                <StyledTableCell align="right">${propertyStatementData && propertyStatementData.tax_amount}</StyledTableCell>
                            </StyledTableRow>
                            <StyledTableRow>
                                <StyledTableCell>Net Income</StyledTableCell>
                                <StyledTableCell align="right">${propertyStatementData && propertyStatementData.net_income}</StyledTableCell>
                            </StyledTableRow>
                            </TableBody>
                        </Table>
                        </TableContainer>
                    </Box> */}
                </Box>
  
                <Box
                  sx={{
                    marginBottom: '30px',
                  }}
                >
                  <h3>Detailed Tenant Data</h3>
                  <TableContainer component={Paper}>
                    <Table
                        aria-label="customized table"
                        stickyHeader
                        sx={{
                        width: '100%',
                        }}
                    >
                        <TableHead>
                        <TableRow>
                            <StyledTableCell>Tenant ID</StyledTableCell>
                            <StyledTableCell align="right">Transaction Date</StyledTableCell>
                            <StyledTableCell align="right">Item</StyledTableCell>
                            <StyledTableCell align="right">Money Due</StyledTableCell>
                            <StyledTableCell align="right">Money Paid</StyledTableCell>
                            <StyledTableCell align="right">Running Balance</StyledTableCell>
                            <StyledTableCell align="right">Description</StyledTableCell>
                        </TableRow>
                        </TableHead>

                        <TableBody>
                        {tenantStatementData && tenantStatementData.map((tenant, index) => (
                            <StyledTableRow key={index}>
                            <StyledTableCell component="th" scope="row">
                                {tenant.id}
                            </StyledTableCell>
                            <StyledTableCell align="right">{tenant.transaction_date}</StyledTableCell>
                            <StyledTableCell align="right">{tenant.item}</StyledTableCell>
                            <StyledTableCell align="right">{tenant.money_due}</StyledTableCell>
                            <StyledTableCell align="right">{tenant.money_paid}</StyledTableCell>
                            <StyledTableCell align="right">{tenant.running_balance}</StyledTableCell>
                            <StyledTableCell align="right">{tenant.description}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </TableContainer>

                </Box>
              </Box>)}
  
  
          </Box>
      </div>
    )
  }
  
  // Define the validation schema using Yup
  const checkoutSchema = yup.object().shape({
    tenant: yup.string().required("Property is required"),
    startDate: yup.date().nullable(),
    endDate: yup.date().nullable(),
  });
  
  // Define the initial values for the form fields
  const initialValues = {
    tenant: "",
    startDate: "",
    endDateDate: "",
  };
  
  
  export default TenantReports