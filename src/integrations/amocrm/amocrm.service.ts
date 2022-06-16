import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SettingIntegrationDto } from './dto/settings-integration.dto';
import { SettingIntegrationAmoCrm } from './settings.model';
//const Client = require('amocrm-js');
import { Client } from 'amocrm-js';

@Injectable()
export class AmocrmService {
    constructor(
        @InjectRepository(SettingIntegrationAmoCrm) private settingsAmoCrmRepository: Repository<SettingIntegrationAmoCrm>
    ) {}
    
    async authAmoCrm(settingsIntDto: SettingIntegrationDto) {
        const oldSettings = await this.getCurrentSettings();
        
        const client = new Client({
            domain: settingsIntDto.clientUrl,
            auth: {
                client_id: settingsIntDto.clientId, 
                client_secret: settingsIntDto.secretKey,
                redirect_uri: 'https://' + settingsIntDto.clientUrl,
                code: settingsIntDto.code
        }});
           
        await client.connection.connect();
        //await client.token.fetch();
        
        try {
            const id = await this.getInvoices(client);
            console.log(id);
        } catch(e) {
            throw new HttpException(`Cart not found`, HttpStatus.NOT_FOUND);
        }

        await this.save(client);

        await this.removeSettings(oldSettings);
    }

    async getCurrentSettings(): Promise<SettingIntegrationAmoCrm> | null {
        const settings = await this.settingsAmoCrmRepository.find();

        if (0 !== settings.length) {
            return settings[0];
        }

        return null;
    }

    async getInvoices(client: any) {
        const responce = await client.request.get('/api/v4/catalogs');
        
        const catalogs = responce.data._embedded.catalogs;

        for (let key in catalogs) {
            if ('invoices' === catalogs[key].type) {
                return catalogs[key].id;
            }
        }

        return 0;
    }

    async save(client: any) {
        const token = client.token.getValue();
        const data = client.token.getBaseClientOptions();

        const newSettings = new SettingIntegrationAmoCrm();

        newSettings.clientId = data.client_id;
        newSettings.secretKey = data.client_secret;
        newSettings.clientUrl = data.redirect_uri.slice(8);
        newSettings.accessToken = token.access_token;
        newSettings.refreshToken = token.refresh_token;
        newSettings.expires = token.expires_in;

        await this.settingsAmoCrmRepository.save(newSettings);
    }

    async removeSettings(oldSettings: SettingIntegrationAmoCrm|null) {
        if (null !== oldSettings) {
            await this.settingsAmoCrmRepository.remove(oldSettings);
        }
    }
}
