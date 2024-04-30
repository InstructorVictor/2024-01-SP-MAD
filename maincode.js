// Auto-run code regarding detecting an account (Remember Me)
// So, not in a Function
// Check localStorage for what's in "Remember Me"
let uid = localStorage.getItem("rememberMe");
console.log("Last login was: " + uid);

// Create null DB object <<<<
let myDB;

// Create empty Current Comic
let comicCurrent = "";

// Based on UID, move the view (User) to the right screen
if(uid === null || uid === undefined || uid === false || uid === "") {
    // There was no user before, so send them to WElcome
    loadPage("welcome.html");
} else {
    // Load the profile data from localstorage, .parse() it to use it
    let tmpLoginUser = JSON.parse(localStorage.getItem(uid));

    // There is an account, so send them to their correct home screen, via Switch
    switch(tmpLoginUser.age) {
        case "Admin":
            console.log("Admin just logged in");
            loadPage("homeAdmin.html");
            initDB(); 
            break;
        case false: 
            console.log("Kid logged in");
            loadPage("homeKids.html");
            initDB();
            break;
        case true:
            console.log("Grown up logged in")
            loadPage("homeCust.html"); // Init DB for user, auto
            initDB();
            break;
        default: 
            console.log("trigged default somehow!");
            ons.notification.alert("???");
            break;
    } // END Switch()
} // END If..Else Auto-login

// Detect when Onsen UI is read to be used
ons.ready(function() {
    console.log("Onsen UI is ready!");
});

// One possible way to detect a device,
// so that certain runs (or not) per device
if (ons.platform.isIPhoneX()) {
    document.documentElement.setAttribute('onsflag-iphonex-portrait', '');
    document.documentElement.setAttribute('onsflag-iphonex-landscape', '');
}

console.log("App is ready");

// Function to load a page, based on an ID
// This type of code (a function) only runs when something makes it run
function loadPage(pageID) {
    console.log("loadPage() is running");
    console.log("about to load: " + pageID);
    // Using the Onsen UI Stack ("appNav") load/display a new page/screen
    // .getElementById() is plain old JS POJS
    // .bringPageTop() is Onsen-specific code: 
    document.getElementById("appNav").bringPageTop(pageID);
} // END loadPage()

// For testing purposes: add a "hard coded" landing page
// So, MUST be removed, once we create "Remember Me" code 
// zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz
// loadPage("welcome.html");

// Function to make the Side Menu open
function sideMenuOpen(menuID) {
    console.log("sideMenuOpen() is running");
    console.log("about to open side menu of: " + menuID);
    // Now open the menu in question
    document.getElementById(menuID).open();
} // END sideMenuOpen() 

// Function to set up navigation via side menu
function loadPageViaMenu(pageID) {
    console.log("loadPageViaMenu() is running");
    console.log("about to load this page: " + pageID);
    // Close the menu before moving to a new screen
    // To-do: make it smarter to know WHICH menu to close
    document.getElementById("menuCust").close();
    // And then load the page in question ORIGINAL 
    // document.getElementById("appNav").bringPageTop(pageID);
            // with promise
        document.getElementById("appNav").bringPageTop(pageID).then(function (result) {
                console.log("Loaded: " + result.id);
                if(result.id === "homeCustCollection") { 
                    console.log("Moved to Collection screen");
                    // Show table of comics
                    comicTable(); // Table clickability is in comicTable()
                } else { 
                    console.log("Moved to a non-Collection screen");
                }; // END If..Else detect Collection screen
            }).catch(function (err){console.log("Error: " + err)}); // END .bringPageTop() with JS Promise
} // END loadPageViaMenu() {

