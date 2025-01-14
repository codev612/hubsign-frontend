"use client";

import { RoomProvider } from "@/liveblocks.config";
import { ClientSideSuspense } from "@liveblocks/react";
import { LiveMap } from "@liveblocks/client";
import Loader from "@/components/canvas/Loader";
import { Presence } from "@/liveblocks.config";

interface CustomPresence extends Presence {
    cursorColor: string | null; // Add your custom fields
    cursor: any; // Define your cursor object type
    editingText: string | null;
}

const Room = ({ children }: { children: React.ReactNode }) => {
  return (
    <RoomProvider id="figman-room"
        initialPresence={{
            cursor: null,
            cursorColor: null, // Now cursorColor should be recognized
            editingText: null,
        } as CustomPresence}
        initialStorage={{
            canvasObjects: new LiveMap()
        }}
    >
      <ClientSideSuspense fallback={<Loader />}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}

export default Room;