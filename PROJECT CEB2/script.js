// ============================================
// PROJECT CEB - SCRIPT.JS
// ============================================


// ============================================
// MODO OSCURO EN TODAS LAS PÁGINAS
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    const modoOscuro = document.getElementById("modoOscuro");

    // Revisar si el modo oscuro estaba activado
    if (localStorage.getItem("modoOscuro") === "activado") {
        document.body.classList.add("dark");

        if (modoOscuro) {
            modoOscuro.checked = true;
        }
    }

    // Cambiar modo oscuro desde Configuración
    if (modoOscuro) {

        modoOscuro.addEventListener("change", function () {

            if (this.checked) {
                document.body.classList.add("dark");
                localStorage.setItem("modoOscuro", "activado");
            } else {
                document.body.classList.remove("dark");
                localStorage.setItem("modoOscuro", "desactivado");
            }

        });

    }

});


// ============================================
// REGISTRO DE EXCUSAS E ID AUTOMÁTICO
// ============================================

document.addEventListener("DOMContentLoaded", function () {
    const formulario = document.getElementById("formExcusa");
    const tabla = document.querySelector(".card table");

    if (!formulario || !tabla) return;

    const cuerpoTabla = tabla.tBodies[0] || tabla.createTBody();

    function obtenerExcusas() {
        try {
            return JSON.parse(localStorage.getItem("registroExcusas")) || [];
        } catch {
            return [];
        }
    }

    function guardarExcusas(excusa) {
        const excusas = obtenerExcusas();
        excusa.id = excusas.reduce(
            (mayor, actual) => Math.max(mayor, Number(actual.id) || 0),
            0
        ) + 1;

        excusas.push(excusa);
        localStorage.setItem("registroExcusas", JSON.stringify(excusas));
        return excusa;
    }

    function mostrarExcusa(excusa) {
        const fila = cuerpoTabla.insertRow();
        const valores = [
            String(excusa.id).padStart(2, "0"),
            excusa.tipo,
            excusa.estudiante,
            excusa.acudiente
        ];

        valores.forEach(valor => {
            const celda = fila.insertCell();
            celda.textContent = valor || "No especificado";
        });
    }

    // Conserva la fila de ejemplo que ya existe en tu HTML.
    // Las excusas nuevas se guardan y reciben IDs consecutivos.
    obtenerExcusas().forEach(mostrarExcusa);

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const campos = formulario.querySelectorAll(
            "input:not([type='file']), select"
        );
        const archivo = formulario.querySelector("input[type='file']");
        const camposObligatorios = Array.from(campos);

        if (archivo) camposObligatorios.push(archivo);

        for (const campo of camposObligatorios) {
            if (!campo.value.trim()) {
                campo.setCustomValidity("Este campo es obligatorio.");
                campo.reportValidity();
                campo.addEventListener("input", () => {
                    campo.setCustomValidity("");
                }, { once: true });
                return;
            }
        }

        const tipo = formulario.querySelector("select").value;
        const estudiante = document
    .getElementById("nombreEstudiante").value.trim();

const acudiente = document
    .getElementById("nombreAcudiente").value.trim();

const detalle = document
    .getElementById("detalleExcusa").value.trim();

        // Si todavía no existe un campo para el estudiante,
        // solicita su nombre para poder llenar esa columna.
        
        if (!estudiante || !estudiante.trim()) {
            alert("El nombre del estudiante es obligatorio.");
            return;
        }

        const nuevaExcusa = guardarExcusas({
            tipo,
            estudiante: estudiante.trim(),
            acudiente,
            detalle,
            fecha: formulario.querySelector("#fecha")?.value || ""
        });

        mostrarExcusa(nuevaExcusa);

        const mensaje = document.getElementById("mensajeExito");
        if (mensaje) {
            mensaje.style.display = "block";
            mensaje.textContent = "¡La excusa se registró correctamente!";
        } else {
            alert("¡La excusa se registró correctamente!");
        }

        formulario.reset();
    });
});




// ============================================
// 3. BUSCADOR DE ESTUDIANTES
// ============================================

const documento = document.getElementById("documento");
const nombre = document.getElementById("nombre");

const nivel = document.getElementById("nivel");
const grado = document.getElementById("grado");
const curso = document.getElementById("curso");

