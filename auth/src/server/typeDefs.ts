const typeDefs =  /* GraphQL */ `
	scalar File
	type Query {
		currentUser: String
	},
	type Mutation {
		signup: String,
		signin: String,
		signout: String,
	}
`;

export default typeDefs;
