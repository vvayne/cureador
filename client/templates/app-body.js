// var adding_interest = 'adding_interest';
// Session.setDefault(adding_interest,false);

var MENU_KEY = 'menuOpen';
Session.setDefault(MENU_KEY, false);

var USER_MENU_KEY = 'userMenuOpen';
Session.setDefault(USER_MENU_KEY, false);

var SHOW_CONNECTION_ISSUE_KEY = 'showConnectionIssue';
Session.setDefault(SHOW_CONNECTION_ISSUE_KEY, false);

var CONNECTION_ISSUE_TIMEOUT = 1000;

Session.setDefault('adding_interest',false);

Meteor.startup(function () {
  // set up a swipe left / right handler
  $(document.body).touchwipe({
    wipeLeft: function () {
      Session.set(MENU_KEY, false);
    },
    wipeRight: function () {
      Session.set(MENU_KEY, true);
    },
    preventDefaultEvents: false
  });

  // Don't show the connection error box unless we haven't connected within
  // 1 second of app starting
  setTimeout(function () {
    Session.set(SHOW_CONNECTION_ISSUE_KEY, true);
  }, CONNECTION_ISSUE_TIMEOUT);
});

Template.appBody.rendered = function() {
  this.find('#content-container')._uihooks = {
    insertElement: function(node, next) {
      $(node)
        .hide()
        .insertBefore(next)
        .fadeIn();
    },
    removeElement: function(node) {
      $(node).fadeOut(function() {
        this.remove();
      });
    }
  };
};

Template.appBody.helpers({
  // We use #each on an array of one todo so that the "list" template is
  // removed and a new copy is added when changing lists, which is
  // important for animation purposes. #each looks at the _id property of it's
  // todos to know when to insert a new todo and when to update an old one.

  // adding_interest : function() {
  //   return Session.get('adding_interest');
  // },

  thisArray: function() {
    return [this];
  },
  menuOpen: function() {
    return Session.get(MENU_KEY) && 'menu-open';
  },
  cordova: function() {
    return Meteor.isCordova && 'cordova';
  },
  emailLocalPart: function() {
    var email = Meteor.user().emails[0].address;
    return email.substring(0, email.indexOf('@'));
  },
  userMenuOpen: function() {
    return Session.get(USER_MENU_KEY);
  },
  lists: function() {
    return Lists.find();
  },

  accessible: function() {
    var user = Meteor.user().emails[0].address;
    var arr = this.access;
    if (arr !== null) {
      for (var i = 0; i < arr.length; i++) {
          if (arr[i] === user) {
              return true;
          }
      }
    }
    return false;
  },

  publicAccessible: function() {
    if (this.name === "Discover") {
      return this.name === "Discover";
    } else if (this.owner === Meteor.user().emails[0].address && !this.Privacy) {
      return true;
    }

  },

  activeListClass: function() {
    var current = Router.current();
    if (current.route.name === 'listsShow' && current.params._id === this._id) {
      return 'active';
    }
  },
  connected: function() {
    if (Session.get(SHOW_CONNECTION_ISSUE_KEY)) {
      return Meteor.status().connected;
    } else {
      return true;
    }
  }
});

Template.appBody.events({

  'click .js-menu': function() {
    Session.set(MENU_KEY, ! Session.get(MENU_KEY));
  },

  'click .content-overlay': function(event) {
    Session.set(MENU_KEY, false);
    event.preventDefault();
  },

  'click .js-user-menu': function(event) {
    Session.set(USER_MENU_KEY, ! Session.get(USER_MENU_KEY));
    // stop the menu from closing
    event.stopImmediatePropagation();
  },

  'click #menu a': function() {
    Session.set(MENU_KEY, false);
  },

  'click .js-logout': function() {
    Meteor.logout();

    // if we are on a private list, we'll need to go to a public one
    var current = Router.current();
    console.log("Hi, we're logging out!");
    console.log(current.data().userId);
    if (current.route.name === 'listsShow') {
      console.log("We are in the logout function");
      Router.go('home'); //I think this works.
    }
  },

  'click .js-new-list': function() {
     if (! Meteor.user()) {
      return alert("Please sign in or create an account to make lists.");
    }
    var CreatedAt = new Date();

   var list = {name: Lists.defaultName(), incompleteCount: 0, Privacy: true, access:[Meteor.user().emails[0].address], owner: Meteor.user().emails[0].address, createdAt: CreatedAt, DiscoverList: false};
    console.log(list);
    list._id = Lists.insert(list);
    console.log(list);

    Router.go('listsShow', list);
  }
});
