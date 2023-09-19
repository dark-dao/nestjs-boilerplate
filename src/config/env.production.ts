export default () => ({
  version: process.env.VERSION,
  db: {
    connectionString: process.env.DB_CONNECTION_STRING,
  },
  allowedDomains: process.env.ALLOWED_DOMAINS,
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL) || 3600,
    limit: parseInt(process.env.THROTTLE_LIMIT) || 1000,
  },
});
