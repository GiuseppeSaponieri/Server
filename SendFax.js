const cors = require ('cors');
const twilio = require ('twilio');
const express = require ('express');

const accountsid='AC5ae5323ca8929d6601a820607f83c312'
const authtoken='8b53e5b15e2f2f747e756c0602b26d42'
const client= new twilio(accountsid,authtoken)

const app=express()


app.use(cors())
app.get('/sendfax',(req,res)=> {
    res.send('Giuseppe Saponieri FAX server with express on port 4100')
})


// twilio FAX
app.get('/send-fax', (req,res) => {
    res.send('Giuseppe Saponieri FAX server with express on port 4100')
    const {from,to,mediaUrl,statusCallback} = req.query
    console.log(req.query)
    client.fax.faxes
    .create({
       from:"+19735200461",
       to: to,
       mediaUrl: mediaUrl,
       statusCallback:statusCallback 
    })
    .then(fax => console.log(fax.sid))
    .catch(error => {
        console.error(error);
    });
    
})


app.listen(1338, () =>console.log('running on 1338'))