const btnBuscar = document.getElementById("btnBuscar");

const tablaEstudiantes =
    document.getElementById("tablaEstudiantes");


// ============================================
// NIVEL → GRADO
// ============================================

if (nivel && grado && curso) {

    nivel.addEventListener("change", function () {

        const nivelSeleccionado = nivel.value;

        grado.innerHTML =
            '<option value="">Todos los grados</option>';

        curso.innerHTML =
            '<option value="">Todos los cursos</option>';

        curso.disabled = true;


        if (nivelSeleccionado === "") {

            grado.disabled = true;

            return;
        }


        grado.disabled = false;


        // PRIMARIA

        if (nivelSeleccionado === "primaria") {

            grado.innerHTML += `
                <option value="1°">Primero</option>
                <option value="2°">Segundo</option>
                <option value="3°">Tercero</option>
                <option value="4°">Cuarto</option>
                <option value="5°">Quinto</option>
            `;

        }


        // BACHILLERATO

        if (nivelSeleccionado === "bachillerato") {

            grado.innerHTML += `
                <option value="6°">Sexto</option>
                <option value="7°">Séptimo</option>
                <option value="8°">Octavo</option>
                <option value="9°">Noveno</option>
                <option value="10°">Décimo</option>
                <option value="11°">Undécimo</option>
            `;

        }

    });


    // ============================================
    // GRADO → CURSO
    // ============================================

    grado.addEventListener("change", function () {

        const gradoSeleccionado = grado.value;

        curso.innerHTML =
            '<option value="">Todos los cursos</option>';

        curso.disabled = true;


        if (gradoSeleccionado === "") {
            return;
        }


        const numeroGrado =
            gradoSeleccionado.replace("°", "");


        // =========================================
        // PRIMARIA
        // =========================================

        if (
            numeroGrado === "1" ||
            numeroGrado === "2" ||
            numeroGrado === "3" ||
            numeroGrado === "4" ||
            numeroGrado === "5"
        ) {

            for (let i = 1; i <= 5; i++) {

                const numeroCurso =
                    numeroGrado + "0" + i;

                curso.innerHTML += `
                    <option value="${numeroCurso}">
                        ${numeroCurso}
                    </option>
                `;

            }

        }


        // =========================================
        // BACHILLERATO
        // =========================================

        if (
            numeroGrado === "6" ||
            numeroGrado === "7" ||
            numeroGrado === "8" ||
            numeroGrado === "9"
        ) {

            for (let i = 1; i <= 7; i++) {

                const numeroCurso =
                    numeroGrado + "0" + i;

                curso.innerHTML += `
                    <option value="${numeroCurso}">
                        ${numeroCurso}
                    </option>
                `;

            }

        }


        // =========================================
        // DÉCIMO Y UNDÉCIMO
        // =========================================

        if (
            numeroGrado === "10" ||
            numeroGrado === "11"
        ) {

            for (let i = 1; i <= 7; i++) {

                const numeroCurso =
                    numeroGrado + "-0" + i;

                curso.innerHTML += `
                    <option value="${numeroCurso}">
                        ${numeroCurso}
                    </option>
                `;

            }

        }


        curso.disabled = false;

    });

}


// ============================================
// BUSCAR ESTUDIANTES
// ============================================

