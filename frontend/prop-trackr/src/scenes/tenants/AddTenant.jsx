import { Box, Button, IconButton, Typography, useTheme, TextField, MenuItem} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
// import useMediaQuery from "@mui/material/useMediaQuery";
import { tokens } from "../../theme";
import Header from "../../components/Header";

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import React from 'react'

const AddTenant = () => {
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
                            label="First Name *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.firstName}
                            name="firstName"
                            error={!!touched.firstName && !!errors.firstName}
                            helperText={touched.firstName && errors.firstName}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Last Name *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.lastName}
                            name="lastName"
                            error={!!touched.lastName && !!errors.lastName}
                            helperText={touched.lastName && errors.lastName}
                        />

                        <TextField
                            fullWidth
                            variant="filled"
                            type="text"
                            label="Phone Number *"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.phoneNumber}
                            name="phoneNumber"
                            error={!!touched.phoneNumber && !!errors.phoneNumber}
                            helperText={touched.phoneNumber && errors.phoneNumber}
                        />

                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ArrowDownwardIcon />}
                                aria-controls="panel1-content"
                                id="panel1-header"
                                sx={{
                                    backgroundColor: colors.primary[400],
                                }}
                            >
                                <Typography>Other Items</Typography>
                            </AccordionSummary>
                            <AccordionDetails
                                sx={{
                                    maxWidth: "100%", // Corrected colon (:) instead of equals (=)
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "20px",
                                    backgroundColor: colors.primary[400],
                                }}
                            >
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Account Number"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.accountNumber}
                                    name="accountNumber"
                                    error={!!touched.accountNumber && !!errors.accountNumber}
                                    helperText={touched.accountNumber && errors.accountNumber}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="National ID"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.nationalId}
                                    name="nationalId"
                                    error={!!touched.nationalId && !!errors.nationalId}
                                    helperText={touched.nationalId && errors.nationalId}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Email"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.email}
                                    name="email"
                                    error={!!touched.email && !!errors.email}
                                    helperText={touched.email && errors.email}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="KRA Tax Pin"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.kraTaxPin}
                                    name="kraTaxPin"
                                    error={!!touched.kraTaxPin && !!errors.kraTaxPin}
                                    helperText={touched.kraTaxPin && errors.kraTaxPin}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Rent Penalty Type"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.rentPenaltyType}
                                    name="rentPenaltyType"
                                    error={!!touched.rentPenaltyType && !!errors.rentPenaltyType}
                                    helperText={touched.rentPenaltyType && errors.rentPenaltyType}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label="Rent Penalty Amount"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.rentPenaltyAmount}
                                    name="rentPenaltyAmount"
                                    error={!!touched.rentPenaltyAmount && !!errors.rentPenaltyAmount}
                                    helperText={touched.rentPenaltyAmount && errors.rentPenaltyAmount}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="number"
                                    label="Rent Penalty Percentage"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.rentPenaltyPercentage}
                                    name="rentPenaltyPercentage"
                                    error={!!touched.rentPenaltyPercentage && !!errors.rentPenaltyPercentage}
                                    helperText={touched.rentPenaltyPercentage && errors.rentPenaltyPercentage}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Notes"
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
                                    type="date"
                                    label="Move In Date"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.moveInDate}
                                    name="moveInDate"
                                    error={!!touched.moveInDate && !!errors.moveInDate}
                                    helperText={touched.moveInDate && errors.moveInDate}
                                    InputLabelProps={{ shrink: true }}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="date"
                                    label="Move Out Date"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.moveOutDate}
                                    name="moveOutDate"
                                    error={!!touched.moveOutDate && !!errors.moveOutDate}
                                    helperText={touched.moveOutDate && errors.moveOutDate}
                                    InputLabelProps={{ shrink: true }}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Other Phone Numbers"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.otherPhoneNumbers}
                                    name="otherPhoneNumbers"
                                    error={!!touched.otherPhoneNumbers && !!errors.otherPhoneNumbers}
                                    helperText={touched.otherPhoneNumbers && errors.otherPhoneNumbers}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="date"
                                    label="Lease Start Date"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.leaseStartDate}
                                    name="leaseStartDate"
                                    error={!!touched.leaseStartDate && !!errors.leaseStartDate}
                                    helperText={touched.leaseStartDate && errors.leaseStartDate}
                                    InputLabelProps={{ shrink: true }}
                                />
                                
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="date"
                                    label="Lease Expiry Date"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.leaseExpiryDate}
                                    name="leaseExpiryDate"
                                    error={!!touched.leaseExpiryDate && !!errors.leaseExpiryDate}
                                    helperText={touched.leaseExpiryDate && errors.leaseExpiryDate}
                                    InputLabelProps={{ shrink: true }}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Lease Notes"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.leaseNotes}
                                    name="leaseNotes"
                                    error={!!touched.leaseNotes && !!errors.leaseNotes}
                                    helperText={touched.leaseNotes && errors.leaseNotes}
                                />

                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="File Upload"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.fileUpload}
                                    name="fileUpload"
                                    error={!!touched.fileUpload && !!errors.fileUpload}
                                    helperText={touched.fileUpload && errors.fileUpload}
                                />

                            </AccordionDetails>
                        </Accordion>
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
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    phoneNumber: yup.string().required("Phone Number is required"),
    accountNumber: yup.string().nullable(),
    nationalId: yup.string().nullable(),
    email: yup.string().email("Invalid email format").nullable(),
    kraTaxPin: yup.string().nullable(),
    rentPenaltyType: yup.string().nullable(),
    rentPenaltyAmount: yup.number().nullable(),
    rentPenaltyPercentage: yup.number().nullable(),
    notes: yup.string().nullable(),
    moveInDate: yup.date().nullable(),
    moveOutDate: yup.date().nullable(),
    otherPhoneNumbers: yup.string().nullable(),
    leaseStartDate: yup.date().nullable(),
    leaseExpiryDate: yup.date().nullable(),
    leaseNotes: yup.string().nullable(),
    fileUpload: yup.string().nullable(), // Assuming file upload is a string field
});


// Define the initial values for the form fields
const initialValues = {
    property: "",
    unitIdOrName: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    accountNumber: null,
    nationalId: null,
    email: "",
    kraTaxPin: null,
    rentPenaltyType: null,
    rentPenaltyAmount: null,
    rentPenaltyPercentage: null,
    notes: "",
    moveInDate: null,
    moveOutDate: null,
    otherPhoneNumbers: "",
    leaseStartDate: null,
    leaseExpiryDate: null,
    leaseNotes: "",
    fileUpload: null,
};




export default AddTenant


