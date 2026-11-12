# Ranking PUG

Datos consultados el 12 de noviembre de 2026 en el historial «Others» de Scope.gg de MigiWR. Se analizaron los 15 marcadores que se mostraron, desde el 12 de octubre hasta el 10 de noviembre; uno tiene dos jugadores por equipo y otro muestra seis por equipo. Scope puede no incluir partidas que no estén en ese historial. Los 29 jugadores se identifican por su ID de Scope; cuentas diferentes no se fusionan sin confirmación, incluido Deadshot 2.0. Los nombres y avatares corresponden a los marcadores consultados.

`pug-datos.js` conserva los totales de cada estadística publicada en las tablas Main y los enlaces a los 15 marcadores; `pug.js` calcula la clasificación. La fuente se puede revisar pulsando cada partida en la página. Una futura actualización debe revisar cada marcador, sumar sus datos por ID de Scope y evitar duplicar partidos.

La puntuación usa rating Scope 2.1 (40 %), ADR (20 %), K/D (15 %), KAST (10 %) y victorias (15 %), en escalas limitadas a 0–100: rating / 2, ADR / 150 y K/D / 2; KAST y victorias se expresan directamente en porcentaje. La puntuación se ajusta por muestra con `40 + (rendimiento - 40) * partidos / (partidos + 5)`. Los jugadores con menos de tres partidas se muestran provisionales y después de los clasificados. El rating, ADR y KAST son medias por partida; K/D es bajas totales divididas por muertes totales. Se incluyen partidas con reemplazos tal como aparecen en el marcador; las estadísticas del jugador se atribuyen a su equipo en esa partida.

El ranking PUG es independiente del oficial. Está en `pug.html`, con acceso desde la cabecera del sitio; es estático y funciona en GitHub Pages. No incorpora estadísticas de Premier, Leetify ni FACEIT al cálculo.
