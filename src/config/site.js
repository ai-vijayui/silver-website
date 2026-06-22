export const SITE = {
  name: 'Silver Group',
  phone: '+917383232352',
  phoneDisplay: '+91 73 83 23 23 52',
  email: 'info@silvergroup.in',
  whatsappUrl:
    'https://wa.me/917383232352?text=Hi%2C%20I%20would%20like%20to%20enquire%20about%20Silver%20Infinity.',
  instagram: 'https://www.instagram.com/official_silver_surat/?hl=en',
  address: {
    line1: 'Block No. 118, Silver Infinity,',
    line2: 'Near VIP Circle, Utran (Digital Vally)',
  },
};

export const FORM = {
  accessKey: import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || 'YOUR_ACCESS_KEY_HERE',
  subject: 'New Enquiry — Silver Group Website',
  fromName: 'Silver Group Website',
  brochure: {
    file: '/documents/silver-infinity-brochure.pdf',
    filename: 'Silver-Infinity-Brochure.pdf',
    subject: 'Brochure Download Request — Silver Group Website',
  },
  whatsapp: {
    phone: '+917383232352',
    apiKey: import.meta.env.VITE_CALLMEBOT_API_KEY || 'YOUR_WHATSAPP_API_KEY_HERE',
  },
};

export const MAP = {
  lat: 21.2323094,
  lng: 72.8657004,
  zoom: 17,
  googleMapsUrl:
    'https://www.google.com/maps/search/Silver%20Infinity%2C%20VIP%20Circle%2C%20Digital%20Valley%20(Uttran)%2C%20Surat%2C%20Gujarat%20394105%2C%20India/@21.2323,72.8657,17z?hl=en',
  embedSrc:
    'https://maps.google.com/maps?q=21.2323094,72.8657004&hl=en&z=17&output=embed',
};

export const TOUR = {
  embedUrl:
    import.meta.env.VITE_TOUR_URL ||
    'https://surbhi-infotech-360.s3.ap-south-1.amazonaws.com/Silver_Infinity/index.htm',
};
