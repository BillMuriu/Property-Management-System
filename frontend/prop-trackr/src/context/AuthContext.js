import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { date } from "yup";


const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {

    let [authTokens, setAuthtokens] = useState(null)
    let [user, setUser] = useState(null)
    let [isLandlord, setIsLandlord] = useState(false)
    let [isSuperadmin, setIsSuperadmin] = useState(false)
    let [isViewer, setIsViewer] = useState(false)
    let [isEditor, setIsEditor] = useState(false)

    useEffect(() => {
        console.log(user);
        console.log(isLandlord);
    }, [user, isLandlord]); 


    let loginUser = async (e) => {
        e.preventDefault();
        try {
            let response = await fetch('http://127.0.0.1:8000/api/token/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 'username': e.target.username.value, 'password': e.target.password.value })
            });
            
            let data = await response.json();
    
            if (data) {
                setAuthtokens(data);
                setUser(jwtDecode(data.access));
                
                // Define an async function to fetch user landlord data
                const fetchUserLandlordData = async () => {
                    try {
                        // Make a GET request to fetch user landlord data
                        const res = await fetch('http://127.0.0.1:8000/user_landlord', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + String(data.access)
                            },
                        });
                        
                        if (res.status === 200) {
                            const userLandlordData = await res.json();
                            console.log(userLandlordData.id);
    
                            // Check if the request was successful
                            if (userLandlordData && (userLandlordData.id === 0 || userLandlordData.id > 0)) {
                                setIsLandlord(true); // Set as boolean true
                                console.log(isLandlord); // Log the updated value of isLandlord
                            }
                        } else {
                            throw new Error('Failed to fetch user landlord status');
                        }
                    } catch (error) {
                        // Handle any errors that occur during the request
                        console.error('Error fetching user landlord data:', error);
                        alert('Failed to fetch user landlord status');
                    }
                };
    
                // Call the async function to fetch user landlord data
                fetchUserLandlordData();
            } else {
                alert('No data received from server');
            }
        } catch (error) {
            console.error('Error fetching authentication token:', error);
            alert('Something went wrong');
        }
    };
    
    
    




    let contextData = {
        loginUser:loginUser
    }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}