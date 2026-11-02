document.addEventListener('DOMContentLoaded', () => {
    console.log("Inkari Smart System inicializado...");

    // 1. CONTROL DE LUCES
    const btnLuces = document.getElementById('toggle-luces');
    const switchLuces = document.getElementById('switch-luces');
    const estadoLuces = document.getElementById('estado-luces');
    const body = document.body;
    let lucesEncendidas = false;

    if (btnLuces) {
        btnLuces.addEventListener('click', () => {
            lucesEncendidas = !lucesEncendidas;
            if (lucesEncendidas) {
                btnLuces.classList.replace('bg-dark-600', 'bg-yellow-500');
                switchLuces.classList.replace('translate-x-1', 'translate-x-7');
                switchLuces.classList.replace('bg-gray-400', 'bg-white');
                estadoLuces.textContent = "Actualmente: Encendidas";
                estadoLuces.classList.replace('text-gray-500', 'text-yellow-400');
                
                body.style.transition = "background-color 0.5s ease";
                body.style.backgroundColor = "#1a1510"; 
                document.getElementById('estado-global').textContent = "Iluminación activada";
            } else {
                btnLuces.classList.replace('bg-yellow-500', 'bg-dark-600');
                switchLuces.classList.replace('translate-x-7', 'translate-x-1');
                switchLuces.classList.replace('bg-white', 'bg-gray-400');
                estadoLuces.textContent = "Actualmente: Apagadas";
                estadoLuces.classList.replace('text-yellow-400', 'text-gray-500');
                
                body.style.backgroundColor = "#050505"; 
                document.getElementById('estado-global').textContent = "Iluminación desactivada";
            }
        });
    }

    // 2. CONTROL DE TEMPERATURA
    const sliderTemp = document.getElementById('slider-temp');
    const tempValor = document.getElementById('temp-valor');

    if (sliderTemp) {
        sliderTemp.addEventListener('input', (e) => {
            const valor = e.target.value;
            tempValor.textContent = `${valor}°C`;
            
            if (valor < 20) {
                tempValor.className = "text-2xl font-display font-bold text-blue-400";
            } else if (valor > 25) {
                tempValor.className = "text-2xl font-display font-bold text-orange-500";
            } else {
                tempValor.className = "text-2xl font-display font-bold text-neon-cyan";
            }
            document.getElementById('estado-global').textContent = `Clima ajustado a ${valor}°C`;
        });
    }

    // 3. CONTROL DE SEGURIDAD
    const btnPuerta = document.getElementById('btn-puerta');
    const iconoPuerta = document.getElementById('icono-puerta');
    let puertaBloqueada = true;

    if (btnPuerta) {
        btnPuerta.addEventListener('click', () => {
            puertaBloqueada = !puertaBloqueada;

            if (puertaBloqueada) {
                btnPuerta.innerHTML = `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg> Desbloquear Puerta`;
                btnPuerta.classList.replace('bg-green-600', 'bg-dark-600');
                btnPuerta.classList.remove('border-green-500');
                btnPuerta.classList.add('border-white/10');
                document.getElementById('estado-global').textContent = "Puerta bloqueada";
            } else {
                btnPuerta.innerHTML = `<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg> Bloquear Puerta`;
                btnPuerta.classList.replace('bg-dark-600', 'bg-green-600');
                btnPuerta.classList.remove('border-white/10');
                btnPuerta.classList.add('border-green-500');
                document.getElementById('estado-global').textContent = "Puerta desbloqueada";
            }
        });
    }
});