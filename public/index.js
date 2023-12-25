let result = document.getElementById('result')
let shortenedUrl = document.getElementById('result-url')
const login_variable = document.getElementById('login-title')
const register_variable = document.getElementById('register-title')
const button = document.getElementById('form-button')
const logout = document.getElementById('logout-form')
const main_form = document.getElementById('inputs')




// This function is used to close modal
function closeModal() {
  document.getElementsByTagName('section')[0].style.visibility = 'hidden'
}

// This function is used to logout user
document.getElementById('logout').addEventListener('click', (event) => {
  event.preventDefault()
  axios.post('/logout', data)
    .catch(error => {
      alert('Error, try again later...')
    });
})


// This function is used copy auth key to clipboard
function copykey(key) {
  navigator.clipboard.writeText(key)
    .then(() => {
      alert(`Your auth key: ${key}\nAuth key is copied.`)
    })
}


function shorten(accessToken) {

  const longUrl = document.getElementById('input_data').value;
  const regex = /^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/;


  if (regex.test(longUrl)) {
    fetch('/api/short-url', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "url": longUrl,
      })
    })
      .then(response => response.json())
      .then(data => {

        document.getElementById('display-url').innerText = data.url
        document.getElementById('result').style.visibility = 'visible'
        shortenedUrl.innerText = (longUrl.length > 15) ? longUrl.slice(0, 15) + '...' : longUrl
        document.getElementById('copy-btn').addEventListener('click', () => {
          alert("Copied!")
          let shortenedURL= data.url
          navigator.clipboard.writeText(shortenedURL)
        })

      })
      .catch(error => {
        switch (error.code) {
          case 429:
            alert('Too many request, try again later')
            break;
          case 403:
            alert('These service is currently unavailable')
            break;
          default:
            alert('Please try again later')
            break;
        }
      });
  }
}


// This function is used to sign in user
function login(event) {

  register_variable.style.color = 'white';
  login_variable.style.color = 'red';
  main_form.action = '/login';
  button.innerText = 'Login';

  axios.post(main_form.action, data)
    .catch(error => {
      alert('Error, try again later...');
    });
}

// This function is used to register user
function register() {

  register_variable.style.color = 'red'
  login_variable.style.color = 'white'
  main_form.action = '/register'
  button.innerText = 'Register'

}

// This function is used to check if user is authenticated
function checkUser(data) {
  if (!data) {
    document.getElementsByTagName('section')[0].style.visibility = 'visible'
  } else {
    shorten(data)
  }
}



