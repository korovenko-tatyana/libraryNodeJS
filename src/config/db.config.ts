import { registerAs } from '@nestjs/config';

import { pgConfig } from './postgres.config';

export default registerAs('pgConfig', pgConfig);