if (btnBuscar && tablaEstudiantes) {

    btnBuscar.addEventListener("click", function () {

        const documentoBuscado =
            documento ? documento.value.trim().toLowerCase() : "";

        const nombreBuscado =
            nombre ? nombre.value.trim().toLowerCase() : "";

        const nivelSeleccionado =
            nivel ? nivel.value.toLowerCase() : "";

        const gradoSeleccionado =
            grado ? grado.value.toLowerCase() : "";

        const cursoSeleccionado =
            curso ? curso.value.toLowerCase() : "";


        const filas =
            tablaEstudiantes.querySelectorAll("tr");


        filas.forEach(function (fila, indice) {

            if (indice === 0) {
                return;
            }


            const documentoFila =
                fila.cells[0].textContent
                    .trim()
                    .toLowerCase();

            const nombreFila =
                fila.cells[1].textContent
                    .trim()
                    .toLowerCase();

            const cursoFila =
            (fila.getAttribute("data-curso") || "")
            .trim()
            .toLowerCase();
        
            const gradoFila =
            (fila.getAttribute("data-grado") || "")
           .trim()
           .toLowerCase();

            const nivelFila =
            (fila.getAttribute("data-nivel") || "")
            .trim()
            .toLowerCase();


            let mostrar = true;


            // DOCUMENTO

            if (
                documentoBuscado !== "" &&
                !documentoFila.includes(documentoBuscado)
            ) {

                mostrar = false;

            }


            // NOMBRE

            if (
                nombreBuscado !== "" &&
                !nombreFila.includes(nombreBuscado)
            ) {

                mostrar = false;

            }


            // NIVEL

            if (
                nivelSeleccionado !== "" &&
                nivelFila !== nivelSeleccionado
            ) {

                mostrar = false;

            }


            // GRADO

            if (
                gradoSeleccionado !== "" &&
                gradoFila !== gradoSeleccionado
            ) {

                mostrar = false;

            }


            // CURSO

            if (
                cursoSeleccionado !== "" &&
                cursoFila !== cursoSeleccionado
            ) {

                mostrar = false;

            }


            fila.style.display =
                mostrar ? "" : "none";

        });

    });

}


// ============================================
// 4. FILTRAR EXCUSAS
// ============================================

const tipoExcusa =
    document.getElementById("tipoExcusa");

const fechaExcusa =
    document.getElementById("fechaExcusa");

const tablaExcusas =
    document.getElementById("tablaExcusas");


// ============================================
// FILTRAR EXCUSAS
// ============================================

function filtrarExcusas() {

    if (!tablaExcusas) {
        return;
    }


    const tipo =
        tipoExcusa ? tipoExcusa.value : "";

    const fecha =
        fechaExcusa ? fechaExcusa.value : "";

    const nivelSeleccionado =
    nivel ? nivel.value : "";

    const gradoSeleccionado =
    grado ? grado.value.replace("°", "") : "";


    const cursoSeleccionado =
    curso ? curso.value : "";

    const filas =
        tablaExcusas.querySelectorAll("tr");


    filas.forEach(function (fila, indice) {

        // Saltar encabezado

        if (indice === 0) {
            return;
        }


        // Datos de la fila

        const tipoFila =
            fila.cells[1].textContent.trim();

        const fechaFila =
            fila.cells[2].textContent.trim();

        const nivelFila =
            fila.getAttribute("data-nivel") || "";

        const gradoFila =
            fila.getAttribute("data-grado") || "";

        const cursoFila =
            fila.getAttribute("data-curso") || "";


        let mostrar = true;


        // =====================================
        // TIPO DE EXCUSA
        // =====================================

        if (
            tipo !== "" &&
            tipoFila !== tipo
        ) {

            mostrar = false;

        }


        // =====================================
        // FECHA
        // =====================================

        if (fecha !== "") {

            const partes =
                fecha.split("-");

            const fechaSeleccionada =
                partes[2] + "/" +
                partes[1] + "/" +
                partes[0];


            if (
                fechaFila !==
                fechaSeleccionada
            ) {

                mostrar = false;

            }

        }


        // =====================================
        // NIVEL
        // =====================================

        if (
            nivelSeleccionado !== "" &&
            nivelFila !== nivelSeleccionado
        ) {

            mostrar = false;

        }


        // =====================================
        // GRADO
        // =====================================

        if (
            gradoSeleccionado !== "" &&
            gradoFila !== gradoSeleccionado
        ) {

            mostrar = false;

        }


        // =====================================
        // CURSO
        // =====================================

        if (
            cursoSeleccionado !== "" &&
            cursoFila !== cursoSeleccionado
        ) {

            mostrar = false;

        }


        // MOSTRAR / OCULTAR

        fila.style.display =
            mostrar ? "" : "none";

    });

}

// ============================================
// FILTRO DE EXCUSAS NO ACEPTADAS
// ============================================

const filtroTipo = document.getElementById("filtroTipo");
const filtroNivel = document.getElementById("filtroNivel");
const filtroGrado = document.getElementById("filtroGrado");
const filtroCurso = document.getElementById("filtroCurso");
const btnBuscarNOExcusas =
    document.getElementById("btnBuscarNOExcusas");
