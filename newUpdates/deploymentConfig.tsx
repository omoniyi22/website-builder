// deployment/config.ts
import type { DeploymentConfig, Environment, CacheConfig, CDNConfig } from '../types';

export const deploymentConfig: DeploymentConfig = {
  environments: {
    production: {
      domain: 'app.builder.com',
      region: 'us-east-1',
      minInstances: 2,
      maxInstances: 10,
      ssl: {
        provider: 'aws',
        certificate: 'arn:aws:acm:us-east-1:123456789012:certificate/xxx',
      },
      database: {
        type: 'postgresql',
        replicas: 2,
        backupSchedule: '0 */6 * * *', // Every 6 hours
      },
      cache: {
        provider: 'redis',
        clusters: 2,
        maxMemoryGB: 16,
      },
      cdn: {
        provider: 'cloudfront',
        priceClass: 'PriceClass_200',
        ttl: {
          min: 0,
          default: 86400, // 1 day
          max: 31536000, // 1 year
        },
      },
    },
    staging: {
      domain: 'staging.builder.com',
      region: 'us-east-1',
      minInstances: 1,
      maxInstances: 3,
      ssl: {
        provider: 'aws',
        certificate: 'arn:aws:acm:us-east-1:123456789012:certificate/yyy',
      },
      database: {
        type: 'postgresql',
        replicas: 1,
        backupSchedule: '0 0 * * *', // Daily
      },
      cache: {
        provider: 'redis',
        clusters: 1,
        maxMemoryGB: 8,
      },
      cdn: {
        provider: 'cloudfront',
        priceClass: 'PriceClass_100',
        ttl: {
          min: 0,
          default: 3600, // 1 hour
          max: 86400, // 1 day
        },
      },
    },
  },
  
  build: {
    optimization: {
      splitChunks: true,
      minify: true,
      treeshake: true,
      compression: {
        brotli: true,
        gzip: true,
      },
      imageOptimization: {
        formats: ['webp', 'avif'],
        quality: 85,
      },
    },
    sourceMaps: {
      production: false,
      staging: true,
    },
    analytics: {
      bundle: true,
      performance: true,
    },
  },

  security: {
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Content-Security-Policy': "default-src 'self'",
    },
    rateLimit: {
      window: '15m',
      max: 100,
    },
    ddos: {
      provider: 'cloudflare',
      sensitivity: 'medium',
    },
  },

  monitoring: {
    apm: {
      provider: 'newrelic',
      sampleRate: 0.1,
    },
    logging: {
      level: 'info',
      retention: '30d',
      providers: ['cloudwatch', 'papertrail'],
    },
    alerts: {
      cpu: { threshold: 80, window: '5m' },
      memory: { threshold: 85, window: '5m' },
      errors: { threshold: 50, window: '5m' },
    },
  },
};

export const cdnConfig: CDNConfig = {
  domains: ['assets.builder.com', 'media.builder.com'],
  origins: {
    assets: {
      s3Bucket: 'builder-assets',
      region: 'us-east-1',
    },
    media: {
      s3Bucket: 'builder-media',
      region: 'us-east-1',
    },
  },
  behaviors: {
    'images/*': {
      ttl: 2592000, // 30 days
      compress: true,
      cachePolicy: {
        queryString: false,
        cookies: 'none',
        headers: ['Origin', 'Access-Control-Request-Method'],
      },
    },
    'js/*': {
      ttl: 86400, // 1 day
      compress: true,
      cachePolicy: {
        queryString: true,
        cookies: 'none',
        headers: ['Origin'],
      },
    },
  },
};

export const cacheConfig: CacheConfig = {
  layers: {
    browser: {
      maxAge: 3600,
      staleWhileRevalidate: 86400,
    },
    cdn: {
      maxAge: 86400,
      staleIfError: 259200,
    },
    application: {
      blocks: { ttl: 300 },
      pages: { ttl: 60 },
      assets: { ttl: 3600 },
    },
  },
  invalidation: {
    patterns: [
      '/api/pages/*',
      '/api/blocks/*',
      '/api/assets/*',
    ],
  },
};