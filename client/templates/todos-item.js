// var EDITING_KEY = 'EDITING_TODO_ID';



// Template.todosItem.helpers({
//   checkedClass: function() {
//     return this.checked && 'checked';
//   },
//   editingClass: function() {
//     return Session.equals(EDITING_KEY, this._id) && 'editing';
//   }
// });

// Template.todosItem.events({

// Template.listsShow.events({
//   'click .addInterest':function(evt,tmpl){
//     evt.preventDefault();
//     Session.set('adding_interest',true);
//   }
// })

Template.addform.events({

  'click .save':function(evt,tmpl){
    var thoughts = tmpl.find('.thoughts').value;
    var name = tmpl.find('.name').value;
    var url= tmpl.find('.src').value;
    // var height = getRandomInt(100,1000);
    Todos.insert({name:name,thoughts:thoughts,src:url,height:1000,width:'25%',listId: this._id,});
    Lists.update(this._id, {$inc: {incompleteCount: 1}});
    Session.set('adding_interest',false);
  },
  'click .cancel':function(evt,tmpl){
    Session.set('adding_interest',false);
  },
  'click .close':function(evt,tmp){
    Session.set('adding_interest',false);
  }
});
  // 'change [type=checkbox]': function(event) {
  //   var checked = $(event.target).is(':checked');
  //   Todos.update(this._id, {$set: {checked: checked}});
  //   Lists.update(this.listId, {$inc: {incompleteCount: checked ? -1 : 1}});
  // },

  // 'focus input[type=text]': function(event) {
  //   Session.set(EDITING_KEY, this._id);
  // },
  //
  // 'blur input[type=text]': function(event) {
  //   if (Session.equals(EDITING_KEY, this._id))
  //     Session.set(EDITING_KEY, null);
  // },
  //
  // 'keydown input[type=text]': function(event) {
  //   // ESC or ENTER
  //   if (event.which === 27 || event.which === 13) {
  //     event.preventDefault();
  //     event.target.blur();
  //   }
  // },
  //
  // // update the text of the item on keypress but throttle the event to ensure
  // // we don't flood the server with updates (handles the event at most once
  // // every 300ms)
  // 'keyup input[type=text]': _.throttle(function(event) {
  //   Todos.update(this._id, {$set: {text: event.target.value}});
  // }, 300),

  // handle mousedown otherwise the blur handler above will swallow the click
  // on iOS, we still require the click event so handle both
Template.todo.events({
  'mousedown .js-delete-item, click .js-delete-item': function() {
    Todos.remove(this._id);
    if (! this.checked)
      Lists.update(this.listId, {$inc: {incompleteCount: -1}});
  }
});
