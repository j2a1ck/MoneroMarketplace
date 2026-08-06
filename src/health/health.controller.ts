import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Public } from 'src/auth/setMetadata';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly memory: MemoryHealthIndicator,
    private readonly disk: DiskHealthIndicator,
    private readonly db: TypeOrmHealthIndicator,
  ) {}

  @Public()
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),

      // Heap memory
      () =>
        this.memory.checkHeap(
          'memory_heap',
          300 * 1024 * 1024, // 300 MB
        ),

      // RSS (total process memory)
      () =>
        this.memory.checkRSS(
          'memory_rss',
          500 * 1024 * 1024, // 500 MB
        ),

      () =>
        this.disk.checkStorage('storage', {
          path: '/',
          thresholdPercent: 0.9, // Fail if disk >90% full
        }),

      () => this.http.pingCheck('google', 'https://google.com'),
    ]);
  }
}
