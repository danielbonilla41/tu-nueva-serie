import { BootstrapContext, bootstrapApplication } from '@angular/platform-browser';
import { Accounts } from './app/pages/accounts/accounts';
import { config } from './app/app.config.server';

const bootstrap = (context: BootstrapContext) =>
    bootstrapApplication(Accounts, config, context);

export default bootstrap;
