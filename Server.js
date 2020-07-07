const http=require('http');
const express=require('express');





const MessagingResponse=require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const adodb = require ('node-adodb');
const adodbINDEX = require ('node-adodb');
const adodbSUPERINDEX = require ('node-adodb');
const adodbTST = require ('node-adodb');
const cors = require ('cors');
//per voice
const morgan = require('morgan');
// fine per voice

const JSON=require('JSON');

const twilio = require ('twilio');
const VoiceResponse = twilio.twiml.VoiceResponse;


const accountsid='AC5ae5323ca8929d6601a820607f83c312'
const authtoken='8b53e5b15e2f2f747e756c0602b26d42'
const client= new twilio(accountsid,authtoken)


const path = require ('path');
const urlUtil  = require ('url');
const fs  = require ('fs');
const fetch  = require ('node-fetch');
const extName = require('ext-name');
//const config =require('../config')

const docServerPath ='C:\\webservices\\doc-servers'
const dbServerPath ='K:'
const dbIndexPath ='K:\\MOM\\TESTPRACTICE'
const dbLocationPath ='K:\\MOM\\TESTPRACTICE\\TESTLOC'

const SMS_IN_DIR = docServerPath+'\\public\\SMS\\IN'
const { NODE_ENV } = process.env


const https = require('https');

//var options = {
//  key: fs.readFileSync('c:\\keys\\bt.key'),
//  cert: fs.readFileSync('c:\\keys\\bt.csr'),
//  ca: fs.readFileSync('c:\\keys\\btcert.pem')
//};





const BODYTRACE_IN_DIR = docServerPath+'\\public\\BODYTRACE\\IN'

const CN_Index='Driver={Microsoft Access Driver (*.mdb)};Dbq='+dbIndexPath+'\\INDEX.mdb;Pwd=cmxkhc';
const CN_SuperIndex='Driver={Microsoft Access Driver (*.mdb)};Dbq='+dbServerPath+'\\SUPERINDEX.mdb;Pwd=cmxkhc';
const CN_TST='Driver={Microsoft Access Driver (*.mdb)};Dbq='+dbLocationPath+'\\TST.mdb';

///////////////// sql server impostazioni

/*var MSSql_Superindex = require("mssql");
// config for Superindex
var SuperindexConfig = {
    //user: 'Owner',
    //password: '',
    server: 'DESKTOP-5TH3U76\SQLEXP2017', 
    database: 'Superindex' 
};
// connect to Superindex
MSSql_Superindex.connect(SuperindexConfig, function (err) {
    if (err) console.log(err);
    // create Request object
    var request = new MSSql_Superindex.Request();
        
    // query to the database and get the records
    request.query('select * from Users', function (err, recordset) {
        
        if (err) console.log(err)

        // send records as a response
        //res.send(recordset);
    });
});


var MSSql_Index = require("mssql");
// config for Superindex
var IndexConfig = {
    //user: 'Owner',
    //password: '',
    server: 'DESKTOP-5TH3U76\SQLEXP2017', 
    database: 'TESTPRACTICE_Index' 
};
// connect to Superindex
MSSql_Superindex.connect(SuperindexConfig, function (err) {
    if (err) console.log(err);
    // create Request object
    var request = new MSSql_Index.Request();
        
    // query to the database and get the records
    request.query('select * from INDEX_LOCATIONS', function (err, recordset) {
        
        if (err) console.log(err)

        // send records as a response
        //res.send(recordset);
    });
});*/



const DBINDEX = adodb.open(CN_Index)
const DBSUPERINDEX = adodb.open(CN_SuperIndex)
const DBGEN = adodb.open(CN_TST)

//const RPM_GLOBAL = adodb.open(CN_RPM_GLOBAL)
//const RPM_LOCAL  = adodb.open(CN_RPM_LOCAL)


const mysql = require('mysql');

const MYSQL_RPM_GLOBAL = mysql.createConnection({
  host: "10.0.0.48",
  user: "root",
  password: "Ipstrix.001!",
  database: "rpm_global"
});

  

