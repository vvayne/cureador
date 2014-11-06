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
    console.log("We're waiting");
    return [
      Meteor.subscribe('publicLists'),
      Meteor.subscribe('privateLists')
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
      console.log("Hi, we're here");
      console.log(this.params._id);
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
      if(Meteor.user()) {
      // Router.go('listsShow', Lists.findOne());
      console.log("we are at home, looking for an open Privacy thing");
      var pubList = Lists.findOne({Privacy: false});
      if (pubList) {
        console.log(pubList);
        Router.go('listsShow', Lists.findOne({Privacy: false}));
      }
    }
      else {
           Router.go('join');
      }

      // Router.go('listsShow', Lists.findOne({Privacy: false}));

    }
  });
});

if (Meteor.isClient) {
  Router.onBeforeAction('loading', {except: ['join', 'signin']});
  Router.onBeforeAction('dataNotFound', {except: ['join', 'signin']});
}
