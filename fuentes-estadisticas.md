# Fuentes de estadísticas del Ranking OBF

Consulta los perfiles de CSStats indicados aquí cuando se solicite actualizar el ranking. Los nombres pueden cambiar: usa la URL o el SteamID para identificar cada jugador. Verifica los datos directamente antes de sustituirlos.

| Jugador en el ranking o nombre consultado | Perfil de CSStats |
| --- | --- |
| MigiWR | https://csst.at/profile/MigiWR |
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
- Usa los valores publicados de Leetify, cstracker.gg, rating Premier y ELO de FACEIT; marca como ausentes los valores no disponibles. No inventes estadísticas. El último campo de cada fila de `estadisticas-2026-11-07.txt` es el rating Premier; déjalo vacío si no se muestra.
- Recalcula la puntuación OBF con las cinco categorías: rendimiento 35 % (Leetify Rating 20, ADR de cstracker.gg 10, KAST 5), resultados 20 % (winrate 10, rango competitivo 10), mecánica 20 % (time to damage 7, preaim 5, counter-strafe 4, HS kills 4), juego colectivo 15 % (utility 8, position 7) y momentos decisivos 10 % (opening 5, clutch 5). El Rating 2.0 estimado es informativo y no puntúa.
- Para el rango competitivo, usa FACEIT cuando esté disponible y, en su ausencia, Premier; normaliza cada plataforma por separado frente al grupo. Solo se usa un rango por jugador. Redistribuye proporcionalmente el peso de cada métrica ausente entre todas las disponibles; nunca la trates como cero.
- Actualiza coherentemente las posiciones por estadística, el orden, divisiones, podio, equipos, metadatos, tabla y objetos `PROFILES`; comprueba que cada ficha abra el jugador correcto.
- El sitio muestra datos de distintos proveedores y ventanas de partidos; registra la fecha de consulta y mantén identificada cada fuente. Si alguna fuente no carga, evita presentar sus datos anteriores como actuales.

Última actualización de estadísticas y ranking: 7 de noviembre de 2026. La instantánea consultada está en `estadisticas-2026-11-07.txt`. Para regenerar el HTML con esa instantánea, ejecuta `node actualizar-ranking.js`; para una actualización futura, consulta primero los enlaces y actualiza la instantánea y la fecha del generador.

Las variaciones de posición se comparan con `posiciones-anteriores.json`, que conserva el ranking de 18 jugadores anterior a la actualización inicial de los enlaces. Los jugadores ausentes de ese archivo se muestran como nuevos; conserva esa referencia hasta que se solicite cambiarla.