let images = []



////////////////////////////////////////////////////////
const app=express();
////////////////////////////////////////////////////////
app.use(bodyParser.json({ type: 'application/json' }));
app.use(bodyParser.urlencoded({ extended: false }));



///////////////////////////////////////// B O D Y   T R A C E //////////////////////////////////////////

app.post('/bodytrace',(req,res) => {
    console.log("/////////////////// EVENT RECEIVED ////////////////////////////")
    var today = new Date(),
    date = (sudue(today.getMonth() + 1)) + '/' + sudue(today.getDate()) +  '/' +today.getFullYear() + " "+today.getHours()+ "."+today.getMinutes()+ "."+today.getSeconds()
    console.log(date)

    const bodyEvent = req.body.values
    const eventFull = req.body

    console.log(bodyEvent)
    console.log("//////////////////////////////")
    console.log(eventFull)

    if (!fs.existsSync(BODYTRACE_IN_DIR)) {
        fs.mkdirSync(path.resolve(BODYTRACE_IN_DIR));
    }
      
    console.log("W R I T E   R E Q   O N   F I L E ")
    var parsedJson = req.body
    var ts = req.body.ts
    var receivedtime = dtostime()
    var jsonFileName = req.body.imei + '_' + ts +"_"+ receivedtime +'.json'
    console.log(jsonFileName)
    
    fs.writeFile(docServerPath+'//public//BODYTRACE//IN//'+jsonFileName, JSON.stringify(parsedJson), function (err) {
    

    if (err) throw err;
    console.log('S A V E D  !!');
    console.log('Starting SaveTransmission on DB');
    let response=MySqlSaveRpmTransmission(req.body,receivedtime)
    console.log('Done SaveTransmission on DB');    
});
   
    
    var ACCTNO='0'
            
    res.writeHead(200,{'Content-Type':'text/xml'});
    res.end('Received!');

});

function MySqlSaveRpmTransmission(xreqBody,xreceivedtime) {
    
    console.log("//////////////////////////") 
    console.log(xreqBody.values.values_tare) 
    console.log("//////////////////////////") 
    
    
    
    let timezoneid=1
    let imei=xreqBody.imei
    let ts=xreqBody.ts
    let batteryVoltage=xreqBody.batteryVoltage
    let signalStrength=xreqBody.signalStrength
    let values_systolic=xreqBody.values.systolic
    let values_diastolic=xreqBody.values.diastolic
    let values_pulse=xreqBody.values.pulse
    let values_unit=xreqBody.values.unit
    let values_irregular=xreqBody.values.irregular
    
    let values_tare=xreqBody.values.values_tare
    let values_weight=xreqBody.values.weight
    let values_rssi=xreqBody.values.rssi
    let values_deviceId=imei
    let contentjson=xreqBody

    if (imei==undefined){
        imei=''
    }
    if (ts==undefined){
        ts=0
    }
    if (batteryVoltage==undefined){
        batteryVoltage=0
    }
    if (signalStrength==undefined){
        signalStrength=0
    }
    if (values_systolic==undefined){
        values_systolic=0
    }
    if (values_diastolic==undefined){
        values_diastolic=0
    }
    if (values_pulse==undefined){
        values_pulse=0
    }
    if (values_unit==undefined){
        values_unit=0
    }
    if (values_irregular==undefined){
        values_irregular=0
    }


    if (values_tare==undefined){
        values_tare=0
    }
    if (values_weight==undefined){
        values_weight=0
    }
    if (values_rssi==undefined){
        values_rssi=0
    }



    MYSQL_RPM_GLOBAL.connect(function(err) {
    if (err) throw err;
        console.log("Connected!");
        //var sql = "INSERT INTO rpm_transmissions (timestamp,timezoneid,imei,ts,batteryVoltage,signalStrength,values_systolic,values_diastolic,values_pulse,values_irregular,values_tare,values_weight,values_rssi,values_deviceId,contentjson) VALUES('"+xreceivedtime+"',"+timezoneid+",'"+imei+","+ts+","+batteryVoltage+","+signalStrength+","+values_systolic+","+values_diastolic+","+values_pulse+","+values_irregular+","+values_tare+","+values_weight+","+values_rssi+",'"+values_deviceId+"','"+contentjson+"')"
        var sql = "INSERT INTO rpm_transmissions (timestamp,timezoneid,imei,ts,batteryVoltage,signalStrength,values_systolic,values_diastolic,values_pulse,values_unit,values_irregular,values_tare,values_weight,values_rssi) VALUES('"+xreceivedtime+"',"+timezoneid+",'"+imei+"',"+ts+","+batteryVoltage+","+signalStrength+","+values_systolic+","+values_diastolic+","+values_pulse+","+values_unit+","+values_irregular+","+values_tare+","+values_weight+","+values_rssi+")"
        MYSQL_RPM_GLOBAL.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
        });
    });
}

