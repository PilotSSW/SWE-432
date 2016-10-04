//extend jQuery to get Max z-index Value for organizing the Sticky Notes
jQuery.fn.extend({
    getMaxZ: function() {
        return Math.max.apply(null, jQuery(this).map(function() {
            var z;
            return isNaN(z = parseInt(jQuery(this).css("z-index"), 10)) ? 0 : z;
        }));
    }
});
$(function() {
	//Initialize Things for the app to be functional

	//Creating the firebase reference.
    //var firebaseref = new Firebase("https://unityos-test.firebaseio.com/");

    var firebaseref = {
      apiKey: "AIzaSyCHpRD4BENRYrTyKsGHr4jJ_OIjFdkUN5I",
      authDomain: "unityos-test.firebaseapp.com",
      databaseURL: "https://unityos-test.firebaseio.com",
      storageBucket: "unityos-test.appspot.com",
      messagingSenderId: "872968420167"
    };
    firebase.initializeApp(firebaseref);

	//Global Variables for userData and the firebase reference to the list.
  var listRef = null;
	var userData = null;

	//timer is used for few animations for the status messages.
	var timer = null;

	//Clear the Status block for showing the Status of Firebase Calls
    $(".status").removeClass('hide').hide();

	//Routing for the Tabs in the navbar
    goToTab = function(tabname) {
        if (tabname == "#lists") {
            if (userData === null) tabname = "#login";
        }
        $(".nav.navbar-nav > li > a").parent().removeClass('active');
        $(".nav.navbar-nav > li > a[data-target='" + tabname + "']").parent().addClass('active');
        $(".tab").addClass('hide');
        $(".tab" + tabname).removeClass('hide');
    }

	/*
	*Bind Events to the list item to provide more functionality.
	*You can extend this function to add more things like a Status button to mark items (for creating something like Trello!)
	*/
    var bindEventsToItems = function($listItem) {
        $listItem.draggable({
            containment: "#sharedlist",
            start: function() {
                var topzindex = $("#sharedlist li").getMaxZ() + 1;
                $(this).css('z-index', topzindex);
            },
            stop: function() {
                addCSSStringToItem($(this).attr('data-item-id'), $(this).attr('style'));
            }

        }).css('position', 'absolute');

        $listItem.find(".removebtn").on('click', function() {
            removeItemFromFirebase($(this).closest("[data-item-id]").attr('data-item-id'));
        });
    }

	//Some Utility Functions for making things pop!
	//In this app I am creating the list item at random position and with random color
	function randomIntFromInterval(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	function getRandomRolor() {
		var letters = '0123456789'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++) {
			var random = Math.round(Math.random() * 10);
			if (random == 10) random = 9;
			color += letters[random];
		}
		return color;
	}

	//Create a new list item with the data sent by firebase.
    var buildNewListItem = function(listItem, key) {
        var author = listItem.author;
        var content = listItem.content;
        var timestamp = listItem.timestamp;
        var id = key;
        var css = listItem.css;
        var $newListItem = $("<li data-item-id='" + id + "'></li>").html("<p class='itemauthor'>Added By - " + author +
            "<span class='removebtn'><i class='fa fa-remove'></i></span> " +
            "<span class='time'> on " + timestamp + "</span></p><p class='itemtext'>" + content + "</p>");
        $newListItem.prependTo($("#sharedlist"));
        $newListItem.attr('style', css);
        //$("#sharedlist").prepend($newListItem);
        bindEventsToItems($newListItem);
    }

	//Update Existing List Items(I am changing the CSS here to update the position of the list items)
    var updateListItem = function(listItem, key) {
        var author = listItem.author;
        var content = listItem.content;
        var timestamp = listItem.timestamp;
        var id = key;
        var css = listItem.css;
        $("#lists [data-item-id='" + id + "']").attr('style', css);
    }

	//Remove List Item from the page
    var removeListItem = function(key) {
        $("#lists [data-item-id='" + key + "']").remove();
    }


	//This function is called when a new child is added in Firebase. It calls buildNewListItem to add item to the page.
    var childAddedFunction = function(snapshot) {
        var key = snapshot.key();
        var listItem = snapshot.val();
        buildNewListItem(listItem, key);
        $("#lists .status").fadeIn(400).html('New item added!')
        if (timer) clearTimeout(timer);
        timer = setTimeout(function() {
            $("#lists .status").fadeOut(400);
        }, 2500);
    }

	//This function is called when an existing child is changed in Firebase. It calls updateListItem to change the css of the item on the page.
    var childChangedFunction = function(snapshot) {
        var listItem = snapshot.val();
        var key = snapshot.key();
        console.log("Key - " + key + " has been changed");
        console.log(listItem);
        updateListItem(listItem, key);
    }

	//This function is called when an existing child is removed from Firebase. It calls removeListItem to delete the item from the page.
    var childRemovedFunction = function(snapshot) {
        var key = snapshot.key();
		removeListItem(key)
        console.log('Child Removed');
    }

	//Setting the 3 firebase events to call different functions that handle the specific functionality of the app.
    var setUpFirebaseEvents = function() {
        //listRef = new Firebase('https://unityos-test.firebaseio.com/lists/sharedlist/items');
        //Updated to latest SDK 3.4
         listRef = firebase.database().ref("lists/sharedlist/items/");

        $("#sharedlist").html('');
        listRef.off('child_added', childAddedFunction)
        listRef.on("child_added", childAddedFunction);

        listRef.off('child_changed', childChangedFunction);
        listRef.on('child_changed', childChangedFunction);

        listRef.off('child_removed', childRemovedFunction);
        listRef.on('child_removed', childRemovedFunction);
    }

	//This function is a callback for ref.onAuth() and is triggered every time the login status of the user changes.
	//This function is also called when the app is initialized (and hence helps you in maintaining the session for a user).
/*
    var authDataCallback = function(authData) {
        console.log("authCallback Event is called from onAuth Event");
        if (authData) {
            console.log("User " + authData.uid + " is logged in with " + authData.provider);
            userData = authData;
            loadProfile();
            setUpFirebaseEvents();

        } else {
            console.log("User is logged out");
            $(".status").html('You are not logged in!').show();
            userData = null;
            listRef = null;
        }
    }
  */



  var authDataCallback = function(user) {
      console.log("authCallback Event is called from onAuth Event");
      if (user) {
          console.log("User " + user.uid + " is logged in with " + user.providerData);
          userData = user;
          loadProfile();
          setUpFirebaseEvents();

      } else {
          console.log("User is logged out");
          $(".status").html('You are not logged in!').show();
          userData = null;
          listRef = null;
      }
  };



	//Each user has a name. This function loads the profile for the user who logged in.
	//You can extend the functionality to add more data when saving the profile.
    var loadProfile = function() {
        //userRef = firebaseref.child('users').child(userData.uid);
        userRef = firebase.database().ref('users').child(userData.uid);
        userRef.once('value', function(snapshot) {
            var user = snapshot.val();
            if (!user) {
                return;
            }
            userData.fullname = user.full_name;
            addUserWelcome(userData.fullname);
            goToTab("#lists");
        });
    }

	//Adds a welcome message when a user logs in.
    var addUserWelcome = function(user_name) {
        $(".welcome").html("<div class='alert alert-success'> Welcome <strong>" + user_name + "</strong></div>");
    }



    //Listen to Auth Changes
    //firebaseref.onAuth(authDataCallback);
    firebase.auth().onAuthStateChanged(authDataCallback);

	//Event to handle click for Adding Items
    $("#addItemToList").on('click', function() {
        var $content = $("#listitem");
        var content = $content.val();
        if (content === "") {
            $("#lists .status").html('Please enter the text for the new item!').fadeIn(400);
            return;
        }
        $("#listitem").val('');
        addListItem(content);
    });

	//Handler for sorting the items in rows neatly!
	//I kept trying to keep them in formation so ended up adding a button for it :)
    $("#sort-items").on('click', function() {
        var leftcounter = 0;
        var topcounter = 0;
        var topPos = 0;
        var e_topPos = 0;
        var e_leftPos = 0;
        $("#sharedlist li").each(function(index) {
            //We need to preserve the background color of the tiles, so each element will generate a specific css string
            topPos = $(this).outerHeight(true) > topPos ? $(this).outerHeight(true) : topPos;
            if (!leftcounter) {
                //lefcounter is zero -- new row of elements
                e_topPos = topcounter * topPos + 10;
                topcounter++;
            }
            e_leftPos = leftcounter * 33;
            leftcounter++;
            leftcounter = leftcounter % 3;
            var staticPosCSSString = $(this).clone().css({
                position: 'absolute',
                top: e_topPos + "px",
                left: e_leftPos + "%",
            }).attr('style');
            var key = $(this).attr('data-item-id');
            addCSSStringToItem(key, staticPosCSSString);
        });
    });

	//Handler for click events on the tabs.
    $(".nav.navbar-nav > li > a").on('click', function(e) {
        var id = $(this).attr('id');
        if (id == "logout") {
            return;
        }

        e.preventDefault();
        $(this).parent().addClass('active');
        //force if logged in
        if (userData !== null) {
            goToTab('#lists');
            return;
        } else {
            goToTab($(this).attr('data-target'));
        }
    });

	//Logout action handler
    $("#logout").on('click', function() {
        //firebaseref.unauth();
        firebase.auth().signOut();
        userData = null;
        $(".welcome").html('');
        goToTab('#login');
    });



	//--------------------------------------- Callback for loginCallback API  ---------------------------------------

	//Callback for authWithPassword API Call
	// var loginCallback = function(error,authData)
	// {
	// 	if (error)
	// 	{
	// 		console.log("Login Failed!", error);
	// 		$("#login-btn").parent().find('.status').html("Login Failed!:" + error).show();
  //       }
	// 	else
	// 	{
	// 		console.log("Authenticated successfully with payload:", authData);
	// 		$("#login-btn").parent().find('.status').html("You are logged in as:" + authData.uid).show();
  //       }
  //
	// }



  // var loginCallback = firebase.auth().signInWithEmailAndPassword(email, password).then(function(result) {
  //   console.log("Authenticated successfully with payload:", result.user);
  //   $("#login-btn").parent().find('.status').html("You are logged in as:" + result.user.uid).show();
  // }).catch(function(error) {
  //   var errorCode = error.code;
  //   var errorMessage = error.message;
  // });

  var loginCallback = function(error,user)
	{
		if (error)
		{
			console.log("Login Failed!", error);
			$("#login-btn").parent().find('.status').html("Login Failed!:" + error).show();
        }
		else
		{
			console.log("Authenticated successfully with payload:", user);
			$("#login-btn").parent().find('.status').html("You are logged in as:" + user.uid).show();
        }

	}


	//--------------------------------------- Callback for createUser API Call ---------------------------------------
  	//Callback for createUser API Call
  	// var signupLoginCallback = function(error,authData)
  	// {
  	// 	if (error)
  	// 	{
  	// 		console.log("Login Failed!", error);
  	// 	}
  	// 	else
  	// 	{
  	// 		console.log("Authenticated successfully with payload:", authData);
  	// 		addUserName(userData.uid);
  	// 		goToTab("#lists");
  	// 	}
  	// }



  // var signupLoginCallback = firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(result) {
  //   console.log("Authenticated successfully with payload:", result.user);
  //   addUserName(result.user.uid);
  //   goToTab("#lists");
  // }).catch(function(error){
  //   var errorCode = error.code;
  //   var errorMessage = error.message;
  // });

  //Callback for createUser API Call
  var signupLoginCallback = function(error,user)
  {
  	if (error)
  	{
  		console.log("Login Failed!", error);
  	}
  	else
  	{
  		console.log("Authenticated successfully with payload:", user);
  		addUserName(userData.uid);
  		goToTab("#lists");
  	}
  }



	//Function to log in a user using email and password.
	// var loginUser = function(email,password,callback)
	// {
	// 	firebaseref.authWithPassword({
  //           email: email,
  //           password: password
  //       }, callback);
	// }

  // var loginUser = firebase.auth().signInWithEmailAndPassword(email, password).then(function(result){
  //     var uid = result.user.uid;
  //   }).catch(function(error) {
  //     var errorMessage = error.message;
  //   });

    // var loginUser = firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    //       // Handle Errors here.
    //       var errorCode = error.code;
    //       var errorMessage = error.message;
    //
    //       if (errorCode === 'auth/wrong-password') {
    //         console.log(error);
    //     }
    //   }

    var loginUser = function(email,password,callback) {
      firebase.auth().signInWithEmailAndPassword({
        email: email,
        password: password
      }, callback);
    }



	//Handling Login Process
    $("#login-btn").on('click', function() {
        var email = $("#login-email").val();
        var password = $("#login-password").val();
        loginUser(email,password,loginCallback);
    });

	//Handling Signup process
    $("#signup-btn").on('click', function() {

        var email = $("#email").val();
        var password = $("#password").val();
        firebase.auth().createUserWithEmailAndPassword({
            email: email,
            password: password
        },

        function(error, userData) {
            if (error) {
                console.log("Error creating user:", error);
                $("#signup-btn").parents("#register").find('.status').html("Error creating user:" + error).show();
            } else {
                console.log("Successfully created user account with uid:", userData.uid);
                $("#signup-btn").parents("#register").find('.status').html("Successfully created user account with uid:" + userData.uid).show();
                //firebaseref.authWithPassword(
                firebase.auth().signInWithEmailAndPassword({
                    email: email,
                    password: password,
                },signupLoginCallback);
              }
            });
    });

	//Pushing new items to Firebase list. This is called when a user click on "AddNewItem Button"
    var addListItem = function(content) {
        var postsRef = listRef;
        var x = Date();
        var random = randomIntFromInterval(1, 400);
        var randomColor = getRandomRolor();
        var topzindex = $("#sharedlist li").getMaxZ() + 1;
        $temp = $("<li></li>");
        $temp.css({
            'position': 'absolute',
            'top': random + 'px',
            'left': random / 2 + 'px',
            'background': randomColor,
            'z-index': topzindex
        });
        var css = $temp.attr('style');
        try {
            var newItemRef = postsRef.push({
                author: userData.fullname,
                content: content,
                timestamp: x,
                css: css
            });
        } catch (e) {
            $("#lists").find(".status").html(e);
        }
    }

	//API call to remove items from Firebase
    // var removeItemFromFirebase = function(key) {
    //     var itemRef = new Firebase('https://unityos-test.firebaseio.com/lists/sharedlist/items/' + key);
    //     itemRef.remove();
    // }

    //Firebase 3.xx API call to remove items
    var removeItemFromFirebase =  function(key) {
      var itemRef = firebase.database().ref("lists/sharedlist/items/" + key);
      itemRef.remove();
    }



	//API call to update the existing item in Firebase with the latest CSS string.
  //Firebase 3.xx
    var addCSSStringToItem = function(key, css) {
        var itemRef = firebase.database().ref("lists/sharedlist/items/" + key);
        itemRef.update({
            css: css,
        });
    }

	//API call to add the user's name after he has signed up.
	//This function is called from 'signupLoginCallback' to set the name entered by the user during signup.
    var addUserName = function(userid) {
        var name = $("#name").val();
		if(!name)
			name = userid;
        //var userRef = new Firebase('https://unityos-test.firebaseio.com/users/' + userid);
        var userRef = firebase.database().ref("users/" + userid);
        userRef.set({
            full_name: name
        },

        function(error) {
            if (error) {
                console.log("Error adding user data:", error);
                $("#signup-btn").parent().find('.status').html("Error adding user data:" + error).show();
            } else {
                console.log("Successfully added user data for");
                $(".nav.navbar-nav > li > a[data-target='#login']").click();
            }
        });
    }
});
