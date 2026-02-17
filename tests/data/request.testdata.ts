type Messages = {
comment: string;
reply: string;
div?: string;
};
export const REQUESTS_TEST_DATA: {
  columnHeaders: string[];
  request: {
    id: string;
    title: string;
    priority: string;
    date: string;
    status: string;
  };

  messages: Messages;
  messageTemplates: {
    comment: string;
    reply: string;
    internalNote: string;
  };
  statuses: string[];
} = {
  columnHeaders: ['TICKET DETAILS', 'PRIORITY', 'CREATED'],

  request: {
    id: 'T1',
    title: 'test 1',
    priority: 'LOW',
    date: '02/02/2026',
    status: 'Open',
  },

  messages: {
    comment: 'Testing comment',
    reply: 'are you done?',
    
  },

  messageTemplates: {
    comment: 'hi testing',
    reply: 'Hi Test',
    internalNote: 'Internal Note',
  },

  statuses: ['Open', 'Closed'],
};

// derived value

