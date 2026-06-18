# Close CRM - Subscribe a Contact to a Sequence

**Endpoint:** POST https://api.close.com/api/v1/sequence_subscription/

**Auth:** Basic (API key as username, empty password) or Bearer token

**Request Body:**
```json
{
  "contact_id": "cont_MEe4I2YKyJBXuTqbttZBbcofXr3uydwKE",
  "sequence_id": "seq_1BTIjGuCooX0nbFoP1hl07",
  "sender_account_id": "emailacct_0oCdHYnxt15sV9j32wrJI",
  "sender_email": "john@salesteam.com",
  "sender_name": "John Doe",
  "contact_email": "contact@example.org",
  "calls_assigned_to": ["user_N6KhMpzHRCYQHdn4gRNIFNN5JExnsrprKA6ekxM63XA"]
}
```

**Required fields:**
- sequence_id: The ID of the sequence to subscribe to
- contact_id: The contact to subscribe
- sender_account_id: The email account to send from
- sender_email: The sender email address
- sender_name: The sender name

**Response:** 201 Created with subscription details

**Workflow:**
1. First need to create a sequence in Close (or use existing one)
2. Then subscribe contacts to it via this API
3. Need: sequence_id, sender_account_id from the Close account
