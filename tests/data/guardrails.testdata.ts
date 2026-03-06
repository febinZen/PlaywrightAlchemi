export const guardrailsTestData = {
  menuName: "Guardrails",

  samples: {
    pii: "PII Sample",
    toxic: "Toxic Sample",
    jailbreak: "Jailbreak Sample",
    clean: "Clean Sample",
  },

  checkboxes: {
    pii: "PII Detection",
    toxic: "Toxic Content",
    jailbreak: "Jailbreak Detection",
  },

   allCheckboxes: [
    "PII Detection",
    "Toxic Content",
    "Jailbreak Detection"
  ],

  expectedResults: {
    piiSample: {
      pii: "Failed",
      toxic: "Passed",
      jailbreak: "Passed",
    },

    toxicSample: {
      pii: "Passed",
      toxic: "Failed",
      jailbreak: "Passed",
    },

    jailbreakSample: {
      pii: "Passed",
      toxic: "Passed",
      jailbreak: "Failed",
    },

    cleanSample: {
      overall: "Passed",
    },
  },
};
