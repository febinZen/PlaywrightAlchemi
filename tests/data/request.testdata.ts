type Messages = {
comment: string;
reply: string;
div?: string;
};
export const REQUESTS_TEST_DATA: {
  menuName: string;
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
  menuName: 'Requests',
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



export const CREDIT_REQUEST_DATA = {
  type: 'Credit Request',
  subject: `Test Credit Request 1`,
  description: 'Automation test credit request',
  credits: 28000,
};

export const REQUEST_PRIORITY_DATA = {
  subject: CREDIT_REQUEST_DATA.subject,
  initialPriorityButton: 'URGENT',
  updatedPriority: 'IMPORTANT',
  expectedPriorityCell: 'IMPORTANT',
};

export const REQUEST_CHAT_DATA = {
  requestId: '2d8b1857-8bd0-4f6d-b70e-f39b3b241e89',
  requestTitle: CREDIT_REQUEST_DATA.subject,
  adminMessage: 'hi',
  userReply: 'fix my issue',
  adminReply: 'Yeaah sure',
};

export const INTERNAL_NOTE_DATA = {
  requestId: '2d8b1857-8bd0-4f6d-b70e-f39b3b241e89',
  requestTitle: CREDIT_REQUEST_DATA.subject,
  internalMessage: `Internal-${Date.now()}`,
};






