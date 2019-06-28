// Environment container
var environments = {};

// Staging environment
environments.staging = {
  'httpPort': 3000,
  'envName': 'staging',
  'hashingSecret': 'thisIsASecret',
  'templateGlobals': {
    'appName': 'Javascript and NodeJS Blog',
    'companyName': 'Acme ltd',
    'yearCreated': '2019',
    'baseUrl': 'http://localhost:3000/'
  }
};

// Production environment
environments.production = {
  'httpPort': 5000,
  'envName': 'production',
  'hashingSecret': 'thisIsASecret',
  'templateGlobals': {
    'appName': 'Javascript and NodeJS Blog',
    'companyName': 'Acme ltd',
    'yearCreated': '2019',
    'baseUrl': 'http://localhost:5000/'
  }
};

// Determine which environment was passed in command line
var passedEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Confirm that passed environment is one of the environment defined above. If not default to staging
var environmentToExport = typeof(environments[passedEnvironment]) == 'object' ? environments[passedEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;