const tablaNOExcusas = document.getElementById("tablaNOExcusas");


// ============================================
// NIVEL → GRADO
// ============================================

if (filtroNivel) {

    filtroNivel.addEventListener("change", function () {

        const nivelSeleccionado = filtroNivel.value;

        // Reiniciar grado y curso
        filtroGrado.innerHTML =
            '<option value="">Todos</option>';

        filtroCurso.innerHTML =
            '<option value="">Todos</option>';

        filtroCurso.disabled = true;


        // Si no selecciona nivel
        if (nivelSeleccionado === "") {

            filtroGrado.disabled = true;

            return;
        }


        filtroGrado.disabled = false;


        // PRIMARIA
        if (nivelSeleccionado === "Primaria") {

            filtroGrado.innerHTML += `
                <option value="1°">Primero</option>
                <option value="2°">Segundo</option>
                <option value="3°">Tercero</option>
                <option value="4°">Cuarto</option>
                <option value="5°">Quinto</option>
            `;
        }


        // BACHILLERATO
        if (nivelSeleccionado === "Bachillerato") {

            filtroGrado.innerHTML += `
                <option value="6°">Sexto</option>
                <option value="7°">Séptimo</option>
                <option value="8°">Octavo</option>
                <option value="9°">Noveno</option>
                <option value="10°">Décimo</option>
                <option value="11°">Undécimo</option>
            `;
        }

    });

}


// ============================================
// GRADO → CURSO
// ============================================

if (filtroGrado) {

    filtroGrado.addEventListener("change", function () {

        const gradoSeleccionado = filtroGrado.value;

        filtroCurso.innerHTML =
            '<option value="">Todos</option>';

        filtroCurso.disabled = true;


        if (gradoSeleccionado === "") {
            return;
        }


        filtroCurso.disabled = false;


        const numeroGrado =
            gradoSeleccionado.replace("°", "");


        // Crear cursos
        for (let i = 1; i <= 7; i++) {

            let numeroCurso;

            if (i < 10) {
                numeroCurso = numeroGrado + "0" + i;
            } else {
                numeroCurso = numeroGrado + i;
            }

            filtroCurso.innerHTML += `
                <option value="${numeroCurso}">
                    ${numeroCurso}
                </option>
            `;
        }

    });

}


// ============================================
// BUSCAR
// ============================================

if (btnBuscarNOExcusas) {

    btnBuscarNOExcusas.addEventListener("click", function () {

        const tipoSeleccionado =
            filtroTipo.value;

        const nivelSeleccionado =
            filtroNivel.value;

        const gradoSeleccionado =
            filtroGrado.value;

        const cursoSeleccionado =
            filtroCurso.value;


        const filas =
            tablaNOExcusas.querySelectorAll("tr");


        // Recorrer las filas
        filas.forEach(function (fila, indice) {

            // Saltar encabezado
            if (indice === 0) {
                return;
            }


            const tipoFila =
                fila.dataset.tipo;

            const nivelFila =
                fila.dataset.nivel;

            const gradoFila =
                fila.dataset.grado;

            const cursoFila =
                fila.dataset.curso;


            let mostrar = true;


            // FILTRAR TIPO
            if (
                tipoSeleccionado !== "" &&
                tipoFila !== tipoSeleccionado
            ) {
                mostrar = false;
            }


            // FILTRAR NIVEL
            if (
                nivelSeleccionado !== "" &&
                nivelFila !== nivelSeleccionado
            ) {
                mostrar = false;
            }


            // FILTRAR GRADO
            if (
                gradoSeleccionado !== "" &&
                gradoFila !== gradoSeleccionado
            ) {
                mostrar = false;
            }


            // FILTRAR CURSO
            if (
                cursoSeleccionado !== "" &&
                cursoFila !== cursoSeleccionado
            ) {
                mostrar = false;
            }


            // MOSTRAR / OCULTAR
            fila.style.display =
                mostrar ? "" : "none";

        });

    });

}

// ============================================
// BUSCAR ACUDIENTES POR DOCUMENTO Y NOMBRE
// ============================================

