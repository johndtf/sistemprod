# Base de datos

## Tabla estados

Contiene los estados posibles de una llanta.

Ejemplos:

1 = Pendiente
2 = Apta
3 = Rechazada

---

## Tabla llantas

Contiene la información actual de cada llanta.

La tabla llantas representa el estado actual del proceso.

Campos importantes:

### id_estado

Estado actual de la llanta.

### nivel_reencauche

Número de reencauche actual.

Ejemplos:

1 = Primer reencauche
2 = Segundo reencauche
3 = Tercer reencauche

---

## Tabla subprocesos

Catálogo de etapas productivas.

Campos:

- id_subproceso
- nombre
- orden (la secuencia del subproceso es decir si está de segundo o tercero, etc)

Ejemplo:

1 = Inspección Inicial
2 = Preparación
3 = Raspado
4 = Escariado
etc.

---

## Tabla procesos

Historial de ejecución de subprocesos.

Cada registro representa una ejecución de un subproceso para una llanta.

Una misma llanta puede tener múltiples registros para un mismo subproceso.

Esto permite manejar reprocesos sin perder historial.
