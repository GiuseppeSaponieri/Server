const cors = require ('cors');
const adodb = require ('node-adodb');
const express = require ('express');

const app=express()

app.use(cors())

// twilio text
app.get('/patientsearch', (req,res) => {
    res.send('Giuseppe Saponieri adodb server on port 1101')
    const patientPhone=req.query.patientPhone
    adodb.debug = true;
    const connection = adodb.open('Driver={Microsoft Access Driver (*.mdb)};Dbq=C:\\medicaloffice\\server1\\MOM\\KHC\\INDEX.mdb;Pwd=cmxkhc');
    connection
    .query("SELECT LNAME,FNAME,DOB,PHONECELL FROM (INDEX_PATIENTS) WHERE PHONECELL='"+req.query.patientPhone+"'")
    .then(data => {
      console.log(JSON.stringify(data, null, 2));
        console.log(data)
    })
    .catch(error => {
      console.error(error);
    });
});  


function  twilionr(x){
    return x.replace("-","").replace("(","").replace(")","").replace(" ","");
}
app.listen(1101, () =>console.log('running on 1101'))

