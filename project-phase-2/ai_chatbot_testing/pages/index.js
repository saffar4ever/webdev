import { Geist, Geist_Mono } from "next/font/google";
import { useEffect, useState } from "react";
import { jwtVerify } from "jose"; // Use jose for token verification
import styles from "@/styles/Home.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SECRET_KEY = new TextEncoder().encode(
  "0959d63f029763711d4f26862cfcc5a8efbf9ba8ecf257ab57ec2e0bb3a3fe78"
);

export default function Home() {
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    console.log("Token found:", token); // Debugging token retrieval

    if (token) {
      jwtVerify(token, SECRET_KEY)
        .then(({ payload }) => {
          console.log("Token payload:", payload); // Debugging token payload
          setUsername(payload.username || "User");
        })
        .catch((error) => {
          console.error("Error decoding token:", error); // Debugging token verification
        });
    } else {
      console.error("No token found"); // Debugging missing token
    }
  }, []);

  return (
    <div className={styles.home}>
      <h3 style={{ textAlign: "center" }}>Welcome, {username}!</h3>
      <br />
      <p style={{ textAlign: "center" }}>
        Use the navigation bar above to explore the functionality of the AI Chatbot Testing App.
      </p>
    </div>
  );
}
