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
  a: 'z', b: 'y', c: 'x', d: 'w', e: 'v', f: 'u', g: 't', h: 's', i: 'r', j: 'q', k: 'p', l: 'o', m: 'n', n: 'm', o: 'l', p: 'k', q: 'j', r: 'i', s: 'h', t: 'g', u: 'f', v: 'e', w: 'd', x: 'c', y: 'b', z: 'a'};

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


// Evento de clic en el botón "desencriptar"
const decryptButton = document.querySelector('#decrypt-button');
decryptButton.addEventListener('click', () => {
  const encryptedMessages = chat.querySelectorAll('p');
  encryptedMessages.forEach(p => {
    const encryptedMessage = p.textContent;
    const decryptedMessage = decryptMessage(encryptedMessage);
    p.textContent = decryptedMessage;
  });
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

  const encryptedMessage = encryptMessage(message.value);

  socket.emit('message', encryptedMessage);
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
