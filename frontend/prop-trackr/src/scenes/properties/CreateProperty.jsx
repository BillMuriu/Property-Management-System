import { Box, Button, IconButton, Typography, useTheme, TextField} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";

import React from 'react'

const AddProperty = () => {

    const isNonMobile = useMediaQuery("(min-width:600px)");

    const handleFormSubmit = (values) => {
        console.log(values);
    };
  return (
    <div>
        <Box style={{marginLeft: "20px"}}>
            <Header title="Add a property"/>
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
                            label="Property Name *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.propertyName}
                            name="propertyName"
                            error={!!touched.propertyName && !!errors.propertyName}
                            helperText={touched.propertyName && errors.propertyName}
                        />
                        <TextField
                            fullWidth
                            variant="filled"
                            type="number"
                            label="Number of Units *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.numberOfUnits}
                            name="numberOfUnits"
                            error={!!touched.numberOfUnits && !!errors.numberOfUnits}
                            helperText={touched.numberOfUnits && errors.numberOfUnits}
                        />
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="City"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.city}
                            name="city"
                            error={!!touched.city && !!errors.city}
                            helperText={touched.city && errors.city}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Contact Number"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.contact}
                            name="contact"
                            error={!!touched.contact && !!errors.contact}
                            helperText={touched.contact && errors.contact}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Address 1"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.address1}
                            name="address1"
                            error={!!touched.address1 && !!errors.address1}
                            helperText={touched.address1 && errors.address1}
                            sx={{ gridColumn: "span 4" }}
                        />
                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Address 2"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.address2}
                            name="address2"
                            error={!!touched.address2 && !!errors.address2}
                            helperText={touched.address2 && errors.address2}
                            sx={{ gridColumn: "span 4" }}
                        />
                    </Box>
                    <Box display="flex" justifyContent="end" mt="20px" mr="75px">
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

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

// Define the validation schema using Yup
const checkoutSchema = yup.object().shape({
    propertyName: yup.string().required("Name is required"),
    numberOfUnits: yup.number().required("Number of units is required"),
    city: yup.string().required("City is required"),
    waterRate: yup.number().nullable(),
    electricityRate: yup.number().nullable(),
    rentPenaltyType: yup.string().nullable(),
    rentPenaltyAmount: yup.number().nullable(),
    rentPenaltyPercentage: yup.number().nullable(),
    taxRate: yup.number().nullable(),
    managementFee: yup.number().nullable(),
    streetName: yup.string().nullable(),
    companyName: yup.string().nullable(),
    notes: yup.string().nullable(),
});
    

// Define the initial values for the form fields
const initialValues = {
    propertyName: "",
    numberOfUnits: "",
    city: "",
    waterRate: null,
    electricityRate: null,
    rentPenaltyType: null,
    rentPenaltyAmount: null,
    rentPenaltyPercentage: null,
    taxRate: null,
    managementFee: null,
    streetName: "",
    companyName: "",
    notes: "",
};




export default AddProperty


