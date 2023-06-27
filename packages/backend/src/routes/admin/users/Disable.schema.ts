export default {
	summary: 'Disable a user account',
	tags: ['User Management', 'Admin'],
	params: {
		type: 'object',
		properties: {
			uuid: {
				type: 'string',
				description: 'The uuid of the user to disable.'
			}
		},
		required: ['uuid']
	},
	response: {
		200: {
			type: 'object',
			properties: {
				message: { $ref: 'ResponseMessage' }
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
