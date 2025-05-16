<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #4f46e5;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      padding: 20px;
      border: 1px solid #e5e7eb;
      border-top: none;
      border-radius: 0 0 8px 8px;
    }
    .field {
      margin-bottom: 15px;
    }
    .field-title {
      font-weight: bold;
      color: #4f46e5;
      margin-bottom: 5px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h2>New Service Booking Request</h2>
  </div>
  
  <div class="content">
    <div class="field">
      <div class="field-title">You got a new booking from:</div>
      {{firstName}} {{lastName}}
    </div>
    
    <div class="field">
      <div class="field-title">Email:</div>
      {{email}}
    </div>
    
    <div class="field">
      <div class="field-title">Phone:</div>
      {{phone}}
    </div>
    
    <div class="field">
      <div class="field-title">Service Category:</div>
      {{serviceType}}
    </div>
    
    <div class="field">
      <div class="field-title">Specific Service:</div>
      {{specificService}}
    </div>
    
    <div class="field">
      <div class="field-title">Preferred Date:</div>
      {{date}}
    </div>
    
    <div class="field">
      <div class="field-title">Preferred Time:</div>
      {{time}}
    </div>
    
    <div class="field">
      <div class="field-title">Address:</div>
      {{address}}<br>
      {{city}}, {{state}} {{zip}}
    </div>
    
    <div class="field">
      <div class="field-title">Special Instructions:</div>
      {{notes}}
    </div>
  </div>
  
  <div class="footer">
    <p>This message was sent from your website's booking form.</p>
    <p>© {% raw %}{{year}}{% endraw %} Your Company Name. All rights reserved.</p>
  </div>
</body>
</html>