// Function to log out
function logOut() {
    console.log("logOut() is running");
    // To-do list for this Fn:
    // Confirm log out? Save any unsaved data/products/history/etc
    // Play a sound? Vibrate? 

    // Using the SWITCH (conditional statement) to confirm a logout...
    // Made from swith() and each possiblity is a case (with colon)
    //  that ends with break;
    // Basic JS Confirm box is too basic
    // window.confirm();
    // Using the Onsen UI Confrim box, to tap into the switch()
    ons.notification.confirm("Are you sure you want to log out?").then(function (response){ 
                    switch(response){
                        case 0:
                            console.log("do not want to log out");
                            // To-do: navigator.vibrate(1000); // remember to activate plugin
                        break;

                        case 1:
                            console.log("YES log out");
                            document.getElementById("menuCust").close();
                            document.getElementById("menuAdmin").close();
                            document.getElementById("menuKids").close();
                            // Clear HISTORY! va .resetToPage (instead of bringPageTop())
                            document.getElementById("appNav").resetToPage("welcome.html");
                            // Set log out data to "Remember Me" - REMOVE it
                            localStorage.removeItem("rememberMe");
                            // Alternative, "empty" it
                            // localStorage.setItem("rememberMe", "");
                            // .setItem() creates or replaces data @ a mem location
                        break;

                        case "Maybe":
                            console.log("Maybe, but save, nonethless");
                        break;

                        default:
                        // For an unknown possiblity
                            console.log("??????? IDK!");
                        break;
                    } // END swith()

    }); // END of .confirm().then()
} // END logOut()

// Fuctnion for SignU p
function signUp() {
    console.log("signUp() is running");

    // Create a pattern for a strong password that requires
    // [a-z] any characters form a - z LC
    // [A-Z]any characters form A - Z UC
    // [0-9] any numbers
    // [!@#%:] 
    const strongPWD = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\!\@\#\$\^\*])(?=.{7,})");

    // Create variables to read what was in the fields
    let valSignUpEmail = document.querySelector("#signupEmail").value;
    let valSignUpPWD = document.querySelector("#signupPWD").value;
    let valSignUpPWDConf = document.querySelector("#signupPWDConf").value;
    // Create a var to check if they are child or not; default, yes a child
    let valSignUpAge = false;
    // Next read the fields and make a decisiion
    if(document.querySelector("#signUpAgeTrue").checked) {
        console.log("Yes, at least 13");
        valSignUpAge = true;
    } else {
        console.log("No, under 13");
        valSignUpAge = false;
    } // END If..Else checking Age of 13+

    console.log(valSignUpEmail, valSignUpPWD, valSignUpPWDConf, valSignUpAge);

    // First check for strong password
    if(strongPWD.test(valSignUpPWD)){ 
        console.log("TRUE! Password is strong");

        // Next check all fields are completed
        if(valSignUpEmail === "" || valSignUpPWD === "" || valSignUpPWDConf === "") { 
            ons.notification.alert("Please fill all fields!");
        } else {
            // Next check if PWD matches Confirm PWD
            if(valSignUpPWD !== valSignUpPWDConf) { 
                ons.notification.alert("Passwords don't match!");
                document.getElementById("signupPWD").value = "";
                document.getElementById("signupPWDConf").value = "";
            } else { 
               // Next check if account already exists or not in localStorage
               // But first lowercase-ify the email for usability
               let tmpValSignUpEmail = valSignUpEmail.toLowerCase();
                if(localStorage.getItem(tmpValSignUpEmail) === null) { 
                    console.log("New account to create: " + tmpValSignUpEmail);
                    // Before we save the profile data, bundle it in JSON format
                    let tmpUser = {
                        "_id" : tmpValSignUpEmail,
                        "pwd" : valSignUpPWD,
                        "age" : valSignUpAge
                    };
                     // Covert the complex Object into a plain String via JSON.stringify(tmpUser)
                    // So set aside a memory loc for this user profile
                    // save the complex data as a "simple" string
                    localStorage.setItem(tmpUser._id, JSON.stringify(tmpUser));
                    ons.notification.alert("Account created!");
                    document.getElementById("signupEmail").value = "";
                    document.getElementById("signupPWD").value = "";
                    document.getElementById("signupPWDConf").value = "";
                    // And clear checkboxes
                    document.getElementById("signUpAgeTrue").checked = false;
                    document.getElementById("signUpAgeFalse").checked = false;
                } else {
                    ons.notification.alert("You already have an account");
                } // END If..Else checking if account exists or not
            } // END If.Else checking PWD matches
        } // END If..Else checking if all complete
    } else {
        console.log("FALSE! password is weak");
        ons.notification.alert("Weak password!");
    } // END of If..Else to check PWD strength
} // END signUp()