function saveRpmTransmission(xreqBody,xreceivedtime) {
    let timezoneid=1
    let imei=xreqBody.imei
    let ts=xreqBody.ts
    let batteryVoltage=xreqBody.batteryVoltage
    let signalStrength=xreqBody.signalStrength
    let values_systolic=xreqBody.values.systolic
    let values_diastolic=xreqBody.values.diastolic
    let values_pulse=xreqBody.values.pulse
    let values_irregular=xreqBody.values.irregular
    let values_tare=xreqBody.values.values_tare
    let values_weight=xreqBody.values.weight
    let values_rssi=xreqBody.values.rssi
    let values_deviceId=imei
    let contentjson=xreqBody
    
    console.log("///////////////////////////")
    console.log("imei="+xreqBody.imei)
    console.log("ts="+xreqBody.ts)
    console.log("batteryVoltage="+xreqBody.batteryVoltage)
    console.log("signalStrength="+xreqBody.signalStrength)
    console.log("values_systolic="+xreqBody.values.systolic)
    console.log("values_diastolic="+xreqBody.values.diastolic)
    console.log("values_pulse="+xreqBody.values.pulse)
    console.log("values_irregular="+xreqBody.values.irregular)
    console.log("values_tare="+xreqBody.values.values_tare)
    console.log("values_weight="+xreqBody.values.weight)
    console.log("values_rssi="+xreqBody.values.rssi)
    console.log("values_deviceId="+imei)
    
    let queryreceived="INSERT INTO rpm_transmissions (timestamp,timezoneid,imei,ts,batteryVoltage,signalStrength,values_systolic,values_diastolic,values_pulse,values_irregular,values_tare,values_weight,values_rssi,values_deviceId,contentjson) VALUES('"+xreceivedtime+"',"+timezoneid+",'"+imei+","+ts+","+batteryVoltage+","+signalStrength+","+values_systolic+","+values_diastolic+","+values_pulse+","+values_irregular+","+values_tare+","+values_weight+","+values_rssi+",'"+values_deviceId+"','"+contentjson+"')"
    console.log(queryreceived)
    //var datalogrec=staticADOExecute(RPM_GLOBAL,queryreceived)
    //var datalogrec=ADOExecute('Driver={MySQL ODBC 8.0 Unicode Driver};Server=Localhost;Port=;Option=;Database=rpm_global;Uid=root;Pwd=root',queryreceived)
    return datalogrec
}

/////////////////////////////////////////////////////////////////////////////
function dtos() {
    var today = new Date(),
    date = today.getFullYear() +(sudue(today.getMonth() + 1)) +  sudue(today.getDate())  
    return  date
}

function dtostime() {
    var today = new Date(),
    //date = (sudue(today.getMonth() + 1)) +  sudue(today.getDate())  +today.getFullYear() + sudue(today.getHours())+ sudue(today.getMinutes())+sudue(today.getSeconds())
    date = today.getFullYear() +(sudue(today.getMonth() + 1)) +  sudue(today.getDate())  + sudue(today.getHours())+ sudue(today.getMinutes())+sudue(today.getSeconds())
    return  date
}

