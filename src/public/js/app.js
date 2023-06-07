/// Establecer conexión con el servidor Socket.io
const socket = io();

// Obtener elementos del DOM para el chat
const form = document.querySelector('#message-form');
const chat = document.querySelector('#chat');
const message = document.querySelector('#message');
const content = document.querySelector('#content-wrap');

// Obtener elementos del DOM para el nickname
const nickForm = document.querySelector('#nick-form');
const nickname = document.querySelector('#nickname');
const error = document.querySelector('#error');
const login = document.querySelector('#login');
const username = document.querySelector('#username');

// Objeto de mapeo del alfabeto normal
const alphabet = {
  a: 'z', b: 'y', c: 'x', d: 'w', e: 'v', f: 'u', g: 't', h: 's', i: 'r', j: 'q', k: 'p', l: 'o', m: 'ñ', n: 'n', ñ: 'm', o: 'l', p: 'k', q: 'j', r: 'i', s: 'h', t: 'g', u: 'f', v: 'e', w: 'd', x: 'c', y: 'b', z: 'a', 
  á: 'ú', é: 'ó', í: 'í', ó: 'é', ú: 'á'
  };

  let isEncrypted = true; // Variable para verificar si los mensajes están encriptados o no

  // Función para encriptar el mensaje
  function encryptMessage(message) {
    const words = message.split(' ');
  
    const encryptedWords = words.map(word => {
      const encryptedWord = word.toLowerCase().split('').map(letter => {
        if (alphabet.hasOwnProperty(letter)) {
          return alphabet[letter];
        }
        return letter;
      }).join('');
  
      return encryptedWord;
    });
  
    const encryptedMessage = encryptedWords.join(' ');
  
    return encryptedMessage;
  }

// Función para desencriptar el mensaje
function decryptMessage(encryptedMessage) {
  const words = encryptedMessage.split(' ');

  const decryptedWords = words.map(word => {
    const decryptedWord = word.toLowerCase().split('').map(letter => {
      const reversedAlphabet = Object.entries(alphabet).reduce((acc, [key, value]) => {
        acc[value] = key;
        return acc;
      }, {});

      if (reversedAlphabet.hasOwnProperty(letter)) {
        return reversedAlphabet[letter];
      }
      return letter;
    }).join('');

    return decryptedWord;
  });

  const decryptedMessage = decryptedWords.join(' ');

  return decryptedMessage;
}

// Evento de clic en el botón "encriptar/desencriptar"
const changeButton = document.querySelector('#change-button');
changeButton.addEventListener('click', () => {
  const messages = chat.querySelectorAll('p');
  messages.forEach(p => {
    const messageContent = p.textContent;
    let transformedMessage;

    if (isEncrypted) {
      transformedMessage = decryptMessage(messageContent);
    } else {
      transformedMessage = encryptMessage(messageContent);
    }

    p.textContent = transformedMessage;
  });

  isEncrypted = !isEncrypted; // Invertir el estado de encriptado/desencriptado
});

// Evento de envío del formulario de inicio de sesión
nickForm.addEventListener('submit', (e) => {
  e.preventDefault();
  socket.emit('new user', nickname.value, (data) => {
    if (data) {
      login.style.display = "none";
      content.style.display = "block";
    } else {
      error.innerHTML = `<div class="alert alert-danger">The user already exists</div>`;
    }
  });
  nickname.value = "";
});

// Evento de envío del formulario de chat
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const messageContent = message.value; // Obtener el contenido del mensaje sin encriptar

  socket.emit('message', messageContent); // Enviar el mensaje sin encriptar al servidor

  e.target.reset();
});
// Actualizar la lista de usuarios en el DOM
socket.on('usernames', (users) => {
  let html = "";
  users.forEach((user) => {
    html += `<p><i class="fa fa-user"></i> ${user}</p>`;
  });
  username.innerHTML = html;
});

// Mostrar mensajes de chat en el DOM
socket.on('message', (data) => {
  const { msg, nick } = data;
  const p = document.createElement('p');
  p.appendChild(document.createTextNode(nick + ' : ' + msg));
  chat.appendChild(p);
});

//////
const logo = document.getElementById('logo');

logo.addEventListener('click', () => {
  location.reload();
});