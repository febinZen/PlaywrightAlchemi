// budget.testdata.ts

export const budgetTestData = {

  menuName: "Budget",
  groups: {
    defaultGroup: "Default",
    devSecOps: "DevSecOps",
    cloudSecurity: "Cloud Security"
  },

  members: {
    lisa: "Lisa Member",
    fiona: "Fiona Member"
  },

 spendingLimits: {
  valid: {
    small: 1000,
    medium: 12490,
    large: 25005,
    max: 999999,
    memberUpdate: 3000 
  },



    invalid: {
      negative: -10,
      zero: 0,
      text: "abc",
      decimal: 12.5,
      empty: ""
    },

    boundary: {
      min: 1,
      justAboveMin: 2,
      max: 1000000,
      justBelowMax: 999999
    }
  },

  overflowTypes: {
    blocked: "Blocked - No overflow allowed",
    unlimited: "Unlimited - Can use pool",
    capped: "Capped - Limited overflow"
  },

  overflowCap: {
    valid: 100,
    invalid: {
      negative: -5,
      zero: 0,
      large: 999999
    }
  }
};



export const planButtonsTestData = {

  views: {
    tabs: "Tabs view",
    tree: "Tree view"
  },

  tabs: {
    teams: "Teams",
    users: "Users"
  },

  buttons: {
    editPlan: "Edit Plan",
    addLimit: "Add Limit",
    cancel: "Cancel",
    close: "Close",
    manageWallet: "Manage Wallet"
  },

  counts: {
    teams: 12,
    users: 23
  }

};



export const editPlanTestData = {

  planNames: {
    valid: [
      "Testing Budget Plan 2024",
      "Enterprise Plan 2026",
      "Plan_123"
    ],
    invalid: {
      empty: "",
      tooLong: "A".repeat(300)
    }
  },

  credits: {
    valid: 500,
    invalid: {
      negative: -10,
      zero: 0
    }
  },

  overflowTypes: {
    unlimited: "Unlimited",
    blocked: "Blocked (No overflow)",
    capped: "Capped"
  },

  capAmounts: {
    valid: 1000,
    invalid: {
      negative: -100,
      zero: 0
    }
  }

};
