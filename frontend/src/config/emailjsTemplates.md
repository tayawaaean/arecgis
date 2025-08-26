# EmailJS Templates for AREC Request Notifications

## Template 1: New Request Notification (to AREC)

**Template ID:** `template_new_request`
**Subject:** New {{request_type}} Request - {{requester_name}}

**HTML Template:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>New Request Notification</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #2c3e50; margin: 0;">🆕 New Request Notification</h2>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
            <h3 style="color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
                Request Details
            </h3>
            
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; width: 150px;">Request Type:</td>
                    <td style="padding: 8px 0;">{{request_type}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Requester Name:</td>
                    <td style="padding: 8px 0;">{{requester_name}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Username:</td>
                    <td style="padding: 8px 0;">{{requester_username}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Request Date:</td>
                    <td style="padding: 8px 0;">{{request_date}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Status:</td>
                    <td style="padding: 8px 0; color: #e67e22; font-weight: bold;">{{status}}</td>
                </tr>
            </table>
            
            <div style="margin-top: 20px;">
                <h4 style="color: #34495e; margin-bottom: 10px;">Reason for Request:</h4>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #3498db;">
                    {{reason}}
                </div>
            </div>
            
            <div style="margin-top: 20px;">
                <h4 style="color: #34495e; margin-bottom: 10px;">Inventory Details:</h4>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #27ae60;">
                    {{inventory_details}}
                </div>
            </div>
        </div>
        
        <div style="background-color: #e8f4fd; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; color: #2980b9; font-size: 14px;">
                <strong>Action Required:</strong> Please review this request in the AREC GIS system and take appropriate action.
            </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #7f8c8d; font-size: 12px;">
            <p>This is an automated notification from the AREC GIS System.</p>
            <p>Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
```

## Template 2: Request Status Update (to Requester)

**Template ID:** `template_status_update`
**Subject:** Your {{request_type}} Request - {{status}}

**HTML Template:**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Request Status Update</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #2c3e50; margin: 0;">📋 Request Status Update</h2>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
            <h3 style="color: #34495e; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
                Request Information
            </h3>
            
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; font-weight: bold; width: 150px;">Request Type:</td>
                    <td style="padding: 8px 0;">{{request_type}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Requester Name:</td>
                    <td style="padding: 8px 0;">{{requester_name}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Current Status:</td>
                    <td style="padding: 8px 0; color: #27ae60; font-weight: bold;">{{status}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-weight: bold;">Review Date:</td>
                    <td style="padding: 8px 0;">{{review_date}}</td>
                </tr>
            </table>
            
            <div style="margin-top: 20px;">
                <h4 style="color: #34495e; margin-bottom: 10px;">Admin Notes:</h4>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #e74c3c;">
                    {{admin_notes}}
                </div>
            </div>
        </div>
        
        <div style="background-color: #e8f4fd; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; color: #2980b9; font-size: 14px;">
                <strong>Next Steps:</strong> Please log into the AREC GIS system to view the complete details of your request.
            </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; color: #7f8c8d; font-size: 12px;">
            <p>This is an automated notification from the AREC GIS System.</p>
            <p>Please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
```

## Environment Variables Setup

Create a `.env` file in your frontend directory:

```env
REACT_APP_EMAILJS_SERVICE_ID=your_service_id_here
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id_here
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key_here
```

## EmailJS Account Setup Steps

1. **Sign up** at [EmailJS.com](https://www.emailjs.com/)
2. **Create a new Email Service** (Gmail, Outlook, etc.)
3. **Create Email Templates** using the HTML above
4. **Get your credentials**:
   - Service ID
   - Template ID  
   - Public Key
5. **Update your .env file** with the real credentials
6. **Test the integration** by submitting a request

## Template Variables

### New Request Template Variables:
- `{{to_email}}` - AREC email address
- `{{request_type}}` - Type of request (Transfer, Bulk Transfer, Account Deletion)
- `{{requester_name}}` - Name of the person making the request
- `{{requester_username}}` - Username of the requester
- `{{reason}}` - Reason provided for the request
- `{{inventory_details}}` - Details about inventories being transferred
- `{{request_date}}` - Date and time of the request
- `{{status}}` - Current status (Pending Review)

### Status Update Template Variables:
- `{{to_email}}` - Requester's email address
- `{{request_type}}` - Type of request
- `{{requester_name}}` - Name of the requester
- `{{status}}` - New status (Approved, Rejected)
- `{{admin_notes}}` - Notes from the admin
- `{{review_date}}` - Date of review
