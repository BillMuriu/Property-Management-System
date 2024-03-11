import { tokens } from "../theme";
import { useTheme } from "@mui/material";


const useScrollbarStyles = () => {
  const theme = useTheme(); // Call useTheme within a functional component or a custom hook
  const colors = tokens(theme.palette.mode);
  const scrollbarColor = colors.primary[400];

  return `
    /* Scrollbar Styles */
    .ps-sidebar-container.css-unpfbf::-webkit-scrollbar {
      width: 15px;
      background-color: ${scrollbarColor}; /* Use the primary color for scrollbar background */
    }

    .ps-sidebar-container.css-unpfbf::-webkit-scrollbar-thumb {
      background-color: ${scrollbarColor}; /* Use the primary color for scrollbar thumb */
    }

    .ps-sidebar-container.css-unpfbf::-webkit-scrollbar-thumb:hover {
      background-color: ${scrollbarColor}; /* Use the primary color for scrollbar thumb on hover */
    }
  `;
};

export default useScrollbarStyles;
