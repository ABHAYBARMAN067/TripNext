import dns from 'dns';
import { MongoClient, type MongoClientOptions } from 'mongodb';

// Support both env variable names for convenience
const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
const options: MongoClientOptions = {};

// In development, override DNS servers to avoid local DNS/SRV resolver issues
if (process.env.NODE_ENV === 'development') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (err) {
    // non-fatal — continue with default resolver
    // eslint-disable-next-line no-console
    console.warn('dns.setServers failed:', err);
  }
}

let client: MongoClient | undefined;
let clientPromise: Promise<MongoClient>;

if (!uri) {
  throw new Error('Please define the MONGODB_URI or MONGO_URI environment variable inside .env');
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;


