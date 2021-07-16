const regexString =
	'^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$';
const emailRegex = new RegExp(regexString, 'i');
const jerseyRegex = /^\d{1,2}$/;

// prevent user from submitting incorrect player info
export default function(val) {
	const errors = { team: {} };
	if (!val.firstName) {
		errors.firstName = 'Please provide a first name';
	} else if (!val.lastName) {
		errors.lastName = 'Please provide a last name';
	} else if (!val.email) {
		errors.email = 'Please provide an email address';
	} else if (!emailRegex.test(val.email)) {
		errors.email = 'Email is not in correct format';
	} else if (val.team && val.team.jerseyNum
		&& !jerseyRegex.test(val.team.jerseyNum)) {
		errors.team.jerseyNum = 'A jersey number should be between 0 and 99';
	}
	return errors;
}


