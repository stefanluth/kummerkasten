import FaqItem from "@/app/_components/faqItem";

export default function About() {
  return (
    <div className="flex flex-col max-w-2xl gap-6 p-2 mx-auto">
      <FaqItem title="Was ist der Kummerkasten?">
        <p>
          Obwohl wir eine offene Kommunikationskultur fördern, gibt es manchmal Fragen oder Meinungen, die man
          vielleicht nicht persönlich äußern möchte, aus Angst vor Konsequenzen oder einem möglichen Unbehagen
          bei der Diskussion von sensiblen Themen.
        </p>
        <p>
          Der Kummerkasten bietet einen sicheren und vertraulichen Raum, in dem Mitarbeiter:innen ihre Gedanken
          und Meinungen frei teilen können.
        </p>
      </FaqItem>
      <FaqItem title="Wie funktioniert der Kummerkasten?">
        <p>
          Der Kummerkasten ist ein anonymes Nachrichtenbrett, auf dem Mitarbeiter:innen Fragen stellen,
          Meinungen äußern und Feedback geben können, ohne sich zu outen.
        </p>
        <p>
          Die Nachrichten werden nicht moderiert, aber wir behalten uns das Recht vor, Nachrichten zu entfernen,
          die gegen die{" "}
          <a href="/code-of-conduct" className="text-slate-300 underline">
            Verhaltensregeln
          </a>{" "}
          verstoßen.
        </p>
      </FaqItem>
      <FaqItem title="Wie kann ich den Kummerkasten nutzen?">
        <p>
          Um eine Nachricht zu veröffentlichen, musst du dich nicht anmelden. Du kannst einfach auf der
          Startseite eine Nachricht schreiben und auf <b>Absenden</b> klicken.
        </p>
      </FaqItem>
      <FaqItem title="Ich sehe keine Nachrichten auf der Startseite.">
        <p>Du benötigst das Passwort, das täglich erneuert wird.</p>
        <p>
          Das Passwort musst du auf der
          <a href="/unlock" className="text-slate-300 underline">
            Unlock-Seite
          </a>{" "}
          eingeben, um die Nachrichten frei zu schalten.
        </p>
      </FaqItem>
      <FaqItem title="Woher kriege ich das Passwort?">
        <p>
          Das Password sollte dir von deinem Teamleiter:in oder einer anderen Person, die Zugang zum
          Kummerkasten hat, mitgeteilt werden.
        </p>
      </FaqItem>
      <FaqItem title="Wie kann ich eine Nachricht melden?">
        <p>
          Wenn du eine Nachricht melden möchtest, kannst du den Link <b>Melden</b> über der Nachricht verwenden.
          Wir werden die Nachricht überprüfen und sie entfernen, wenn sie gegen unsere{" "}
          <a href="/code-of-conduct" className="text-slate-300 underline">
            Verhaltensregeln
          </a>{" "}
          verstößt.
        </p>
      </FaqItem>
      <FaqItem title="Wie kann ich eine Nachricht löschen?">
        <p>
          Nachrichten können nicht gelöscht werden. Wenn du eine Nachricht löschen möchtest, kannst du sie
          melden und wir werden sie entfernen, wenn sie gegen unsere{" "}
          <a href="/code-of-conduct" className="text-slate-300 underline">
            Verhaltensregeln
          </a>{" "}
          verstößt.
        </p>
      </FaqItem>
      <FaqItem title="Wie kann ich eine Nachricht bearbeiten?">
        <p>Nachrichten können nicht bearbeitet werden.</p>
      </FaqItem>
      <FaqItem title="Wie kann ich eine Nachricht teilen?">
        <p>
          Du kannst eine Nachricht teilen, indem du die Nachrichten-ID am Ende der Überschrift anklickst und die
          URL kopierst.
        </p>
      </FaqItem>
      <FaqItem title="Wie kann ich eine Nachricht bewerten?">
        <p>
          Links neben jeder Nachricht findest du einen Pfeil hoch und einen Pfeil runter. Wenn du auf einen der
          Pfeile klickst, wird deine Bewertung gespeichert.
        </p>
      </FaqItem>
      <FaqItem title="Wie kann ich auf eine Nachricht antworten?">
        <p>
          Dieses Feature ist noch nicht verfügbar. Wir arbeiten daran, es so schnell wie möglich zu
          implementieren.
        </p>
      </FaqItem>
      <FaqItem title="Wie kann ich sicher sein, dass meine Nachrichten und Bewertungen anonym sind?">
        <p>
          Wir speichern keine IP-Adressen oder andere Daten, die Rückschlüsse auf deine Identität zulassen. Wir
          speichern nur die Nachrichten, die veröffentlicht und die Bewertungen, die abgegeben werden.
        </p>
      </FaqItem>
      <FaqItem title="Wenn keine Daten gespeichert werden und man sich nicht anmelden muss, kann man dann nicht einfach die Nachrichten manipulieren?">
        <p>
          Ja, das ist möglich. Wir vertrauen darauf, dass unsere Mitarbeiter:innen verantwortungsbewusst mit
          diesem Tool umgehen. Wenn wir feststellen, dass das nicht der Fall ist, werden wir das Tool
          deaktivieren.
        </p>
      </FaqItem>
      <FaqItem title="Wo kann ich den Source Code finden?">
        <p>
          Der Source Code ist auf{" "}
          <a href="https://github.com/stefanluth/kummerkasten" className="text-slate-300 underline">
            GitHub
          </a>{" "}
          verfügbar.
        </p>
      </FaqItem>
      <FaqItem title="Im Source Code steht etwas über einen 'Fingerprint'. Was ist das?">
        <p>
          Der Fingerprint ist ein Hash, der aus deiner Browser- und Gerätekonfiguration generiert wird. Er
          ermöglicht es uns, die grobe Anzahl der Besucher:innen zu zählen, mehrfaches Abstimmen zu verhindern
          und Spam zu erkennen ohne IP-Adressen oder andere Daten zu speichern, die Rückschlüsse auf deine
          Identität zulassen.
        </p>
      </FaqItem>
      <FaqItem title="Wie kann ich den Kummerkasten kontaktieren?">
        <p>
          Du kannst uns eine Nachricht im Kummerkasten hinterlassen oder eine{" "}
          <a href="mailto:dummy@email.com" className="text-slate-300 underline">
            Email schreiben
          </a>
          .
        </p>
      </FaqItem>
    </div>
  );
}
