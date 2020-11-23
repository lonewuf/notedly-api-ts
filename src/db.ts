import mongoose from 'mongoose';

export default {
	connect: (DB_HOST: string) => {
		// use mongo driver updated url parser
		mongoose.set('useNewUrlParser', true);
		// use fineOneAndUpdate in place of findAndModify
		mongoose.set('useFindAndModify', true);
		// use createIndex in place of ensureIndex
		mongoose.set('useCreateIndex', true);
		// use the new server discovery and monitoring engine
		mongoose.set('useUnifiedTopology', true);
		// connect to dabase
		mongoose.connect(DB_HOST, () => {
			console.log('Connected to the database.');
		});
		// log an error if it fails to connect
		mongoose.connection.on('error', (err) => {
			console.error(err);
			console.log(
				'Mongodb connection error. Make sure that the database is running properly.'
			);
			process.exit();
		});
	},

	close: () => {
		mongoose.connection.close();
	},
};
