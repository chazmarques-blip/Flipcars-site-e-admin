// Simular o que acontece no código
const data = {
  firstName: "Test",
  lastName: "User",
  email: "test@test.com",
  phone: "(321) 960-8661",
  serviceType: "bodyshop",  // Este campo deve ser removido
  contactPreferences: {
    phoneCall: true,
    whatsapp: false,
    textMessage: true
  }
};

console.log("Original data:", Object.keys(data));

// Aplicar destructuring
const { serviceType, ...cleanData } = data;

console.log("After destructuring - cleanData keys:", Object.keys(cleanData));
console.log("ServiceType removed?", !("serviceType" in cleanData));

// Criar leadData como no código
const leadData = {
  firstName: cleanData.firstName,
  lastName: cleanData.lastName,
  email: cleanData.email,
  phone: cleanData.phone,
  contactPreferences: cleanData.contactPreferences,
  source: 'website_estimate_form',
  status: 'new',
};

console.log("Final leadData keys:", Object.keys(leadData));
console.log("ServiceType in leadData?", "serviceType" in leadData);
console.log("Final payload:", JSON.stringify(leadData, null, 2));
