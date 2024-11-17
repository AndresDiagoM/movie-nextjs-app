import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface CustomArrowProps {
	className?: string;
	style?: React.CSSProperties;
	onClick?: () => void;
}

export const CustomPrevArrow: React.FC<CustomArrowProps> = (props) => {
	const { className, style, onClick } = props;
	return (
		<div
			className={`${className} custom-prev-arrow`}
			style={{
				...style,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				left: "10px",
				zIndex: 1,
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				borderRadius: "50%",
				width: "40px",
				height: "40px",
				cursor: "pointer",
			}}
			onClick={onClick}
		>
			<FaChevronLeft color="white" />
		</div>
	);
};

export const CustomNextArrow: React.FC<CustomArrowProps> = (props) => {
	const { className, style, onClick } = props;
	return (
		<div
			className={`${className} custom-next-arrow`}
			style={{
				...style,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				right: "10px",
				zIndex: 1,
				backgroundColor: "rgba(0, 0, 0, 0.5)",
				borderRadius: "50%",
				width: "40px",
				height: "40px",
				cursor: "pointer",
			}}
			onClick={onClick}
		>
			<FaChevronRight color="white" />
		</div>
	);
};
