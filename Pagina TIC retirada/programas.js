
//Vamos a meter todo lo que teníamos en el programa pide_nombre.js dentro de una función. Veamos cómo se define:

function pide_nombre()
{
  //Dentro de estas llaves irá el programa pide_nombre

  var nombre;
  nombre=prompt("Escribe tu nombre","Nombre")

  alert("Hola " + nombre + ".\nEspero que veas el potencial de esta herramienta.\n¿Sabes quien soy?");
  alert("Soy TICO y tu profesor me ha programado.");
}

function alerta()
{
  //Siguiendo el mismo procedimiento anterior, ahora vamos a incluir el primer programa que creamos: alerta.js como una función que podremos ejecutar con otro botón.

  alert("Bienvenido de nuevo, este programa se ha ejecutado al cargar la página.")

}
