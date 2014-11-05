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
      Meteor.subscribe('privateLists')
    ];
  }
});

Router.map(function() {
  this.route('join');
  this.route('signin');

  this.route('listsShow', {
    path: '/lists/:_id',
    // subscribe to todos before the page is rendered but don't wait on the
    // subscription, we'll just render the todos as they arrive
    onBeforeAction: function() {
      this.todosHandle = Meteor.subscribe('todos', this.params._id);
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
      Router.go('listsShow', Lists.findOne());
      // var pubList = Lists.findOne({Privacy: false});
      // console.log("we are here");
      // console.log(pubList);
      // if (pubList !== null) {
      //   Router.go('listsShow', Lists.findOne({Privacy: false}));
      // } else {
      //   Router.go('join');
      // }

    }
  });
});

if (Meteor.isClient) {
  Router.onBeforeAction('loading', {except: ['join', 'signin']});
  Router.onBeforeAction('dataNotFound', {except: ['join', 'signin']});
}
