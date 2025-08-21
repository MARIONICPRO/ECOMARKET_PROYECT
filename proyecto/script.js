/************ ESTADO GLOBAL ************/
let usuarioLogueado = false;
let carrito = [];

/************ UTILIDADES ************/
function cerrarModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

/************ NAVEGACIÓN / SECCIONES ************/
function mostrarSeccion(id) {
  document.querySelectorAll('.seccion').forEach(s => (s.style.display = 'none'));
  const target = document.getElementById('seccion-' + id);
  if (target) target.style.display = 'block';
}

/************ PERFIL / CUENTA ************/
// Crear cuenta con username, email, password y foto
function crearCuenta() {
  const username = document.getElementById('nuevoNombre').value.trim();
  const email = document.getElementById('nuevoEmail').value.trim();
  const password = document.getElementById('nuevaPassword').value.trim();
  const fotoFile = document.getElementById('nuevaFoto').files[0];

  if (!username || !email || !password || !fotoFile) {
    alert('⚠️ Por favor, completa todos los campos.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const perfil = { username, email, password, foto: e.target.result };
    localStorage.setItem('perfilUsuario', JSON.stringify(perfil));
    alert('✅ Cuenta creada correctamente. Ahora puedes iniciar sesión.');
    cerrarModal('modalCrearCuenta');
  };
  reader.readAsDataURL(fotoFile);
}

// Inicia sesión con email y password
function iniciarSesion() {
  const loginEmail = document.getElementById('loginEmail').value.trim();
  const loginPassword = document.getElementById('loginPassword').value.trim();
  const perfilStr = localStorage.getItem('perfilUsuario');

  if (!perfilStr) {
    alert('⚠️ No tienes un perfil creado. Regístrate primero.');
    return;
  }

  const perfil = JSON.parse(perfilStr);

  if (loginEmail !== perfil.email || loginPassword !== perfil.password) {
    alert('❌ Credenciales incorrectas.');
    return;
  }

  usuarioLogueado = true;
  localStorage.setItem('sesionIniciada', 'true');
  renderPerfil(perfil);
  cerrarModal('modalLogin');
  alert('✅ Bienvenido ' + perfil.username);
}

// Cerrar sesión (NO borra el perfil)
function cerrarSesion() {
  usuarioLogueado = false;
  localStorage.setItem('sesionIniciada', 'false');
  hidePerfil();
  alert('🔒 Has cerrado sesión');
}

// Pinta el perfil en la UI
function renderPerfil(perfil) {
  document.getElementById('nombreUsuario').innerText = perfil.username;
  document.getElementById('fotoPerfil').src = perfil.foto;
  document.getElementById('perfilUsuario').style.display = 'block';
  document.getElementById('btnLogin').style.display = 'none';
  document.getElementById('btnRegister').style.display = 'none';
  document.getElementById('btnLogout').style.display = 'block';
}

// Oculta el perfil en la UI
function hidePerfil() {
  document.getElementById('perfilUsuario').style.display = 'none';
  document.getElementById('btnLogin').style.display = 'block';
  document.getElementById('btnRegister').style.display = 'block';
  document.getElementById('btnLogout').style.display = 'none';
}

// Editar perfil (valida contraseña actual si cambia email o password)
function actualizarPerfil() {
  const perfilStr = localStorage.getItem('perfilUsuario');
  if (!perfilStr) {
    alert('⚠️ No hay perfil para actualizar.');
    return;
  }

  let perfil = JSON.parse(perfilStr);

  const nuevoUsername = document.getElementById('editarUsername').value.trim();
  const nuevoEmail = document.getElementById('editarEmail').value.trim();
  const nuevaPassword = document.getElementById('editarPassword').value.trim();
  const passwordActual = document.getElementById('editarPasswordActual').value.trim();
  const nuevaFoto = document.getElementById('editarFoto').files[0];

  // Validar si intenta cambiar correo o contraseña
  if ((nuevoEmail || nuevaPassword) && passwordActual !== perfil.password) {
    alert('❌ Debes ingresar la contraseña actual para cambiar correo o contraseña.');
    return;
  }

  if (nuevoUsername) perfil.username = nuevoUsername;
  if (nuevoEmail) perfil.email = nuevoEmail;
  if (nuevaPassword) perfil.password = nuevaPassword;

  if (nuevaFoto) {
    const reader = new FileReader();
    reader.onload = function (e) {
      perfil.foto = e.target.result;
      localStorage.setItem('perfilUsuario', JSON.stringify(perfil));
      if (localStorage.getItem('sesionIniciada') === 'true') renderPerfil(perfil);
    };
    reader.readAsDataURL(nuevaFoto);
  } else {
    localStorage.setItem('perfilUsuario', JSON.stringify(perfil));
    if (localStorage.getItem('sesionIniciada') === 'true') renderPerfil(perfil);
  }

  cerrarModal('modalEditarPerfil');
  alert('✅ Perfil actualizado correctamente.');
}

/************ PRODUCTOS ************/
function abrirModalProductos() {
  document.getElementById('modalProductos').style.display = 'flex';
}
function cerrarModalProductos() {
  document.getElementById('modalProductos').style.display = 'none';
}

function seleccionarProducto(nombre) {
  if (!usuarioLogueado) {
    alert('⚠️ No puedes comprar el producto, inicia sesión primero');
    return;
  }
  carrito.push(nombre);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  alert('🛒 ' + nombre + ' añadido al carrito');
}

/************ CARRITO (MODAL) ************/
function abrirCarrito() {
  const contenedor = document.getElementById('listaCarrito');
  if (!contenedor) {
    alert('No se encontró el contenedor del carrito (listaCarrito).');
    return;
  }

  contenedor.innerHTML = '';
  if (carrito.length === 0) {
    contenedor.innerHTML = '<p>El carrito está vacío.</p>';
  } else {
    carrito.forEach((producto, index) => {
      const item = document.createElement('div');
      item.className = 'item-carrito';
      item.innerHTML = `
        <span>${producto}</span>
        <button onclick="eliminarDelCarrito(${index})">❌</button>
      `;
      contenedor.appendChild(item);
    });
  }
  document.getElementById('modalCarrito').style.display = 'flex';
}

function cerrarCarrito() {
  document.getElementById('modalCarrito').style.display = 'none';
}

function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  abrirCarrito();
}

