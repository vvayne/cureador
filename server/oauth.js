// Meteor.startup(function () {

	ServiceConfiguration.configurations.remove({
		service: "google"
	});
	ServiceConfiguration.configurations.insert({
		service: "google",
		clientId: "676201113985-c09ug0agg1mboqltb2827h5vq916d7nj.apps.googleusercontent.com",
		loginStyle: "popup",
		secret: "arNX_28hIa4NJwAyEwUzSsjm"
	});

// });