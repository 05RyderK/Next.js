'use client'
import React from "react";
import type { AppProps } from "next/app"; // Importamos el tipo adecuado de Next.js
import ProveedorLista from "./proveedores/lista/ListaProveedores";
import styles from "../page.module.css";

export default function page() {
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