function sudue(number) {
    if (number<10){
        return'0' +(number)
    }
    else{
        return (number)
    }

    
}

async function SaveMedia(mediaItem) {
    const { mediaUrl, fileName } = mediaItem;
    if (NODE_ENV !== 'test') {
        const fullPath = path.resolve(`${SMS_IN_DIR}/${fileName}`);
        if (!fs.existsSync(fullPath)) {
            const response = await fetch(mediaUrl);
            const fileStream = fs.createWriteStream(fullPath);
            response.body.pipe(fileStream);
            deleteMediaItem(mediaItem);
        }
        images.push(fileName);
    }
}

function deleteMediaItem(mediaItem) {
    return client
      .api.accounts(accountsid)
      .messages(mediaItem.MessageSid)
      .media(mediaItem.mediaSid).remove();
      console.log("Media Item"+mediaItem.mediaSid+" deleted!");
}


/*class Database {
    constructor( config ) {
        this.connection= adodb.open(config).then().catch();
    }
    query(sql) {
        return new Promise((resolve,reject) => {
            this.connection.query(sql,(err,rows) => {
                if ( err )
                    return reject( err );
                resolve( rows );
            })
        });
    }
    close() {
        return new Promise((resolve,reject) => {
            this.connection.end(err => {
                if ( err )
                    return reject(err );
                resolve();
            })
        });
    }
}*/

function togliApici(xString){
    let tempString =''
    console.log(xString)
    //tempString = xString.replace("'", "''")
    //tempString = tempString.replace("[", "(")
    //tempString = tempString.replace( "]", ")")
    tempString = xString.replace("'", "").replace("[", "").replace( "]", "").replace("(", "").replace( ")", "")
    tempString = tempString.replace("'", "").replace("[", "").replace( "]", "").replace("(", "").replace( ")", "")
    tempString = tempString.replace("'", "").replace("[", "").replace( "]", "").replace("(", "").replace( ")", "")
    tempString = tempString.replace("'", "").replace("[", "").replace( "]", "").replace("(", "").replace( ")", "")
    tempString = tempString.replace("'", "").replace("[", "").replace( "]", "").replace("(", "").replace( ")", "")
    tempString = tempString.replace("'", "").replace("[", "").replace( "]", "").replace("(", "").replace( ")", "")
    tempString = tempString.replace("'", "").replace("[", "").replace( "]", "").replace("(", "").replace( ")", "")
    tempString = tempString.replace("'", "").replace("[", "").replace( "]", "").replace("(", "").replace( ")", "")
    tempString = tempString.replace("'", "").replace("[", "").replace( "]", "").replace("(", "").replace( ")", "")

    console.log("/////////////////////////////")
    console.log(tempString)
    console.log("/////////////////////////////")
    return tempString
}

function rsADO(connectionString,sql) {
    adodb.debug=true;
    const connection = adodb.open(connectionString)
    return new Promise((resolve,reject) => {
        connection.query( sql ,(err,rows) => {
            if ( err )  return reject( err );
            setTimeout(resolve, 100, rows);
            //resolve( rows );
        })
    });
}


async function ADOQuery(connectionString,sql) {
    adodb.debug=true;
    const connection = adodb.open(connectionString)
    try {
        data = await connection.query(sql);
        //console.log(JSON.stringify(data, null, 2));
        return data;
    } catch (error) {
        console.error(error);
    }
}

async function ADOExecute(connectionString,sql) {
    adodb.debug=true;
    const connection = adodb.open(connectionString)
    try {
        data = await connection.execute((sql));
        return data;
    } catch (error) {
        console.error(error);
        console.error("/////////////////// ERROR CATCHED ////////////////////////////");
        try {
            data = await connection.execute((sql));
            console.error("/////////////////// Second try ok ////////////////////////////");
            return data;
        } catch (error) {
            console.error(error);
            console.error("/////////////////// II ERROR CATCHED ////////////////////////////");
            try {
                data = await connection.execute((sql));
                console.error("/////////////////// Third try ok ////////////////////////////");
                return data;
            } catch (error) {
                console.error(error);
                console.error("/////////////////// III ERROR CATCHED ////////////////////////////");
            }    
        }    
    }
}


