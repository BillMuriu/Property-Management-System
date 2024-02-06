import { Box, Button, IconButton, Typography, useTheme, TextField, MenuItem, Checkbox, FormControlLabel} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
// import useMediaQuery from "@mui/material/useMediaQuery";
import { tokens } from "../../theme";
import Header from "../../components/Header";

import React from 'react'

const UpdateIssue = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);


    const handleFormSubmit = (values) => {
        console.log(values);
    };
  return (
    <div>
        <Box style={{marginLeft: "20px"}}>
            <Header title="Add a maintenance issue"/>
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
                            label="Category *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.category}
                            name="category"
                            error={!!touched.category && !!errors.category}
                            helperText={touched.category && errors.category}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label="Expense Amount"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.expenseAmount}
                            name="expenseAmount"
                            error={!!touched.expenseAmount && !!errors.expenseAmount}
                            helperText={touched.expenseAmount && errors.expenseAmount}
                        />

                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            variant="filled"
                            type="text"
                            label="Short Description (optional)"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.shortDescription}
                            name="shortDescription"
                            error={!!touched.shortDescription && !!errors.shortDescription}
                            helperText={touched.shortDescription && errors.shortDescription}
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
    unitIdOrName: yup.string().required("Unit ID or Name is required"),
    status: yup.string().required("Status is required"),
    category: yup.string().required("Category is required"),
    shortDescription: yup.string().nullable(),
    expenseAmount: yup.number().nullable().typeError("Expense amount must be a number"),
});

const initialValues = {
    property: "Property 1",
    unitIdOrName: "Unit 101",
    status: "Completed",
    category: "Plumbing",
    shortDescription: "Fix leaky faucet in bathroom",
    expenseAmount: 50.0,
};




export default UpdateIssue
