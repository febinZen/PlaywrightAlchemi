import { test, expect } from '../../fixtures/roles.fixture';
import { CockpitRequestPage } from '../../../pages/request/request.page';
import { REQUEST_PRIORITY_DATA } from '../../data/request.testdata';

test('Priority change reflects in Cockpit request table',
async ({ adminPage }) => {

  const cockpit = new CockpitRequestPage(adminPage);

  // ==========================
  // 🔹 Navigate to Requests
  // ==========================
  await cockpit.navigate();

  //search for the request to ensure it exists before proceeding
  await adminPage.waitForLoadState('networkidle');
  await cockpit.searchRequest(REQUEST_PRIORITY_DATA.subject);

  // ==========================
  // 🔹 Open Specific Request
  // ==========================
  await cockpit.openRequest(REQUEST_PRIORITY_DATA.subject);

  // 🔹 Get current priority
  const currentPriority = await cockpit.getCurrentPriority();
  console.log('Current Priority:', currentPriority);

  // 🔹 Decide new priority dynamically
  let newPriority =  currentPriority === 'Urgent' ? 'Important' : 'Urgent';

  if (currentPriority.toLowerCase().includes('urgent')) {
    newPriority = 'Important';
  }

  // 🔹 Change priority
  await cockpit.changePriority(newPriority);

  // ==========================
  // 🔹 Go Back to Table
  // ==========================
  await cockpit.goBack();

  // ==========================
  // 🔹 Search for Request
  // ==========================
  await cockpit.searchRequest(REQUEST_PRIORITY_DATA.subject);   

  // ==========================
  // 🔹 Validate Updated Priority
  // ==========================
   // 🔹 Validate updated value in table row
  const tableText = await cockpit.getPriorityFromTable(REQUEST_PRIORITY_DATA.subject);

  expect(tableText.toLowerCase())
    .toContain(newPriority.toLowerCase());

});
