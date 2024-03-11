import { Box } from "@mui/material";
import BarChart from "../../components/BarChart";
import OccupiedVsUnoccupiedUnitsChart from "../../components/LineChart";
import Header from "../../components/Header";


const Bar = () => {
    return (
        <Box 
            m="20px"
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                maxWidth: '95%',
            }}
        >
            <Box 
                height="400px"
                sx={{
                    maxWidth: "400px",
                    overflow: "auto",
                }}
            >
                <BarChart/>
            </Box>
            <Box 
                height="400px"
                sx={{
                    maxWidth: "400px",
                    overflow: "auto",
                }}
            >
                <OccupiedVsUnoccupiedUnitsChart/>
            </Box>
        </Box>
    )
}

export default Bar;