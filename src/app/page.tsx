import styles from "./page.module.css";
// import Image from "next/image";

export default function Home() {
	return (
		<div className={styles.page}>
			<main className={styles.main}>
				<h1>Hola Mundo</h1>
			</main>
		</div>
	);
}
