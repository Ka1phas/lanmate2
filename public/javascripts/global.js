// UserList data array for filling in info box
var userListData = [];

// DOM Ready =====================================================
$(document).ready(function(){

	// Populate the user table on initial pageload
	populateTable();

	// Username link click
	$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

	// Add User button click
	$('#btnAddUser').on('click', addUser);

	// Delete User link click
	$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

	// Modify User link click
	$('#userList table tbody').on('click', 'td a.linkmodifyuser', showModifyUser);
});

// Functions ======================================================

//Fill table with data
function populateTable(){

	// Empty content string
	var tableContent = '';

	// JQuery Ajax call for JSON
	$.getJSON('/users/userlist', function(data){

		userListData = data;

		//For each item in our JSON, add a table row and cells to the content string
		$.each(data, function(){
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</a></td>';
			tableContent += '<td>' + this.email + '</td>';
			tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
			tableContent += '<td><a href="#" class="linkmodifyuser" rel="' + this._id + '">modify</a></td>';
			tableContent += '</tr>';
		});

		// Inject the whole content string into our existing HTML table
		$('#userList table tbody').html(tableContent);
	});
}

// Show User Info
function showUserInfo(event){

	// Prevent Link from firing
	event.preventDefault();

	// Retrieve User Name from link rel attribute
	var thisUserName = $(this).attr('rel');

	// Get Index of item based on id value
	var arrayPosition = userListData.map(function(arrayItem){
		return arrayItem.username;
	}).indexOf(thisUserName);

	//Get our User Object
	var thisUserObject = userListData[arrayPosition];

	//Populate Info box
	$('#userInfoName').text(thisUserObject.fullname);
	$('#userInfoAge').text(thisUserObject.age);
	$('#userInfoGender').text(thisUserObject.gender);
	$('#userInfoLocation').text(thisUserObject.location);
}

// ADD USER
function addUser(event){
	event.preventDefault();

	// Super basic validation - increase errorCount variable if any fields are blank
	var errorCount = 0;
	$('#addUser input').each(function(index, val){
		if($(this).val() == '')errorCount++;
	});

	// Check and make sure that ErrorCount is still zero
	if(errorCount === 0){

		// If it is, compile all user info into one object
		var newUser = {
			'username': $('#addUser fieldset input#inputUserName').val(),
			'email': $('#addUser fieldset input#inputUserEmail').val(),
			'fullname': $('#addUser fieldset input#inputUserFullName').val(),
			'age': $('#addUser fieldset input#inputUserAge').val(),
			'location': $('#addUser fieldset input#inputUserLocation').val(),
			'gender': $('#addUser fieldset input#inputUserGender').val()
		}

		// Use AJAX to post the object to our adduser service
		$.ajax({
			type: 'POST',
			data: newUser,
			url: '/users/adduser',
			dataType: 'JSON'
		}).done(function(response){

			// Check for successful (blank) response
			if(response.msg === ''){

				// Clear the form inputs
				$('#addUser fieldset input').val();

				// Update the table
				populateTable();
			} else {

				// If something goes wrong, alert the error message that our service returned
				alert('Error: ' + response.msg);
			}
		});
	} else {
		// If errorCount is more than 0, error out
		alert('Please fill in all fields');
		return false;
	}
}

// Delete User
function deleteUser(event){

	event.preventDefault();

	// Pop up a confirmation dialogue
	var confirmation = confirm('Are your sure to delete this user?');

	// Check and make sure the user confirmed
	if (confirmation === true) {

		// If they did, do the delete
		$.ajax({
			type: 'DELETE',
			url: '/users/deleteuser/' + $(this).attr('rel')
		}).done(function(response){

			// Check for successful (blank) response
			if(response.msg === ''){

				// Clear the form inputs
				$('#addUser fieldset input').val();

				// Update the table
				populateTable();
			} else {

				// If something goes wrong, alert the error message that our service returned
				alert('Error: ' + response.msg);
			}

		});
	}
}

// Modify User
function showModifyUser(event){

	event.preventDefault();

	// Retrieve User Name from link rel attribute
	var thisUserId = $(this).attr('rel');

	// Get Index of item based on id value
	var arrayPosition = userListData.map(function(arrayItem){
		return arrayItem._id;
	}).indexOf(thisUserId);

	//Get our User Object
	var thisUserObject = userListData[arrayPosition];

	var content = '';
	content += '<h2>Edit User</h2>';
	content += '<form>';
	content += '<fieldset>';
	content += '<input id="modifyUserName" type="text" value="' + thisUserObject.username + '">';
	content += '<input id="modifyUserEmail" type="text" value="' + thisUserObject.email + '">';
	content += '<br>';
	content += '<input id="modifyUserFullName" type="text" value="' + thisUserObject.fullname + '">';
	content += '<input id="modifyUserAge" type="text" value="' + thisUserObject.age + '">';
	content += '<br>';
	content += '<input id="modifyUserLocation" type="text" value="' + thisUserObject.location + '">';
	content += '<input id="modifyUserGender" type="text" value="' + thisUserObject.gender + '">';
	content += '<br>';
	content += '<button id="btnModifyUser">Modify User</button>';
	content += '</fieldset>'
	content += '</form>';

	$('#modifyUser').html(content);

	$('#btnModifyUser').on('click', modifyUser);

	function modifyUser(event){

	event.preventDefault();

	// Super basic validation - increase errorCount variable if any fields are blank
	var errorCount = 0;
	$('#modifyUser input').each(function(index, val){
		if($(this).val() == '')errorCount++;
	});

	if (errorCount === 0){

		// If it is, compile all user info into one object
		var modifiedUser = {
				username: $('#modifyUser fieldset input#modifyUserName').val(),
				email: $('#modifyUser fieldset input#modifyUserEmail').val(),
				fullname: $('#modifyUser fieldset input#modifyUserFullName').val(),
				age: $('#modifyUser fieldset input#modifyUserAge').val(),
				location: $('#modifyUser fieldset input#modifyUserLocation').val(),
				gender: $('#modifyUser fieldset input#modifyUserGender').val()
		}

		// Use AJAX to post the object to our adduser service
		$.ajax({
			type: 'PUT',
			data: modifiedUser,
			url: '/users/modifyuser/' + thisUserId,
			dataType: 'JSON'
		}).done(function(response){

			// Check for successful (blank) response
			if(response.msg === ''){

				// Clear the form inputs and delete them
				$('#modifyUser fieldset input').val();
				$('#modifyUser').html('');

				// Update the table
				populateTable();
			} else {

				// If something goes wrong, alert the error message that our service returned
				alert('Error: ' + response.msg);
			}
		});

	} else {
		// If errorCount is more than 0, error out
		alert('Please fill in all fields');
		return false;
	}
}

}
