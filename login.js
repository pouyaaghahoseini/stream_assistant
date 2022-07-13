const input = document.getElementById('chname');
const errorElement = document.getElementById('errorMsg');

enter.addEventListener('click', (e) =>{
  const specialChars = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/; // special characters
  let messages = []; // array of error messages, basically we want this to be empty
  
  // checks if empty, null, or has special character
  if(input.value === '' || input.value == null || specialChars.test(input)){
    if(input.value === '' || input.value == null){ // empty/null
      messages.push('Channel name is required.');
    }
    else if(specialChars.test(input.value)){//special character
      messages.push('Channel name is invalid.');
    }
  }

  if(messages.length > 0){ // if there is an error, prevent proceeding forward
    e.preventDefault();
    errorElement.innerText = messages.join(', ')
  }
  else{
    // This is where we should store the value
    // alert("Channel name is: "+input.value)
  }
});

// Allow us to press enter to proceed
input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("enter").click();
  }
});