import channel from "./covid-jokes-channel.json";
import threads from "./threads.json";
import Container from "react-bootstrap/Container";
import Badge from "react-bootstrap/Badge";
import Image from 'react-bootstrap/Image'
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";

const nameMap = new Map([
	["U0STUPF54", "rtortora"],
	["U0VD193PB", "dave"],
	["U0SUXE44U", "choirsoftheeye"],
	["U0CMM0630", "dan"],
	["U578WQRRV", "katherine"],
	["U0VHEB0GY", "johnnysmash"],
	["U0VHPF3LJ", "niru72"],
	["U5VDCCWN5", "vesa"],
]);

function App() {
	const messages = channel.messages;

	const getText = (message) => {
		for (const element of nameMap.keys()) {
			if (message.text.includes(element)) {
				return message.text.replace(element, nameMap.get(element));
			}
		}

		if (message.attachments) {
			for (const attachment of message.attachments) {
				return (
					<React.Fragment>
						{attachment.ts && <Container className="p-1 mb-2 mt-2 rounded-3 text-light border border-1 fw-bold">
							{nameMap.get(attachment.author_id)}
							<Badge className="ms-3">
								{new Date(Number(attachment.ts) * 1000).toString()}
							</Badge>
							<Container className="p-4 mb-2 bg-secondary rounded-3 fw-normal">
								{attachment.text}
								<Container className="fw-light">{attachment.footer}</Container>
							</Container>
						</Container>}
						<Container className="p-4 mb-2 bg-secondary rounded-3 fw-normal">
							{message.text}
						</Container>
					</React.Fragment>
				);
			}
		}

		if (message.files) {
			for (const file of message.files) {
				return (
					<React.Fragment>
						<Container className="p-1 mb-2 mt-2 rounded-3 text-light border border-1 fw-bold">
							{file.thumb_720}
						</Container>
						<Container className="p-4 mb-2 bg-secondary rounded-3 fw-normal">
							{message.text}
						</Container>
					</React.Fragment>
				);
			}
		}

		if (message.blocks) {
			for (const block of message.blocks) {
				if (block.type ==='image') {
					return (
						<React.Fragment>
							<Container className="p-1 mb-2 mt-2 rounded-3 text-light border border-1 fw-bold">
								{block.image_url}
							</Container>
							<Container className="p-4 mb-2 bg-secondary rounded-3 fw-normal">
								{message.text}
							</Container>
						</React.Fragment>
					);
				}
			}
		}

		return message.text;
	};

	const getThreads = (message) => {
		const messageThread = [];
		if (message.thread_ts) {
			for (const msg of threads.messages) {
				if (msg.thread_ts === message.thread_ts && msg.text !== message.text) {
					messageThread.push(msg);
				}
			}
			return messageThread.map((el, index) => {
				return (
					<Container
						className="p-1 mb-2 mt-2 rounded-3 text-light border border-1"
						key={index}
					>
						<Badge className='bg-info'>{nameMap.get(el.user)}</Badge>
						{el.text}
					</Container>
				);
			});
		}
	};

	return (
		<Container className="border border-primary rounded border-5 bg-dark">
			<div>
				{messages.map((el, index) => {
					return (
						<Container
							className="p-1 mb-2 mt-2 rounded-3 text-light border border-1 fw-bold"
							key={index}
						>
							{nameMap.get(el.user)}
							<Badge className="ms-3">
								{new Date(Number(el.ts) * 1000).toString()}
							</Badge>
							<Container className="p-2 mb-2 bg-secondary rounded-3 fw-normal">
								{getText(el)}
							</Container>
							{getThreads(el)}
						</Container>
					);
				})}
			</div>
		</Container>
	);
}

export default App;
