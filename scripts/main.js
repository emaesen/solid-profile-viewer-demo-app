const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const VCARD = $rdf.Namespace('http://www.w3.org/2006/vcard/ns#');

// Log the user in on click
const popupUri = 'popup.html';
$('#login button').click(() => solid.auth.popupLogin({ popupUri }));
$('#logout button').click(() => solid.auth.logout());


// Update components to match the user's login status
solid.auth.trackSession(session => {
  const loggedIn = !!session;
  $('#login').toggle(!loggedIn);
  $('#logout').toggle(loggedIn);
  $('.logged-in').toggle(loggedIn);
  if (loggedIn) {
    $('#user').text(session.webId);
    // Use the user's WebID as default profile
    //if (!$('#profile').val())
    //  $('#profile').val(session.webId);
  }

});

function escape(str) {
  return (""+str).replace(/[<>"]/g, function (char) {
		var replace_char = {
            '<': '&lt;',
            '>': '&gt;',
            '"': '\''
        };
		return replace_char[char] || char;
	});
}

let loadSeq = 0;

$('#view').click(function loadProfile() {
  $('#fullName').text("loading...");
  $('#homepage').text("loading...");
  $('#img').text("loading...");
  $('#friends').html("<li>loading...</li>");
  $('#nr-of-friends').text("");
  let errors = [];

  // Set up a local data store and associated data fetcher
  const store = $rdf.graph();

  const fetcher = new $rdf.Fetcher(store);
  // Load the person's data into the store
  const person = $('#profile').val();
  const me = store.sym(person);
  const profile = me.doc();
  console.log({profile:profile});
  fetchProfile(++loadSeq);

  function fetchProfile(i){
    fetcher.load(person)
      .then(
        resp => {
          console.log(">>> loaded " + person);
          processProfile(i).then(res => {
            console.log({loadErrors:errors})
          });
        },
        err => {
          console.log(">>> failed to load " + person + ". error: " + err);
        }
      );
  }

  function processProfile(i){
    return new Promise((resolve, reject) => {
      displayName(i);
      displayImage(i);
      displayHomepage(i);
      displayFriends(i).then(res => {
        resolve();
      });
    });
  }

  function displayName(i) {
    if (i===loadSeq){
      const fullName = store.any(me, FOAF('name')) || store.any(me, VCARD('fn'));
      $('#fullName').text(fullName && fullName.value);
    }
  }

  function displayImage(i) {
    if (i===loadSeq){
      const img = store.any(me, FOAF('img')) || store.any(me, VCARD('hasPhoto'));
      if (!img || img.length===0) {
        $('#img').text("...not provided...");
      } else {
        $('#img').html('<img class="img" src="' + img.value + '"/>');
      }
    }
  }

  function displayHomepage(i) {
    if (i===loadSeq){
      const homepage = store.any(me, FOAF('homepage'));
      if (!homepage || homepage.length===0) {
        $('#homepage').text("...not provided...");
      } else {
        $('#homepage').html('<a href="' + homepage.value + '">' + homepage.value + '</a>');
      }
    }
  }

  function displayFriendsLoading(ind, nr){
    if (ind < nr) {
      $('#nr-of-friends').text("(loading... " + ind + " of " + nr + ")");
    } else {
      $('#nr-of-friends').text("(" + nr + ")");
    }
  }

  function displayFriends(i) {
    return new Promise((resolve, reject) => {
      const friends = store.each(me, FOAF('knows'));
      const nrOfFriends = friends && friends.length;
      let friendIndex = 0;
      $('#friends').empty();
      if (friends.length===0) {
        $('#friends').html("<li>...no friends found, sad...</li>");
      } else {
        displayFriendsLoading(0, nrOfFriends);
      }
      let promises = [];
      friends.forEach(friend => {
        console.log(">>> loading " + friend + "...");
        let fetchPromise = fetcher.load(friend)
          .then(
            resp => {
              if (i===loadSeq){
                console.log(">>> loaded " + friend);
                const fullName = store.any(friend, FOAF('name')) || store.any(me, VCARD('fn'));
                $('#friends').append(
                  $('<li class="button">').append(
                    $('<a title="' + friend.value + '">')
                      .text(fullName && fullName.value || friend.value)
                      .click(() => $('#profile').val(friend.value))
                      .click(loadProfile)
                  )
                );
                displayFriendsLoading(++friendIndex, nrOfFriends);
              }
            },
            err => {
              if (i===loadSeq){
                console.log(">>> failed to load " + friend + ". error: " + err.statusText);
                errors.push(err);
                $('#friends').append(
                  $('<li>').append(
                    $('<span title="' + escape(err.statusText) + '">')
                      .html(friend.value + " <i>(fetch error!)</i>")
                  )
                );
                displayFriendsLoading(++friendIndex, nrOfFriends);
              }
            }
          );
        promises.push(fetchPromise);
      });
      Promise.all(promises).then(res => {
        resolve();
      })
    });
  }
});

$('#cardliu').click(() => {
  $('#profile').val($('#user').text());
  $('#view').click();
});

bindProfile('#cardrv');
bindProfile('#cardcs');
bindProfile('#cardwb');

function bindProfile(id){
  $(id).click(() => {
    $('#profile').val($(id).data("webid"));
    $('#view').click();
  });
}
