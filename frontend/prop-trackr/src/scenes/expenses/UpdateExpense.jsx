import { Box, Button, IconButton, Typography, useTheme, TextField, MenuItem, Checkbox, FormControlLabel} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
// import useMediaQuery from "@mui/material/useMediaQuery";
import { tokens } from "../../theme";
import Header from "../../components/Header";

import React from 'react'

const UpdateExpense = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleFormSubmit = (values) => {
        console.log(values);
    };
  return (
    <div>
        <Box style={{marginLeft: "20px"}}>
            <Header title="Add an expense"/>
            <Formik
                onSubmit={handleFormSubmit}
                initialValues={initialValues}
                validationSchema={expenseSchema}
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
                            label="Unit ID or Name *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.unitIdOrName}
                            name="unitIdOrName"
                            error={!!touched.unitIdOrName && !!errors.unitIdOrName}
                            helperText={touched.unitIdOrName && errors.unitIdOrName}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label="Amount *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.amount}
                            name="amount"
                            error={!!touched.amount && !!errors.amount}
                            helperText={touched.amount && errors.amount}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Payment Method *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.paymentMethod}
                            name="paymentMethod"
                            error={!!touched.paymentMethod && !!errors.paymentMethod}
                            helperText={touched.paymentMethod && errors.paymentMethod}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Expense Category *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.expenseCategory}
                            name="expenseCategory"
                            error={!!touched.expenseCategory && !!errors.expenseCategory}
                            helperText={touched.expenseCategory && errors.expenseCategory}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            type="date"
                            label="Expense Date *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.expenseDate}
                            name="expenseDate"
                            error={!!touched.expenseDate && !!errors.expenseDate}
                            helperText={touched.expenseDate && errors.expenseDate}
                            InputLabelProps={{ shrink: true }}
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

                        <TextField
                            fullWidth
                            variant="filled"
                            type="file"
                            label="File Upload"
                            onChange={(event) => {
                                setFieldValue("fileUpload", event.currentTarget.files[0]);
                            }}
                            name="fileUpload"
                            error={!!touched.fileUpload && !!errors.fileUpload}
                            helperText={touched.fileUpload && errors.fileUpload}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{ inputProps: { accept: 'image/*' } }} // Specify file types here
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
const expenseSchema = yup.object().shape({
    property: yup.string().required("Property is required"),
    unitIdOrName: yup.string().required("Unit ID or Name is required"),
    amount: yup.number().required("Amount is required"),
    paymentMethod: yup.string().required("Payment Method is required"),
    expenseCategory: yup.string().required("Expense Category is required"),
    expenseDate: yup.date().required("Expense Date is required"),
    notes: yup.string().nullable(),
    fileUpload: yup.mixed().nullable(), // Assuming fileUpload is optional
});

// Define the initial values for the form fields
const initialValues = {
    property: "Property ABC",
    unitIdOrName: "Unit 101",
    amount: 500.00,
    paymentMethod: "Credit Card",
    expenseCategory: "Maintenance",
    expenseDate: "2024-01-25", // Should be in ISO date format (YYYY-MM-DD)
    notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    fileUpload: null,
};





export default UpdateExpense
