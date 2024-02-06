import { Box, Button, IconButton, Typography, useTheme, TextField, MenuItem, Checkbox, FormControlLabel} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
// import useMediaQuery from "@mui/material/useMediaQuery";
import { tokens } from "../../theme";
import Header from "../../components/Header";

import React from 'react'

const UpdateInvoice = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleFormSubmit = (values) => {
        console.log(values);
    };
  return (
    <div>
        <Box style={{marginLeft: "20px"}}>
            <Header title="Update invoice"/>
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
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Property *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.property}
                            name="property"
                            error={!!touched.property && !!errors.property}
                            helperText={touched.property && errors.property}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Tenant *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.tenant}
                            name="tenant"
                            error={!!touched.tenant && !!errors.tenant}
                            helperText={touched.tenant && errors.tenant}
                        />

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
                        />

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            variant="filled"
                            type="text"
                            label="Memo (optional)"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.memo}
                            name="memo"
                            error={!!touched.memo && !!errors.memo}
                            helperText={touched.memo && errors.memo}
                        />



                    </Box>
                    <Box display="flex" justifyContent="end" mt="20px" mr="75px" mb="300px">
                        <Button type="submit" color="secondary" variant="contained">
                            Create New User
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
    invoice_date: yup.date().required("Invoice date is required"),
    invoice_status: yup.string().required("Invoice status is required"),
    memo: yup.string().nullable(),
});

// Define the initial values for the form fields
const initialValues = {
    property: "Property ABC", // Initial value for property
    tenant: "John Doe",
    invoice_date: "2024-01-15",
    invoice_status: "open",
    memo: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed at velit nec ipsum vestibulum posuere.",
};



export default UpdateInvoice
