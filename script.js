
const botonJugar = document.getElementById("botonJugar");
const botonVolver = document.getElementById("botonVolver");

const menu = document.getElementById("menu");
const juego = document.getElementById("juego");

const coordenada = document.getElementById("coordenada");
const mensaje = document.getElementById("mensaje");
const puntosTexto = document.getElementById("puntos");
const nivelTexto = document.getElementById("nivel");
const plano = document.getElementById("plano");

// VARIABLES
let puntos = 0;
let nivel = 1;
let vidas = 3;
let errores = 0;

let objetivoX = 2;
let objetivoY = 3;
let limite = 5;

let respondiendo = false;
let partidaActiva = false;
let temporizador = null;

const NIVEL_VICTORIA = 5;

// CREAR CONTADORES
function crearContador(id, texto) {
    let elemento = document.getElementById(id);

    if (!elemento) {
        elemento = document.createElement("p");
        elemento.id = id;
        elemento.style.color = "#e4c4ff";
        elemento.style.fontWeight = "bold";
        elemento.style.margin = "8px";

        const referencia = document.getElementById("puntos");

        if (referencia && referencia.parentElement) {
            referencia.parentElement.appendChild(elemento);
        } else {
            juego.appendChild(elemento);
        }
    }

    elemento.textContent = texto;
    return elemento;
}

const vidasTexto = crearContador("vidasContador", "❤️ Vidas: 3");
const erroresTexto = crearContador("erroresContador", "❌ Errores: 0");

// ESTILOS DE LAS PANTALLAS FINALES
const estilosFinales = document.createElement("style");

estilosFinales.textContent = `
    #juego {
        position: relative;
    }

    #pantallaFinal {
        position: absolute;
        inset: 0;
        z-index: 100;
        display: none;
        align-items: center;
        justify-content: center;
        padding: 20px;
        border-radius: 23px;
        background: rgba(18, 9, 34, 0.96);
        box-sizing: border-box;
    }

    #pantallaFinal.visible {
        display: flex;
    }

    #tarjetaFinal {
        width: 100%;
        max-width: 390px;
        padding: 28px 18px;
        border: 2px solid #c99aff;
        border-radius: 24px;
        background: linear-gradient(145deg, #39205c, #1c102e);
        box-shadow: 0 0 30px #a45bff55;
        text-align: center;
        color: white;
        box-sizing: border-box;
        animation: aparecerGatito 0.35s ease-out;
    }

    #iconoFinal {
        font-size: 64px;
        margin-bottom: 8px;
    }

    #tituloFinal {
        color: #e4c4ff;
        font-size: 2rem;
        margin: 8px 0;
    }

    #descripcionFinal {
        line-height: 1.6;
        margin: 12px 0 20px;
    }

    #resultadosFinales {
        padding: 12px;
        margin: 15px 0;
        border-radius: 14px;
        background: #160d2b;
        line-height: 2;
    }

    #botonesFinales {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
    }

    #botonesFinales button {
        margin: 4px;
    }

    @keyframes aparecerGatito {
        from {
            opacity: 0;
            transform: scale(0.85);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;

document.head.appendChild(estilosFinales);

// CREAR PANTALLA FINAL
const pantallaFinal = document.createElement("div");
pantallaFinal.id = "pantallaFinal";

pantallaFinal.innerHTML = `
    <div id="tarjetaFinal">
        <div id="iconoFinal">🐈‍⬛</div>
        <h2 id="tituloFinal">¡Miau!</h2>
        <p id="descripcionFinal"></p>
        <div id="resultadosFinales"></div>
        <div id="botonesFinales">
            <button type="button" id="reiniciarFinal">
                🔄 Volver a jugar
            </button>
            <button type="button" id="menuFinal">
                🏠 Menú principal
            </button>
        </div>
    </div>
