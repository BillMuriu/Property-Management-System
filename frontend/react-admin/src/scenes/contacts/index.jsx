import { Box } from "@mui/material";
import { 
  DataGrid, 
  GridToolbar, 
  GridToolbarExport, 
  GridToolbarContainer, 
  GridToolbarExportContainer, 
  GridCsvExportMenuItem,
  useGridApiContext,
  gridFilteredSortedRowIdsSelector,
  selectedGridRowsSelector,
} from "@mui/x-data-grid";
import MenuItem from '@mui/material/MenuItem';
import { tokens } from "../../theme";
import { mockDataContacts } from "../../data/mockData";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import jsPDF from "jspdf";
import 'jspdf-autotable'

const columns = [
  { field: "id", 
    headerName: "ID", 
    flex: 0.5 
  },
  { field: "registrarId", 
    headerName: "Registrar ID" 
  },
  {
    field: "name",
    headerName: "Name",
    flex: 1,
    cellClassName: "name-column--cell",
  },
  {
    field: "age",
    headerName: "Age",
    type: "number",
    headerAlign: "left",
    align: "left",
  },
  {
    field: "phone",
    headerName: "Phone Number",
    flex: 1,
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1,
  },
  {
    field: "address",
    headerName: "Address",
    flex: 1,
  },
  {
    field: "city",
    headerName: "City",
    flex: 1,
  },
  {
    field: "zipCode",
    headerName: "Zip Code",
    flex: 1,
  },
];

const downloadPdf = (selectedRowData) => {
  const doc = new jsPDF()
  doc.text("Details", 20, 10)

  doc.autoTable({
    columns: columns.map(col => ({ ...col, dataKey: col.field })),
    body: selectedRowData // Use selectedRowData as the body value
  })

  doc.save('table.pdf')
}

const getSelectedRowsToExport = ({ apiRef }) => {
  const selectedRowIds = selectedGridRowsSelector(apiRef);
  if (selectedRowIds.size > 0) {
    const selectedRowData = Array.from(selectedRowIds.values());
    console.log(selectedRowData)

    // Call downloadPdf and pass selectedRowData as a parameter
    downloadPdf(selectedRowData);
  }
};
const TestMenuItem = ({ onClick }) => {
  const apiRef = useGridApiContext();

  const handleClick = () => {
    if (onClick) {
      onClick({ apiRef }); // Call the onClick handler with apiRef parameter
    }
  };

  return (
    <MenuItem onClick={handleClick}>Export PDF</MenuItem>
  );
};


function CustomExportButton(props) {
  return (
    <GridToolbarExportContainer {...props}>
      <GridCsvExportMenuItem />
      <TestMenuItem onClick={getSelectedRowsToExport} />
    </GridToolbarExportContainer>
  );
}

function CustomToolbar(props) {
  return (
    <GridToolbarContainer {...props}>
      <CustomExportButton />
    </GridToolbarContainer>
  );
}



const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  

  return (
    <Box m="20px">
      <Header
        title="CONTACTS"
        subtitle="List of Contacts for Future Reference"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          checkboxSelection
          rows={mockDataContacts}
          columns={columns}
          slots={{ toolbar: CustomToolbar }}
          
        />
      </Box>
    </Box>
  );
};


export default Contacts;