async function staticADOQuery(connection,sql) {
    adodb.debug=true;
    try {
        data = await connection.query((sql));
        //console.log(JSON.stringify(data, null, 2));
        return data;
    } catch (error) {
        console.error(error);
    }
}

async function staticADOExecute(connection,sql) {
    adodb.debug=true;
    try {
        data = await connection.execute((sql));
        return data;
    } catch (error) {
        console.error(error);
        console.error("/////////////////// ERROR CATCHED ////////////////////////////");
        try {
            data = await connection.execute((sql));
            console.error("/////////////////// Second try ok ////////////////////////////");
            return data;
        } catch (error) {
            console.error(error);
            console.error("/////////////////// II ERROR CATCHED ////////////////////////////");
            try {
                data = await connection.execute((sql));
                console.error("/////////////////// Third try ok ////////////////////////////");
                return data;
            } catch (error) {
                console.error(error);
                console.error("/////////////////// III ERROR CATCHED ////////////////////////////");
            }    
        }    
    }
}


app.post('/conference', (request, response) => {
    // Use the Twilio Node.js SDK to build an XML response
    const twiml = new twilio.TwimlResponse();
  
    // Start with a <Dial> verb
    twiml.dial(dialNode => {
      // If the caller is our MODERATOR, then start the conference when they
      // join and end the conference when they leave
      MODERATOR=request.body.From
      if (request.body.From == MODERATOR) {
        dialNode.conference('My conference', {
          startConferenceOnEnter: true,
          endConferenceOnExit: true,
        });
      } else {
        // Otherwise have the caller join as a regular participant
        dialNode.conference('My conference', {
          startConferenceOnEnter: false,
        });
      }
    });
  
    // Render the response as XML in reply to the webhook request
    response.type('text/xml');
    response.send(twiml.toString());
  });
  


app.post('/call',(req,res) => {
    console.log("/////////////////// call request ////////////////////////////")
    var salesNumber="+15619614616"
    var url = 'https://28yzj4jum.cname.us.ngrok.io/callin' 
    var options = {
        to: req.body.phoneNumber,
        //from: '+15614183017',
        from: '+19172807971',
        url: url
    };
    client.calls.create(options)
    .then((message) => {
      console.log(message.responseText);
      res.send({
          message: 'Thank you! We will be calling you shortly.',
      });
    })
    .catch((error) => {
      console.log(error);
      response.status(500).send(error);
    });
});
// Return TwiML instructions for the outbound call
app.post('/outbound/:salesNumber', function(request, response) {
    var salesNumber = request.params.salesNumber;
    var twimlResponse = new VoiceResponse();

    twimlResponse.say('Thanks for contacting our sales department. Our ' +
                      'next available representative will take your call. ',
                      { voice: 'alice' });

    twimlResponse.dial(salesNumber);

    response.send(twimlResponse.toString());
});

app.post('/callin',(req,res)=>{
    const VoiceResponse = require('twilio').twiml.VoiceResponse;
    const response = new VoiceResponse();
    const dial = response.dial();
    dial.number({
        statusCallbackEvent: 'initiated ringing answered completed',
        statusCallback: 'https://izjtpblg.cname.us.ngrok.io/public' ,
        statusCallbackMethod: 'POST'
    }, '+12349013030');
    
    console.log(response.toString());
});















