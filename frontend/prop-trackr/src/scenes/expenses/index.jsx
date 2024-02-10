import { Box, Button, IconButton, Typography, useTheme, Card, CardContent, TextField, MenuItem, useMediaQuery } from "@mui/material";
import Header from "../../components/Header";
import { ExpenseData } from "../../mock-data/expensedata/expensedata";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import TuneIcon from '@mui/icons-material/Tune';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';


import { Formik } from "formik";
import * as yup from "yup";

import React from 'react'

const Expenses = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const handleFormSubmit = (values) => {
      console.log(values);
  };


  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'property', headerName: 'Property', width: 200 },
    { field: 'unit', headerName: 'Unit', width: 200 },
    { field: 'amount', headerName: 'Amount', width: 150 },
    { field: 'payment_method', headerName: 'Payment Method', width: 150 },
    { field: 'expense_category', headerName: 'Expense Category', width: 200 },
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
              maxWidth: "92%",
            }}
        >
            <Header title="Expenses" subtitle="Welcome to the Expenses page" />
            <Card
                sx={{
                    backgroundColor: colors.blueAccent[900],
                    maxWidth: "95%",
                    padding: 2,
                }}
                >
                <CardContent>
                    <Typography variant="h5" component="div" gutterBottom>
                        Total Expenses: {ExpenseData.length}
                    </Typography>
                    <Typography variant="body1" component="div">
                        Total Vacancies: 1
                    </Typography>
                </CardContent>
            </Card>


            <Accordion 
              defaultExpanded
              sx={{
                maxWidth: "95%",
                marginTop: "10px",
              }}
            >
              <AccordionSummary
                expandIcon={<TuneIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography>Filters</Typography>
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
                              // variant="filled"
                            >
                              {properties.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </TextField>

                          <FormControlLabel
                            fullWidth 
                            control={<Checkbox defaultChecked />} 
                            label="Show vacant Expenses" 
                          />
                        </Box>
                      </form>
                      )}
                  </Formik>
              </AccordionDetails>
            </Accordion>


            <Box
                m="40px 0 0 0"
                height="75vh"
                overflow-x='hidden'
            >
                <DataGrid
                    sx={{
                        maxWidth: '95%',
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
                    rows={ExpenseData} 
                    columns={columns} 
                />
            </Box>
        </Box>
  )
}

// Define the validation schema using Yup
const checkoutSchema = yup.object().shape({
  companyName: yup.string().nullable(),
  notes: yup.string().nullable(),
});
  

// Define the initial values for the form fields
const initialValues = {
  propertyName: "",
  numberOfExpenses: "",
};

export default Expenses