const documentoAcudiente = document.getElementById("documentoAcudiente");
const nombreAcudiente = document.getElementById("nombreAcudiente");
const btnBuscarAcudiente = document.getElementById("btnBuscarAcudiente");
const tablaAcudientes = document.getElementById("tablaAcudientes");


if (btnBuscarAcudiente) {

    btnBuscarAcudiente.addEventListener("click", function () {

        const documentoBuscado =
            documentoAcudiente.value.trim().toLowerCase();

        const nombreBuscado =
            nombreAcudiente.value.trim().toLowerCase();

        const filas =
            tablaAcudientes.querySelectorAll("tr");

        filas.forEach(function (fila, indice) {

            // Saltar encabezado
            if (indice === 0) {
                return;
            }

            const documentoFila =
                fila.cells[0].textContent
                    .trim()
                    .toLowerCase();

            const nombreFila =
                fila.cells[1].textContent
                    .trim()
                    .toLowerCase();

            let mostrar = true;

            // FILTRAR DOCUMENTO
            if (
                documentoBuscado !== "" &&
                !documentoFila.includes(documentoBuscado)
            ) {
                mostrar = false;
            }

            // FILTRAR NOMBRE
            if (
                nombreBuscado !== "" &&
                !nombreFila.includes(nombreBuscado)
            ) {
                mostrar = false;
            }

            fila.style.display = mostrar ? "" : "none";

        });

    });

}

// ============================================
// FILTROS - EXCUSAS ACEPTADAS
// ============================================

const tipoAceptadas =
    document.getElementById("filtroTipoAceptadas");

const nivelAceptadas =
    document.getElementById("filtroNivelAceptadas");

const gradoAceptadas =
    document.getElementById("filtroGradoAceptadas");

const cursoAceptadas =
    document.getElementById("filtroCursoAceptadas");

const botonAceptadas =
    document.getElementById("btnBuscarAceptadas");

const tablaAceptadas =
    document.getElementById("tablaAceptadas");


// ============================================
// NIVEL → GRADO
// ============================================

if (nivelAceptadas) {

    nivelAceptadas.addEventListener("change", function () {

        const nivel = this.value;


        // Limpiar grado
        gradoAceptadas.innerHTML =
            '<option value="">Selecciona un grado</option>';


        // Limpiar curso
        cursoAceptadas.innerHTML =
            '<option value="">Selecciona un curso</option>';


        // Desactivar curso
        cursoAceptadas.disabled = true;


        // Si no selecciona nivel
        if (nivel === "") {

            gradoAceptadas.disabled = true;

            return;
        }


        // Activar grado
        gradoAceptadas.disabled = false;


        // PRIMARIA
        if (nivel === "Primaria") {

            gradoAceptadas.innerHTML += `
                <option value="1°">Primero</option>
                <option value="2°">Segundo</option>
                <option value="3°">Tercero</option>
                <option value="4°">Cuarto</option>
                <option value="5°">Quinto</option>
            `;

        }


        // BACHILLERATO
        if (nivel === "Bachillerato") {

            gradoAceptadas.innerHTML += `
                <option value="6°">Sexto</option>
                <option value="7°">Séptimo</option>
                <option value="8°">Octavo</option>
                <option value="9°">Noveno</option>
                <option value="10°">Décimo</option>
                <option value="11°">Undécimo</option>
            `;

        }

    });

}


// ============================================
// GRADO → CURSO
// ============================================

if (gradoAceptadas) {

    gradoAceptadas.addEventListener("change", function () {

        const grado = this.value;


        cursoAceptadas.innerHTML =
            '<option value="">Todos los cursos</option>';

        cursoAceptadas.disabled = true;


        if (grado === "") {
            return;
        }


        const numeroGrado = grado.replace("°", "");


        // ====================================
        // CURSOS
        // ====================================

        for (let i = 1; i <= 7; i++) {

            const numeroCurso =
                numeroGrado + "0" + i;

            cursoAceptadas.innerHTML += `
                <option value="${numeroCurso}">
                    ${numeroCurso}
                </option>
            `;

        }


        cursoAceptadas.disabled = false;

    });

}


// ============================================
// BOTÓN BUSCAR
// ============================================

