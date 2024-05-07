// Auto-run code regarding detecting an account (Remember Me)
let uid = localStorage.getItem("rememberMe");
console.log("Last login was: " + uid);

// Create null DB object <<<<
let myDB;

// Create empty Current Comic for editing
let comicCurrent = "";

// Based on UID, move the view (User) to the correct screen
if(uid === null || uid === undefined || uid === false || uid === "") {
    // There was no user before, so send them to Welcome
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
}); // END Onsen detection

// Detecting an iPhone via ons Object
if (ons.platform.isIPhoneX()) {
    console.log("Detected iPhone");
    document.documentElement.setAttribute('onsflag-iphonex-portrait', '');
    document.documentElement.setAttribute('onsflag-iphonex-landscape', '');
} // END iPhone detection

// Event Listener for running device-only code
function onDeviceReady() {
    console.log("The Device is: " + device.platform);
} // END onDeviceReady()
document.addEventListener("deviceready", onDeviceReady, false);

console.log("App is ready");

// Function to load a screen, based on an ID
function loadPage(pageID) {
    console.log("loadPage() is running");
    console.log("about to load: " + pageID);
    document.getElementById("appNav").bringPageTop(pageID);
} // END loadPage()

// Function to make the Side Menu open
function sideMenuOpen(menuID) {
    console.log("sideMenuOpen() is running");
    console.log("about to open side menu of: " + menuID);
    document.getElementById(menuID).open();
} // END sideMenuOpen() 

// Function to load a screen via side menu
function loadPageViaMenu(pageID) {
    console.log("loadPageViaMenu() is running");
    console.log("about to load this page: " + pageID);
    // Close the menu before moving to a new screen
    document.getElementById("menuCust").close();
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
                document.getElementById("appNav").resetToPage("welcome.html");
                // Set log out data to "Remember Me" - REMOVE it
                localStorage.removeItem("rememberMe");
            break;
            case "Maybe":
                console.log("Maybe, but save, nonethless");
            break;
            default:
                console.log("??????? IDK!");
            break;
        } // END swith()
    }); // END of .confirm().then()
} // END logOut()

// Function for signing up for an account
function signUp() {
    console.log("signUp() is running");

    // Create a pattern for a strong password that requires
    const strongPWD = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\!\@\#\$\^\*])(?=.{7,})");

    // Create variables to read what was in the fields
    let valSignUpEmail = document.querySelector("#signupEmail").value;
    let valSignUpPWD = document.querySelector("#signupPWD").value;
    let valSignUpPWDConf = document.querySelector("#signupPWDConf").value;
    // Create a var to check if they are child or not; default, yes a child
    let valSignUpAge = false;
    // Next read the fields and make a decision 
    if(document.querySelector("#signUpAgeTrue").checked) {
        console.log("Yes, at least 13");
        valSignUpAge = true;
    } else {
        console.log("No, under 13");
        valSignUpAge = false;
    } // END If..Else checking Age of 13+
    console.log(valSignUpEmail, valSignUpPWD, valSignUpPWDConf, valSignUpAge);

    // First, check for strong password
    if(strongPWD.test(valSignUpPWD)){ 
        console.log("TRUE! Password is strong");

        // Next check all fields are filled in
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
                    // Convert the complex Object into a plain String via JSON.stringify(tmpUser)
                    localStorage.setItem(tmpUser._id, JSON.stringify(tmpUser));
                    ons.notification.alert("Account created!");
                    // Clear fields and checkboxes
                    document.getElementById("signupEmail").value = "";
                    document.getElementById("signupPWD").value = "";
                    document.getElementById("signupPWDConf").value = "";
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
                    ons.notification.alert("IDK");
                    break;
            } // END Switch() for account type

            // Set up "Remembe Me" when you log in
            localStorage.setItem("rememberMe", tmpValLoginEmail); 
            initDB(); // Init DB for user that just logged in
        } else {
            ons.notification.alert("Passwords don't match!");
        } // END If.else pwd check
    } // END If..Else account check
} // END logIn()


// Function to initialize a PouchDB database
function initDB() {
    console.log("initDB() is running");
    // Get the current user's email
    let emailForDB = localStorage.getItem("rememberMe");
    // Use the current user's email for DB name
    myDB = new PouchDB(emailForDB);
    // Show some info about the DB
    myDB.info().then(function (result) {
            console.log("DB Info -Name:", result.db_name, "-Docs: " + result.doc_count, "-Updates: " + result.update_seq);
        }).catch(function (err) {
            console.log(err);
        }); // END .info()
    return myDB;
} // END initDB()

// Prepare a comic for storage
function comicPrep() {
    console.log("comicPrep() is running");
    // Get the values of the fields
    let valInputSaveTitle = document.querySelector("#inputSaveTitle").value,
        valInputSaveNumber = document.querySelector("#inputSaveNumber").value,
        valInputSaveYear = document.querySelector("#inputSaveYear").value,
        valInputSaveComment = document.querySelector("#inputSaveComment").value;

    console.log("Collecting data: ", valInputSaveTitle, valInputSaveNumber, valInputSaveYear, valInputSaveComment);

    // Build the _id, lowercaseify and strip out special characters
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
    console.log("Bundled data: " + Object.keys(tmpComic));

    // Return data to rest of app
    return tmpComic;
} // END comicPrep()

// Function to save a comic
function comicSave() {
    console.log("comicSave() is running");

    // Get comic data to save
    let aComic = comicPrep();
    console.log("About to save comic: " + aComic._id);

    // Save the comic to PouchDB
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
    
    // Get all the comic data and alphabetize it
    myDB.allDocs({"ascending":true, "include_docs":true}).then(function (result){
        console.log("Getting comic data: " + result);
        // For first run, no data:
        if(result.rows[0] === undefined) { 
            console.log("First run, no data to display...");
            // Set the header to their email
            let myEmail = localStorage.getItem("rememberMe");
            document.querySelector("#myCollection").innerHTML = myEmail;
            // Add a message to placeholder <div>
            document.querySelector("#divComicTable").innerHTML = "No comics, yet. Save some!";
        } else {
            console.log("Some comics to display: " + result.rows.length);
            let myEmail = localStorage.getItem("rememberMe");
            document.querySelector("#myCollection").innerHTML = myEmail;
            
            // Set up Variable to hold start of Table of comics
            let comicData = "<table> <tr> <th>Title</th> <th>#</th> </tr>";

            // Conditional For loop to create i number of rows based on data .length property
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

            // Display on-screen in placeholder <div>
            document.querySelector("#divComicTable").innerHTML = comicData;

            // Gather list of clickable Rows of comics
            let tableRows = document.querySelectorAll("tr.btnComicInfo");
            // Conditional For Loop to make each one clickable
            // Different from previous; uses "of" based on list of clickable items
            for (let aRow of tableRows) {
                // After click, run comicEditInfo(this) and pass on "this" row info
                aRow.addEventListener("click", function () { comicEditInfo(this); }); 
            } // END FOR loop adding listeners
        } // END If..Else checking no comic data to display
    }).catch(function (err){ console.log("Failure getting comic table data: " + err.message); }); // END .catch()
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