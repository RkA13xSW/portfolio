//TODO: VARIABLES GLOBALES:
var username = 'Invitado';
var nivelVentana = 10;
var arrastrando = false;
var ejeX, ejeY;
var fullScreen = false;


// TODO: MOVER RELOJ:
function mueveReloj(){
    date = new Date();
    horaImprimible = date.toLocaleTimeString();
    document.getElementById('relojHora').value = horaImprimible;
    setTimeout("mueveReloj()",1000);
} 

// TODO: CAMBIO FRASES PANTALLA DE CARGA:
function cambiarFraseCarga(){
    const CAJA = document.getElementById('loadingScreen');
    const FRASES = [
        "El 52% del tráfico de todo Internet es creado por Bots.",
        "Google utiliza 1.000 ordenadores en 0,2 segundos para ofrecer un resultado.",
        "En el mundo existen 370,1 millones de dominios registrados.",
        "Los productos y servicios que más se compran por Internet son: Entretenimiento (68%), tecnología (66%), alimentación (62%).",
        "Si la web de Amazon estuviera caída un día entero, sin poder vender nada, perdería 360 millones de euros.",
        "España es el país con más smartphones por habitante en el mundo.",
        "El 38,8% de los usuarios abandonan una web si no está adaptada para smartphone.",
        "La palabra más cara de España es \"Mysql Import\" con un coste de 82,57$ por clic.",
        "Se envían más de 100 mil millones de correos diariamente.",
        "Hay 3.800 millones de usuarios activos en redes sociales (casi la mitad de los habitantes de la tierra)."
    ];
    if(!CAJA.classList.contains('noVer')){
        document.getElementById('frasesCarga').innerHTML = FRASES[Math.floor(Math.random() * 10)];
        setTimeout("cambiarFraseCarga()",3000);
    }
}

// TODO: GUARDAR NOMBRE USER:
function guardarNombre(){
    username = document.getElementById('nameLoggin').value;
    document.getElementById('buttonLoggin').disabled = false;
}

//TODO: CARGAMOS LOS ELEMENTOS AL FINALIZAR LA CARGA DE LA WEB:
function finalizacionCarga(){
    cambiarFraseCarga();
    mueveReloj();
    eventoDragVentanas();
    cambiarVisibilidad(`loadingScreen`);
}

// TODO: VENTANA SALUDO:
function cambiarTextoSaludo(){
    document.getElementById("saludo").value = `!Bienvenido a mi portfolio ${username}! \nSe irá actualizando el contenido a medida de que haya cambios. \nSi encuentra cualquier error o tiene cualquier duda contacteme sin ningún problema. \nTodos los iconos que puedes observar son interactuables y las carpetas se abren con doble click ¿Quién sabe que habrá? \n¡Espero que lo disfrute! `;
}

// TODO: FUNCIÓN PARA REALIZAR UNA ENTRADA ANIMADA Y QUE PERMANEZCA
function entradaLateral(idElemento){
    const ELEMENTOANIMACION = document.getElementById(idElemento);

    ELEMENTOANIMACION.classList.remove('noVer');
    if(idElemento == "ventanaBienvenida"){
        cambiarTextoSaludo();
    }

    ELEMENTOANIMACION.style = "animation-name: entradaLateralDerecha; animation-duration: 1s;";
    
    ELEMENTOANIMACION.classList.add('ver');
    setTimeout(()=>{
        ELEMENTOANIMACION.style = "right: 5px; top: 50px;" 
    }, 999);
}

// TODO: ENTRADA SUPERIOR PARA EL SISTEMA
function entradaSistema(){
    const ELEMENTOSISTEMA = document.getElementById('ventanaSistema');

    ELEMENTOSISTEMA.classList.remove('noVer');
    nivelVentana = nivelVentana + 1;
    ELEMENTOSISTEMA.style = `animation-name: entradaSuperiorIzquierda; animation-duration: 1s; z-index: ${nivelVentana}`;
    
    ELEMENTOSISTEMA.classList.add('ver');
    setTimeout(()=>{
        ELEMENTOSISTEMA.style = "left: 10px; top: 47px;" 
    }, 1000);
}

