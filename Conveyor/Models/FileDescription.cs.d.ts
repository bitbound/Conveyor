	interface fileDescription {
		content: {
			content: any[];
			fileDescription: .fileDescription;
			fileDescriptionId: number;
			id: number;
		};
		contentDisposition: string;
		contentType: string;
		dateUploaded: Date;
		fileName: string;
		guid: string;
		id: number;
		size: number;
		user: {
			authenticationTokens: any[];
			fileDescriptions: .fileDescription[];
		};
		userId: string;
	}