`;

juego.appendChild(pantallaFinal);

// ACTUALIZAR CONTADORES
function actualizarContadores() {
    puntosTexto.textContent = puntos;
    nivelTexto.textContent = nivel;
    vidasTexto.textContent = `❤️ Vidas: ${vidas}`;
    erroresTexto.textContent = `❌ Errores: ${errores}`;
}

// MOSTRAR VICTORIA O GAME OVER
function finalizarJuego(tipo) {
    partidaActiva = false;
    respondiendo = true;

    clearTimeout(temporizador);
    plano.querySelectorAll("button").forEach(boton => {
        boton.disabled = true;
    });

    const victoria = tipo === "victoria";

    document.getElementById("iconoFinal").textContent =
        victoria ? "🏆🐈‍⬛" : "😿💜";

    document.getElementById("tituloFinal").textContent =
        victoria ? "¡VICTORIA!" : "GAME OVER";

    document.getElementById("descripcionFinal").textContent =
        victoria
            ? "¡Lo lograste! Eres una experta encontrando gatitos en el plano cartesiano."
            : "¡Se acabaron las vidas! Los gatitos te esperan para una nueva aventura.";

    document.getElementById("resultadosFinales").innerHTML = `
        ⭐ Puntos: <strong>${puntos}</strong><br>
        🎮 Nivel alcanzado: <strong>${nivel}</strong><br>
        ❌ Errores: <strong>${errores}</strong><br>
        ❤️ Vidas restantes: <strong>${vidas}</strong>
    `;

    pantallaFinal.classList.add("visible");
}

// INICIAR PARTIDA
function iniciarJuego() {
    clearTimeout(temporizador);

    puntos = 0;
    nivel = 1;
    vidas = 3;
    errores = 0;

    respondiendo = false;
    partidaActiva = true;

    pantallaFinal.classList.remove("visible");

    actualizarContadores();

    menu.hidden = true;
    juego.hidden = false;

    generarReto();
}

// GENERAR COORDENADA OBJETIVO
function generarReto() {
    if (!partidaActiva) return;

    respondiendo = false;
    limite = Math.min(4 + nivel, 8);

    do {
        objetivoX =
            Math.floor(Math.random() * (limite * 2 + 1)) - limite;

        objetivoY =
            Math.floor(Math.random() * (limite * 2 + 1)) - limite;
    } while (objetivoX === 0 && objetivoY === 0);

    coordenada.textContent = `(${objetivoX}, ${objetivoY})`;

    mensaje.textContent =
        "🐾 ¡Encuentra el gatito negro de esta coordenada!";

    dibujarPlano(limite);
}

// DIBUJAR PLANO Y COLOCAR GATITOS
function dibujarPlano(limite) {
    plano.innerHTML = "";

    const total = limite * 2 + 1;

    plano.style.setProperty("display", "grid", "important");
    plano.style.setProperty(
        "grid-template-columns",
        `repeat(${total}, minmax(0, 1fr))`,
        "important"
    );
    plano.style.setProperty(
        "grid-template-rows",
        `repeat(${total}, 32px)`,
        "important"
    );

    plano.style.width = "100%";
    plano.style.maxWidth = "520px";
    plano.style.boxSizing = "border-box";
    plano.style.margin = "20px auto";
    plano.style.padding = "8px";
    plano.style.gap = "2px";
    plano.style.background = "#2b1745";
    plano.style.borderRadius = "12px";

    const posiciones = [];

    for (let y = limite; y >= -limite; y--) {
        for (let x = -limite; x <= limite; x++) {
            if (x !== 0 && y !== 0) {
                posiciones.push({ x, y });
            }
        }
    }

    // MEZCLAR POSICIONES
    for (let i = posiciones.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [posiciones[i], posiciones[j]] =
            [posiciones[j], posiciones[i]];
    }

    // POSICIÓN DEL GATITO CORRECTO
    const posicionesGatitos = [
        { x: objetivoX, y: objetivoY }
    ];

    const cantidadGatitos = Math.min(
        3 + Math.floor((nivel - 1) / 2),
        8
    );

    for (const posicion of posiciones) {
        if (posicionesGatitos.length >= cantidadGatitos) {
            break;
        }

        if (
            posicion.x === objetivoX &&
            posicion.y === objetivoY
        ) {
            continue;
        }

        posicionesGatitos.push(posicion);
    }

    // CREAR CASILLAS
    for (let y = limite; y >= -limite; y--) {
        for (let x = -limite; x <= limite; x++) {
            const casilla = document.createElement("button");

            casilla.type = "button";
            casilla.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 32px;
                min-width: 0;
                margin: 0;
                padding: 0;
                border: 1px solid #b78aff;
                border-radius: 4px;
                box-sizing: border-box;
                font-size: 12px;
                font-weight: bold;
                color: #291342;
                background: #f0dcff;
                cursor: pointer;
            `;

            // EJES DEL PLANO
            if (x === 0 && y === 0) {
                casilla.textContent = "0";
                casilla.style.background = "#ffd875";
            } else if (x === 0) {
                casilla.textContent = y;
                casilla.style.background = "#b78aff";
            } else if (y === 0) {
                casilla.textContent = x;
                casilla.style.background = "#b78aff";
            }

            const tieneGatito = posicionesGatitos.some(
                posicion => posicion.x === x && posicion.y === y
            );

            if (tieneGatito) {
                casilla.textContent = "🐈‍⬛";
                casilla.style.background = "#e4c4ff";
                casilla.style.fontSize = "18px";
            }

            casilla.setAttribute(
                "aria-label",
                tieneGatito
                    ? `Gatito negro en (${x}, ${y})`
                    : `Coordenada (${x}, ${y})`
            );

            casilla.addEventListener("click", () => {
                comprobarRespuesta(x, y, casilla, tieneGatito);
            });

            plano.appendChild(casilla);
        }
    }
}

