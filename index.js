const express = require('express'); //web frame work
const axios = require('axios'); //http lb 
const serverless = require('serverless-http');
const app = express(); //invoke express
const PORT = 4000; //define port no.
app.use(express.json());

app.use(express.json()); //parsing the req
const username = 'DF_API'; 
const password = 'S#)z&[B;3*g)*pe1D(ZRj!5[1Dj<fyXs3>bC}#4%q;-)oZ{j<r2tmolp+5n@*3:PYQ8s?},.DRRELT!Mv<OLS?-8ec{F}=A{Te:]';
const basicAuth = Buffer.from(`${username}:${password}`).toString('base64');//buffer.from(special type of object use to handle raw binary data),
//  `string literal(initialise string with dynamic value)
// base64 format of file most efficient in encoding

app.post('/webhook', async (req, res) => { // webhook is a API, it is triggered by servicenow when a customer is trying to create a ticket
  console.log('Webhook received:', req.body);
  try { //to handle error, null check error, request undefined
      const response = await axios.post(`https://dev221314.service-now.com/api/now/table/incident?sysparm_limit=1`, req.body, {
        headers: {
            Authorization: `Basic ${basicAuth}`
        }
      });
      const result = {
        incidentNumber: response.data?.result.number, // traversing, lookup- access value in object, ? optional chainig for null checks
        success: true
      }
      if (!response?.data?.result?.number) {
        throw 'not found'
      }
      res.send(result)
  } catch (error) {
    console.error(error.message);
    res.status(400).send({success: false})
  }

});

app.listen(PORT, () => { //allow our application to run on a specific port
  console.log(`Server is running on port ${PORT}`);
});