module.exports = {
  apps: [
    {
      name: 'node-api',
      script: './server.js',
      watch: true,
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      time: true,
      env: {
        NODE_ENV: 'development',
        TZ: 'Australia/Sydney'
      },
      env_production: {
        NODE_ENV: 'production',
        TZ: 'Australia/Sydney'
      }
    }
  ]
};