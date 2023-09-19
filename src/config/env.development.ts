export default () => ({
  version: process.env.VERSION || '0.0.1-dev-build',
  db: {
    connectionString: 'mongodb://adminUser:lXH916$7y@127.0.0.1:27017/my-db',
  },
  allowedDomains: 'localhost;example.com;',
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL) || 3600,
    limit: parseInt(process.env.THROTTLE_LIMIT) || 1000,
  },
});