// TODO: CERRAR VENTANAS
function cerrarVentana(idElemento){
    const ELEMENTOANIMACION = document.getElementById(idElemento);
    if(idElemento == "ventanaSistema"){
        ELEMENTOANIMACION.style = "left: 10px; top: 47px; animation-name: cerrarVentana; animation-duration: 0.5s;";
    }else{
        ELEMENTOANIMACION.style = "right: 5px; top: 50px; animation-name: cerrarVentana; animation-duration: 0.5s;";
    }
    setTimeout(()=>{
        ELEMENTOANIMACION.classList.remove('ver');
        ELEMENTOANIMACION.classList.add('noVer');
    }, 490);
}

// TODO: Control de click fuera de ventanas:
window.addEventListener('click', function(e){   
    if (document.getElementById('ventanaSistema').contains(e.target) || document.getElementById('top-bar-pcico').contains(e.target)){
      // Click en la caja
    } else{
        //Cerrar ventana sistema al hacer click fuera de esta:
        cerrarVentana('ventanaSistema');
    }
});

// TODO: EVENTO DE ARRARTE; SUPERPOSICIÓN Y MAXIMIZACIÓN DE VENTANAS:
function eventoDragVentanas(){
    const VENTANAS = document.querySelectorAll(".ventana");

    VENTANAS.forEach(ventana => {
            
        let mousePosition   = [0,0];
        let element         = document.getElementById(ventana.id);
        let elementPosition = [10 , 55];
        
        let mainEH = function (event) {
            if(!fullScreen && event.target.classList.contains('barraSuperiorVentana')){
                let rect = event.target.getBoundingClientRect();
                elementPosition = [rect.left , rect.top];
                mousePosition = [event.clientX, event.clientY];
                document.addEventListener('mousemove', calcEH);
                document.addEventListener('mouseup', removeHandlers);
                document.addEventListener('contextmenu', removeHandlers);
            }
        };
        
        let calcEH = function (event) {
            let vector      = [-mousePosition[0] + event.clientX, -mousePosition[1] + event.clientY];
            mousePosition   = [mousePosition[0] + vector[0], mousePosition[1] + vector[1]];
            elementPosition = [elementPosition[0] + vector[0], elementPosition[1] + vector[1]];
            updatePosition();
        };
        
        let removeHandlers = function () {
            if(elementPosition[1] <= 0){
                maximizarVentana(element.id);
            }
            document.removeEventListener('mousemove', calcEH);
            document.removeEventListener('mouseup', removeHandlers);
            document.removeEventListener('contextmenu', removeHandlers);
        };
        
        function updatePosition() {
            element.style.left = elementPosition[0] + "px";
            element.style.top  = elementPosition[1] + "px";
        }
        
        element.addEventListener('mousedown', mainEH, true);

        ventana.addEventListener('click', ()=>{
            superponerVentanas(ventana.id);
        });
            
            
    });
}

// TODO: OCULTAR/VISUALIZAR ELEMENTOS:
function cambiarVisibilidad(idElemento){
    const ELEMENTO = document.getElementById(idElemento);

    if(ELEMENTO.classList.contains('noVer')){
        ELEMENTO.classList.remove('noVer');
        ELEMENTO.classList.add('ver');
    }else{
        ELEMENTO.classList.remove('ver');
        ELEMENTO.classList.add('noVer');
    }
}

//TODO REDIMENSIONA VENTANA A SU ESTADO ORIGINAL:
function redimensionOriginalVentana(idVentana){
    const VENTANA = document.getElementById(idVentana);

    nivelVentana = nivelVentana + 1;

    VENTANA.classList.remove('noVer');
    VENTANA.style.zIndex = nivelVentana;
    VENTANA.style.width= '50vw';
    VENTANA.style.height= '400px';
    VENTANA.style.top= '55px';
    VENTANA.style.left= '10px';
    VENTANA.classList.add('ver');
}

