# Guía de Programación con p5.js (Niveles de Abstracción)

## Introducción

p5.js es una biblioteca de JavaScript para la web que facilita el desarrollo creativo directamente en el navegador. Se concibe como un cuaderno de dibujo sobre un elemento `<canvas>` de HTML5, orientado a estudiantes, artistas, diseñadores y docentes. La sintaxis es sencilla y la comunidad es amplia, lo que permite acceder a numerosos ejemplos y recursos. 

Su diseño favorece la integración de imágenes, animación, sonido e interacción, ofreciendo un entorno idóneo para prototipado rápido y producción creativa accesible con un simple archivo HTML y un script JavaScript. p5.js hereda el espíritu de Processing, pero ejecutándose en el navegador.

---

## Tarea inicial: Entorno y primer sketch

- Opción rápida: usar el editor web oficial de p5.js. 
- Opción local mínima: un archivo `index.html` y un `sketch.js` con el esqueleto básico.

**Estructura mínima** 
`index.html`
```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Apuntes p5.js</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js"></script>
  </head>
  <body>
    <script src="sketch.js"></script>
  </body>
</html>
```

`sketch.js`
```js
function setup() {
  createCanvas(400, 400); // tamaño del lienzo
}

function draw() {
  background(255);        // color de fondo
  // dibujo aquí
}
```

![Entorno de programación](imagenes/01_pde_entorno.png)
![Botones ejecutar y detener](imagenes/02_pde_botones.png)

---

## Tarea 1. Dibujo de primitivas básicas

**Funciones nuevas:** `line()`, `stroke(r,g,b[,a])`, `strokeWeight()`. 
El sistema de coordenadas tiene origen en la esquina superior izquierda `(0,0)`. El eje X crece hacia la derecha y el eje Y hacia abajo.

```js
function setup() {
  createCanvas(400, 400);
  background(255);

  // Línea mínima
  line(0, 0, 10, 10);

  // Color de trazo (RGB)
  stroke(255, 0, 0);
  line(0, 0, 10, 10);

  stroke(0, 255, 0);
  line(30, 10, 10, 30);
}
```

![Sistema de coordenadas 2D](imagenes/03_coords_2d.png)
![Sistema de coordenadas 2D vs 3D](imagenes/04_coords_2d_3d.png)
![Salida líneas con stroke](imagenes/05_salida_lineas_colores.png)

### Ejercicio propuesto 1
Dibuja un cuadrado con cuatro lados de distinto color, al menos uno con transparencia. Refuerza la referencia al origen cartesiano y avanza coordenadas según se indique.  
Guarda el archivo como: **apellido_nombre_p5_1**

<!--
#### Solución (referencia)
```js
function setup() {
  createCanvas(400, 400);
  background(255);
  strokeWeight(3);

  let x1 = 100, y1 = 100;
  let x2 = 300, y2 = 300;

  stroke(255, 0, 0);           // lado superior
  line(x1, y1, x2, y1);

  stroke(0, 255, 0, 150);      // derecha con transparencia
  line(x2, y1, x2, y2);

  stroke(0, 0, 255);           // inferior
  line(x2, y2, x1, y2);

  stroke(120);                 // izquierda (gris)
  line(x1, y2, x1, y1);
}
```
-->
---

## Tarea 1bis. Tamaño del lienzo, random(), strokeWeight(), background()

**Funciones nuevas:** `createCanvas(w,h)`, `background()`, `random()`, `strokeWeight()`.

```js
function setup() {
  createCanvas(640, 360);
  stroke(random(255), random(255), random(255));
  line(0, 0, 10, 10);
}
```

```js
function setup() {
  createCanvas(400, 400);
  background(128);
  strokeWeight(2);

  line(30, 30, 30, 60);
  line(30, 60, 60, 60);
  line(60, 60, 60, 30);
  line(60, 30, 30, 30);
}
```

### Ejercicio propuesto 1bis
Lienzo de 800×800, fondo verde claro, `strokeWeight(4)`. Dibuja tus iniciales con líneas; cada letra con color aleatorio (`stroke(random(...))`).  
Guarda el archivo como: **apellido_nombre_p5_1bis**

