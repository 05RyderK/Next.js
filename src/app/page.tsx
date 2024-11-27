import React from "react";
import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
    return (
        <div className={styles.page}>
            {/* Aquí colocamos el Navbar para que aparezca en la página de Home */}
            <main className={styles.main}>
                <h1>Welcome to the Home Page</h1>
                {/* Agrega el contenido de tu página aquí */}
            </main>
            <footer className={styles.footer}>
                <p>© 2024 My Application</p>
            </footer>
        </div>
    );
}