// COMPROBAR RESPUESTAS
function comprobarRespuesta(x, y, casilla, tieneGatito) {
    if (!partidaActiva || respondiendo) return;

    // ACIERTO
    if (
        tieneGatito &&
        x === objetivoX &&
        y === objetivoY
    ) {
        respondiendo = true;

        puntos += 10;

        const nuevoNivel = Math.floor(puntos / 30) + 1;
        nivel = Math.min(nuevoNivel, NIVEL_VICTORIA);

        actualizarContadores();

        casilla.style.background = "#a8f0c6";

        mensaje.textContent =
            "¡MIAU-gnífico! 🐈‍⬛ ¡Rescataste al gatito! +10 puntos";

        // VICTORIA AL LLEGAR AL NIVEL 5
        if (nivel >= NIVEL_VICTORIA) {
            coordenada.textContent = "¡Lo lograste!";
            finalizarJuego("victoria");
            return;
        }

        temporizador = setTimeout(() => {
            if (partidaActiva) {
                generarReto();
            }
        }, 1500);

        return;
    }

    // ERROR Y PÉRDIDA DE VIDA
    errores++;
    vidas--;

    actualizarContadores();

    if (vidas <= 0) {
        coordenada.textContent = "Fin del juego";
        mensaje.textContent = "¡Se acabaron tus vidas!";
        finalizarJuego("gameover");
        return;
    }

    mensaje.textContent = tieneGatito
        ? `😿 Ese gatito está en (${x}, ${y}). Busca (${objetivoX}, ${objetivoY}).`
        : "😿 Aquí no hay gatito. Perdiste una vida.";

    const fondoOriginal = casilla.style.background;
    casilla.style.background = "#ff9eae";

    setTimeout(() => {
        if (casilla.isConnected && partidaActiva) {
            casilla.style.background = fondoOriginal;
        }
    }, 400);
}

// VOLVER AL MENÚ
function volverAlMenu() {
    partidaActiva = false;
    respondiendo = false;

    clearTimeout(temporizador);

    pantallaFinal.classList.remove("visible");

    juego.hidden = true;
    menu.hidden = false;

    plano.innerHTML = "";
}

// BOTONES PRINCIPALES
botonJugar.addEventListener("click", iniciarJuego);
botonVolver.addEventListener("click", volverAlMenu);

// BOTONES DE LAS PANTALLAS FINALES
document.getElementById("reiniciarFinal").addEventListener(
    "click",
    iniciarJuego
);

document.getElementById("menuFinal").addEventListener(
    "click",
    volverAlMenu
);
