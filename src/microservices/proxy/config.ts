import * as env from 'env-var'

export const getConfig = () => ({
  port: env.get('PORT').default(3000).asPortNumber(),
  monolithUrl: env.get('MONOLITH_URL').default('http://monolith:8080').asUrlString(),
  moviesServiceUrl: env.get('MOVIES_SERVICE_URL').default('http://movies-service:8081').asUrlString(),
  eventsServiceUrl: env.get('EVENTS_SERVICE_URL').default('http://events-service:8082').asUrlString(),
  gradualMigration: env.get('GRADUAL_MIGRATION').default('true').asBool(),
  moviesMigrationPercent: env.get('MOVIES_MIGRATION_PERCENT').default(50).asIntPositive()
})
