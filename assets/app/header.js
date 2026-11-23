/*   No vuelvo a intentar esto: horas intentado reutilizar el header 12       */

fetch("header.html")
    .then(response => {
        if (!response.ok) {
            throw new Error("No se pudo cargar el header");
        }
        return response.text();
    })
    .then(data => {


        document.getElementById("header-container").innerHTML = data;


        const header = document.querySelector(".header");
        const botonMenu = document.querySelector("#botonMenu");

  
        window.addEventListener("scroll", () => {

            if (window.scrollY > 100) {
                header.classList.add("compacto");
            } else {
                header.classList.remove("compacto");
                header.classList.remove("abierto");
            }

        });

        botonMenu.addEventListener("click", () => {
            header.classList.toggle("abierto");
        });

const modalLogin = document.querySelector('#modal-login');
const formLogin = document.querySelector('#form-login');
const btnCerrarModal = document.querySelector('#btn-cerrar-modal');
const estadoLogin = document.querySelector('#estado-login');
const btnGmail = document.querySelector('#btn-gmail');
const btnRegistrarse = document.querySelector('#btn-registrarse');

function abrirModal() {
    if (!modalLogin) return;
    modalLogin.classList.add('activo');
    modalLogin.setAttribute('aria-hidden', 'false');
    document.querySelector('#email')?.focus();
}

function cerrarModal() {
    if (!modalLogin) return;
    modalLogin.classList.remove('activo');
    modalLogin.setAttribute('aria-hidden', 'true');
    if (estadoLogin) estadoLogin.textContent = '';
}

// Delegación para abrir desde cualquier lugar (incluido el header cargado con fetch si no explorta)
document.addEventListener('click', (evento) => {
    if (evento.target.closest('#btn-abrir-modal')) {
        abrirModal();
    }
});

btnCerrarModal?.addEventListener('click', cerrarModal);

// Cerrar al hacer clic en el fondo oscuro (fuera de .grid-container)
modalLogin?.addEventListener('click', (evento) => {
    if (evento.target === modalLogin) {
        cerrarModal();
    }
});

// Cerrar con tecla Escape ya por probar el evento de teclas
document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && modalLogin?.classList.contains('activo')) {
        cerrarModal();
    }
});

// Envío real a Formspree mediante fetch
formLogin?.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    estadoLogin.textContent = 'Enviando datos...';

    const datos = new FormData(formLogin);

    try {
        const respuesta = await fetch(formLogin.action, {
            method: formLogin.method || 'POST',
            body: datos,
            headers: { Accept: 'application/json' }
        });

        if (respuesta.ok) {
            estadoLogin.textContent = '¡Solicitud enviada correctamente!';
            formLogin.reset();
            setTimeout(cerrarModal, 1200);
        } else {
            estadoLogin.textContent = 'No se pudo enviar. Revisá los campos e intentá de nuevo.';
        }
    } catch (error) {
        console.error('Error al enviar formulario:', error);
        estadoLogin.textContent = 'Error de conexión al enviar el formulario.';
    }
        });

        btnGmail?.addEventListener('click', () => {
            estadoLogin.textContent = 'Acceso con Gmail aún no configurado (modo demo).';
        });

        /* Deberia eliminar el boton de registro  */
        btnRegistrarse?.addEventListener('click', () => {
            estadoLogin.textContent = 'Completa tus datos y presioná "Ingresar" para registrarte.';
        });


    /* Ya me perdí 
    
        esto último para el modo celular
    */
        document.addEventListener('click', (evento) => {
    const disparadorLogin = evento.target.closest('#btn-abrir-modal, .js-abrir-modal');
    if (disparadorLogin) {
        evento.preventDefault();
        document.querySelector('.header')?.classList.remove('abierto');
        abrirModal();
    }
});

    })
    .catch(error => console.error(error));

    