#### Solución (referencia)
```js
function setup() {
  createCanvas(800, 800);
  background(204, 255, 204);
  strokeWeight(4);
  noFill();

  // Letra A
  stroke(random(255), random(255), random(255));
  line(200, 600, 260, 200);
  line(320, 600, 260, 200);
  line(230, 420, 290, 420);

  // Letra B (segmentos)
  stroke(random(255), random(255), random(255));
  line(400, 200, 400, 600);
  line(400, 200, 520, 260);
  line(520, 260, 400, 320);
  line(400, 320, 520, 380);
  line(520, 380, 400, 440);
  line(400, 440, 520, 500);
  line(520, 500, 400, 560);
}
```

---

## Tarea 2. Dibujo de primitivas y funciones asociadas (rect(), fill())

**Funciones nuevas:** `rect(x,y,w,h)`, `fill(r,g,b[,a])`.  
Si no se llama a `fill()`, la figura se dibuja sin relleno.

```js
function setup() {
  createCanvas(400, 400);
  background(255);

  rect(100, 100, 200, 150);

  fill(0, 0, 255);            // Azul
  rect(100, 100, 200, 150);

  fill(255, 0, 0);            // Rojo
  rect(150, 150, 100, 75);
}
```

![Rectángulo básico](imagenes/06_rect_basico.png)
![Rectángulos con relleno](imagenes/07_rect_fill.png)

### Ejercicio propuesto 2
Casa rudimentaria con rectángulos y colores (base, puerta y dos ventanas azul claro). Fondo gris suave `background(200)`.  
Guarda el archivo como: **apellido_nombre_p5_2**

#### Solución (referencia)
```js
function setup() {
  createCanvas(600, 450);
  background(200);

  stroke(0);
  fill(245, 230, 200);       // pared
  rect(150, 180, 300, 200);

  fill(180, 80, 60);         // "tejado" plano
  rect(140, 160, 320, 30);

  fill(120, 70, 40);         // puerta
  rect(275, 260, 50, 120);

  fill(140, 200, 255);       // ventanas
  rect(180, 220, 70, 60);
  rect(350, 220, 70, 60);

  stroke(50);                // marcos
  line(180, 250, 250, 250);
  line(215, 220, 215, 280);
  line(350, 250, 420, 250);
  line(385, 220, 385, 280);
}
```

---

## Tarea 3. Circunferencias y arcos (ellipse(), circle(), arc())

**Funciones nuevas:** `ellipse(x,y,w,h)`, `circle(x,y,d)`, `arc(x,y,w,h,start,stop)`.  
Recordatorio: ángulos en radianes. `PI = 180°`, `HALF_PI = 90°`, `TWO_PI = 360°`. Cero radianes apunta a la derecha; el ángulo crece en sentido antihorario.

```js
function setup() {
  createCanvas(400, 400);
  background(255);

  noFill();
  stroke(0);
  strokeWeight(2);
  circle(200, 200, 180);         // círculo

  ellipse(200, 200, 260, 120);   // elipse horizontal
  ellipse(200, 200, 120, 260);   // elipse vertical

  stroke(255, 0, 0);
  arc(200, 200, 180, 180, 0, PI);         // semicírculo superior

  stroke(0, 0, 255);
  arc(200, 200, 120, 120, -HALF_PI, 0);   // cuarto de círculo
}
```

![Elipses y arcos básicos](imagenes/08_ellipse_arc_basico.png)

### Ejercicio propuesto 3
Carita con círculos y un arco: círculo grande sin relleno para la cabeza, ojos como dos círculos rellenos y boca con un arco de 0 a PI.  
Guarda el archivo como: **apellido_nombre_p5_3**

#### Solución (referencia)
```js
function setup() {
  createCanvas(400, 400);
  background(255);

  // Cabeza
  noFill();
  stroke(0);
  strokeWeight(3);
  circle(200, 200, 250);

  // Ojos
  fill(0);
  noStroke();
  circle(160, 170, 20);
  circle(240, 170, 20);

  // Boca
  noFill();
  stroke(0);
  strokeWeight(4);
  arc(200, 230, 120, 80, 0, PI);
}
```

![Composición carita con circle() y arc()](imagenes/09_carita_circle_arc.png)
