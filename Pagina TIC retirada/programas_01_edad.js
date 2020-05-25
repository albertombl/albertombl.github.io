
function programa_1()
{
  alert("Este programa calculará tu edad actual ¿Estás seguro de ir adelante?")

  var año;
  año=prompt("Cuál es tu año de nacimiento:", "1900")
  var currenttime=new Date();
  var año_actual=currenttime.getFullYear();
  edad=año_actual-año;
  alert(edad)
}

function programa_2()
{
  alert("Este programa te dirá si eres mayor de edad ¿Estás seguro de ir adelante?")

  var año;
  año=prompt("Cuál es tu año de nacimiento:", "1900")
  var currenttime=new Date();
  var año_actual=currenttime.getFullYear();
  edad=año_actual-año;
  if(edad<18)
  {
    var espera;
    espera=18-edad;
    alert("Eres menor de edad te toca esperar: "+ espera +" años")
  }
  else{
    alert("Eres mayor de edad podrás votar en las próximas elecciones. Piénsatelo bien.")
  }

}

function programa_3()
{
  var ventana=window.open("","Ventana_mensajes","width=200,height=500");

  var año;
  año=prompt("Cuál es tu año de nacimiento:", "1900")
  var currenttime=new Date();
  var año_actual=currenttime.getFullYear();
  edad=año_actual-año;
  if(edad<18)
  {
    var espera;
    espera=18-edad;
    ventana.document.write("<h1>Consola<h1>","Eres menor de edad te toca esperar: ",espera," años")

  }
  else{
    ventana.document.writeln("<h1>Consola<h1>","<p>Eres mayor de edad podrás votar en las próximas elecciones. Piénsatelo bien.</p>")
  }


}
