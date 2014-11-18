// if the database is empty on server start, create some sample data.


Meteor.startup(function () {
	if (Lists.find().count() === 0) {
      var CreatedAt = new Date();
      Lists.insert({name: "Discover", incompleteCount: 0, Privacy: false, owner: "CureadorTeam@gmail.com", ownerName: "Cureador Team", DiscoverList: true, createdAt: CreatedAt});
	}
});
// Meteor.startup(function () {
//   if (Lists.find().count() === 0) {
//     var data = [
//       {name: "Meteor Principles",
//        todos: ["Data on the Wire",
//          "One Language",
//          "Database Everywhere",
//          "Latency Compensation",
//          "Full Stack Reactivity",
//          "Embrace the Ecosystem",
//          "Simplicity Equals Productivity"
//        ]
//       },
//       {name: "Languages",
//        todos: ["Lisp",
//          "C",
//          "C++",
//          "Python",
//          "Ruby",
//          "JavaScript",
//          "Scala",
//          "Erlang",
//          "6502 Assembly"
//          ]
//       },
//       {name: "Favorite Scientists",
//        todos: ["Ada Lovelace",
//          "Grace Hopper",
//          "Marie Curie",
//          "Carl Friedrich Gauss",
//          "Nikola Tesla",
//          "Claude Shannon"
//        ]
//       }
//     ];
//
//     var timestamp = (new Date()).getTime();
//     _.each(data, function(list) {
//       var list_id = Lists.insert({name: list.name,
//         incompleteCount: list.todos.length});
//
//       _.each(list.todos, function(text) {
//         Todos.insert({listId: list_id,
//                       text: text,
//                       createdAt: new Date(timestamp)});
//         timestamp += 1; // ensure unique timestamp.
//       });
//     });
//   }
// });
