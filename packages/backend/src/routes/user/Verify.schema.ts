export default {
	description: 'Return the current user.',
	tags: ['User', 'API Key'],
	response: {
		200: {
			type: 'object',
			properties: {
				user: { $ref: 'RequestUser' }
			}
		},
		'4xx': { $ref: 'HTTP4xxError' },
		'5xx': { $ref: 'HTTP5xxError' }
	}
};
