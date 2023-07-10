import Link from 'next/link';
import FaqItem from '@/app/_components/faqItem';

export default function About() {
  return (
    <div className="flex flex-col max-w-2xl gap-6 p-2 mx-auto">
      <FaqItem title="Was ist der Kummerkasten?">
        <p>
          Obwohl eine offene Kommunikationskultur gefördert wird, gibt es manchmal Fragen oder Meinungen, die man
          vielleicht nicht persönlich äußern möchte, aus Angst vor Konsequenzen oder einem möglichen Unbehagen bei der
          Diskussion von sensiblen Themen.
        </p>
        <p>
          Der Kummerkasten bietet einen sicheren und vertraulichen Raum, in dem Mitarbeiter:innen ihre Gedanken und
          Meinungen frei teilen können.
        </p>
      </FaqItem>
      <FaqItem title="Wie funktioniert der Kummerkasten?">
        <p>
          Der Kummerkasten ist ein anonymes Nachrichtenbrett, auf dem Mitarbeiter:innen Fragen stellen, Meinungen äußern
          und Feedback geben können, ohne sich zu outen.
        </p>
        <p>
          Die Nachrichten werden nicht moderiert, aber es wird das Recht vorbehalten, Nachrichten zu entfernen, die
          gegen die{' '}
          <Link href="/code-of-conduct" className="text-slate-300 underline">
            Verhaltensregeln
          </Link>{' '}
          verstoßen.
        </p>
      </FaqItem>
      <FaqItem title="Wie kann ich den Kummerkasten nutzen?">
        <p>
          Um eine Nachricht zu veröffentlichen, musst du dich nicht anmelden. Du kannst einfach auf der Startseite eine
          Nachricht schreiben und auf <b>Absenden</b> klicken.
        </p>
      </FaqItem>
      <FaqItem title="Ich sehe keine Nachrichten auf der Startseite.">
        <p>Du benötigst das Passwort, das regelmäßig erneuert wird.</p>
        <p>
          Das Passwort musst du auf der{' '}
          <Link href="/unlock" className="text-slate-300 underline">
            Unlock-Seite
          </Link>{' '}
          eingeben, um die Nachrichten frei zu schalten.
        </p>
      </FaqItem>
      <FaqItem title="Woher kriege ich das Passwort?">
        <p>
          Das Passwort sollte dir von deinem Teamleiter:in oder einer anderen Person, die Zugang zum Kummerkasten hat,
          mitgeteilt werden.
        </p>
      </FaqItem>
      <FaqItem title="Wie kann ich eine Nachricht melden?">
        <p>
          Wenn du eine Nachricht melden möchtest, kannst du den Link <b>Melden</b> über der Nachricht verwenden. Wir
          werden die Nachricht überprüfen und sie entfernen, wenn sie gegen unsere{' '}
          <Link href="/code-of-conduct" className="text-slate-300 underline">
            Verhaltensregeln
          </Link>{' '}
          verstößt.
          <br />
          Bis dahin können gemeldete Nachrichten uf der{' '}
          <Link href="/reported" className="text-slate-300 underline">
            Reported-Seite
          </Link>{' '}
          eingesehen werden.
        </p>
      </FaqItem>
      <FaqItem title="Wie kann ich eine Nachricht löschen?">
        <p>
          Nachrichten können nicht gelöscht werden. Wenn du eine Nachricht löschen möchtest, kannst du sie melden und
          sie wird entfernt, wenn sie gegen die{' '}
          <Link href="/code-of-conduct" className="text-slate-300 underline">
            Verhaltensregeln
          </Link>{' '}
          verstößt.
        </p>
      </FaqItem>
      <FaqItem title="Wie kann ich eine Nachricht bearbeiten?">
        <p>Nachrichten können nicht bearbeitet werden.</p>
      </FaqItem>
      <FaqItem title="Wie kann ich eine Nachricht teilen?">
        <p>
          Du kannst eine Nachricht teilen, indem du die Nachrichten-ID am Ende der Überschrift anklickst und die URL
          kopierst.
        </p>
      </FaqItem>
      <FaqItem title="Wie kann ich eine Nachricht bewerten?">
        <p>
          Links neben jeder Nachricht findest du einen Pfeil hoch und einen Pfeil runter. Wenn du auf einen der Pfeile
          klickst, wird deine Bewertung gespeichert.
        </p>
      </FaqItem>
      <FaqItem title="Wie kann ich auf eine Nachricht antworten?">
        <p>
          Dieses Feature ist noch nicht verfügbar. Es wird daran gearbeitet, es so schnell wie möglich zu
          implementieren.
        </p>
      </FaqItem>
      <FaqItem title="Wie kann ich sicher sein, dass meine Nachrichten und Bewertungen anonym sind?">
        <p>
          Es werden keine IP-Adressen oder andere Daten gespeichert, die Rückschlüsse auf deine Identität zulassen. Es
          werden nur die Nachrichten, die veröffentlicht und die Bewertungen, die abgegeben werden, gespeichert.
        </p>
      </FaqItem>
      <FaqItem title="Wenn keine Daten gespeichert werden und man sich nicht anmelden muss, kann man dann nicht einfach die Nachrichten manipulieren?">
        <p>
          Ja, das ist möglich. Es wird darauf vertraut, dass alle Mitarbeiter:innen verantwortungsbewusst mit diesem
          Tool umgehen. Wenn festgestellt wird, dass das nicht der Fall ist, wird das Tool deaktiviert.
        </p>
      </FaqItem>
      <FaqItem title="Wo kann ich den Source Code finden?">
        <p>
          Der Source Code ist auf{' '}
          <Link href="https://github.com/stefanluth/kummerkasten" className="text-slate-300 underline">
            GitHub
          </Link>{' '}
          verfügbar.
        </p>
      </FaqItem>
      <FaqItem title="Im Source Code steht etwas über einen 'Fingerprint'. Was ist das?">
        <p>
          Der Fingerprint ist ein Hash (eine Art von ID), der aus deiner Browser- und Gerätekonfiguration generiert
          wird. Diese Informationen selbst werden nicht gespeichert, nur der daraus generierte Hash. Er ermöglicht es
          uns, die grobe Anzahl der Besucher:innen zu zählen, mehrfaches Abstimmen zu verhindern und Spam zu erkennen
          ohne IP-Adressen oder andere Daten zu speichern, die Rückschlüsse auf deine Identität zulassen.
        </p>
      </FaqItem>
      <FaqItem title="Im Source Code steht etwas über eine IP-Adresse. Wird meine IP-Adresse gespeichert?">
        <p>
          Nein, deine IP-Adresse wird nicht gespeichert. Die IP-Adresse wird verwendet, um den Hash zu generieren, der
          als Fingerprint bezeichnet wird. Die IP-Adresse selbst wird nicht gespeichert und kann nicht mit deinen
          Nachrichten oder Bewertungen in Verbindung gebracht werden.
        </p>
      </FaqItem>
      <FaqItem title="Wie kann ich den Kummerkasten kontaktieren?">
        <p>
          Du kannst uns eine Nachricht im Kummerkasten hinterlassen oder eine{' '}
          <a href="mailto:dummy@email.com" className="text-slate-300 underline">
            Email schreiben
          </a>
          .
        </p>
      </FaqItem>
    </div>
  );
}
