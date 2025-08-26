# Backend EmailJS Integration Setup Guide

## 🎯 **Overview**
This guide will help you set up EmailJS integration in your backend to automatically send email notifications when requests are approved or rejected.

## 🚀 **Quick Start**

### 1. **Install Dependencies**
```bash
npm install axios
```

### 2. **Environment Configuration**
Create a `.env` file in your `my-express-web-server` directory:

```env
# EmailJS Configuration
EMAILJS_SERVICE_ID=your_service_id_here
EMAILJS_TEMPLATE_ID=your_template_id_here
EMAILJS_PUBLIC_KEY=your_public_key_here
EMAILJS_USER_ID=your_user_id_here
```

### 3. **EmailJS Account Setup**
1. **Visit [EmailJS.com](https://www.emailjs.com/)**
2. **Sign up for a free account**
3. **Verify your email address**

### 4. **Create Email Service**
1. **Go to Email Services** in your EmailJS dashboard
2. **Click "Add New Service"**
3. **Choose your email provider** (Gmail, Outlook, etc.)
4. **Follow the authentication steps**
5. **Note down your Service ID**

### 5. **Create Email Template**
1. **Go to Email Templates** in your EmailJS dashboard
2. **Click "Create New Template"**
3. **Use the template from `emailjsTemplates.md`**
4. **Set subject line:** `Your {{request_type}} Request - {{status}}`
5. **Save and note the Template ID**

### 6. **Get Your Credentials**
1. **Service ID:** From your email service
2. **Template ID:** From your email template
3. **Public Key:** From your EmailJS account settings
4. **User ID:** From your EmailJS account settings

## 🔧 **Implementation Details**

### **Files Modified:**

#### 1. **Email Service** (`services/emailService.js`)
- ✅ EmailJS API integration
- ✅ Request status email functions
- ✅ Error handling and logging
- ✅ Template parameter management

#### 2. **Requests Controller** (`controllers/requestsController.js`)
- ✅ Email service integration
- ✅ Automatic email sending on approval/rejection
- ✅ User email lookup and validation
- ✅ Graceful email failure handling

#### 3. **Environment Configuration**
- ✅ EmailJS credentials management
- ✅ Secure configuration storage
- ✅ Development/production flexibility

### **How It Works:**

1. **Admin approves/rejects request** in the system
2. **Backend processes** the approval/rejection
3. **User email is retrieved** from the database
4. **EmailJS API is called** with template parameters
5. **Email is sent** to the requester automatically
6. **System continues** even if email fails

## 📧 **Email Templates**

### **Template Features:**
- ✅ **Responsive Design** - Works on all devices
- ✅ **Status-Specific Content** - Different for approved vs rejected
- ✅ **Professional Appearance** - Clean, branded design
- ✅ **Clear Information** - All request details displayed
- ✅ **Action Items** - Clear next steps for users

### **Template Variables:**
| Variable | Description | Example |
|----------|-------------|---------|
| `{{to_email}}` | Requester's email | `user@example.com` |
| `{{request_type}}` | Type of request | `Transfer Request` |
| `{{requester_name}}` | Name of requester | `John Doe` |
| `{{status}}` | Request status | `Approved`, `Rejected` |
| `{{admin_notes}}` | Admin comments | `Request approved after review` |
| `{{review_date}}` | Review timestamp | `January 15, 2025 at 2:30 PM` |
| `{{inventory_details}}` | Inventory info | `ABC Company - Solar Energy (50 kW)` |

## 🧪 **Testing**

### **Test the Integration:**

1. **Set up your EmailJS credentials** in `.env`
2. **Submit a test request** in your system
3. **Approve or reject** the request as an admin
4. **Check the requester's email** for notification
5. **Verify all information** is correctly displayed

### **Common Issues:**

| Issue | Solution |
|-------|----------|
| Emails not sending | Check EmailJS credentials in `.env` |
| Template variables not working | Verify template syntax in EmailJS dashboard |
| Service connection failed | Re-authenticate your email service |
| Rate limiting | Check EmailJS free tier limits |

## 📊 **EmailJS Pricing**

### **Free Tier:**
- **200 emails per month**
- **2 email templates**
- **1 email service**

### **Paid Plans:**
- **Starter:** $15/month - 1,000 emails
- **Professional:** $25/month - 5,000 emails
- **Enterprise:** Custom pricing

## 🔒 **Security Considerations**

1. **Environment Variables** - Never commit `.env` files to version control
2. **EmailJS Keys** - Keep your credentials secure
3. **Template Validation** - Validate all template variables
4. **Error Handling** - Graceful fallback if email fails
5. **User Privacy** - Only send emails to authenticated users

## 📱 **Email Features**

### **Automatic Notifications:**
- ✅ **Request Approval** - Sent when admin approves request
- ✅ **Request Rejection** - Sent when admin rejects request
- ✅ **Status Updates** - Real-time notification delivery
- ✅ **Professional Format** - Branded, mobile-friendly emails

### **Content Included:**
- ✅ **Request details** and status
- ✅ **Administrator notes** and comments
- ✅ **Inventory information** (for transfer requests)
- ✅ **Next steps** and action items
- ✅ **Review date** and timestamp

## 🎯 **Next Steps**

### **Immediate:**
1. **Set up EmailJS account** and get credentials
2. **Create email template** using provided HTML
3. **Update environment variables** with real credentials
4. **Test with real requests** to ensure everything works

### **Future Enhancements:**
1. **Email preferences** for users
2. **Custom email templates** for different request types
3. **Email scheduling** and batch processing
4. **Email analytics** and delivery tracking

## 📞 **Support**

If you need help:

1. **EmailJS Documentation:** [docs.emailjs.com](https://docs.emailjs.com/)
2. **EmailJS Community:** [community.emailjs.com](https://community.emailjs.com/)
3. **AREC Technical Team:** Contact your system administrator

---

**Status**: ✅ **READY** - Backend EmailJS integration fully implemented
**Last Updated**: January 2025
**Maintained By**: Development Team