if (botonAceptadas) {

    botonAceptadas.addEventListener("click", function () {

        const tipo = tipoAceptadas.value;
        const nivel = nivelAceptadas.value;
        const grado = gradoAceptadas.value;
        const curso = cursoAceptadas.value;


        const filas =
            tablaAceptadas.getElementsByTagName("tr");


        // Recorrer filas
        for (let i = 1; i < filas.length; i++) {

            const fila = filas[i];


            const tipoFila =
                fila.cells[0].textContent.trim();

            const nivelFila =
                fila.getAttribute("data-nivel");

            const gradoFila =
                fila.getAttribute("data-grado");

            const cursoFila =
                fila.getAttribute("data-curso");


            let mostrar = true;


            // TIPO
            if (
                tipo !== "" &&
                tipoFila !== tipo
            ) {

                mostrar = false;

            }


            // NIVEL
            if (
                nivel !== "" &&
                nivelFila !== nivel
            ) {

                mostrar = false;

            }


            // GRADO
            if (
                grado !== "" &&
                gradoFila !== grado
            ) {

                mostrar = false;

            }


            // CURSO
            if (
                curso !== "" &&
                cursoFila !== curso
            ) {

                mostrar = false;

            }


            // Mostrar / ocultar
            fila.style.display =
                mostrar ? "" : "none";

        }

    });

}

// ================================
// CERRAR SESIÓN
// ================================

function cerrarSesion() {

    let confirmar = confirm("¿Seguro que deseas cerrar sesión?");

    if (confirmar) {
        window.location.href = "index.html";
    }

}

document.addEventListener("DOMContentLoaded", function () {

    const password = document.getElementById("password");
    const mostrarPassword = document.getElementById("mostrarPassword");

    mostrarPassword.addEventListener("change", function () {

        if (this.checked) {
            password.type = "text";
        } else {
            password.type = "password";
        }

    });

});

// ============================================
// EDITAR PERFIL
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    const btnEditarPerfil = document.getElementById("btnEditarPerfil");

    if (!btnEditarPerfil) {
        return;
    }

    btnEditarPerfil.addEventListener("click", function () {

        const apellidos = document.getElementById("apellidos");
        const nombres = document.getElementById("nombres");
        const documento = document.getElementById("documento");
        const telefono = document.getElementById("telefono");
        const correo = document.getElementById("correo");


        // EDITAR
        if (btnEditarPerfil.textContent.trim() === "Editar Perfil") {

            apellidos.innerHTML =
                `<input type="text" id="editApellidos" value="${apellidos.textContent}">`;

            nombres.innerHTML =
                `<input type="text" id="editNombres" value="${nombres.textContent}">`;

            documento.innerHTML =
                `<input type="text" id="editDocumento" value="${documento.textContent}">`;

            telefono.innerHTML =
                `<input type="text" id="editTelefono" value="${telefono.textContent}">`;

            correo.innerHTML =
                `<input type="email" id="editCorreo" value="${correo.textContent}">`;


            btnEditarPerfil.textContent = "Guardar Cambios";

        }


        // GUARDAR
        else {

            apellidos.textContent =
                document.getElementById("editApellidos").value;

            nombres.textContent =
                document.getElementById("editNombres").value;

            documento.textContent =
                document.getElementById("editDocumento").value;

            telefono.textContent =
                document.getElementById("editTelefono").value;

            correo.textContent =
                document.getElementById("editCorreo").value;


            // Guardar los datos
            const datosPerfil = {

                apellidos: apellidos.textContent,
                nombres: nombres.textContent,
                documento: documento.textContent,
                telefono: telefono.textContent,
                correo: correo.textContent

            };


            localStorage.setItem(
                "datosPerfil",
                JSON.stringify(datosPerfil)
            );


            btnEditarPerfil.textContent = "Editar Perfil";


            alert("Perfil actualizado correctamente.");

        }

    });

});

// ============================================
// SISTEMA DE NOTIFICACIONES
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    const campana = document.getElementById("campanaNotificaciones");
    const contador = document.getElementById("contadorNotificaciones");

    if (!campana || !contador) return;

    let cantidad = Number(localStorage.getItem("cantidadNotificaciones")) || 0;

    actualizarContador();

    // Al hacer clic en la campana
    campana.addEventListener("click", function () {
        cantidad = 0;
        localStorage.setItem("cantidadNotificaciones", 0);
        actualizarContador();

        const anuncio = document.querySelector(".anuncio-notificacion");

        if (anuncio) {
            anuncio.remove();
        }
    });

    function actualizarContador() {

        if (cantidad > 0) {
            contador.textContent = cantidad;
            contador.style.display = "flex";
        } else {
            contador.style.display = "none";
        }
    }
});


