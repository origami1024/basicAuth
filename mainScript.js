//there should be state object, to track the user
let state = {
  login: false
}
let re = /^[a-zA-Z\d]*$/; //for checking username?

//utils
hashCode = function(string) {
  let hash = 0;
  if (string.length == 0) {
      return hash;
  }
  for (let i = 0; i < string.length; i++) {
      let char = string.charCodeAt(i);
      hash = ((hash<<5)-hash)+char;
      hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
//

function reg(e){
  //console.log('trolo')
  $.ajax({
    type: 'GET',
    url: 'reg',
    data : {
      login: $("#regLogin")[0].value,
      pw: hashCode($("#regPW")[0].value)
    },
    success: function(data) {
      console.log(data)
      //do the login part
    }
  })
}

function getAllUsers(e){
  //console.log('trolo')
  $.ajax({
    type: 'GET',
    url: 'getAllUsers',
    success: function(data) {
      console.log(data)
      $('.usersList').empty()
      data.forEach(x => {
        $('.usersList').append( '<li class="list-group-item p-2">' + x.userid + ' : ' + x.username + ' : ' + x.userpw + '</li>' );

      });
    }
  })
}
function stateLogin(){
  state.login = true
  $(".logoutPart").removeClass("d-none")
  $(".loginPart").hide(0)//.addClass("d-none")
  //$(".registerControl").addClass("d-none")
  $(".registerControl").hide(0)
  $(".statusBadge").text("logged in")
  $(".statusBadge").removeClass("bg-warning")
  $(".statusBadge").addClass("bg-success")
  $(".nameField").text(state.data.username)
  $('.btnProfile').prop('disabled', false)
}
function stateLogout(){
  state.login = false
  $(".logoutPart").addClass("d-none")
  $(".loginPart").show(0)//.addClass("d-none")
  //$(".registerControl").addClass("d-none")
  $(".registerControl").show(0)
  $(".statusBadge").text("not logged in")
  $(".statusBadge").addClass("bg-warning")
  $(".statusBadge").removeClass("bg-success")
  $(".nameField").text("______")
  $('.btnProfile').prop('disabled', true)
}
function login(e){
  //console.log('trolo')
  $.ajax({
    type: 'GET',
    url: 'login',
    data : {
      login: $("#logLogin")[0].value,
      pw: hashCode($("#logPW")[0].value)
    },
    statusCode: {
      200: function(data) {
        console.log(data)
        console.log(200)
        state.data = JSON.parse(getCookie("state")) 
        stateLogin()
      },
      201: function(data) {
        console.log(data)
        console.log(201)
      }
    }
    /*success: function(data) {
      console.log(data)
    }*/
  })
}
function logout(e){
  $.ajax({
    type: 'GET',
    url: 'logout',
    success: function(data) {
      stateLogout()
    }
  })
}


$( document ).ready(function() {
  $(".btnRegister").on("click", reg)
  $(".btnLogin").on("click", login)
  $(".btnLogout").on("click", logout)
  $(".btnRefresh").on("click", getAllUsers)

  getAllUsers()
  //check if cookies appropriate, do cookiein (analogous to login)
  //document.cookie
  if (getCookie("state")!=''){
    state.data = JSON.parse(getCookie("state"))
    stateLogin()
  }
})