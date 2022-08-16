import mongoose from 'mongoose';

import { Password } from '../utils/password';

// An interface that describes properties that are required to create a new User
// This is so that Typescript knows about the User Schema and can call out errors
interface UserAttrs {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

// An interface that describes the properties that a User Model has
// This describes what the entire collection of Users looks like
// (or at lease methods associated with the User Model)
interface UserModel extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties that a User Document has
// These are the properties that a single User has
// If we have extra properties that Mongoose will add to the Model, this is where we add them
// Ex: createdAt, updatedAt
interface UserDoc extends mongoose.Document {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	}
}, {
	toJSON: {
		transform(doc, ret) {
			ret.id = ret._id;
			delete ret._id;
			delete ret.password;
			delete ret.__v;
		}
	}
});

userSchema.pre('save', async function (done) {
	if (this.isModified('password')) {
		const hashed = await Password.toHash(this.get('password'));
		this.set('password', hashed);
	}
	done();
});

// To use Typescript effectively, 'new' keyword will not work, so we create a 'build' method to add to the Model
// Add properties to our model so we don't have to have seperate functions to export then import
userSchema.statics.build = (attrs: UserAttrs) => {
	return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

// We cannot do effective Typescript checking if we call the 'new' keyword with our model
// So instead, we built in a function to build/create a new model when we need it
// This extra step gets Typescript involved

export { User };
