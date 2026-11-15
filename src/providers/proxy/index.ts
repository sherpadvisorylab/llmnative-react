import { onConfigChange } from '../../Config';
import { configureProxy } from './core';

export * from './core';

onConfigChange((config) => {
    configureProxy(config.proxy);
});
