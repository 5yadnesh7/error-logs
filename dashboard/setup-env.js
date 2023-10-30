const ENV = process.env.APP_ENV
const serverEnvironments = {
    production: {
        BROWSER_ENV: 'production',
        FRONTEND_PATH_BC: 'https://m.justdial.com/',
        // ERROR_LOG: 'http://192.168.40.171:2121',
        ERROR_LOG: 'http://localhost:2121',
    },
    staging: {
        BROWSER_ENV: 'staging',
        FRONTEND_PATH_BC: 'https://staging2.justdial.com/',
        // ERROR_LOG: 'http://192.168.40.171:2121',
        ERROR_LOG: 'http://localhost:2121',
    },
    development: {
        BROWSER_ENV: 'development',
        // FRONTEND_PATH_BC: 'http://sahil.jdsoftware.jd:8962/',
        FRONTEND_PATH_BC: 'http://localhost:8962/',
        // ERROR_LOG: 'http://192.168.40.171:2121',
        ERROR_LOG: 'http://localhost:2121',
        API_PATH: '/api/',
    },
}

const browserEnvironments = {
    production: {
        BROWSER_ENV: 'production',
        API_PATH: 'https://m.justdial.com/api/',
    },
    staging: {
        BROWSER_ENV: 'staging',
        API_PATH: 'https://staging2.justdial.com/api/',
    },
    development: {
        BROWSER_ENV: 'development',
        // ERROR_DASHBOARD_PATH: 'http://192.168.40.171:8962',
        ERROR_DASHBOARD_PATH:'http://localhost:8962/',
        API_PATH: '/api/',
        ERROR_LOG:process.env.ERRORLOG
    },
}

const getServerEnv = (envName = 'development') => serverEnvironments[envName]
const getBrowserEnv = (envName = 'development') => browserEnvironments[envName]
const currentEnv = serverEnvironments[ENV]
for (let i in currentEnv) {
    process.env[i] = process.env[i] || currentEnv[i]
}

module.exports = {
    getServerEnv,
    getBrowserEnv,
}