// TODO: ABRIR VENTANA
function abrirVentana(idVentana){
    const VENTANA = document.getElementById(idVentana);

    if(VENTANA.classList.contains('noVer')){
        const ICONOVENTANAMIN = document.getElementById('min' + idVentana);
        const ICONOVENTANAMAX = document.getElementById('max' + idVentana);

        VENTANA.style = `
            animation-name: abrirVentana;
            animation-duration: 0.5s;
            `; 
        redimensionOriginalVentana(VENTANA.id);
        
        ICONOVENTANAMIN.classList.add('noVer');
        ICONOVENTANAMAX.classList.add('ver');

        ICONOVENTANAMIN.classList.remove('ver');
        ICONOVENTANAMAX.classList.remove('noVer');
    }else{

        VENTANA.style = `
            animation-name: parpadeoVentana;
            animation-duration: 0.5s;
        `; 
        redimensionOriginalVentana(VENTANA.id);

        setTimeout(()=>{
            VENTANA.style.opacity = "1";
            VENTANA.style = `
            animation-name: none;
            `; 
            redimensionOriginalVentana(VENTANA.id);
        }, 500);
    }
}

//TODO: CERRAR VENTANA:
function cerrarVentanaDir(idVentana){
    const VENTANA = document.getElementById(idVentana);
    fullScreen = false;
    VENTANA.style.transition = "0.5s";
    VENTANA.style.opacity = "0";
    setTimeout(()=>{
        VENTANA.classList.remove('ver');
        VENTANA.classList.add('noVer');
    }, 500);
    
}

// TODO: SUPERPONER VENTANAS:
function superponerVentanas(idVentana){
    const VENTANA = document.getElementById(idVentana);
    nivelVentana = nivelVentana + 1;
    VENTANA.style.zIndex = nivelVentana;
}

//TODO: MAXIMIZAR VENTANA:
function maximizarVentana(idVentana){
    const VENTANA = document.getElementById(idVentana);

    const ICONOVENTANAMIN = document.getElementById('min' + idVentana);
    const ICONOVENTANAMAX = document.getElementById('max' + idVentana);
    
    VENTANA.style.transition = "0.5s"


    VENTANA.style.zIndex = nivelVentana;
    VENTANA.style.width= 'calc(100vw - 4px)';
    VENTANA.style.height= 'calc(100vh - 4px)';
    VENTANA.style.top= '2px';
    VENTANA.style.left= '2px';
    
    ICONOVENTANAMIN.classList.add('ver');
    ICONOVENTANAMAX.classList.add('noVer');

    ICONOVENTANAMIN.classList.remove('noVer');
    ICONOVENTANAMAX.classList.remove('ver');

    fullScreen = true;
}

//TODO: MINIMIZAR VENTANA:
function minimizarVentana(idVentana){
    const VENTANA = document.getElementById(idVentana);

    const ICONOVENTANAMIN = document.getElementById('min' + idVentana);
    const ICONOVENTANAMAX = document.getElementById('max' + idVentana);

    redimensionOriginalVentana(VENTANA.id);

    ICONOVENTANAMIN.classList.add('noVer');
    ICONOVENTANAMAX.classList.add('ver');

    ICONOVENTANAMIN.classList.remove('ver');
    ICONOVENTANAMAX.classList.remove('noVer');

    
    setTimeout(()=>{
        fullScreen = false;
        VENTANA.style.transition = "0s";
    }, 500);
    

}

// TODO: MUESTRA LAS VENTANAS DE LAS APLICACIONES:
function mostrarAplicacion(idApp){
    const APLICACION = document.getElementById(idApp);
    APLICACION.classList.remove('noVer');
    APLICACION.classList.add('ver');
}

// TODO: CIERRA LA VENTANA DE LAS APLICACIONES:
function cerrarAplicacion(idApp){
    const APLICACION = document.getElementById(idApp);
    APLICACION.classList.remove('ver');
    APLICACION.classList.add('noVer');
}
/**
 * AÑADIR:
 * -MOSTRAR CONTENIDO EN VENTANAS
 * -HACER CONFIGURACIÓN LATERAL
 */