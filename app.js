// Main app
// Uses https://github.com/knadh/localStorageDB for database functionality.

var current_account;
var lib;
var total;

window.onload = function(){
	total = 0;
	count = 0;
	document.getElementById("account").innerHTML = "None";
	document.getElementById("total").innerHTML = "$0.00";
	lib = new localStorageDB("library", localStorage);
	if (lib.isNew()){
		console.log("First time launching.");
	}
	else{
		console.log("Database already exists.");
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
	var checked = document.querySelector('Checkbox:checked').value;
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
	for (var i = 0; i < len; i++){
		console.log(full[i]);
	}
	document.getElementById("total").innerHTML = "$" + total;
}

switchAccount = function(){
	var name = prompt("Switch to Account:");
	current_account = name;
	document.getElementById("account").innerHTML = name;
	document.getElementById("total").innerHTML = "$0.00";
	checkDatabase();
}