// ============================================
// SISTEMA DE NOTIFICACIONES
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    const campana = document.getElementById("campanaNotificaciones");
    const contador = document.getElementById("contadorNotificaciones");

    if (!campana || !contador) return;

    let cantidad = Number(localStorage.getItem("cantidadNotificaciones")) || 0;

    actualizarContador();

    // Al hacer clic en la campana
    campana.addEventListener("click", function () {
        cantidad = 0;
        localStorage.setItem("cantidadNotificaciones", 0);
        actualizarContador();

        const anuncio = document.querySelector(".anuncio-notificacion");

        if (anuncio) {
            anuncio.remove();
        }
    });

    function actualizarContador() {

        if (cantidad > 0) {
            contador.textContent = cantidad;
            contador.style.display = "flex";
        } else {
            contador.style.display = "none";
        }
    }
});


// ============================================
// MOSTRAR UNA NOTIFICACIÓN
// ============================================

function mostrarNotificacion(titulo, mensaje) {

    // Verificar si las notificaciones están activadas
    const notificacionesActivadas =
        localStorage.getItem("notificaciones") !== "false";

    if (!notificacionesActivadas) {
        return;
    }

    // Aumentar contador
    let cantidad =
        Number(localStorage.getItem("cantidadNotificaciones")) || 0;

    cantidad++;

    localStorage.setItem(
        "cantidadNotificaciones",
        cantidad
    );

    // Crear anuncio
    const anuncio = document.createElement("div");

    anuncio.className = "anuncio-notificacion";

    anuncio.innerHTML = `
        <strong>🔔 ${titulo}</strong>
        <span>${mensaje}</span>
    `;

    document.body.appendChild(anuncio);

    // Quitar anuncio después de 5 segundos
    setTimeout(function () {
        anuncio.remove();
    }, 5000);

    // Actualizar contador si existe
    const contador =
        document.getElementById("contadorNotificaciones");

    if (contador) {
        contador.textContent = cantidad;
        contador.style.display = "flex";
    }
}


// ============================================
// AVISO DE EXCUSAS
// ============================================

function mostrarAvisoExcusa(mensaje) {

    // Verificar si los avisos de excusas están activados
    const avisosActivados =
        localStorage.getItem("avisosExcusas") !== "false";

    if (!avisosActivados) {
        return;
    }

    mostrarNotificacion(
        "Aviso de Excusas",
        mensaje
    );
}

// ============================================
// CUADRO DE NOTIFICACIONES
// ============================================

document.addEventListener("DOMContentLoaded", function () {

    const campana = document.getElementById("campanaNotificaciones");
    const lista = document.getElementById("listaNotificaciones");
    const contenido = document.getElementById("contenidoNotificaciones");

    if (!campana || !lista || !contenido) return;

    campana.addEventListener("click", function (e) {

        e.stopPropagation();

        lista.classList.toggle("mostrar");

        // Cargar las notificaciones guardadas
        const notificaciones =
            JSON.parse(localStorage.getItem("notificacionesLista")) || [];

        if (notificaciones.length === 0) {
            contenido.innerHTML = `
                <p class="sin-notificaciones">
                    No tienes notificaciones.
                </p>
            `;
            return;
        }

        contenido.innerHTML = "";

        notificaciones.forEach(function (notificacion) {

            const div = document.createElement("div");

            div.className = "notificacion-item";

            div.innerHTML = `
                <strong>🔔 ${notificacion.titulo}</strong>
                <span>${notificacion.mensaje}</span>
            `;

            contenido.appendChild(div);
        });
    });

    // Cerrar el cuadro al hacer clic fuera
    document.addEventListener("click", function () {
        lista.classList.remove("mostrar");
    });

    // Evitar que se cierre al hacer clic dentro
    lista.addEventListener("click", function (e) {
        e.stopPropagation();
    });

});