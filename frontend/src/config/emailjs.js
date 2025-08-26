import emailjs from '@emailjs/browser';

// EmailJS configuration
export const EMAILJS_CONFIG = {
  // You'll need to get these from your EmailJS account
  SERVICE_ID: process.env.REACT_APP_EMAILJS_SERVICE_ID || 'your_service_id',
  TEMPLATE_ID: process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'your_template_id',
  PUBLIC_KEY: process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'your_public_key',
  // AREC email address for notifications
  AREC_EMAIL: 'arec@mmsu.edu.ph'
};

// Initialize EmailJS
export const initEmailJS = () => {
  emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
};

// Send email notification for new requests
export const sendRequestNotification = async (requestData) => {
  try {
    const templateParams = {
      to_email: EMAILJS_CONFIG.AREC_EMAIL,
      request_type: requestData.requestType,
      requester_name: requestData.requesterName,
      requester_username: requestData.requesterUsername,
      reason: requestData.reason,
      inventory_details: requestData.inventoryDetails || 'N/A',
      request_date: new Date().toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'Pending Review'
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    console.log('Email notification sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Failed to send email notification:', error);
    return { success: false, error };
  }
};

// Send email notification for request status updates
export const sendRequestStatusNotification = async (requestData, status, adminNotes = '') => {
  try {
    const templateParams = {
      to_email: requestData.email || requestData.requesterEmail,
      request_type: requestData.requestType,
      requester_name: requestData.requesterName,
      status: status,
      admin_notes: adminNotes || 'No additional notes provided.',
      review_date: new Date().toLocaleDateString('en-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    console.log('Status update email sent successfully:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Failed to send status update email:', error);
    return { success: false, error };
  }
};

// Send approval email notification
export const sendApprovalEmail = async (requestData, adminNotes = '') => {
  return await sendRequestStatusNotification(requestData, 'Approved', adminNotes);
};

// Send rejection email notification
export const sendRejectionEmail = async (requestData, adminNotes = '', rejectionReason = '') => {
  const notes = rejectionReason ? `${adminNotes}\n\nRejection Reason: ${rejectionReason}` : adminNotes;
  return await sendRequestStatusNotification(requestData, 'Rejected', notes);
};

export default emailjs;
