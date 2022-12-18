const chname = document.getElementById('chname');
const passwd = document.getElementById('passwd');
const loginButton = document.getElementById('loginbutton');
const errorElement = document.getElementById('errorMsg');


loginButton.addEventListener('click', (e) =>{
  const specialChars = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/; // special characters
  let messages = []; // array of error messages, basically we want this to be empty
  // checks if empty, null, or has special character
  console.log(chname.value.toLowerCase());
  if(chname.value === '' || chname.value == null || specialChars.test(chname.value)){
    if(chname.value === '' || chname.value == null){ // empty/null
      messages.push('Channel name is required.');
    }
    else if(specialChars.test(chname.value)){//special character
      messages.push('Channel name is invalid.');
    }
  }
  if(passwd.value == '' || passwd.value == null){
    messages.push('Password is required.');
  }
  if(messages.length > 0){ // if there is an error, prevent proceeding forward
    e.preventDefault();
    errorElement.innerText = messages.join(', ')
  }
  else{
    // This is where we should store the value
    // alert("Channel name is: "+input.value)
    res.send({chname: chname.value.toLowerCase(), passwd: passwd.value});
  }
});

// Allow us to press enter to proceed
loginButton.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("enter").click();
  }
});