app.post('/response',(req,res) => {
    console.log("/////////////////// MESSAGE RECEIVED ////////////////////////////")
    const twimlResponse = new MessagingResponse();
    const message = twimlResponse.message();

    const callerNumber = req.body.From
    const callerMessage = req.body.Body

    var findUser=0
    var findPatient=0
    
    var dataPatient,dataUser

    if (!fs.existsSync(SMS_IN_DIR)) {
        fs.mkdirSync(path.resolve(SMS_IN_DIR));
    }
      
    //console.log("W R I T E   R E Q   O N   F I L E ")
    var parsedJson = req.body
    //console.log (parsedJson);
    var jsonFileName = req.body.MessageSid
    fs.writeFile(docServerPath+'//public//SMS//IN//'+jsonFileName, JSON.stringify(parsedJson)+".json", function (err) {
    if (err) throw err;
    //console.log('S A V E D  !!');
    });
   
    
    console.log("Caller Nr: " + req.body.From)
    console.log("Message  : " + req.body.Body)
    console.log("Num Media  : " + req.body.NumMedia)
    console.log(req.body)

    let NumMedia=req.body.NumMedia
    let saveOperations = [];
    const mediaItems = [];
    
    const SenderNumber = req.body.From
    const MessageSid =req.body.MessageSid
    const mediaSids=[] 
    mediaSids[0]=''
    mediaSids[1]=''
    mediaSids[2]=''
    mediaSids[3]=''
    mediaSids[4]=''
    mediaSids[5]=''
    mediaSids[6]=''
    mediaSids[7]=''
    mediaSids[8]=''
    mediaSids[9]=''

    for (var i = 0; i < NumMedia; i++) {  // eslint-disable-line
        const mediaUrl = req.body[`MediaUrl${i}`];
        const contentType = req.body[`MediaContentType${i}`];
        const extension = extName.mime(contentType)[0].ext;
        const mediaSid = path.basename(urlUtil.parse(mediaUrl).pathname);
        const fileName = `${mediaSid}.${extension}`;
        mediaSids[i]=mediaSid
        //console.log(mediaSids[i])
        //console.log("Media Url: " + mediaUrl )            
        //console.log("Content Type: " + contentType)
        //console.log("Extension: " + extension)
        //console.log("Media Sid: " + mediaSid)
        //console.log("File Name: "+ fileName)

        mediaItems.push({ mediaSid, MessageSid, mediaUrl, fileName, SenderNumber });
        saveOperations = mediaItems.map(mediaItem => SaveMedia(mediaItem));
        //console.log (saveOperations);
    }


    

    const numberPrefix=callerNumber.replace("+1","").substr(0,3)
    const numberRoot=callerNumber.replace("+1","").substr(3,3)
    const numberEnd=callerNumber.replace("+1","").substr(6,4)

    numberToSearch="("+numberPrefix+")"+" "+numberRoot+"-"+numberEnd

    
    //console.log("Number To Search:"+numberToSearch)
    //console.log("message Received:"+callerMessage)

    //console.log="SEARCH FOR PARTNER"
    if (numberToSearch=='(516) 853-7979'){
        //console.log="Partner - NO - Response"
        return;
    }

    var today = new Date(),
    date = (today.getMonth() + 1) + '/' + today.getDate()+  '/' +today.getFullYear() + " "+today.getHours()+ "."+today.getMinutes()+ "."+today.getSeconds()
    //console.log(date)

    var ACCTNO='0'
    var USERID='0'
    var TECHNICIANID='0'
    var PHYSICIANID='0'

    if (numberToSearch.substr(0,1) == '(') {
        let patientRows,userRows
        //console.log("Numero: "+numberToSearch)
        var consent_patient_Name=''
        var consent_patient_FName=''
        var consent_patient_DOB=''
        var consent_date=''
        
        //dataPatient =   ADOQuery(CN_Index,"SELECT LNAME,FNAME,DOB,PHONECELL,ACCTNO FROM (INDEX_PATIENTS) WHERE PHONECELL ='"+numberToSearch+"'")
        //dataUser=   ADOQuery(CN_SuperIndex,"SELECT ID, USERID, USERNAME, PHONECELL, LNAME, FNAME FROM (INDEX_USERS) WHERE PHONECELL ='"+numberToSearch+"'")
        dataPatient =   staticADOQuery(DBINDEX,"SELECT LNAME,FNAME,DOB,PHONECELL,ACCTNO FROM (INDEX_PATIENTS) WHERE PHONECELL ='"+numberToSearch+"'")
        dataUser=   staticADOQuery(DBSUPERINDEX,"SELECT ID, USERID, USERNAME, PHONECELL, LNAME, FNAME FROM (INDEX_USERS) WHERE PHONECELL ='"+numberToSearch+"'")
        let data = Promise.all([dataPatient, dataUser ]).then((values) => {
            var response=''
            if (values[0].length!=0 && values[1].length==0) {
                console.log("P A T I E N T   F O U N D")
                findPatient=1;
                USERID=0
                ACCTNO=values[0][0].ACCTNO
                consent_patient_FName=values[0][0].FNAME
                consent_patient_Name=values[0][0].FNAME+ " "+values[0][0].LNAME    
                consent_patient_DOB=values[0][0].DOB
                consent_date=date
                
                console.log(consent_patient_Name)
                console.log(consent_patient_DOB)
                console.log(ACCTNO)
                
                response='Thank you '+  consent_patient_FName.substr(0,1).toUpperCase()+consent_patient_FName.substr(1).toLowerCase()+"! Your message has been received!"
                if (callerMessage.trim().toUpperCase()=="NO" ){
                    response=consent_patient_FName.substr(0,1).toUpperCase()+consent_patient_FName.substr(1).toLowerCase()+", "+"please call the office at (718) 252 4765. Thank you!"
                    console.log(response)
                }
                var result=messageHandler('Patient',callerMessage)
            }    
            else if (values[1].length!=0) {
                console.log("U S E R    F O U N D")
                console.log(values[1][0])
                findPatient=0;
                findUser=1;
                USERID=values[1][0].ID
                ACCTNO=0
                consent_User_Name=values[1][0].FNAME+ " "+values[1][0].LNAME    
                consent_User_FName=values[1][0].FNAME
                consent_date=date
                response='Thank you '+ consent_User_FName.substr(0,1).toUpperCase()+consent_User_FName.substr(1).toLowerCase()+"!  Message received!"
                
                var result=messageHandler('User',values[1],callerMessage)
            }
                else if (values[1].length==0) {
                    console.log("Unkown Caller")
                    console.log("")
                    findUser=0;
                    findPatient=0;
                    USERID=0
                    ACCTNO=0
                    consent_User_Name=''
                    consent_User_FName=''
                    consent_date=date
                    response='Thank you! Message received!\r\nYour phone in not in our records' 
                    var result=messageHandler('Unknown',numberToSearch,callerMessage)    

            }                
        
        
            var queryreceived=''
            var queryresponse=''
            queryreceived="INSERT INTO SMS_LOG (MSG_ID,MSG_DATETIME,MSG_NRFROM,MSG_NRTO,MSG_MESSAGE,MSG_ACCTNO_FROM,MSG_USER_FROM,MSG_IO,MSG_MEDIA01,MSG_MEDIA02,MSG_MEDIA03,MSG_MEDIA04,MSG_MEDIA05,MSG_MEDIA06,MSG_MEDIA07,MSG_MEDIA08,MSG_MEDIA09,MSG_MEDIA10) VALUES('"+MessageSid+"','"+date+"','"+numberToSearch+"','"+"+10000000000"+"','"+togliApici(callerMessage)+"',"+ACCTNO+","+USERID+",1,'"
            +mediaSids[0]+"','"
            +mediaSids[1]+"','"
            +mediaSids[2]+"','"
            +mediaSids[3]+"','"
            +mediaSids[4]+"','"
            +mediaSids[5]+"','"
            +mediaSids[6]+"','"
            +mediaSids[7]+"','"
            +mediaSids[8]+"','"
            +mediaSids[9]+"'"
            +")"
            
            
            
            //var datalogrec=ADOExecute(CN_Index,queryreceived)
            var datalogrec=staticADOExecute(DBINDEX,queryreceived)
            //console.log("RETURNED datalogrec: ")
            //console.log(datalogrec)
            
            queryresponse="INSERT INTO SMS_LOG (MSG_ID,MSG_DATETIME,MSG_NRFROM,MSG_NRTO,MSG_MESSAGE,MSG_ACCTNO_FROM,MSG_USER_FROM,MSG_IO) VALUES('"+"res_"+MessageSid+"','"+date+"','"+"+10000000000"+"','"+numberToSearch+"','"+response+"',"+"0,0,0)"

            //var datalogres=ADOExecute(CN_Index,queryresponse)
            var datalogres=staticADOExecute(DBINDEX,queryresponse)
            //console.log("RETURNED datalogres: ")
            //console.log(datalogres)

            message.body(response);
            
            res.writeHead(200,{'Content-Type':'text/xml'});
            res.end(twimlResponse.toString());

        
        });

    }
});

