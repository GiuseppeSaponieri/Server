const cors = require ('cors');
const twilio = require ('twilio');
const express = require ('express');

const accountsid='AC5ae5323ca8929d6601a820607f83c312'
const authtoken='8b53e5b15e2f2f747e756c0602b26d42'
const client= new twilio(accountsid,authtoken)

const app=express()




// twilio text
app.get('/send-text', (req,res) => {
    const { recipient, textmessage} = req.query
    client.messages.create({
    body: textmessage,
    to: recipient,
    from: '+19735200461'
    }) 
})


app.listen(4000, () =>console.log('running on 4000'))

