var restify = require('restify');

var builder = require('botbuilder');

var botbuilder_azure = require("botbuilder-azure");

var inMemoryStorage = new builder.MemoryBotStorage();

var say=require("say");

// Setup Restify Server

var server = restify.createServer();

server.listen(process.env.port
|| process.env.PORT ||
3978, function () {console.log('%s listening to %s', server.name,server.url); 

});


// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId:'41624a8a-dae2-4dbb-821c-069fe202c74b',
    appPassword:'utsebMCEG2$[^lkRQM1812$'
});



// Listen for messages from users 

server.post('/api/messages', connector.listen());




var tableName = 'botdata';

var azureTableClient = new
botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);

var tableStorage = new botbuilder_azure.AzureBotStorage({
gzipData: false }, azureTableClient);







// -----------------bot diloags----------------------
var bot = new builder.UniversalBot(connector,
function (session) {
 session.beginDialog('first_msg');

});

var item;

var order_entity=[];

var utterance;

var item_name;

function randomString() {

    var result = '';

    var chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (var i =
12; i > 0; --i)
result += chars[Math.floor(Math.random()
* chars.length)];

    return result;

}

//-------------------------------------------------------------

bot.dialog('first_msg',function(session){

	say.speak("Hello Rohan. How can i help you today?");
    session.send("Hello Rohan. How can i help you today?");

});

//---------------LUIS-----------------------------------------

// Make sure you add code to validate these fields

var luisAppId = process.env.LuisAppId
|| '2bac5856-145a-46c5-9cfd-eb7fe0a4fcea' ;

var luisAPIKey = process.env.LuisAPIKey
||'082bd925b7714e4dae990d9e0904e36c';

var luisAPIHostName = process.env.LuisAPIHostName
|| 'westus.api.cognitive.microsoft.com';




const LuisModelUrl = 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/2bac5856-145a-46c5-9cfd-eb7fe0a4fcea?subscription-key=082bd925b7714e4dae990d9e0904e36c&verbose=true&timezoneOffset=0&q='




// Main dialog with LUIS

var luis_recognizer = new builder.LuisRecognizer(LuisModelUrl);

bot.recognizer(luis_recognizer);

var intents = new builder.IntentDialog({
recognizers: [luis_recognizer] });

var date_del;





//------------------------------------------------------------------
bot.dialog('end_dialog',[
  
  function(session)
  {  ticket_no=randomString();
    
      
    session.send(`Thank you for using IT help desk`);
    session.endDialog();
   
  }]);


bot.dialog('ms_ofice_prob',[
  
    function(session)
    {  ticket_no=randomString();
      
        say.speak("Your license has been expired on Jan 01 2018 Drop an e-mail to your manager Anshul to continue your service");
      session.send("I have looked into your account.Your license has been expired on Jan 01,2018. Drop an e-mail to your manager Anshul to continue your service");
      builder.Prompts.text(session,"Is there anything else I can help you with ?");
    }
    ,
    function(session,results)
    {
      if(results.response=='No'||results.response=='no' )
      {
        session.beginDialog('end_dialog');
      }
    }
]);



bot.dialog('email_f_pass',[
  function(session)
    { 
      console.log("yahooooo email password forgot");
      builder.Prompts.text(session,"Please enter you email id");
        
        
    },
    function(session,results)
    {
      session.dialogData.mail_id = results.response;
      session.send(`password change link has been send to phone number linked  to your email id ${ session.dialogData.mail_id} `);
      say.speak(`password change link has been send to phone number linked  to your email id ${ session.dialogData.mail_id} `);
     
      builder.Prompts.text(session,"Anything else?");
    }
    ,
    function(session,results)
    {
      if(results.response=='No'||results.response=='no' )
      {
        session.beginDialog('end_dialog');
      }
    }

   
]);

var column_value = "";
var column_name = "";

