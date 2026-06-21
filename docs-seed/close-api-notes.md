# Close CRM API - Create Lead

Endpoint: POST https://api.close.com/api/v1/lead/
Auth: Basic auth with API key as username, empty password

Request body:
```json
{
  "name": "Company Name",
  "description": "Notes about the lead",
  "contacts": [
    {
      "name": "Contact Name",
      "title": "Job Title",
      "emails": [
        { "email": "email@example.com", "type": "office" }
      ]
    }
  ]
}
```

Response: Returns lead object with id, contact_ids, etc.

Auth header: `Authorization: Basic base64(apikey:)`
