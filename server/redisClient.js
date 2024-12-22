import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  connectTimeout: 10000,
});

// Redis 연결 성공 시 출력
redis.on('connect', () => {
  console.log('Redis에 성공적으로 연결되었습니다.');
});

// Redis 연결 에러 시 출력
redis.on('error', (err) => {
  console.error('Redis 연결 오류:', err);
});

// Redis 연결 종료 시 출력
redis.on('close', () => {
  console.log('Redis 연결이 종료되었습니다.');
});


export default redis;