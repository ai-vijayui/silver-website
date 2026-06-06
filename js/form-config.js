/**
 * Silver Group — Form notifications
 *
 * Email (Web3Forms): https://web3forms.com
 * WhatsApp (CallMeBot): https://www.callmebot.com/blog/free-api-whatsapp-messages/
 */
window.SILVER_FORM = {
  accessKey: 'YOUR_ACCESS_KEY_HERE',
  subject: 'New Enquiry — Silver Group Website',
  fromName: 'Silver Group Website',

  /* Brochure download — documents/silver-infinity-brochure.pdf */
  brochure: {
    file: 'documents/silver-infinity-brochure.pdf',
    filename: 'Silver-Infinity-Brochure.pdf',
    subject: 'Brochure Download Request — Silver Group Website'
  },

  /* Optional — WhatsApp alert to your phone when a form is submitted */
  whatsapp: {
    phone: '+917383232352',
    apiKey: 'YOUR_WHATSAPP_API_KEY_HERE'
  }
};