bot.dialog('tkt_status',[
  function(session)
    { 
      builder.Prompts.text(session,"Please enter your ticket no");
        
    },
    function(session,results)
    {
      session.dialogData.tkt_id = results.response;
            const Connection = require('tedious').Connection;
        const Request = require('tedious').Request;

      const config = {
        userName: 'admin_login',
        password: 'helloBOT@007',
        server: 'celebal.database.windows.net',
        options: {
          database: 'test_db',
          encrypt: true
        }
      };
      var column_value = "";
      var column_name = "";
      const connection = new Connection(config);
      connection.on('connect', function(err) {  
              console.log("Connected");  
              
              executeStatement1();  
          }); 
          var TYPES = require('tedious').TYPES;  

          function executeStatement1() {  
            request = new Request(
              'select requirement, status  from query where ticket=@per;', function (err, rowCount, rows) {
                if (err) {
                  callback(err);
                } else {
                  console.log(rowCount + ' Data Fetched');
                  if (rowCount==0){
                    session.send("Please enter a valid ticket no");
                  }
          //process.exit();
                }
              });
            request.addParameter('per', TYPES.NVarChar, session.dialogData.tkt_id);
       request.on('row', function(columns) {
              columns.forEach(function(column) {
              console.log("%s\t%s", column.metadata.colName, column.value);
              column_value=column.value;
              column_name=column.metadata.colName;

             
               session.send(column_name+":\t"+column_value);
               

               });
              builder.Prompts.text(session,"Anything else?");

                   });
            connection.execSql(request); 
            
          }
         
          },
          function(session,results)
    {
      if(results.response=='No'||results.response=='no' )
      {
        session.beginDialog('end_dialog');
      }
    }

   
]);




bot.dialog('keyboard_',[

    function(session)

    {

        say.speak("You can choose among these keyboards which one you want");

        var msg = new
builder.Message(session);

    msg.attachmentLayout(builder.AttachmentLayout.carousel)

    msg.attachments([

        new builder.HeroCard(session)

            .title("Artis K10 Wired USB Keyboard")

           

            .images([builder.CardImage.create(session,'https://images-na.ssl-images-amazon.com/images/I/61o4vVvR6dL._SY355_.jpg')])

            .buttons([

                builder.CardAction.imBack(session,"keyboard ordered Artis K10 Wired USB ", "Order")

            ]),

        new builder.HeroCard(session)

            .title("Razer Ornata Chroma")

            

            .images([builder.CardImage.create(session,'https://images-na.ssl-images-amazon.com/images/I/61o4vVvR6dL._SY355_.jpg')])

            .buttons([

                builder.CardAction.imBack(session,"keyboard ordered Razer Ornata Chroma", "Order")

            ])

    ]);

    session.send(msg).endDialog();

    }




]);




bot.dialog('keyboard_button',[

   

        function(session,args,next)

    {   utterance = args.intent.matched['input'];

        console.log("--------------------------",args);

        console.log("--------------------------",utterance);

        item_name=utterance.replace("keyboard ordered","");

        console.log("--------------------------",utterance.replace("keyboard ordered",""));

        session.beginDialog('date_d');

    },

    function(session, results)

    {  ticket_no=randomString();

      session.dialogData.d =builder.EntityRecognizer.resolveTime([results.response]);
      date_del=String(session.dialogData.d ).replace("12:00:00 GMT+0530 (India Standard Time)","");

      console.log("in dialog entity___________",order_entity);

     session.send(`You request has been recorded:<br/>Ticket no: ${ticket_no} 
<br/>Category: Order place <br/>Entity:${order_entity}

      <br/> Item name: ${item_name}

     <br/> Delivery date:${date_del}`);


     session.beginDialog("confirm");
    
    }

]).triggerAction({ matches: /(Keyboard)\s.*ordered/i
});

bot.dialog('confirm', function(session){
      var msg = new builder.Message(session);

    msg.attachmentLayout(builder.AttachmentLayout.list)

    msg.attachments([

        new builder.HeroCard(session)

            .buttons([builder.CardAction.imBack(session,`Order Confirmed`, "Submit") ])
        

    ])

    session.send(msg);
    session.endDialog();
    });

