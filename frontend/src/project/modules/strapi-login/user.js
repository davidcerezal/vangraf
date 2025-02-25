export class User {
	constructor(params) {
		this.setUsername(params.username);
		this.setEmail(params.email);
	}

	setUsername(username) {
		this.username = username;
	}

	setEmail(email) {
		this.email = email;
	}

	setConfirmed(confirmed) {
		this.confirmed = confirmed;
	}

	toJSON() {
		return {
			username: this.username,
			email: this.email,
			confirmed: this.confirmed
		};
	}
}