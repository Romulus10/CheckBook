// Main app
// Uses https://github.com/knadh/localStorageDB for database functionality.

var current_account;
var lib;
var total;
var version = "0.1.0.0"
var date = "7/12/16"

// From Douglas Crockford's Remedial JavaScript
String.prototype.supplant = function (o) {
    return this.replace(/{([^{}]*)}/g,
        function (a, b) {
            var r = o[b];
            return typeof r === 'string' || typeof r === 'number' ? r : a;
        }
    );
};

window.onload = function(){
	total = 0;
	count = 0;
	document.getElementById("account").innerHTML = "None";
	document.getElementById("total").innerHTML = "$0";
	document.getElementById("version").innerHTML = version;
	document.getElementById("date").innerHTML = date;
	lib = new localStorageDB("library", localStorage);
	if (lib.isNew()){
		console.log("First time launching.");
	}
	else{
		console.log("Database already exists.");
	}
	alert("Offline use of this app is not yet supported.");
	var cook = document.cookie;
	if (cook != ("version=" + version)){
	    var appCache = window.applicationCache;
	    console.log(appCache.status());
         appCache.update();
     if (appCache.status == window.applicationCache.UPDATEREADY) {
         appCache.swapCache();
     }
     document.cookie = "version=" + version;
     }
}

newTable = function(){
	var name = prompt("New Account Name:");
	current_account = name;
	document.getElementById("account").innerHTML = name;
	document.getElementById("total").innerHTML = "$0.00";
	try{
		lib.createTable(name, ["name", "category", "date", "amount"]);
	}
	catch(err){
		console.log(err);
		alert("Account " + name + " already exists.");
	}
	lib.commit();
	console.log("Account " + name + " created.");
	checkDatabase();
}

addTransaction = function(){
	console.log("Adding new transaction to database.");
	var n = prompt("Transaction name:");
	var c = prompt("Transaction category:");
	var d = prompt("Transaction date:");
	var a = prompt("Amount:");
	total = parseFloat(total) + parseFloat(a);
	lib.insert(current_account, {name: n, category: c, date: d, amount: a})
	lib.commit();
	checkDatabase();
}

delTransaction = function(){
	console.log("Removing transaction from database.");
	var checked = [];
	console.log(checked);
	for (var i = 0; i < checked.length; i++){
		lib.deleteRows(current_account, {ID: checked[i]});
	}
	lib.commit();
	checkDatabase();
}

checkDatabase = function(){
	var full = lib.queryAll(current_account);
	var len = full.length;
	var string = "";
	for (var i = 0; i < len; i++){
		console.log(full[i]);
		string += "<input type=checkbox>{0}    {1}    {2}    {3}<br>".supplant([full[i].name, full[i].category, full[i].date, full[i].amount]);
	}
	document.getElementById("transactions").innerHTML = string;
	document.getElementById("total").innerHTML = "$" + total;
}

switchAccount = function(){
	var name = prompt("Switch to Account:");
	current_account = name;
	document.getElementById("account").innerHTML = name;
	document.getElementById("total").innerHTML = "$0.00";
	checkDatabase();
}

reset = function(){
	console.log("Displaying reset dialog.");
	var choose = confirm("This will delete ALL app data. Are you sure you want to continue?");
	if (choose){
		console.log("Reset.");
		localStorage.clear();
	}
	else{
		console.log("Reset cancelled.");
	}
}