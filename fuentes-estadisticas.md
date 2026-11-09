# Fuentes de estadísticas del Ranking OBF

Consulta los perfiles de CSStats indicados aquí cuando se solicite actualizar el ranking. Los nombres pueden cambiar: usa la URL o el SteamID para identificar cada jugador. Verifica los datos directamente antes de sustituirlos.

| Jugador en el ranking o nombre consultado | Perfil de CSStats |
| --- | --- |
| MigiWR (cuenta principal, cuenta que puntúa en el ranking) | https://csst.at/profile/MigiWR |
| NomFPS (cuenta secundaria del mismo jugador; no ocupa otro puesto) | https://csst.at/profile/nomfps |
| M4rceeX | https://csst.at/profile/76561198337276315 |
| Fronter | https://csst.at/profile/76561198080215754 |
| DeadShot | https://csst.at/profile/76561199849098615 |
| delmito | https://csst.at/profile/delmides_17 |
| J1suS | https://csst.at/profile/jisus_ |
| hAww | https://csst.at/profile/arcadio202 |
| Z3R0taps | https://csst.at/profile/76561199050520415 |
| Ecuadorian Toad <3 | https://csst.at/profile/76561198799908309 |
| Semir | https://csst.at/profile/askoulsemir |
| Bigui | https://csst.at/profile/76561199848996000 |
| AntooNEEEE | https://csst.at/profile/76561199042296869 |
| 4NDRES | https://csst.at/profile/76561199348426725 |
| lete99 | https://csst.at/profile/76561199620049304 |
| [SGT]Tompsom | https://csst.at/profile/SGTtompsom |
| Holaa | https://csst.at/profile/76561199799060008 |
| Flys | https://csst.at/profile/PredatorFly |
| Gift me a glove | https://csst.at/profile/76561198913208921 |
| Fronsay | https://csst.at/profile/76561199517977469 |
| gajve95 | https://csst.at/profile/76561199619598523 |

## Instrucciones para la actualización

- Consulta cada perfil y conserva las fuentes y periodos por separado: Leetify, cstracker.gg y FACEIT. No confundas las métricas con el mismo nombre de diferentes proveedores.
- El HTML contiene los 20 jugadores, incluidos Ecuadorian Toad <3 y 4NDRES.
- Usa los valores publicados de Leetify, cstracker.gg, rating Premier y ELO de FACEIT; marca como ausentes los valores no disponibles. No inventes estadísticas. El último campo de cada fila de `estadisticas-2026-11-08.txt` es el rating Premier; déjalo vacío si no se muestra.
- Recalcula la puntuación OBF con las cinco categorías: rendimiento 35 % (Leetify Rating 20, ADR de cstracker.gg 10, KAST 5), resultados 20 % (winrate 10, rango competitivo 10), mecánica 20 % (time to damage 7, preaim 5, counter-strafe 4, HS kills 4), juego colectivo 15 % (utility 8, position 7) y momentos decisivos 10 % (opening 5, clutch 5). El Rating 2.0 estimado es informativo y no puntúa.
- Para el rango competitivo, usa Premier actual; si no aparece, consulta Leetify y utiliza el último valor conocido guardado en `premier-historico.json` con la fuente y fecha de consulta. Solo si no existe ningún dato de Premier, usa FACEIT. Normaliza cada plataforma por separado frente al grupo y usa un solo rango por jugador. Redistribuye proporcionalmente el peso de cada métrica ausente entre todas las disponibles; nunca la trates como cero.
- Actualiza coherentemente las posiciones por estadística, el orden, los colores de los grupos de cinco, el podio, la lista y los objetos `PROFILES`; comprueba que cada ficha abra el jugador correcto.
- El sitio muestra datos de distintos proveedores y ventanas de partidos; registra la fecha de consulta y mantén identificada cada fuente. Si alguna fuente no carga, evita presentar sus datos anteriores como actuales.

Última actualización de estadísticas y ranking: 8 de noviembre de 2026. La instantánea consultada está en `estadisticas-2026-11-08.txt`. Para regenerar el HTML con esa instantánea, ejecuta `node actualizar-ranking.js`; para una actualización futura, consulta primero los enlaces y actualiza la instantánea y la fecha del generador.

Las variaciones de posición se comparan con `posiciones-anteriores.json`, que conserva el ranking de 18 jugadores anterior a la actualización inicial de los enlaces. Los jugadores ausentes de ese archivo se muestran como nuevos; conserva esa referencia hasta que se solicite cambiarla.

Los rangos de letras se asignan por puntuación OBF: S ≥ 70, A ≥ 60, B ≥ 50, C ≥ 40, D ≥ 30, E ≥ 20 y F < 20. La lista muestra Premier con los colores por intervalo y señala los valores recuperados con su fecha de consulta.

La cuenta secundaria NomFPS está documentada en `cuenta-secundaria.json`: actualiza sus datos desde su enlace al actualizar perfiles. No la agregues como jugador adicional ni la incluyas en el cálculo del ranking; la puntuación y posición de MigiWR corresponden únicamente a su cuenta principal.

Consulta del 8 de noviembre: perfiles verificados en el navegador. Leetify: últimos 30 partidos; cstracker.gg: 90 partidos, excepto MigiWR (63) y Z3R0taps (6). Los cinco Premier ausentes en csst.at se consultaron directamente en Leetify y se registraron con fuente y fecha en `premier-historico.json`. FACEIT conserva su propia ventana; su ELO es el publicado al consultar.
