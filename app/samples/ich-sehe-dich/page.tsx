import Link from "next/link";

const sceneOneParagraphs = [
  "Die kleine Tür lehnte schon an der Sockelleiste, als Laura sich auf die Knie ließ. Das Holz war billig, aus dem Bastelladen, zwei Euro neunzig. Das Scharnier war nur eine Prägung im Plastik. Sie drückte sie gegen die Leiste neben der Garderobe, dort, wo Henri am Morgen als Erstes hinsehen würde, wenn er barfuß aus seinem Zimmer kam. Die Dielen waren kalt durch den Stoff der Leggings. Im Rücken zog es von der Schulter bis unter das Schulterblatt, der gleiche Strang wie jeden Abend.",
  "Sie hatte nur die kleine Stehlampe an. Die Wohnung hörte sich anders an, wenn Henri schlief. Der Kühlschrank arbeitete. Die Heizung klackte einmal, dann war wieder Ruhe. Unter der Balkontür strich die Luft über die Dielen, und sie zog die Strickjacke enger.",
  "Der Klebestreifen löste sich schlecht von der Rolle. Sie biss ihn mit den Zähnen ab, wie immer, und schmeckte den Kleber. Zwei Streifen hinten an die Tür, einer oben, einer unten. Sie drückte sie fest. Ein Daumenabdruck blieb auf dem Lack. Sie wischte ihn mit dem Ärmel weg.",
  "Der Zettel lag auf dem Couchtisch, neben der Schachtel, in der sie die Wichtelsachen seit November sammelte. Drei Rollen Tesa, ein paar Schokoladentaler aus dem Adventskalender-Restbestand, ein Päckchen Miniatur-Bauklötze für einsneunundneunzig, Geschenkpapier in Streifen geschnitten. Sie hatte darüber im letzten Jahr noch mit Sabine am Telefon gelacht. Jetzt war es einfach Teil der Liste.",
  "Sie nahm den dünnen Stift. Lieber Henri, schrieb sie in der krakeligen Wichtelschrift, die sie sich angewöhnt hatte. Eckiger als ihre eigene, mit zu großen Os. Ich bin heute Nacht bei dir eingezogen. Mein Name ist Pip. Ich bin sehr klein und sehr leise. Sie hielt inne. Das P war zu rund. Sie setzte neu an. Ich freue mich darauf, dich kennenzulernen. Der Stift stockte an der letzten Silbe. Sie strich das Wort nicht durch. Sie schrieb weiter. Dein Pip.",
  "Das Mini-Päckchen wickelte sie aus Goldpapier. Darin ein Streichholzschächtelchen, in das sie zwei Schokotaler gelegt hatte und einen gefalteten Zettel, auf dem für später stand. Sie band Bastgarn herum, machte eine Schleife, zog sie wieder auf, machte sie neu. Die erste war schief gewesen. Henri würde es sehen. Er sah alles.",
  "Zwischen zwei Knoten bückte sie sich nach dem Playmobilmännchen unter dem Sessel. Sie legte es in den Korb auf dem Sideboard. Die Socke neben dem Heizkörper wanderte zur Wäsche im Flur. Sie faltete den Pullover zusammen, den Henri am Nachmittag über die Lehne geworfen hatte, roch für einen Moment an dem Stoff, legte ihn weg. Der Zettel vom Kindergarten lag noch auf dem Tisch. Bitte Gummistiefel kontrollieren. Sie schob ihn unter das Telefonbuch.",
  "Ihre Hand zitterte leicht, als sie den Stift zurück in die Schublade legte. Nicht viel. Nur so, wie er nach zu langen Tagen zitterte, wenn sie den Kaffee in die Tasse goss.",
  "In der Küche standen die Tassen vom Abend. Die große blaue mit dem Teerest, Henris Plastikbecher mit den Pinguinen, ihre eigene Tasse, in der der Kaffee vom Nachmittag kalt geworden war. Sie stellte ein Glas unter den Hahn, ließ Wasser laufen, bis es wirklich kalt war, und trank im Stehen. Der Schluck tat im Hals weh. Sie stellte das Glas zu den Tassen. Die Spüle roch nach nassem Schwamm.",
  "Sie dachte an das Brot für morgen. An Henris Jacke, deren Reißverschluss klemmte. An die Reha-Unterlagen von Tobias, die seit Freitag ungeöffnet auf dem Schuhschrank lagen. Sie ging zurück in den Flur.",
  "Auf den Knien richtete sie die Tür noch einmal aus. Gerade, dann ein halbes Grad nach rechts. Sie lehnte das Päckchen gegen die Leiste, genau mittig vor die Tür. Sie schob einen Schokotaler daneben. Sie nahm ihn wieder weg. Zu viel. Sie legte ihn zurück.",
  "Die Knie brannten. Sie blieb trotzdem hocken. Es war sehr still. Keine Tür ging. Kein Kind rief. Das Telefon leuchtete nicht. Sie zog die Schultern ein kleines Stück zurück, das Schulterblatt knackte, und sie blieb, wo sie war.",
  "Niemand wollte in diesem Moment etwas von ihr.",
  "Sie kniete trotzdem weiter. Ihre Hand strich den Klebestreifen am unteren Rand der Tür nach, obwohl er hielt. Sie zupfte eine winzige Faser aus dem Bastgarn. Sie rückte das Päckchen einen Millimeter nach links. Sie blieb noch einen Moment so sitzen.",
  "Sie stand auf, eine Hand an der Wand, die andere auf dem Knie. Der Rücken zog. Sie drückte die Faust in die Stelle unter dem Schulterblatt und atmete einmal tief durch die Nase.",
  "Im Bad putzte sie sich die Zähne im Dunkeln, nur das Licht aus dem Flur. Sie spuckte aus, spülte, wischte den Rand des Waschbeckens mit dem Handtuch, weil sie es nicht lassen konnte.",
  "Bevor sie ins Schlafzimmer ging, blieb sie im Flur stehen. Die kleine Tür saß an der Sockelleiste. Das Goldpapier fing das Licht der Stehlampe auf. In der Küche warteten die Tassen und der Pinguinbecher.",
  "Laura machte das Licht aus."
];

export default function IchSeheDichSamplePage() {
  return (
    <main className="reader-shell sample-reader">
      <header className="reader-topbar sample-reader__topbar">
        <div>
          <p className="reader-eyebrow">EMBER Leseprobe</p>
          <h1>Ich sehe dich</h1>
          <p>Szene 1 ist live. Die Leseprobe wird fortlaufend ergänzt.</p>
        </div>
        <div className="reader-actions">
          <Link href="/" className="landing-button">
            Store öffnen
          </Link>
          <Link href="/studio" className="landing-button">
            Zurück ins Studio
          </Link>
        </div>
      </header>

      <article className="sample-reader__article">
        <div className="sample-reader__hero">
          <p className="reader-eyebrow">Buchprobe · Szene 1</p>
          <h2>Die Wichteltür</h2>
          <p>
            Laura baut nachts die kleine Tür für Henri auf. Der erste Moment des Romans
            zeigt Liebe, Erschöpfung und die Arbeit, die niemand sieht.
          </p>
        </div>

        <section className="sample-reader__scene">
          {sceneOneParagraphs.map(function (paragraph) {
            return <p key={paragraph}>{paragraph}</p>;
          })}
        </section>

        <section className="sample-reader__divider">
          <h3>Fortsetzung folgt</h3>
          <p>
            Die Leseprobe endet hier vorerst. Im EMBER Studio wird die nächste Szene
            weiterentwickelt.
          </p>
        </section>
      </article>
    </main>
  );
}
