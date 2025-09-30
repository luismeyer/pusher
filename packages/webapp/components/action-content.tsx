"use client";

import { useMemo } from "react";
import { useRecoilState } from "recoil";

import { dataAtom } from "@/state/data";
import { Keys } from "@pusher/shared";

import { Combobox } from "./ui/combobox";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { EMPTY, TextInput } from "./text-input";
import { InfoIcon } from "lucide-react";

type ActionContentProps = {
	id: string;
};

export const ActionContent: React.FC<ActionContentProps> = ({ id }) => {
	const [data, setData] = useRecoilState(dataAtom(id));

	const inputs = useMemo(() => {
		let components: JSX.Element[] = [];

		if ("selector" in data) {
			const prefixOptions = [
				{
					label: "none",
					value: EMPTY,
				},
				{
					label: "# (id)",
					value: "#",
				},
				{
					label: ". (class)",
					value: ".",
				},
			];

			components = [
				...components,
				<TextInput
					id={id}
					key={components.length}
					value={data.selector}
					placeholder="Enter CSS Selector"
					addonBeforeOptions={prefixOptions}
					onChange={(value) => setData((pre) => ({ ...pre, selector: value }))}
				/>,
			];
		}

		if ("timeInSeconds" in data) {
			const key = `seconds${id}`;

			components = [
				...components,
				<div key={key} className="grid w-full gap-1.5">
					<Label htmlFor={key}>Time in seconds</Label>
					<Input
						id={key}
						type="number"
						value={data.timeInSeconds}
						onChange={(value) =>
							setData((pre) => ({
								...pre,
								timeInSeconds: Number(value.target.value) ?? 0,
							}))
						}
					/>
				</div>,
			];
		}

		if ("pageUrl" in data) {
			const prefixOptions = [{ value: "https://" }, { value: "http://" }];

			components = [
				...components,
				<TextInput
					id={id}
					key={components.length}
					value={data.pageUrl}
					placeholder="google.com"
					addonBeforeOptions={prefixOptions}
					onChange={(value) => setData((pre) => ({ ...pre, pageUrl: value }))}
				/>,
			];
		}

		if ("text" in data) {
			let placeholder = "Enter Text";

			if (data.type === "type") {
				placeholder = `${placeholder} to type`;
			}

			if (data.type === "textContentMatches") {
				placeholder = `${placeholder} to match against`;
			}

			components = [
				...components,
				<TextInput
					id={id}
					key={components.length}
					value={data.text}
					placeholder={placeholder}
					onChange={(value) => setData((pre) => ({ ...pre, text: value }))}
				/>,
			];
		}

		if (data.type === "telegram") {
			components = [
				...components,
				<TextInput
					id={id}
					key={components.length}
					value={data.chatId}
					placeholder="Enter Telegram ChatId"
					onChange={(value) => setData((pre) => ({ ...pre, chatId: value }))}
				/>,
				<TextInput
					id={id}
					key={components.length + 1}
					value={data.message}
					placeholder="Enter Telegram Message"
					onChange={(value) => setData((pre) => ({ ...pre, message: value }))}
				/>,
			];
		}

		if (data.type === "email") {
			components = [
				...components,
				<TextInput
					id={id}
					key={components.length}
					value={data.email}
					placeholder="Enter recieving Email"
					onChange={(value) => setData((pre) => ({ ...pre, email: value }))}
				/>,
				<TextInput
					id={id}
					key={components.length + 1}
					value={data.message}
					placeholder="Enter Email Text"
					onChange={(value) => setData((pre) => ({ ...pre, message: value }))}
				/>,
			];
		}

		if (data.type === "storeTextContent") {
			components = [
				...components,
				<TextInput
					id={id}
					key={components.length}
					value={data.variableName}
					placeholder="Enter VariableName to store the TextContent"
					onChange={(value) =>
						setData((pre) => ({ ...pre, variableName: value }))
					}
				/>,
			];
		}

		if (data.type === "keyboard") {
			components = [
				...components,
				<Combobox
					key={components.length}
					label="Search key..."
					data={Keys.map((item) => ({ value: item, label: item }))}
				/>,
			];
		}

		return components;
	}, [data, id, setData]);

	return (
		<div className="grid gap-2 w-full">
			{inputs.length === 0 && (
				<div className="flex flex-col items-center">
					<InfoIcon />

					<span>No Input needed here</span>
				</div>
			)}

			{inputs}
		</div>
	);
};
