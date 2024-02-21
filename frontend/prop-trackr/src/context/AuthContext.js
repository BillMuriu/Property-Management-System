import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { date } from "yup";


const AuthContext = createContext()

export default AuthContext;

export const AuthProvider = ({children}) => {

    let [authTokens, setAuthtokens] = useState(null)
    let [user, setUser] = useState(null)
    let [isLandlord, setIsLandlord] = useState(false)
    let [isAdmin, setIsAdmin] = useState(false)
    let [isViewer, setIsViewer] = useState(false)
    let [isEditor, setIsEditor] = useState(false)

    useEffect(() => {
        console.log(user);
        console.log(isLandlord);
        console.log(isEditor);
        console.log(isViewer);
        console.log(isAdmin);
    }, [user, isLandlord, isEditor, isViewer, isAdmin]); 


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
                const fetchUserRole = async () => {
                    try {
                        // Make a GET request to fetch user landlord data
                        const res = await fetch('http://127.0.0.1:8000/custom-user/', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + String(data.access)
                            },
                        });
                        
                        if (res.status === 200) {
                            const userRoleData = await res.json();
                            const role = userRoleData.role;
                        
                            if (role === 'viewer') {
                                setIsViewer('viewer');
                            } else if (role === 'admin') {
                                setIsAdmin(true);
                            } else if (role === 'landlord') {
                                setIsLandlord(true);
                            } else if (role === 'editor') {
                                setIsEditor(true);
                            } else {
                                // Handle unknown role
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
                fetchUserRole();
            } else {
                alert('No data received from server');
            }
        } catch (error) {
            console.error('Error fetching authentication token:', error);
            alert('Something went wrong');
        }
    };
    
    

    let contextData = {
        loginUser:loginUser,
        user:user
    }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}