export const baseUrl =
	(process.env.REACT_APP_IMAGE_BASE_URL ||
	`${(process.env.REACT_APP_API_URL || '').replace(/\/$/, '')}/image/`);