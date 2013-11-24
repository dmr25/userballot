'use strict';

userballotApp.controller('SignupCtrl', function($scope, $location, angularFire, angularFireAuth, userballotAuthSvc) {
    $scope.email = '';
    $scope.password = '';
    $scope.domain = '';
    $scope.error = null;
    $scope.domainError = null;
    $scope.emailError = null;

    // authenticate a user
    $scope.register = function() {
	angularFireAuth.createUser($scope.email, $scope.password, function(error, user) {
	    var emailRegex = /[a-zA-Z0-9_.-]+@[A-Za-z0-9]+\.[a-zA-Z0-9]+/;
	    var domainRegex = /((http|https)\:\/\/)?[a-zA-Z0-9_.-]+\.[a-zA-Z0-9]+/;
	    var emailMatch = $scope.email.match(emailRegex);
	    //var domainMatch = $scope.domain.match(domainRegex);

	    $scope.emailError = null;
	    //$scope.domainError = null;

	    if (!error && emailMatch) {
		var site = new Object();
		//site.domain = $scope.domain;
		site.frequency = 10;
		site.allowmute = 1; // Allow muting questions by default
		site.label = "Test";

		site.messages = new Object();
		site.messages['default1'] = createMessage("Would you find a mobile version of our website helpful?");
		site.messages['default2'] = createMessage("Would you recommend our products and service to others?");
		site.messages['default3'] = createMessage("If we asked you to describe what we offer you, would that be easy to do?");

		var sitesRef = new Firebase("https://userballotdb.firebaseio.com/sites");

	  	var siteId = sitesRef.push(site).name();

		var emailId = user.email.replace(/\./g, ',');
		var userRef = new Firebase("https://userballotdb.firebaseio.com/users/");

		var userPromise = angularFire(sitesRef, $scope, 'users');

	  	var sitesObj = new Object();
		sitesObj[siteId] = siteId;


		var newUser = userRef.child(emailId);
	  	newUser.set({email: user.email, sites: sitesObj});

	  	// login the user and redirect to the admin interface
	  	// console.log("User Reg:", user);
	  	$location.path('/admin');
	    } else if ( !(emailMatch) || error.code === 'EMAIL_TAKEN' ) {
		if (!emailMatch)
		    $scope.emailError = "Invalid email.";

		//if (!domainMatch)
		//    $scope.domainError = "Invalid domain.";

		if (error.code === 'EMAIL_TAKEN')
		    $scope.emailError = "Email is already in use. Please login.";
	    } else {
		if ( !(error.code === 'EMAIL_TAKEN') ) {
		    $scope.error = "Registration Error: "  + error.code;
		}
	    }
	});
    };
});

function createMessage(messageText) {
    var message = new Object();
    message['text'] = messageText;
    message['noVotes'] = 0;
    message['yesVotes'] = 0;
    message['views'] = 0;
    message['mute'] = 0;
    message['position'] = 0;
    message['active'] = 0;
    return message;
}

