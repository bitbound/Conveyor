	interface fileDescription {
		content: {
			content: any[];
			id: number;
		};
		contentType: string;
		dateUploaded: Date;
		fileName: string;
		guid: string;
		id: number;
		size: number;
		user: {
			authenticationTokens: {
				local: {
					count: number;
					isReadOnly: boolean;
				};
			};
			fileDescriptions: {
				local: {
					count: number;
					isReadOnly: boolean;
				};
			};
		};
	}
