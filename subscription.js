document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById('subscription-form');
    const modal = document.getElementById('miModal');
    const span = document.getElementsByClassName('cerrar')[0];
    const modalTitulo = document.getElementById('modalTitulo');
    const modalMensaje = document.getElementById('modalMensaje');
    const nombreInput = document.getElementById('nombre');

    // mostrar modal
    function mostrarModal(titulo, mensaje) {
        modalTitulo.textContent = titulo;
        modalMensaje.textContent = mensaje;
        modal.style.display = "block";
    }

    // cerrar modal
    span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Actualizar nombre formulario
    nombreInput.addEventListener('input', function() {
        const nombre = nombreInput.value.trim().toUpperCase();
        const formTitle = document.getElementById('form-title');
        formTitle.textContent = nombre ? `HOLA ${nombre}` : 'HOLA';
    });

    // Validar formulario
    function validarFormulario() {
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const passwordConfirm = document.getElementById('password-confirm').value.trim();
        const edad = document.getElementById('edad').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const direccion = document.getElementById('direccion').value.trim();
        const ciudad = document.getElementById('ciudad').value.trim();
        const codigoPostal = document.getElementById('codigo-postal').value.trim();
        const dni = document.getElementById('dni').value.trim();

        if (nombre.length < 7 || !/\s/.test(nombre)) {
            mostrarModal("Error", "Nombre completo: Debe tener más de 6 letras y al menos un espacio entre medio.");
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            mostrarModal("Error", "Email: debe tener un formato de email válido.");
            return false;
        }
        if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
            mostrarModal("Error", "Contraseña: Al menos 8 caracteres, formados por letras y números.");
            return false;
        }
        if (password !== passwordConfirm) {
            mostrarModal("Error", "Contraseña: Las contraseñas no coinciden.");
            return false;
        }
        if (!Number.isInteger(Number(edad)) || Number(edad) < 18) {
            mostrarModal("Error", "Edad: Número entero mayor o igual a 18.");
            return false;
        }
        if (!/^\d{7,}$/.test(telefono)) {
            mostrarModal("Error", "Teléfono: Número de al menos 7 dígitos, no aceptar espacios, guiones ni paréntesis.");
            return false;
        }
        if (direccion.length < 5 || !/\s/.test(direccion)) {
            mostrarModal("Error", "Dirección: Al menos 5 caracteres, con letras, números y un espacio en el medio.");
            return false;
        }
        if (ciudad.length < 3) {
            mostrarModal("Error", "Ciudad: Al menos 3 caracteres.");
            return false;
        }
        if (codigoPostal.length < 3) {
            mostrarModal("Error", "Código Postal: Al menos 3 caracteres.");
            return false;
        }
        if (!/^\d{7,8}$/.test(dni)) {
            mostrarModal("Error", "DNI: Número de 7 u 8 dígitos.");
            return false;
        }
        return true;
    }

    // envio formulario
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (!validarFormulario()) {
            return;
        }
        
        // agarrar datos formulario
        const formData = new FormData(form);
        const params = new URLSearchParams();

        formData.forEach((value, key) => {
            params.append(key, value);
        });

        // GET
        fetch(`https://jsonplaceholder.typicode.com/users?${params.toString()}`, {
            method: 'GET',
        })
        .then(response => response.json())
        .then(data => {
            if (data) {
                // exito
                mostrarModal("Éxito", "Datos enviados exitosamente.");
                // guardar datos en LocalStorage
                formData.forEach((value, key) => {
                    localStorage.setItem(key, value);
                });
            }
        })
        .catch(error => {
            // error
            mostrarModal("Error", "Error en el envío de datos.");
        });
    });

    // cargar datos desde LocalStorage al cargar la pagina
    window.onload = function() {
        const fields = ['nombre', 'email', 'password', 'password-confirm', 'edad', 'telefono', 'direccion', 'ciudad', 'codigo-postal', 'dni'];
        fields.forEach(key => {
            const savedValue = localStorage.getItem(key);
            if (savedValue) {
                document.getElementById(key).value = savedValue;
            }
        });
        // actualizar nombre constantemente
        actualizarTitulo();
    }
});