function messageHandler(callerData,callerMessage){
    console.log(callerData)
    console.log(callerMessage)
    return'ok'
}


      
app.get('/send-fax1', (req,res) => {
    
    const {from,to,mediaUrl } = req.query
    
    console.log(req.query)
    client.sms.message
    .create({
        from:"+19735200461",
        to: to,
        mediaUrl: mediaUrl
        })
    .then(sms => res.send(sms))
    .catch(error => {
        console.error(error);
    });
})



// twilio FAX
app.get('/send-fax', (req,res) => {
    //res.send('Giuseppe Saponieri FAX server with express on port 4100')
    const {from,to,mediaUrl,statusCallback} = req.query
    console.log(req.query)
    client.fax.faxes
    .create({
       from:"+19735200461",
       to: to,
       mediaUrl: mediaUrl,
       statusCallback:statusCallback 
    })
    .then(fax => res.send(fax))
    .catch(error => {
        console.error(error);
    });
    
})


















app.post('/fax-status',(req,res) => {
    console.log("/////////////////// FAX STATUS REQUEST ////////////////////////////")
    console.log(req.body)
})




app.get('/rpm_sim', (req,res) => {
    //res.send('Giuseppe Saponieri FAX server with express on port 4100')
    const theQuery = req.query
    console.log(req.query)
    rpm_request;
   
})