// Function to Log In
function logIn() {
    console.log("logIn() is running");
    // Read the fields, and lowercase-ify the email
    let valLoginEmail = document.querySelector("#loginEmail").value;
    let valLoginPWD = document.querySelector("#loginPassword").value;
    let tmpValLoginEmail = valLoginEmail.toLowerCase();
    console.log(valLoginEmail, valLoginPWD, tmpValLoginEmail);

    // First, check if account exists in localStoarage
    if(localStorage.getItem(tmpValLoginEmail) === null) { 
        ons.notification.alert("Account doesn't exist!");
    } else {
        // Get the user profile data from localstorage
        let tmpLoginUser = JSON.parse(localStorage.getItem(tmpValLoginEmail));
        console.log("About to log in");
        // Next check if password matches
        if(valLoginPWD === tmpLoginUser.pwd){
            // Now detect if Kids account or not, and send to correct screen
            switch(tmpLoginUser.age) {
                case true: 
                    // So move us to the Customer screen, with no history
                    document.getElementById("appNav").resetToPage("homeCust.html");
                    break;
                case false: 
                    // So move us to the Kids screen, with no history
                    document.getElementById("appNav").resetToPage("homeKids.html");
                    break;
                case "Admin":
                    // So move us to the Admin screen, with no history
                    document.getElementById("appNav").resetToPage("homeAdmin.html");
                    break;
                default:
                    // Some possibility I can't even think of!
                    ons.notification.alert("IDK");
                    break;
            } // END Switch() for account type

            // Set up "Remembe Me" when you log in
            localStorage.setItem("rememberMe", tmpValLoginEmail); 
            initDB(); // Init DB for user <<<<<<
        } else {
            ons.notification.alert("Passwords don't match!");
        } // END If.else pwd check
    } // END If..Else account check
} // END logIn()

/*
    Notes on saving data:
    Cache - temporary storage as your app runs; stores simple data; easy; not great for apps
    Cookie - more-permanent; simple data; easy; not great for apps
    localStorage - permament; more-complex data (with tricks); less-easy; great for apps
                    ; profiles (harder); "remember me"; simple user account
    DBs - permament; complex data; not-easy; best for apps; profiles
        WebSQL; IndexDB; MonogoDB; MariaDB; PouchDB; CouchDB - NoSQL DB - No-infrastructure needed
        (NOT MySQL, SQL, Oracle, FoxPro, ) - Classic DB - Infrastructure
*/

/*
    Notes on Remember Me feature
    #1 When the app starts, check who last logged in, so you can
        send people to the right place at start
    #2 When you log in, keep track of who logged in, so you can set a localStorage
        data of who the last person was, which ties into #3 (also ties into #1)
    #3 When you log out (switch accounts), keep track of who that is, so you can
        delete (or clear) that bit of memory, which ties into #1
*/

/*
// POUCHDB TESTING
let db1 = new PouchDB("data1");
let appNow = JSON.stringify(new Date());
console.log("App time is: " + appNow);
let tmpInfo1 = {
    "_id" : appNow,
    "note" : uid
};

db1.put(tmpInfo1).then(function (response) {
  console.log("updated app: " + response.rev);
}).catch(function (err) {
  console.log("got an error:" + err);
});
*/

// ------------------------- NEW
// Function to initialize a PouchDB database
function initDB() {
console.log("initDB() is running");
let emailForDB = localStorage.getItem("rememberMe");
myDB = new PouchDB(emailForDB);
myDB.info().then(function (result) {
        console.log("DB Info -Name:", result.db_name, "-Docs: " + result.doc_count, "-Updates: " + result.update_seq);
    }).catch(function (err) {
        console.log(err);
    });
return myDB;
} // END initDB()

function comicPrep() {
    console.log("comicPrep() is running");
    // Get the values of the fields
    let valInputSaveTitle = document.querySelector("#inputSaveTitle").value,
        valInputSaveNumber = document.querySelector("#inputSaveNumber").value,
        valInputSaveYear = document.querySelector("#inputSaveYear").value,
        valInputSaveComment = document.querySelector("#inputSaveComment").value;

    console.log("Collecting data: ", valInputSaveTitle, valInputSaveNumber, valInputSaveYear, valInputSaveComment);

    // Build the _id
    let tmpTmpComic = valInputSaveTitle.replace(/\W/g, "").toLowerCase() + valInputSaveYear + valInputSaveNumber;

    // Bundle the data via JSON
    let tmpComic = {
        "_id" : tmpTmpComic,
        "cTitle" : valInputSaveTitle,
        "cYear" : valInputSaveYear,
        "cNumber" : valInputSaveNumber,
        "cComment" : valInputSaveComment
    }; // END JSON data

    // Check bundle
    console.log("Bundled data: " + tmpComic);

    // Return data to rest of app
    return tmpComic;
} // END comicPrep()

