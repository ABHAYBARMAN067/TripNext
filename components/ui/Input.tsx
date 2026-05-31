import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { useId } from "react";

type BaseProps = {
	label?: string;
	error?: string;
};

type InputProps = BaseProps &
	Omit<InputHTMLAttributes<HTMLInputElement>, "color" | "size"> & {
		as?: "input";
	};

type TextareaProps = BaseProps &
	TextareaHTMLAttributes<HTMLTextAreaElement> & {
		as: "textarea";
	};

type Props = InputProps | TextareaProps;

export default function Input(props: Props) {
	const { label, error, className = "" } = props;
	const inputId = useId();

	const inputClasses = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed ${
		error ? "border-red-500" : "border-gray-300"
	} ${className}`;

	const required =
		props.as === "textarea"
			? Boolean((props as TextareaProps).required)
			: Boolean((props as InputProps).required);

	return (
		<div className="mb-4">
			{label && (
				<label
					htmlFor={inputId}
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					{label}
					{required && <span className="text-red-500 ml-1">*</span>}
				</label>
			)}

			{props.as === "textarea" ? (
				<textarea
					{...(props as TextareaProps)}
					id={inputId}
					className={inputClasses}
				/>
			) : (
				<input
					{...(props as InputProps)}
					id={inputId}
					type={(props as InputProps).type ?? "text"}
					className={inputClasses}
				/>
			)}

			{error && <p className="mt-1 text-sm text-red-600">{error}</p>}
		</div>
	);
}