bot.dialog('sub_btn',[
    function(session){
        session.beginDialog('database');
        session.beginDialog('end_con');
    }

]).triggerAction({ matches: /(Order)\s.*Confirmed/i});


bot.dialog('database',[
  function(session)
    { 
      
        var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

// Create connection to database
var config = 
   {
     userName: 'admin_login', // update me
     password: 'helloBOT@007', // update me
     server: 'celebal.database.windows.net', // update me
     options: 
        {
           database: 'test_db' //update me
           , encrypt: true
        }
   }
var connection = new Connection(config);

// Attempt to connect and execute queries if connection goes through
connection.on('connect', function(err) 
   {
     if (err) 
       {
          console.log(err)
       }
    else
       {
           executeStatement1()
       }
   }
 );

    var TYPES = require('tedious').TYPES;  

function executeStatement1() {  
      request = new Request(
        'INSERT INTO query VALUES (@Name, @query1, @stat , @dept, @status,@user1);', function (err, rowCount, rows) {
          if (err) {
            console.log(err);
          } else {
            console.log(rowCount + ' row(s) inserted');
          }
        });
      request.addParameter('Name', TYPES.NVarChar, ticket_no);
      request.addParameter('query1', TYPES.NVarChar,'order place');
      request.addParameter('stat', TYPES.NVarChar, order_entity);
      request.addParameter('dept', TYPES.NVarChar, 'Rahul');
      request.addParameter('status', TYPES.NVarChar, 'under process');
      request.addParameter('user1', TYPES.NVarChar, 'Rohan');
      connection.execSql(request); 
    }

    },
  
   
]);



bot.dialog('date_d',function(session)

{

    say.speak("By when you want it");

    builder.Prompts.time(session,"By when you want it");

});



bot.dialog('end_con',function(session){

var arr=['Anything else i can help you with','What else I can do?','Do you have any further query?','Any further question']

var comment=arr[Math.floor(Math.random()*arr.length)];
    builder.Prompts.text(session,comment); 

},

function(session,results)

{

    if(resuts.reponse=='No')

    {   say.speak("Thank you for using IT help desk.");

        session.send("Thank you for using IT help desk.");

        session.endDialog();

    }

}

);




bot.dialog('mouse_',[

    function(session){

        say.speak("You can choose among these mouse which one you want");

        var msg = new builder.Message(session);

    msg.attachmentLayout(builder.AttachmentLayout.list)

    msg.attachments([

        new builder.HeroCard(session)

            

            .buttons([

                builder.CardAction.imBack(session,"mouse ordered Wired ", "Order wired")

            ]),

        new builder.HeroCard(session)

            

            .buttons([

                builder.CardAction.imBack(session,"mouse ordered wireless", "Order wireless")

            ])

    ]);

    session.send(msg);

    }

    

]);

bot.dialog('mouse_button',[

     function(session,args,next)

     {utterance = args.intent.matched['input'];

     console.log("--------------------------",args);

     console.log("--------------------------",utterance);

     item_name=utterance.replace("ordered","");

         session.beginDialog('date_d');

     },

     function(session,results){

        ticket_no=randomString();

      session.dialogData.d =builder.EntityRecognizer.resolveTime([results.response]);

      console.log("in dialog entity___________",order_entity);

      
date_del=String(session.dialogData.d ).replace("12:00:00 GMT+0530 (India Standard Time)","");
      

     session.send(`You request has been recorded:<br/>Ticket no: ${ticket_no} <br/>Category: Order place <br/>Entity:${order_entity} <br/> Item name: ${item_name}<br/> Delivery date:${date_del}`);
    session.beginDialog("confirm");
   
    }
    
]).triggerAction({ matches: /(mouse)\s.*/i
});




bot.dialog('laptop_',[

     function(session){

         

         say.speak("Please select the brand of the laptop");

        var msg = new
builder.Message(session);

    msg.attachmentLayout(builder.AttachmentLayout.list)

    msg.attachments([

        new builder.HeroCard(session)

            

            .buttons([

                builder.CardAction.imBack(session,
"Laptop Lenovo ", "Lenovo")

            ]),

        new builder.HeroCard(session)

            

            .buttons([

                builder.CardAction.imBack(session,
"Laptop Asus", "Asus")

            ])

    ]);

    session.send(msg);

    }

     

 

]);




