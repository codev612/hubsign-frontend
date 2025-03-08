"use client";

import React, { useEffect, useState, createContext, useContext } from "react";
import Cookies from "js-cookie";
import { Recipient } from "@/interface/interface";

interface UserData {
  email: string;
  firstname: string;
  lastname: string;
  role: string;
}

type UserContextProps = {
  userData: UserData;
  contacts: Recipient[];
};

type UserContextProviderProps = {
  children: React.ReactNode;
};

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};

export const UserProvider: React.FC<UserContextProviderProps> = ({
  children,
}) => {
  const [userData, setUserData] = useState<UserData>({
    email: "",
    firstname: "",
    lastname: "",
    role: "",
  });

  const [contacts, setContacts] = useState<Recipient[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("session") || ""}`, // Attach token to Authorization header
            },
          },
        );

        if (!response.ok) {
          return;
        }

        const json = await response.json();

        setUserData(json);
      } catch (error) {
        console.log(error);
        return;
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/contacts`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Cookies.get("session") || ""}`, // Attach token to Authorization header
            },
          },
        );

        if (!response.ok) {
          return;
        }

        const json = await response.json();

        setContacts(json);
      } catch (error) {
        console.log(error);
        return;
      }
    };

    fetchContacts();
  }, [])

  return (
    <UserContext.Provider
      value={{
        userData,
        contacts,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
