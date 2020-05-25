/*
Recoger un dato por teclado y visualizarlo.
En muchas    ocasiones será de gran utilidad recoger un dato por teclado y guardarlo para ,   posteriormente, tomar decisiones según lo que se haya introducido (muy útil, por ejemplo, para los accesos de los usuarios a las páginas).
En este ejemplo, la variable que definimos, nombre nosservirá para guardar lo que introduzcamos por teclado a través de la función prompt() de Javascript.*/

//Primero definiremos la variable donde alojaremos el dato que introduzca el cliente.

var nombre;

/*Para recoger el nombre usaremos la función prompt() que una vez que el cliente introduzca su nombre nos entregará esa información. Esa información la guardaremos en la variable que hemos creado para usarla después si la queremos*/
nombre=prompt("Escribe tu nombre","Nombre");

/*Fíjate que le tenemos que pasar dos cadenas de texto separadas por comas. Eso son dos atributos. Relaciónalos con el mensaje que sale en la pantalla. Las funciones trabajan con atributos que les pasamos, algunas no neceistan como las de los juegos  moveforward(), getX(), noworm(), pero otras sí que necesitarán de algúnn atributo con el que hacer "algo" (como es este caso)*/

alert("Hola " + nombre + ".\nEspero que veas el potencial de esta herramienta.\n¿Sabes quien soy?");
alert("Soy TICO y tu profesor me ha programado.");

/*Aquí ya se complicó la cosa. Habla con el profesor para que te ayude a interpretar ese signo + con la variable nombre*/
/*También nos encontramos con un caracter raro  \n   .Pregúntale para qué sirve*/
/*No te olvides de tratar el ; que hay al final de cada instrucción, suele ser el origen de muchos problemas a la hora de ejecutar estos scripts*/