bot.dialog('laptop_button',[

    function(session,args,next)

    {utterance = args.intent.matched['input'];

    console.log("--------------------------",args);

    console.log("--------------------------",utterance);

    session.dialogData.brand_name=utterance.replace("Laptop","");

       builder.Prompts.text(session,"What Processor do you need?");

       

    },

    

    function(session,results)

    {

      

      session.dialogData.lap_processor =
results.response;

      builder.Prompts.text(session,"What ram size do you want?");

        

    },

    function(session,results)

    {

      session.dialogData.lap_ram_size =
results.response;

      builder.Prompts.text(session,"What Hard disk size do you want?");

        

    },

    function(session,results){

        session.dialogData.lap_hd_size =
results.response;

        session.beginDialog('date_d');

    },

    function(session,results)

    {

       ticket_no=randomString();

     session.dialogData.d =
builder.EntityRecognizer.resolveTime([results.response]);
 console.log("-----------------",builder.EntityRecognizer.resolveTime([results.response]));
 date_del=String(session.dialogData.d ).replace("12:00:00 GMT+0530 (India Standard Time)","");   

     console.log("in dialog entity___________",order_entity);



     

     session.send(`You request has been recorded:<br/>Ticket no: ${ticket_no}

    <br/>Category: Order place <br/>Entity:${order_entity}<br/>Brand Name:-${session.dialogData.brand_name}<br/>
prcoessor: ${ session.dialogData.lap_processor}<br/>hard
disk:${session.dialogData.lap_hd_size}<br/>Ram
size:${session.dialogData.lap_ram_size}

       <br/>Delivery Date:${date_del}`);

    session.beginDialog("confirm");
   

    }




]).triggerAction({ matches: /(Laptop)\s.*/i
});







//------------------------------------------------------------------




bot.dialog('order place',[

    function(session,args){

        var intent = args.intent.entities;

   console.log("length=====",intent.length);//printing the length of the total entities in the utternece

   console.log("json file========",args);//printing the json reponse

        var entity = builder.EntityRecognizer.findEntity(intent,'hardware');

        console.log("in else entity___________",entity.entity);//printing the single entity

        

        if(entity.entity=='keyboard')

        {

         order_entity=entity.entity;

         session.beginDialog('keyboard_');

        } 

        if(entity.entity=='mouse')

        {

         order_entity=entity.entity;

         session.beginDialog('mouse_');

        } 

        if(entity.entity=='laptop')

        {

         order_entity=entity.entity;

         session.beginDialog('laptop_');

        } 


    }


]).triggerAction( {

    matches: "order place"

    });



 bot.dialog('status', [
  
    function(session, args){
     
     
  
      session.beginDialog('tkt_status');             
         
    }
    
    ])
    .triggerAction( {
    matches: "status"
    });

 bot.dialog('Authentication', [
  
    function(session, args){
     
     
  
      session.beginDialog('email_f_pass');     
  }
    
    ])
    .triggerAction( {
    matches: "Authentication"
    });


 bot.dialog('problems', [
  
  function(session, args){
    var intent = args.intent.entities;
    console.log("json file-----",args);
    console.log("entity------",intent);
    console.log("entity type----",intent[0].type);

    

   if(intent[0].type=='software')
   {
   var entity_soft = builder.EntityRecognizer.findAllEntities(intent, 'software');
   if (entity_soft[0].entity=='microsoft office' || entity_soft[0].entity=='Microsoft Office' || entity_soft[0].entity=='msoffice' || entity_soft[0].entity=='MS Office')
   {
     order_entity=entity_soft[0].entity;
     session.beginDialog('ms_ofice_prob');
   }
   }
  
  }
  
  ])
  .triggerAction( {
  matches: "problems"
  });