function rpm_request(){
    var request = require('request');
    var options = {
      'method': 'POST',
      'url': 'http://2mkxcquxp.cname.us.ngrok.io/bodytrace',
      'headers': {'Content-Type': 'application/json'},
      body: JSON.stringify({"imei":"012896009462125","ts":1380562575798,"baMeryVoltage":5522,"signalStrength":91,"values":{"systolic":16400,"diastolic":10533,"pulse":88,"unit":1,"irregular":0}})
    };
    request(options, function (error, response) { 
      if (error) throw new Error(error);
      console.log(response.body);
    });

}

/*    http.createServer(app).listen(80,() => {
    console.log('KINGSHEART::Comm Server (c) Giuseppe  Saponieri')
})*/
/*        http.createServer({
        host: '28yzj4jum.cname.us.ngrok.io',
       //key: fs.readFileSync('c:\\keys\\private.key','utf8'),
      //cert: fs.readFileSync('c:\\keys\\server.crt','utf8'),
     rejectUnauthorized: false
   },app).listen(80,() => {
       console.log('KINGSHEART::Comm Server (c) Giuseppe  Saponieri')
   })
*/
    const httpsOptions = {
        key: fs.readFileSync('C:\\Certbot\\live\\rmdxwrva.cname.us.ngrok.io\\privkey.pem'),
        cert: fs.readFileSync('C:\\Certbot\\live\\rmdxwrva.cname.us.ngrok.io\\fullchain.pem')
    }
    const server = https.createServer(httpsOptions, app)
        .listen(80, () => {
            console.log('server running at 80')
        })


