export const USERS_TEST_DATA = {
  menuName: 'Users',
  users: [
    { name: 'Admin', email: 'admin2@testcorp.com', role: 'Admin', workspace: 'Default' },
    { name: 'Bob', email: 'admin2@testcorp.com', role: 'Admin' },
    { name: 'Charlie', email: 'charlie@testcorp.com', role: 'Member' },
    { name: 'Diana', email: 'diana@testcorp.com', role: 'Member' },
    { name: 'Fiona', email: 'fiona@testcorp.com', role: 'Member', credits: 2085, cap: 100 },
    { name: 'Lisa', email: 'lisa@testcorp.com', role: 'Member', credits: 6248, cap: 100, workspace: 'Cloud Security' },
    { name: 'Sriram', email: 'sriram@testcorp.com', role: 'Member' },
  ],
  columnHeaders: ['USER MEMBER', 'JOINED DATE', 'LASTLY ACTIVE', 'APP ROLE'],
  rowsPerPage: [5, 10],
  pagination: [1, 2, 3],
  filterOptions: {
    field: 'USER MEMBER',
    searchValue: 'f',
  },
};

export const INVITE_TEST_DATA = {
  inviteUser: {
    email: 'lkjehoz@gmail.com',
    role: 'USER',
  },

  expectedStatus: {
    pending: 'PENDING',
    accepted: 'ACCEPTED',
    rejected: 'REJECTED'
  }
};