interface QueryInterface {
	currentUser: () => String,
}

const Query: QueryInterface = {
	currentUser: () => 'currentUser has been returned',
};

export default Query;
