Ein Problem ist sichtbar: Die Beat-Labels sind falsch — Beat 1: pov: EVA, Beat 2: ort: Büro / Auto / Kita-Eingang usw. Das sind die Scene Card Direktiven die als Fallback-Beat-Plan missbraucht werden. Der buildFallbackBeatPlan zieht sceneCardOutline rein und die enthält offenbar die rohen Direktiven-Zeilen statt echte Beat-Beschreibungen.
Das ist aber nur ein Anzeige-Problem in der Outline — der eigentliche Szenentext ist davon nicht betroffen.
Für jetzt: Klick auf "Final übernehmen" — der Text wird in die Mitte kopiert, du bearbeitest ihn dort, dann Speichern. Danach erscheint das Human Edit Memory Beispiel.
Der Fallback-Beat-Plan Fehler können wir danach fixen — buildFallbackBeatPlan muss die rohen Direktiven-Schlüssel herausfiltern und nur echte Inhaltswerte verwenden.

Rechts panal