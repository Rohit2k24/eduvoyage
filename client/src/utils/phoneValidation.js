// Phone number validation rules for different countries
const phoneValidationRules = {
  // North America
  US: { minLength: 10, maxLength: 10 }, // United States
  CA: { minLength: 10, maxLength: 10 }, // Canada
  
  // Europe
  GB: { minLength: 10, maxLength: 11 }, // United Kingdom
  DE: { minLength: 10, maxLength: 11 }, // Germany
  FR: { minLength: 9, maxLength: 10 },  // France
  IT: { minLength: 9, maxLength: 11 },  // Italy
  ES: { minLength: 9, maxLength: 9 },   // Spain
  
  // Asia
  IN: { minLength: 10, maxLength: 10 }, // India
  CN: { minLength: 11, maxLength: 11 }, // China
  JP: { minLength: 10, maxLength: 10 }, // Japan
  KR: { minLength: 9, maxLength: 10 },  // South Korea
  
  // Oceania
  AU: { minLength: 9, maxLength: 9 },   // Australia
  NZ: { minLength: 8, maxLength: 10 },  // New Zealand
  
  // Default rule for unlisted countries
  DEFAULT: { minLength: 8, maxLength: 15 }
};

const validatePhoneNumber = (phoneNumber, country) => {
  if (!phoneNumber) return { isValid: false, message: 'Phone number is required' };
  
  try {
    const parsedNumber = parsePhoneNumber(phoneNumber);
    if (!parsedNumber) {
      return { isValid: false, message: 'Invalid phone number format' };
    }

    const countryCode = parsedNumber.country;
    const nationalNumber = parsedNumber.nationalNumber;
    const rules = phoneValidationRules[countryCode] || phoneValidationRules.DEFAULT;

    if (nationalNumber.length < rules.minLength) {
      return {
        isValid: false,
        message: `Phone number for ${countryCode} must be ${rules.minLength} digits`
      };
    }

    if (nationalNumber.length > rules.maxLength) {
      return {
        isValid: false,
        message: `Phone number for ${countryCode} cannot exceed ${rules.maxLength} digits`
      };
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      return {
        isValid: false,
        message: 'Invalid phone number format'
      };
    }

    return { isValid: true, message: '' };
  } catch (error) {
    return { isValid: false, message: 'Invalid phone number format' };
  }
};

export { validatePhoneNumber, phoneValidationRules }; 