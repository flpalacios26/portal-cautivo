let usuario = {};

document.getElementById('form-registro').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    usuario.nombre = document.getElementById('nombre').value;
    usuario.email = document.getElementById('email').value;
    usuario.telefono = document.getElementById('telefono').value;
    
    if (!usuario.nombre || !usuario.email || !usuario.telefono) {
        mostrarMensaje('Por favor complete todos los campos', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/registro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usuario)
        });
        
        const data = await response.json();
        
        if (data.success) {
            mostrarMensaje('Registro exitoso. Proceda al pago.', 'exito');
            cambiarPaso('step-pago');
        } else {
            mostrarMensaje(data.message || 'Error en el registro', 'error');
        }
    } catch (error) {
        // Si no hay backend (GitHub Pages), simulamos el registro
        mostrarMensaje('Registro exitoso (modo demo). Proceda al pago.', 'exito');
        cambiarPaso('step-pago');
    }
});

document.getElementById('form-pago').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const pago = {
        tarjeta: document.getElementById('tarjeta').value,
        expiracion: document.getElementById('expiracion').value,
        cvv: document.getElementById('cvv').value,
        email: usuario.email
    };
    
    if (pago.tarjeta.length !== 16 || pago.cvv.length !== 3) {
        mostrarMensaje('Datos de tarjeta inválidos', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/pago', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(pago)
        });
        
        const data = await response.json();
        
        if (data.success) {
            mostrarMensaje('Pago procesado exitosamente.', 'exito');
            document.getElementById('ip-asignada').textContent = data.ip;
            document.getElementById('valido-hasta').textContent = data.validoHasta;
            cambiarPaso('step-liberacion');
        } else {
            mostrarMensaje(data.message || 'Error en el pago', 'error');
        }
    } catch (error) {
        // Si no hay backend (GitHub Pages), simulamos el pago
        mostrarMensaje('Pago procesado exitosamente (modo demo).', 'exito');
        document.getElementById('ip-asignada').textContent = '192.168.100.20';
        document.getElementById('valido-hasta').textContent = new Date(Date.now() + 24*60*60*1000).toLocaleString('es-GT');
        cambiarPaso('step-liberacion');
    }
});

document.getElementById('btn-acceder').addEventListener('click', () => {
    mostrarMensaje('Redirigiendo al clúster de IA...', 'exito');
    setTimeout(() => {
        window.location.href = 'acceso-concedido.html';
    }, 1500);
});

function cambiarPaso(pasoId) {
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById(pasoId).classList.add('active');
}

function mostrarMensaje(texto, tipo) {
    const mensaje = document.getElementById('mensaje');
    mensaje.textContent = texto;
    mensaje.className = `mensaje ${tipo}`;
    setTimeout(() => {
        mensaje.className = 'mensaje';
    }, 4000);
}