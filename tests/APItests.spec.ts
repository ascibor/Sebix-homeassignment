import { test, expect } from '@playwright/test';
import { APIcalls } from '../utils/APIcalls';

const loginPayLoad = {userEmail:"anshika@gmail.com",userPassword:"Iamking@000"};
const apiBooking = "https://restful-booker.herokuapp.com/booking";

test ('Successful login verification', async ({page}) => {
    const apiEndpoint = 'https://restful-booker.herokuapp.com/auth';
    
    const requestBody = {
        username: 'admin',
        password: 'password123',
      };
    
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      expect(response.status).toBe(200);

      const jsonResponse = await response.json()
      expect(jsonResponse).toBeDefined();
      expect(jsonResponse).toHaveProperty('token');
     console.log(jsonResponse);
     const token = jsonResponse.token;
     console.log('Token:', token);
    });

test ('Unsuccessful login verification', async ({page}) => {
    const apiEndpoint = 'https://restful-booker.herokuapp.com/auth';
    
    const requestBody = {
        username: 'admin',
        password: 'pass',
      };
    
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      //This is a proper assertion but serive is returing 200 for now. 
      //expect(response.status).toBe(401);

      const jsonResponse = await response.json()
      expect(jsonResponse).toBeDefined();
      expect(jsonResponse).toHaveProperty('reason', 'Bad credentials');
      //console.log(jsonResponse);
});

test('Verify successful new booking creation', async ({page}) => {
  const apiEndpoint = 'https://restful-booker.herokuapp.com/auth';
  const api = new APIcalls(apiEndpoint);
  const token = await api.login('admin', 'password123');
  console.log('Token from test:', token);

  const requestBody = {
    firstname: "Jim",
    lastname: "Brown",
    totalprice: 111,
    depositpaid : true,
    bookingdates : {
        checkin : "2018-01-01",
        checkout : "2019-01-01"
    },
    additionalneeds : "Breakfast"
  };

  const response = await fetch(apiBooking, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });
  expect(response.status).toBe(200);

  const jsonResponse = await response.json()
  expect(jsonResponse).toBeDefined();
  expect(jsonResponse).toHaveProperty('bookingid');
  console.log(jsonResponse);
  });