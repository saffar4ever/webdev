import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import styles from "@/styles/Home.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Retrieve the username from localStorage
    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername || "User");
  }, []);

  return (
    <div className={styles.home}>
      <h3 style={{ textAlign: 'center' }}>Welcome, {username}!</h3>
      <br />
      <p style={{ textAlign: 'center' }}>
        Use the navigation bar above to explore the functionality of the AI Chatbot Testing App.
      </p>
    </div>
  );
}
