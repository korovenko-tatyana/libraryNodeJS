import { Command, CommandRunner } from "nest-commander";
import { AmocrmService } from "../integrations/amocrm/amocrm.service";
import { HttpException, HttpStatus, Inject } from "@nestjs/common";
//const Client = require('amocrm-js');
import { Client } from 'amocrm-js';
import { Cron, SchedulerRegistry } from "@nestjs/schedule";

@Command({ name: 'amocrm:update-token' })
export class UpdateTokenAmoCrmCommand implements CommandRunner {
    constructor(
        @Inject(AmocrmService)
        private amoService: AmocrmService,
        private schedulerRegistry: SchedulerRegistry
    ) {}

    // @Cron('0 */2 * * * *', {name: 'token'})
    @Cron('0 0 */10 * * *', {name: 'token'})
    async run(passedParams: string[], options?: Record<string, any>): Promise<void> {
        const settings = await this.amoService.getCurrentSettings();
        //const job = this.schedulerRegistry.getCronJob('token');
        //console.log(job);
        if (null === settings) {
            throw new HttpException(`No AmoCRM credentials`, HttpStatus.NOT_FOUND);
        }
        
        try {
            const client = new Client({
                domain: settings.clientUrl,
                auth: {
                    client_id: settings.clientId, 
                    client_secret: settings.secretKey,
                    redirect_uri: 'https://' + settings.clientUrl,
            }});

            client.token.setValue({
                token_type: 'Bearer',
                expires_in: settings.expires,
                access_token: settings.accessToken,
                refresh_token: settings.refreshToken,
            });

            await client.connection.connect();
            await client.token.refresh();
            
            await this.amoService.save(client);

            await this.amoService.removeSettings(settings);
            console.log('Success update token!');
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }
    }
}