# Fuentes de estadísticas del Ranking OBF

Consulta los perfiles de CSStats indicados aquí cuando se solicite actualizar el ranking. Los nombres pueden cambiar: usa la URL o el SteamID para identificar cada jugador. Verifica los datos directamente antes de sustituirlos.

| Jugador en el ranking o nombre consultado | Perfil de CSStats |
| --- | --- |
| Skrog ∆. (Steam: Josue06) | https://csst.at/profile/76561198062014243 |
| JosekL | https://csst.at/profile/76561199650858969 |
| P0RN_Star (utiliza el mismo avatar que delmito) | https://csst.at/profile/76561199806088701 |
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
- En cada actualización, revisa el Premier y el ELO de FACEIT de todos los jugadores y NomFPS; conserva el último Premier conocido con su fuente y fecha cuando no haya uno activo.
- El HTML contiene 23 jugadores; P0RN_Star utiliza el mismo avatar que delmito.
- Usa los valores publicados de Leetify, cstracker.gg, rating Premier y ELO de FACEIT; marca como ausentes los valores no disponibles. No inventes estadísticas. El último campo de cada fila de `estadisticas-2026-11-11.txt` es el rating Premier; déjalo vacío si no se muestra.
- Recalcula la puntuación OBF con las cinco categorías: rendimiento 35 % (Leetify Rating 20, ADR de cstracker.gg 10, KAST 5), resultados 20 % (winrate 10, rango competitivo 10), mecánica 20 % (time to damage 7, preaim 5, counter-strafe 4, HS kills 4), juego colectivo 15 % (utility 8, position 7) y momentos decisivos 10 % (opening 5, clutch 5). El Rating 2.0 estimado es informativo y no puntúa.
- Para el rango competitivo, usa Premier actual; si no aparece, consulta Leetify y utiliza el último valor conocido guardado en `premier-historico.json` con la fuente y fecha de consulta. Solo si no existe ningún dato de Premier, usa FACEIT. Normaliza cada plataforma por separado frente al grupo y usa un solo rango por jugador. Cada métrica ausente incluida en el cálculo aporta 0 puntos a su propio peso; no redistribuyas ese porcentaje ni incorpores el cero como si fuera una observación real al normalizar el grupo.
- Actualiza coherentemente las posiciones por estadística, el orden, los colores de los grupos de cinco, el podio, la lista y los objetos `PROFILES`; comprueba que cada ficha abra el jugador correcto.
- El sitio muestra datos de distintos proveedores y ventanas de partidos; registra la fecha de consulta y mantén identificada cada fuente. Si alguna fuente no carga, evita presentar sus datos anteriores como actuales.

Último recálculo del ranking: 11 de noviembre de 2026. Los 22 jugadores anteriores y NomFPS se consultaron el 10 de noviembre, y Skrog ∆. el 11 de noviembre. La instantánea consultada está en `estadisticas-2026-11-11.txt`. Para regenerar el HTML con esa instantánea, ejecuta `node actualizar-ranking.js`; para una actualización futura, consulta primero los enlaces y actualiza la instantánea y la fecha del generador.

Las variaciones comparan el puesto actual con la clasificación inmediatamente anterior en `posiciones-anteriores.json`. Antes de modificar estadísticas, jugadores o fórmula para una nueva actualización, ejecuta `node registrar-posiciones.js` una sola vez para guardar los puestos actuales; después actualiza los datos y regenera el ranking. No ejecutes ese paso al repetir la generación de la misma actualización. Los jugadores sin puesto previo muestran un guion. El archivo `posiciones-iniciales.json` conserva la referencia histórica de 18 jugadores.

Los rangos de letras se asignan por puntuación OBF: S ≥ 70, A ≥ 60, B ≥ 50, C ≥ 40, D ≥ 30, E ≥ 20 y F < 20. La lista muestra Premier con los colores por intervalo y señala los valores recuperados con su fecha de consulta.

La cuenta secundaria NomFPS está documentada en `cuenta-secundaria.json`: actualiza sus datos desde su enlace al actualizar perfiles. No la agregues como jugador adicional ni la incluyas en el cálculo del ranking; la puntuación y posición de MigiWR corresponden únicamente a su cuenta principal.

Consulta del 8 de noviembre: perfiles verificados en el navegador. Leetify: últimos 30 partidos; cstracker.gg: 90 partidos, excepto MigiWR (63) y Z3R0taps (6). Los cinco Premier ausentes en csst.at se consultaron directamente en Leetify y se registraron con fuente y fecha en `premier-historico.json`. FACEIT conserva su propia ventana; su ELO es el publicado al consultar.

Control de datos incompletos: se marcan en rojo los jugadores con dos o más métricas importantes no disponibles (las usadas por la fórmula y Aim). La alerta no demuestra que el perfil sea privado y no implica eliminarlo; los datos ausentes permanecen sin inventar. Revisión del 9 de noviembre: Flys, 4NDRES, Ecuadorian Toad <3, Gift me a glove y P0RN_Star no mostraron Position, Opening ni Clutch en los perfiles públicos revisados de CSStats y Leetify; las demás métricas guardadas sí están disponibles.

Regla de cálculo desde el 9 de noviembre: los pesos originales suman 100 %. Una métrica ausente de la fórmula aporta 0 en su parte; por ejemplo, si faltan Opening y Clutch, Momentos decisivos aporta 0 de su 10 %. Si falta Position, su 7 % aporta 0 mientras Utility conserva su 8 %. Las medias y desviaciones del grupo se calculan solo con valores reales disponibles; no se rellenan con ceros. Aim se vigila para las alertas, pero no forma parte de la fórmula y su ausencia no resta puntos. Tras recalcular, los indicadores de movimiento usan `posiciones-anteriores.json`, guardado antes de comenzar la actualización.

Actualización del 11 de noviembre de 2026: se incorporó Skrog ∆. (SteamID 76561198062014243) con datos consultados en su perfil de CSStats ese día. Los demás perfiles conservan la consulta del 10 de noviembre; no se presentan como recién consultados. Los movimientos comparan contra las 22 posiciones anteriores a esta incorporación.

Consulta del 10 de noviembre: se revisaron los 22 perfiles y NomFPS en csst.at. Los Premier ausentes se comprobaron en Leetify y se registraron con su fuente y fecha en `premier-historico.json`.
