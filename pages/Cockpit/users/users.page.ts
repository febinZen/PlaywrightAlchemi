import { Page } from '@playwright/test';

export class UsersPage {
  constructor(private page: Page) {}

 
  headerButton(name: string) {
    return this.page.getByRole('button', { name });
  }

  dropdown() {
    return this.page.getByRole('combobox');
  }

  searchBox() {
    return this.page.getByRole('textbox', { name: 'Search table' });
  }


  
}
