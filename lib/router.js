Router.configure({
  // we use the  appBody template to define the layout for the entire app
  layoutTemplate: 'appBody',

  // the appNotFound template is used for unknown routes and missing lists
  notFoundTemplate: 'appNotFound',

  // show the appLoading template whilst the subscriptions below load their data
  loadingTemplate: 'appLoading',

  // wait on the following subscriptions before rendering the page to ensure
  // the data it's expecting is present



  waitOn: function() {
    return [
      Meteor.subscribe('publicLists'),
      Meteor.subscribe('privateLists'),
      // Meteor.subscribe('userData')
    ];
  }
});



Router.map(function() {
  this.route('join');
  this.route('signin');

  // this.route('openBook');

  this.route('listsShow', {
    path: '/lists/:_id',
    // subscribe to todos before the page is rendered but don't wait on the
    // subscription, we'll just render the todos as they arrive
    onBeforeAction: function() {

      console.log(this.params_id);
      this.todosHandle = Meteor.subscribe('todos', this.params._id);
      console.log("yo we finished subscribing dis ");
    },
    data: function() {
      console.log("We are in data");
      console.log(Lists.findOne(this.params._id));
      return Lists.findOne(this.params._id);
    }
  });

  this.route('home', {
    path: '/',
    action: function() {
      // Meteor.subscribe('publicLists');
      // Router.go('listsShow', Lists.findOne({name: "Discover"}));

      // if(Meteor.user()) {
      // // Router.go('listsShow', Lists.findOne());

      // Meteor.subscribe('publicLists');
      // var pubList = Lists.findOne({name: "Discover"});
      // console.log("Why is apploading:" +pubList);
      // if (pubList) {
      //   Router.go('listsShow', Lists.findOne({name: "Discover"}));
      // } else {
      //   Router.go('appLoading');
      // }
    // }
    }
  });
});


if (Meteor.isClient) {
  Router.onBeforeAction('loading', {except: ['join', 'signin']});
  Router.onBeforeAction('dataNotFound', {except: ['join', 'signin']});
}