function comicSave() {
    console.log("comicSave() is running");

    // Get comic data to save
    let aComic = comicPrep();
    console.log("About to save comic: " + aComic._id);

    myDB.put(aComic).then(function (result) {
        console.log("Saved comic: " + result.ok);
        ons.notification.alert("Comic Saved!");
        document.querySelector("#inputSaveTitle").value = "";
        document.querySelector("#inputSaveNumber").value = "";
        document.querySelector("#inputSaveYear").value = "";
        document.querySelector("#inputSaveComment").value = "";
        // Update Comic Table
        comicTable();
    }).catch(function (err) {
        console.log(err.message);
        ons.notification.alert("You already saved that comic!");
    }); // END .put() data
} // END comicSave()

// Show table of comics
function comicTable() {
    console.log("comicTable() is running");
    myDB.allDocs({"ascending":true, "include_docs":true}).then(function (result){
        console.log("Getting comic data: " + result);
        // For first run, no data:
        if(result.rows[0] === undefined) { 
            console.log("First run, no data to display...");
            // Set the header to their email
            let myEmail = localStorage.getItem("rememberMe");
            document.querySelector("#myCollection").innerHTML = myEmail;
            // Add a message to empty <div>
            document.querySelector("#divComicTable").innerHTML = "No comics, yet. Save some!";
        } else {
            console.log("Some comics to display: " + result.rows.length);
            let myEmail = localStorage.getItem("rememberMe");
            document.querySelector("#myCollection").innerHTML = myEmail;
            // Set up Variable to hold start of Table of comics
            let comicData = "<table> <tr> <th>Title</th> <th>#</th> </tr>";

            // Conditional For loop to create X number of rows based on data .length property
            for(let i = 0; i < result.rows.length; i++) {
                // Be very careful of opening closing "" and ''  and +=
                // Embed a Class on each <tr> for clickability later
                // Embed a unique ID based on the _id of the comic from Pouch
                comicData += "<tr class='btnComicInfo' id='" + result.rows[i].doc._id + "'>" + 
                            "<td>" + result.rows[i].doc.cTitle + "</td>" + 
                            "<td>" + result.rows[i].doc.cNumber + "</td>" +
                        "</tr>";
            } // END For loop of comics rows

            // Complete the <table>
            comicData += "</table>";

            // Display on-screen in empty <div>
            document.querySelector("#divComicTable").innerHTML = comicData;

            // Set up <table> clickablity // NOT needed actually
            // let clickComicTable = document.querySelector("#divComicTable");

            // Gather list of clickable Rows of comics
            let tableRows = document.querySelectorAll("tr.btnComicInfo");
            // Conditional For Loop to make each one clickable
            // Different from previous; uses "of" based on list of clickable items
            for (let aRow of tableRows) {
                // After click, run comicEditInfo(this) and pass on "this" row info
                aRow.addEventListener("click", function () { comicEditInfo(this); }); 
            } // END FOR loop adding listeners

        } // END If..Else checking no comic data to display
    }).catch( function (err){ console.log("Failure getting comic table data: " + err.message); }); // END .catch()
} // END comicTable()

// Subroutine to delete entire DB
function comicDeleteCollection() {
    console.log("comicDeleteCollection() is running");
    // Check to confirm
    ons.notification.confirm("Are you sure you want to delete your whole collection?").then(function (response) {
        switch(response) {
            case 0: 
                console.log("Canceled ONCE");
            break;
            case 1:
                console.log("Check again");
                // DOUBLE check
                ons.notification.confirm("Are you sure? THERE IS NO UNDO!").then(function (response) {
                    switch(response) {
                        case 0:
                            console.log("Second cancel");
                        break;
                        case 1:
                            console.log("Starting to delete DB");
                            // PouchDB code to delete DB
                            myDB.destroy().then(function (result){
                                console.log("Db DELETED: " + result.ok);
                                // Re-initialize database
                                initDB();
                                ons.notification.alert("All comics are gone!");
                            }).catch(function (err){console.log("ERROR: " + err.message);}); // END .destroy()
                        break;
                    } // Deal with delete DB
                }); // END second delete confirm
            break;
        } // END Switch() confirm
    }); // END first delete confirm
}// END comicDeleteCollection