function finalizarCompra() {
  if (carrito.length === 0) {
    alert('Tu carrito está vacío.');
    return;
  }
  alert('✅ Compra realizada con éxito.');
  carrito = [];
  localStorage.setItem('carrito', JSON.stringify(carrito));
  cerrarCarrito();
}

/************ JUEGOS / MÓDULOS ************/
function toggleTetris() {
  cerrarMenuJuegos();
  const contenedor = document.getElementById('contenidoTetris');
  if (!document.getElementById('iframeTetris')) {
    const iframe = document.createElement('iframe');
    iframe.id = 'iframeTetris';
    iframe.src = 'https://tetris.com/play-tetris';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';
    contenedor.appendChild(iframe);
  }
  document.getElementById('modalTetris').style.display = 'flex';
}

function cerrarModalTetris() {
  const modal = document.getElementById('modalTetris');
  const iframe = document.getElementById('iframeTetris');
  if (iframe) iframe.remove();
  modal.style.display = 'none';
}

function abrirMenuJuegos() {
  document.getElementById('menu-juegos').style.display = 'flex';
}
function cerrarMenuJuegos() {
  document.getElementById('menu-juegos').style.display = 'none';
}
function cerrarEscanner() {
  document.getElementById('menu-juegos').style.display = 'none';
}

function abrirEscaner() {
  cerrarMenuJuegos();
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.style.width = '100%';
        video.style.maxWidth = '600px';

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';

        const content = document.createElement('div');
        content.className = 'modal-content';

        const close = document.createElement('span');
        close.className = 'close';
        close.textContent = '×';
        close.onclick = () => {
          modal.remove();
          stream.getTracks().forEach((track) => track.stop());
        };

        content.appendChild(close);
        content.appendChild(video);
        modal.appendChild(content);
        document.body.appendChild(modal);
      })
      .catch((err) => {
        alert('No se pudo acceder a la cámara: ' + err);
      });
  } else {
    alert('Tu navegador no soporta acceso a la cámara');
  }
}

/************ INICIO: Restaurar sesión y carrito ************/
window.onload = function () {
  const perfilStr = localStorage.getItem('perfilUsuario');
  const sesion = localStorage.getItem('sesionIniciada');

  if (perfilStr && sesion === 'true') {
    const perfil = JSON.parse(perfilStr);
    usuarioLogueado = true;
    renderPerfil(perfil);
  } else {
    usuarioLogueado = false;
    hidePerfil();
  }

  try {
    const carritoStr = localStorage.getItem('carrito');
    carrito = carritoStr ? JSON.parse(carritoStr) : [];
  } catch {
    carrito = [];
  }

  mostrarSeccion('inicio');
};
