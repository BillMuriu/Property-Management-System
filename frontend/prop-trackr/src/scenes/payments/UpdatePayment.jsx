import { Box, Button, IconButton, Typography, useTheme, TextField, MenuItem, Checkbox, FormControlLabel} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
// import useMediaQuery from "@mui/material/useMediaQuery";
import { tokens } from "../../theme";
import Header from "../../components/Header";

import React from 'react'

const UpdatePayment = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleFormSubmit = (values) => {
        console.log(values);
    };
  return (
    <div>
        <Box style={{marginLeft: "20px"}}>
            <Header title="Update Payment"/>
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
                            type="number"
                            label="Paid Amount *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.paid_amount}
                            name="paid_amount"
                            error={!!touched.paid_amount && !!errors.paid_amount}
                            helperText={touched.paid_amount && errors.paid_amount}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            type="date"
                            label="Payment Date *"
                            InputLabelProps={{ shrink: true }}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.payment_date}
                            name="payment_date"
                            error={!!touched.payment_date && !!errors.payment_date}
                            helperText={touched.payment_date && errors.payment_date}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Status *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.status}
                            name="status"
                            error={!!touched.status && !!errors.status}
                            helperText={touched.status && errors.status}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Payment Type"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.payment_type}
                            name="payment_type"
                            error={!!touched.payment_type && !!errors.payment_type}
                            helperText={touched.payment_type && errors.payment_type}
                        />

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            variant="filled"
                            type="text"
                            label="Description"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.description}
                            name="description"
                            error={!!touched.description && !!errors.description}
                            helperText={touched.description && errors.description}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Bank Transaction ID"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.bank_transaction_id}
                            name="bank_transaction_id"
                            error={!!touched.bank_transaction_id && !!errors.bank_transaction_id}
                            helperText={touched.bank_transaction_id && errors.bank_transaction_id}
                        />

                        <input
                            type="file"
                            onChange={(event) => {
                                setFieldValue("file_upload", event.currentTarget.files[0]);
                            }}
                            onBlur={handleBlur}
                            name="file_upload"
                            accept=".pdf"
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
    paid_amount: yup.number().required("Paid amount is required"),
    payment_date: yup.date().required("Payment date is required"),
    status: yup.string().required("Status is required"),
    payment_type: yup.string().nullable(),
    description: yup.string().nullable(),
    bank_transaction_id: yup.string().nullable(),
    file_upload: yup.mixed().nullable(), // Assuming file_upload is a file field
});

const initialValues = {
    property: "Property A",
    tenant: "John Doe",
    paid_amount: "500",
    payment_date: "2023-01-10",
    status: "draft",
    payment_type: null,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    bank_transaction_id: "1234567890",
    file_upload: null,
};





export default UpdatePayment