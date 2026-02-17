export const NOTIFICATIONS_TEST_DATA = {
  columnHeaders: ['TEMPLATE', 'EVENT'],
  templates: [
    {
      name: 'Support Ticket Notification',
      event: 'Ticket Created',
      actions: ['Edit', 'Open Ticket & Assign'],
    },
  ],
  searchQuery: 'we',
  events: ['Ticket Created', 'Ticket Updated', 'User Added'],
};