// Function to make comic info Modal popup, for edits, etc
// Uses id of currently-clicked row (see tableRow.addEventListener("click", function () { comicEditInfo(this); }); 
// in comicTable() Function for .addEventListener of dynamically-created content
function comicEditInfo(thisRow) {
    console.log("comicEditInfo is running");
    console.log("Clicked this ID:", thisRow.id);

    // Get this Comic's details; note, different (result) [now (comic)], to differentiate
    myDB.get(thisRow.id).then(function (comic){
        console.log("Comic details:", comic._id, Object.keys(comic));
        // Then run dialog box popup code
        // Create var to hold comic details dialog box
        let popComicDetail = document.querySelector("#comicDetail");
        // Conditional statement to show existing or new popup
        if(popComicDetail) {
            // Already exists in DOM, populate fields
            document.querySelector("#inputEditTitle").value = comic.cTitle;
            document.querySelector("#inputEditYear").value = comic.cYear;
            document.querySelector("#inputEditNumber").value = comic.cNumber;
            document.querySelector("#inputEditComment").value = comic.cComment;
            // Already exists in DOM, show popup
            popComicDetail.show();
            // Update Current Comic
            comicCurrent = comic._id;
        } else {
            // Doesn't exist on DOM, so create then, populate fields, then show popup
            ons.createElement("comicDetail.html", {"append":true}).then(function (result){
                // Populate fields
                document.querySelector("#inputEditTitle").value = comic.cTitle;
                document.querySelector("#inputEditYear").value = comic.cYear;
                document.querySelector("#inputEditNumber").value = comic.cNumber;
                document.querySelector("#inputEditComment").value = comic.cComment;
                // Now exists in DOM, show popup
                result.show();
                // Update Current Comic
                comicCurrent = comic._id;
            }); // END .createElement()
        } // END If..Else to show dialog
    }).catch(function (err){console.log("Error getting comic details:" + err);});
} // END comicEditInfo()

// Function to close the comic details popup
function comicEditInfoClose() {
    console.log("Closed the Comic popup");
    document.querySelector("#comicDetail").hide();
} // END comicEditInfoClose();

// Function to delete comic we are currently viewing; uses comicCurrent global variable
function comicEditDelete() {
    console.log("About to delete: " + comicCurrent);
    // First .get() the current comic .then() we .remove() it [note use of (comic)]
    myDB.get(comicCurrent).then(function (comic){
        ons.notification.confirm("Are you sure you want to delete this comic?").then(function (response){
            // Conditional Switch between responses
            switch(response) {
                case 0:
                    console.log("Canceled comic delete");
                break;
                case 1:
                    //return myDB.remove(comic).then(function (result){  // Uses return from docs, but makes break unreachable
                    myDB.remove(comic).then(function (result){
                        console.log("Single comic deleted: " + result.ok);
                        // Redraw table
                        comicTable();
                        // Close comic info popup
                        comicEditInfoClose();
                        // Clear current comic
                        comicCurrent = "";
                    }); // END .remove()
                break;
            } // END switch()
        }); // END .confirm() to delete
    }).catch(function (err){console.log("Error in getting to delete: " + err);});
} // END comicEditDelete()

// Function to edit the comic we are currently viewing; uses comicCurrent global variable
function comicEditUpdate() {
    console.log("About to update: " + comicCurrent);

    // Read all the inputs in the current comic popup
    let valInputEditTitle = document.querySelector("#inputEditTitle").value,
        valInputEditYear = document.querySelector("#inputEditYear").value,
        valInputEditNumber = document.querySelector("#inputEditNumber").value,
        valInputEditComment = document.querySelector("#inputEditComment").value;
    console.log("Edits", valInputEditTitle, valInputEditYear, valInputEditNumber, valInputEditComment);

    // Get the current _id and _rev to make changes [note (comic)]
    myDB.get(comicCurrent).then(function (comic){
        myDB.put(
            {
                "_id": comic._id,
                "_rev": comic._rev,
                "cTitle": valInputEditTitle,
                "cYear": valInputEditYear,
                "cNumber": valInputEditNumber,
                "cComment": valInputEditComment
            }
        ).then(function (result){
            console.log("Updated comic: " + result.ok, result.rev);
            // Redraw table
            comicTable();
            // Close popup
            comicEditInfoClose();
        });
    }).catch(function (err){console.log("Error updating comic:" + err);});
} // END comicEditUpdae()


// Event Listener for running device-only code
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    console.log("!!!!!!!!!!!!!!The Device is: " + device.platform);

} // END onDeviceReady()