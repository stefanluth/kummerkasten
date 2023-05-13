"use client";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { Modal } from "./modal";

export function NavBar(props: any) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && (
        <Modal title="About" close={() => setShowModal(false)}>
          <div className="flex flex-col gap-2">
            <p>
              Obwohl wir eine offene Kommunikationskultur fördern, gibt es
              manchmal Fragen oder Meinungen, die man vielleicht nicht
              persönlich äußern möchte, aus Angst vor Konsequenzen oder einem
              möglichen Unbehagen bei der Diskussion von sensiblen Themen.
            </p>
            <p>
              Der Kummerkasten bietet einen sicheren und vertraulichen Raum, in
              dem Mitarbeiter:innen ihre Gedanken und Meinungen frei teilen
              können.
            </p>
          </div>
        </Modal>
      )}
      <div className="flex w-full h-14 bg-zinc-800 justify-center">
        <div className="flex w-2/3 justify-between">
          <button onClick={() => setShowModal(true)}>
            <InformationCircleIcon className="w-6 h-6 m-4 text-zinc-100" />
          </button>
        </div>
      </div>
    </>
  );
}
