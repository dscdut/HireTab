// @ts-check
const express = require('express');
import methodOverride from 'method-override';
import swaggerUi from 'swagger-ui-express';
import { connectDatabase } from 'core/database';
import { InvalidResolver, InvalidFilter } from '../common/exceptions/system';
import { logger } from '../../packages/logger';
import { NODE_ENV } from '../env';
import cors from 'cors';

/**
 * @typedef Filter
 * @property {(req, res, next) => {}} filter
 */

export class AppBundle {
    static logger = logger;

    BASE_PATH = '/v1/api';

    BASE_PATH_SWAGGER = '/docs';

    static builder() {
        AppBundle.logger.info('App is starting bundling');
        return new AppBundle();
    }

    /**
     * @param {import("express-serve-static-core").Express} app
     */
    applyAppContext(app) {
        this.app = app;
        return this;
    }

    applyResolver(resolver) {
        if (!resolver['resolve']) {
            throw new InvalidResolver(resolver);
        }
        this.app.use(this.BASE_PATH, resolver.resolve());
        return this;
    }

    applySentryError(sentry) {
        this.app.use(sentry.Handlers.errorHandler());
        return this;
    }

    /**
     *
     * @param {[Filter]} filters
     * @returns {AppBundle}
     */
    applyGlobalFilters(filters) {
        filters.forEach(filter => {
            if (filter['filter']) {
                this.app.use(filter.filter);
            } else {
                throw new InvalidFilter(filter);
            }
        });
        return this;
    }

    applySwagger(swaggerBuilder) {
        this.app.use(
            this.BASE_PATH_SWAGGER,
            swaggerUi.serve,
            swaggerUi.setup(swaggerBuilder.instance),
        );
        logger.info('Building swagger');

        return this;
    }

    /**
     * Default config
     */
    init() {
        AppBundle.logger.info(`Application is in mode ${NODE_ENV}`);
        /**
         * Setup basic express
         */
        this.app.use(express.json({ limit: '50mb' }));
        this.app.use(express.urlencoded({ extended: false, limit: '50mb' }));

         /**
         * Setup CORS
         */
        const allowedOrigins = process.env.CORS_ALLOW.split(',');
        const corsOptions = {
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                } else {
                    callback(new Error('Not allowed by CORS'));
                }
            },
            credentials: true,
        };
        this.app.use(cors(corsOptions));

        /**
         * Setup method override method to use PUT, PATCH,...
         */
        this.app.use(methodOverride('X-HTTP-Method-Override'));
        this.app.use(
            methodOverride(req => {
                if (
                    req.body &&
                    typeof req.body === 'object' &&
                    '_method' in req.body
                ) {
                    const method = req.body._method;
                    delete req.body._method;

                    return method;
                }

                return undefined;
            }),
        );
        AppBundle.logger.info('Building initial config');

        return this;
    }

    /*
    Setup asynchronous config here
     */
    async run() {
        AppBundle.logger.info('Building asynchronous config');
        await connectDatabase();
    }
}
