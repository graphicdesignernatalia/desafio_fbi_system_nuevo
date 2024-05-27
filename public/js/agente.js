async function accesar() {
    const token = sessionStorage.getItem('token');
    if(!token){
        alert("No hay token, inicie sesion");
        window.location.href = "/";
        return;
    }

    const response = await fetch('/agentes', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (response.ok) {
        const text = await response.text();
        document.body.innerHTML = `<h1>${text}</h1>`;
    } else {
        alert('Acceso denegado');
        window.location.href = "/"
    }
}

accesar();