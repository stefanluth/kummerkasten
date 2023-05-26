# Was ist der Kummerkasten?

Obwohl wir eine offene Kommunikationskultur fördern,
gibt es manchmal Fragen oder Meinungen,
die man vielleicht nicht persönlich äußern möchte,
aus Angst vor Konsequenzen oder einem möglichen Unbehagen bei der Diskussion von sensiblen Themen.

Der Kummerkasten bietet einen sicheren und vertraulichen Raum,
in dem Mitarbeiter:innen ihre Gedanken und Meinungen frei teilen können.

## Wie funktioniert der Kummerkasten?

Der Kummerkasten ist ein anonymes Nachrichtenbrett,
auf dem Mitarbeiter:innen Fragen stellen,
Meinungen äußern und Feedback geben können,
ohne sich zu outen.

Die Nachrichten werden nicht moderiert,
aber wir behalten uns das Recht vor,
Nachrichten zu entfernen,
die gegen die Verhaltensregeln verstoßen.

## Wie kann ich den Kummerkasten nutzen?

Um eine Nachricht zu veröffentlichen,
musst du dich nicht anmelden. Du kannst einfach auf der Startseite eine Nachricht schreiben und auf Absenden klicken.

Ich sehe keine Nachrichten auf der Startseite.

Du benötigst das Passwort, das täglich erneuert wird.

Das Passwort musst du auf der Unlock-Seite eingeben,
um die Nachrichten frei zu schalten.

## Woher kriege ich das Passwort?

Das Password sollte dir von deinem Teamleiter:in oder einer anderen Person,
die Zugang zum Kummerkasten hat, mitgeteilt werden.

## Wie kann ich eine Nachricht melden?

Wenn du eine Nachricht melden möchtest, kannst du den Link Melden über der Nachricht verwenden.
Wir werden die Nachricht überprüfen und sie entfernen, wenn sie gegen unsere Verhaltensregeln verstößt.

## Wie kann ich eine Nachricht löschen?

Nachrichten können nicht gelöscht werden. Wenn du eine Nachricht löschen möchtest,
kannst du sie melden und wir werden sie entfernen,
wenn sie gegen unsere Verhaltensregeln verstößt.

## Wie kann ich eine Nachricht bearbeiten?

Nachrichten können nicht bearbeitet werden.

## Wie kann ich eine Nachricht teilen?

Du kannst eine Nachricht teilen,
indem du die Nachrichten-ID am Ende der Überschrift anklickst und die URL kopierst.

## Wie kann ich eine Nachricht bewerten?

Links neben jeder Nachricht findest du einen Pfeil hoch und einen Pfeil runter. Wenn du auf einen der Pfeile klickst,
wird deine Bewertung gespeichert.

## Wie kann ich auf eine Nachricht antworten?

Dieses Feature ist noch nicht verfügbar. Wir arbeiten daran,
es so schnell wie möglich zu implementieren.

## Wie kann ich sicher sein dass meine Nachrichten und Bewertungen anonym sind?

Wir speichern keine IP-Adressen oder andere Daten,
die Rückschlüsse auf deine Identität zulassen. Wir speichern nur die Nachrichten,
die veröffentlicht und die Bewertungen,
die abgegeben werden.

## Wenn keine Daten gespeichert werden und man sich nicht anmelden muss kann man dann nicht einfach die Nachrichten manipulieren?

Ja, das ist möglich.
Wir vertrauen darauf, dass unsere Mitarbeiter:innen verantwortungsbewusst mit diesem Tool umgehen.
Wenn wir feststellen, dass das nicht der Fall ist, werden wir das Tool deaktivieren.

## Im Source Code steht etwas über einen 'Fingerprint'. Was ist das?

Der Fingerprint ist ein Hash, der aus deiner Browser- und Gerätekonfiguration generiert wird.
Er ermöglicht es uns, die grobe Anzahl der Besucher:innen zu zählen,
mehrfaches Abstimmen zu verhindern und Spam zu erkennen ohne IP-Adressen oder andere Daten zu speichern,
die Rückschlüsse auf deine Identität zulassen.

## How to run

### Development

#### Migrationen erstellen

```shell
npx prisma migrate dev --name init
```

#### Prisma Client generieren

```shell
npx prisma generate
```

#### App in Development Modus starten

```shell
UNLOCK_PASSWORD=password123 npm run dev
```

Auf der `/unlock` Seite dann das gewählte Passwort eingeben.

### Production

```shell
bash ./deploy.sh
```
