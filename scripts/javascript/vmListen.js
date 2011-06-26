 include("inc_logger.js");           // the logging functions
   include("inc_vmListen.js");         // loading functions
   include("inc_settings_test.js");
   
   var result = "";
   
   if (session.ready()) {
       session.answer();
   
       session.execute("sleep","2000");
       session.sayPhrase("speak", "Welcome to the freeswitch videomail application", "en");
   
       var dir = new File(vmMessageDir + "/" + vmAccount);
   
       var numNewMessages = 0;
       var numOldMessages = 0;
       var currentNewNum = 0;
       var currentOldNum = 0;
       var newMessagesArray = new Array();
       var oldMessagesArray = new Array();
   
   // Reads the voicemail directory and sorts messages
   
       if (dir.isDirectory) {
           var dirContent = dir.list();
           var numFiles = dirContent.length;
   
           for (i = 0; i < numFiles; i++) {
               var contentFile = dirContent[i];
               var strThisFile = contentFile.name;
               var fileName = strThisFile.substring(strThisFile.lastIndexOf("/"),strThisFile.lastIndexOf("."));
               var fileSuffix = strThisFile.substring(strThisFile.lastIndexOf("."));
               fsLogger(i +" FILE ", fileName);
               fsLogger(i +" DATE ", contentFile.creationTime);
               fsLogger("fileSuffix", fileSuffix);
               if (fileSuffix == ".meta") {
                   var infoObj = metaFileRead(vmAccount,fileName);
                   fsLogger("infoObj.heard",infoObj.heard);
                   if (infoObj.heard == "true") {
                       oldMessagesArray[numOldMessages] = fileName;
                       numOldMessages++;
                   } else {
                       newMessagesArray[numNewMessages] = fileName;
                       numNewMessages++;
                   }
               }
           }
       } else {
           fsLogger("", dir.name + " is NOT a directory");
           session.sayPhrase("speak", "No directory was found for this account ", "en");
       }
   
   // Announcement of Message Summary
       announceMessageSummary(numNewMessages, numOldMessages);
   
   // Playback for NEW Messages
   
       if (numNewMessages > 0) {
           while (currentNewNum < numNewMessages) {
               var fileName = newMessagesArray[currentNewNum];
               var vmMessageMeta = fileName + ".meta";
               var infoObj = metaFileRead(vmAccount,fileName);
               currentNewNum++;
               dtmf = session.sayPhrase("speak", "Video Message " + currentNewNum + " Recieved on " + infoObj.createdDate + " at " + infoObj.createdTime
                  + " from " + validateNull(infoObj.callerName) + ", press 1 to play,  press 2 to skip,  press 3 to delete  ", "en", menu_dtmf, "");
               session.execute("sleep","1000");
               if (dtmf == "1") {
                   messagePlay(vmAccount,fileName);
                   messageHeard(infoObj);
               }
               if (dtmf == "2") {
                   session.sayPhrase("speak", "Skipping this message ", "en");
               }
               if (dtmf == "3") {
                   messageDelete(vmAccount,fileName);
               }
           }
           session.sayPhrase("speak", "This is the end of your new messages ", "en");
       } else {
           session.sayPhrase("speak", "Skipping to old messages ", "en");
       }
   
   // Playback for Old Messages
   
       if (numOldMessages > 0) {
           while (currentOldNum < numOldMessages) {
               var fileName = oldMessagesArray[currentOldNum];
               var vmMessageMeta = fileName + ".meta";
               var infoObj = metaFileRead(vmAccount,fileName);
   
               currentOldNum++;
               dtmf = session.sayPhrase("speak", "Video Message " + currentOldNum + " recieved on " + infoObj.createdDate + " at " + infoObj.createdTime
                  + " from " + validateNull(infoObj.callerName) + " press 1 to play,  press 2 to skip,  press 3 to delete  ", "en", menu_dtmf, "");
               session.execute("sleep","1000");
               if (dtmf == "1") {
                   messagePlay(vmAccount,fileName);
               }
               if (dtmf == "2") {
                   session.sayPhrase("speak", "Skipping message ", "en");
               }
               if (dtmf == "3") {
                   messageDelete(vmAccount,fileName);
               }
               session.execute("sleep","2000");
           }
           session.sayPhrase("speak", "No more old messages ", "en");
       } else {
           session.sayPhrase("speak", "No old messages ", "en");
       }
   
       session.execute("sleep","1000");
       session.sayPhrase("speak", "Thanks for using this application", "en");
       session.execute("sleep","1000");
       session.sayPhrase("speak", "Good bye", "en");
       session.hangup;
   }
