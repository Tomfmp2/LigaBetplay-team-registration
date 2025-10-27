

const agregarLogo = document.getElementById('add-logo');
const botonRegistrar = document.getElementById('button-registrar');
const contenedorNombres = document.getElementById('equipo');
const contenedorLogos = document.getElementById('escudo-equipo');
let base64Data = null;

// Convertir logo a Base64
agregarLogo.addEventListener('change', () => {
	const logoAgregado = agregarLogo.files[0];
	const lector = new FileReader();
	lector.onload = () => (base64Data = lector.result);
	lector.readAsDataURL(logoAgregado);
});

// Guardar equipo
function guardarEquipo(nombre, logo) {
	return new Promise((resolve, reject) => {
		if (!nombre.trim()) return reject("El nombre está vacío");
		if (!logo) return reject("El logo no ha sido seleccionado");
		let registros = JSON.parse(localStorage.getItem('registrosEquipos')) || [];
		registros.push({ nombre, logo });
		localStorage.setItem('registrosEquipos', JSON.stringify(registros));
		resolve("Equipo guardado correctamente.");
	});
}

// Mostrar registros
function mostrarRegistros() {
	contenedorNombres.querySelectorAll('.name-registrado').forEach(e => e.remove());
	contenedorLogos.querySelectorAll('.logo-container').forEach(e => e.remove());

	const registros = JSON.parse(localStorage.getItem('registrosEquipos')) || [];

	registros.forEach((registro, index) => {
		const nombre = document.createElement('p');
		nombre.classList.add('name-registrado');
		nombre.textContent = registro.nombre;
		contenedorNombres.appendChild(nombre);

		const logoContainer = document.createElement('div');
		logoContainer.classList.add('logo-container');

		const botonesContainer = document.createElement('div');
		botonesContainer.classList.add('botones-container');

		const btnEditar = document.createElement('button');
		btnEditar.textContent = "Editar";
		btnEditar.classList.add('editar');
		btnEditar.addEventListener('click', () => editarRegistro(index));

		const btnEliminar = document.createElement('button');
		btnEliminar.textContent = "Eliminar";
		btnEliminar.classList.add('eliminar');
		btnEliminar.addEventListener('click', () => eliminarRegistro(index));

		botonesContainer.appendChild(btnEditar);
		botonesContainer.appendChild(btnEliminar);

		const img = document.createElement('img');
		img.src = registro.logo;
		img.classList.add('logo-equipo');

		logoContainer.appendChild(botonesContainer);
		logoContainer.appendChild(img);
		contenedorLogos.appendChild(logoContainer);
	});

	alinearFilas();
}

function alinearFilas() {
	const nombres = document.querySelectorAll('.name-registrado');
	const logos = document.querySelectorAll('.logo-container');
	const filas = Math.min(nombres.length, logos.length);
	for (let i = 0; i < filas; i++) {
		const altura = Math.max(nombres[i].offsetHeight, logos[i].offsetHeight);
		nombres[i].style.height = `${altura}px`;
		logos[i].style.height = `${altura}px`;
		nombres[i].style.display = 'flex';
		nombres[i].style.alignItems = 'center';
	}
}

// Editar registro
function editarRegistro(index) {
	const registros = JSON.parse(localStorage.getItem('registrosEquipos')) || [];
	const nuevoNombre = prompt("Editar nombre del equipo:", registros[index].nombre);
	if (nuevoNombre && nuevoNombre.trim() !== "") {
		registros[index].nombre = nuevoNombre.trim();
		localStorage.setItem('registrosEquipos', JSON.stringify(registros));
		mostrarRegistros();
	  }
}

// Eliminar registro
function eliminarRegistro(index) {
	let registros = JSON.parse(localStorage.getItem('registrosEquipos')) || [];
	registros.splice(index, 1);
	localStorage.setItem('registrosEquipos', JSON.stringify(registros));
	mostrarRegistros();
}

// Registrar equipo
botonRegistrar.addEventListener('click', () => {
	const nombreEquipo = document.getElementById('name-equipo').value;
	guardarEquipo(nombreEquipo, base64Data)
		.then(() => {
		mostrarRegistros();
		document.getElementById('name-equipo').value = "";
		agregarLogo.value = "";
		base64Data = null;
	})
	.catch(error => alert(error));
});


mostrarRegistros();

