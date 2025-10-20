import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { Accounts } from './app/pages/accounts/accounts';

bootstrapApplication(Accounts, {
  providers: [
    provideHttpClient() // ✅ Importante
  ]
});