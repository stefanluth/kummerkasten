import Link from 'next/link';

import FaqItem from '@/app/_components/faqItem';

export default function About() {
  return (
    <div className="flex flex-col max-w-2xl gap-6 p-2 mx-auto">
      <FaqItem title="Was ist der Kummerkasten?">
        <p>
          In Umgebungen, in denen offene Kommunikation geschätzt wird, können dennoch Momente auftreten, in denen einige
          Fragen oder Ansichten vielleicht nicht direkt ausgedrückt werden wollen. Dies könnte aus Besorgnis über
          mögliche Reaktionen oder einem Unbehagen bei bestimmten Themen herrühren.
        </p>
        <p>
          Der Kummerkasten stellt in solchen Fällen eine vertrauenswürdige Plattform dar, auf der Mitarbeiter:innen ihre
          Gedanken in einem geschützten Rahmen austauschen können.
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
      <FaqItem title="Ich sehe keine Nachrichten. Was muss ich tun?">
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
          Das Passwort sollte dir einer Person, die Zugang zum Kummerkasten hat, mitgeteilt werden, oder in einem
          anderen Kommunikationskanal, der für dich zugänglich ist, veröffentlicht werden. So können kann garantiert
          werden, dass nur berechtigte Personen Zugang erhalten und die Anonymität sowie der Schutz der Anliegen und
          Gedanken der Mitarbeiter:innen gewahrt bleiben. Es ist wichtig, das Passwort nicht an unbefugte Dritte
          weiterzugeben.
        </p>
      </FaqItem>
      <FaqItem title="Wie kann ich eine Nachricht melden?">
        <p>
          Wenn du eine Nachricht melden möchtest, kannst du den Link <b>Melden</b> über der Nachricht verwenden. Wird
          eine Nachricht oft gemeldet, wird sie zunächst ausgeblendet und dann ggf. entfernt, wenn sie gegen die{' '}
          <Link href="/code-of-conduct" className="text-slate-300 underline">
            Verhaltensregeln
          </Link>{' '}
          verstößt.
          <br />
          Bis dahin können gemeldete Nachrichten auf der{' '}
          <Link href="/reported" className="text-slate-300 underline">
            Reported-Seite
          </Link>{' '}
          eingesehen werden.
        </p>
      </FaqItem>
      <FaqItem title="Wie kann ich meine Nachricht löschen?">
        <p>
          Nachrichten können nicht gelöscht werden. Wenn du deine Nachricht löschen möchtest, kannst du sie melden und
          sie wird entfernt, wenn sie gegen die{' '}
          <Link href="/code-of-conduct" className="text-slate-300 underline">
            Verhaltensregeln
          </Link>{' '}
          verstößt.
        </p>
      </FaqItem>
      <FaqItem title="Warum kann ich meine Nachricht nicht löschen?">
        <p>
          Nachrichten können nicht gelöscht werden, um die Anonymität zu gewährleisten, da nicht nachvollzogen werden
          kann, wer die Nachricht geschrieben hat.
        </p>
      </FaqItem>
      <FaqItem title="Wie kann ich eine Nachricht bearbeiten?">
        <p>Nachrichten können aus demselben Grund nicht bearbeitet werden, aus dem sie nicht gelöscht werden können.</p>
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
          implementieren. Bis dahin kannst du die Nachrichten-ID am Ende der Überschrift kopieren, um sie in deiner
          Antwort zu erwähnen.
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
      <FaqItem title="Im Source Code steht etwas über einen 'Fingerprint'. Was ist das?">
        <p>
          Der Fingerprint ist eine Art von ID, der aus deiner Browser- und Gerätekonfiguration generiert wird. Diese
          Informationen selbst werden nicht gespeichert, nur der daraus generierte Hash. Er ermöglicht es uns,
          mehrfaches Abstimmen zu verhindern und Spam zu erkennen ohne IP-Adressen oder andere Daten zu speichern, die
          Rückschlüsse auf deine Identität zulassen.
        </p>
      </FaqItem>
      <FaqItem title="Aber im Source Code steht etwas über eine IP-Adresse. Wird meine IP-Adresse doch gespeichert?">
        <p>
          Nein, deine IP-Adresse wird nicht gespeichert. Die IP-Adresse wird verwendet, um den Hash zu generieren, der
          als Fingerprint bezeichnet wird. Die IP-Adresse selbst wird nicht gespeichert und kann nicht mit deinen
          Nachrichten oder Bewertungen in Verbindung gebracht werden.
        </p>
      </FaqItem>
      <FaqItem title="Ist der Kummerkasten mit dem Unternehmen XY verbunden?">
        <p>
          Nein, der Kummerkasten ist{' '}
          <Link href="https://github.com/stefanluth/kummerkasten" className="text-slate-300 underline">
            ein privates Open Source Projekt
          </Link>
          . Es ist nicht mit irgendeinem Unternehmen verbunden und wurde nur zum Austausch mit Kolleg:innen entwickelt.
        </p>
      </FaqItem>
    </div>
  );
}
