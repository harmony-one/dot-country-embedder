import * as dotenv from 'dotenv'
import * as process from "process";
dotenv.config()

const DEBUG = process.env.DEBUG === 'true' || process.env.DEBUG === '1'
const config = {
  TLD: process.env.TLD ?? 'country',
  subdomain: process.env.SUBDOMAIN ?? 'www',
  debug: DEBUG,
  provider: process.env.DEFAULT_RPC ?? 'https://api.harmony.one',
  ewsContract: process.env.EMBEDDER_CONTRACT ?? '',
  verbose: process.env.VERBOSE === 'true' || process.env.VERBOSE === '1',
  https: {
    only: process.env.HTTPS_ONLY === 'true' || process.env.HTTPS_ONLY === '1',
    key: DEBUG ? './certs/test.key' : './certs/privkey.pem',
    cert: DEBUG ? './certs/test.cert' : './certs/fullchain.pem'
  },
  corsOrigins: process.env.CORS ?? '',
  farcast: {
    // postUrlSubdomainPrefix: process.env.FC_POST_SUBDOMAIN_PREFIX ?? 'farcast-api',
    postUrlSubdomainPrefix: process.env.FC_POST_SUBDOMAIN_PREFIX ?? '',
    apiBase: process.env.FC_API_BASE ?? 'farcast',
    postProtocol: process.env.FC_POST_PROTOCOL ?? 'https',
    hubUrl: process.env.FC_HUB_URL ?? 'hub-grpc.pinata.cloud',
    defaultImageUrl: process.env.FC_DEFAULT_IMAGE_URL ?? 'https://storage.googleapis.com/dotcountry-farcaster/fc-default.png'
  },
  google: {
    storage: {
      bucket: process.env.GOOGLE_STORAGE_BUCKET ?? 'farcaster-cache'
    },
    map:
        {
          key: process.env.GOOGLE_MAP_KEY ?? '',
          defaultLocation: process.env.GOOGLE_MAP_DEFAULT_LOCATION ?? 'Salesforce Tower',
          defaultLocationSuffix: process.env.GOOGLE_MAP_LOCATION_SUFFIX ?? ', San Francisco, CA'
        }
  },
  unrestrictedProxy: ['true', '1'].includes(process.env.UNRESTRICTED_PROXY ?? '')
}
export default config
