import { Box, Button, IconButton, Typography, useTheme, TextField, MenuItem, Checkbox, FormControlLabel} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { tokens } from "../../theme";
import Header from "../../components/Header";

import React from 'react'

const UpdateUnit = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const rentPenaltyOptions = [
        {
          value:'rentPenaltyAmount',
          label: 'Fixed Amount',
        },
        {
          value: 'rentPenaltyPercentage',
          label: 'Rent Percentage',
        },
      ];

    const handleFormSubmit = (values) => {
        console.log(values);
    };
  return (
    <div>
        <Box style={{marginLeft: "20px"}}>
            <Header title="Update {}"/>
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
                            type="number"
                            label="Rent Amount *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.rentAmount}
                            name="rentAmount"
                            error={!!touched.rentAmount && !!errors.rentAmount}
                            helperText={touched.rentAmount && errors.rentAmount}
                        />

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={values.occupied}
                                    onChange={handleChange}
                                    name="occupied"
                                    color="primary"
                                />
                            }
                            label="Occupied *"
                            onBlur={handleBlur}
                            error={!!touched.occupied && !!errors.occupied}
                            helperText={touched.occupied && errors.occupied}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label="Tax Rate"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.taxRate}
                            name="taxRate"
                            error={!!touched.taxRate && !!errors.taxRate}
                            helperText={touched.taxRate && errors.taxRate}
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
    property: yup.string().required("Property is required"), // Assuming property is a foreign key to Property model
    unitIdOrName: yup.string().required("Unit ID or Name is required"),
    rentAmount: yup.number().required("Rent amount is required"),
    occupied: yup.boolean().required("Occupied status is required"),
    taxRate: yup.number().nullable().typeError("Tax rate must be a number"), // Assuming taxRate is a decimal field
    notes: yup.string().nullable(),
});

const initialValues = {
    property: "Property A", // Initial value for property
    unitIdOrName: "Unit 1",
    rentAmount: 1200.50,
    occupied: false, // Assuming occupied is a boolean field
    taxRate: 7.5,
    notes: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
};





export default UpdateUnit