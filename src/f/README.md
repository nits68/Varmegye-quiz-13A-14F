# F-csoport TypeScript források

# 1. kérdés - A felsorolt városok közül melyik nem tartozik egy vármegyébe?

# Megoldás:

- random Vármegye kiválasztása, majd 3 város kiválasztása abból a vármegyéből
- 1 város kiválasztása, ami nem abba a Vármegyébe tartozik
- Helyes válasz mindig az, ami másik Vármegyéből lett kiválasztva
- Visszatérési érték maga a kérdés, a 4 lehetséges válasz összekeverve, és a helyes válasz.

# 2. kérdés - A felsoroltak közül melyik vármegyének van a legkevesebb vármegye szomszédja?

# Megoldás:

- Sorba rendezi a Vármegyéket szomszédos Vármegyék száma alapján
- Helyes válasz az, amelyiknek a legkevesebb szomszédos Vármegyéje van
- Kiválaszt másik 3 Vármegyét véletlenszerűen mint rossz válaszok
- Visszatérési érték a kérdés, 4 lehetséges válasz összekeverve, és a válasz.
