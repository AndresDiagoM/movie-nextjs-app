import styles from "./Skeleton.module.sass";

export const Skeleton = () => {
	return (
		<div className={styles.MovieHome}>
			<div className={styles.skeletonTitle}></div>
			<div className={styles.skeletonStats}></div>
			<div className={styles.skeletonDate}></div>
			<div className={styles.skeletonDescription}></div>
			<div className={styles.skeletonButtons}></div>
		</div>
	);
};
