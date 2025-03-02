import { Express } from 'express';
import { Logger } from '../../helpers/logger';

interface RouteInfo {
    path: string;
    methods: string[];
}

export const RouterLoggerMiddleware = (app: Express) => {
    const routes: RouteInfo[] = [];
    const Context = 'RouteLogger';
    const Method = null;

    const getBasePathFromRegex = (regexp: RegExp): string => {
        const regexStr = regexp.toString();
        let path = regexStr
            .replace('/^', '')
            .replace('\\/?(?=\\/|$)/i', '')
            .replace(/\\\//g, '/');
        
        path = path.split('(?=')[0];
        path = path.replace(/\\/g, '');
        
        return path;
    };

    const extractRoutesFromLayer = (layer: any, basePath: string = '') => {
        if (layer.route) {
            const methods = Object.keys(layer.route.methods)
                .filter(method => layer.route.methods[method])
                .map(method => method.toUpperCase());
            
            const fullPath = `${basePath}${layer.route.path}`;
            routes.push({ 
                path: fullPath,
                methods 
            });
        } else if (layer.name === 'router') {
            let newBasePath = basePath;
            
            // Get the router's base path if it exists
            if (layer.regexp) {
                const routerBasePath = getBasePathFromRegex(layer.regexp);
                if (routerBasePath !== '/^') {
                    newBasePath += routerBasePath;
                }
            }

            layer.handle.stack.forEach((stackItem: any) => {
                extractRoutesFromLayer(stackItem, newBasePath);
            });
        }
    };

    app._router.stack.forEach((layer: any) => {
        if (layer.name === 'router') {
            const basePath = '/api';
            layer.handle.stack.forEach((stackItem: any) => {
                extractRoutesFromLayer(stackItem, basePath);
            });
        }
    });

    routes.sort((a, b) => a.path.localeCompare(b.path));

    Logger.info(Context, Method, '🚀 Available Routes:');

    routes.forEach(route => {
        route.methods.forEach(method => {
            Logger.info(Context, Method, `${method.padEnd(6)} ${route.path}`);
        });
    });

    Logger.info(Context, Method, `Total routes: ${routes.length}`);
};