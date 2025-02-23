import React , { useEffect, useState }from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { useDispatch } from 'react-redux';
import { useGetloggeduserQuery } from '../Serve/userAuthapi';
import { getToken } from '../Serve/LocalStorageService';
import { useUserPreferenceMutation } from '../Serve/userAuthapi';
export default function UserPreference() {
  const { access_token } = getToken();
  const { data, isSuccess } = useGetloggeduserQuery(access_token);

  const [usersData, setUsersData] = useState({
    email: "",
    name: "",
  });
    const currencies = [
        {
          value: 'Budget_Friendly',
          label: 'Budget_Friendly',
        },
        {
          value: 'Luxury',
          label: 'Luxury',
        },
        {
          value: 'Mid-range',
          label: 'Mid-range',
        },
     
      ];
      useEffect(() => {
        if (data && isSuccess) {
          setUsersData({
            email: data.email,
            name: data.name,
          });
          console.log("dash data:", data);
        }
      }, [data, isSuccess]);
      console.log("the user email is",usersData.email )
      const [userPreferences, { isLoading }] = useUserPreferenceMutation();
      const handleSubmit = async (e) => {
        e.preventDefault();
        const data1 = new FormData(e.currentTarget);
        const actualData = {
          email: usersData.email,
          preferred_destination_types: data1.get('preferred_destination_types'),
          preferred_activities: data1.get('preferred_activities'),
          preferred_budget_range: data1.get('preferred_budget_range'),
        }
        console.log(actualData)
        const res = await userPreferences(actualData)
      }
  return (
    <>
    <h1>Fill form if you want recommendations</h1>
    <div className="card" style={{width: '18rem'}}>
      
              <div className="card-body">
                
                <Box
    component="form"
    sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' } }}
    noValidate
    autoComplete="off"
    onSubmit={handleSubmit}
  >
   Choose Destinations: <TextField id="preferred_destination_types" name='preferred_destination_types' label="Outlined" variant="outlined" /> <br/>
   Prefered Activities:<TextField id="preferred_activities" name='preferred_activities' label="Outlined" variant="outlined" />
    <div>
    
    Budget Range: <TextField
        id="preferred_budget_range"
        name='preferred_budget_range'
        select
        label="Select"
        defaultValue="Luxury"
        helperText="Please select your currency"
      >
        {currencies.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    </div>
    {isLoading ? <CircularProgress /> : <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Submit</Button>}
 
  </Box>
              </div>
            </div>
   
  </>
  )
}
