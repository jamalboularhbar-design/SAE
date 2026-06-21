# Create a new lead | Close | Developer API Documentation

**URL:** https://developer.close.com/api/resources/leads/create

---

For AI agents: a documentation index is available at the root level at /llms.txt and /llms-full.txt. Append /llms.txt to any URL for a page-level index, or .md for the markdown version of any page.
Search
/
Homepage
Product Help
Log in
Try for Free
Developers Home
API Reference
MCP
Getting Started
Introduction
Authentication with API Keys
Authentication with OAuth
API Clients
Pagination
Specifying Fields
Filter Parameters
HTTP Response Codes
Rate Limits
Timezone Offsets
Rich Text Fields
Changelog
CRM Core
Leads
GET
List Leads
POST
Create a new lead
POST
Merge two leads
GET
Get a single Lead
PUT
Update an existing lead
DEL
Delete a lead
Contacts
Opportunities
Tasks
Files
Custom Objects
Comments
Activities
Activities
Notes
Calls
Emails
Email Threads
SMS
WhatsApp Messages
Meetings
Custom Activities
Creations
Form Submissions
Lead Status Changes
Opportunity Status Changes
Lead Merges
Task Completions
Events & Webhooks
Webhooks
Events
Search & Reporting
Advanced Filtering
Smart Views
Reporting
Automation & Bulk Actions
Sequences (Workflows)
Bulk Actions
Exports
AI Field Enrichment
CRM Configuration
Custom Fields
Custom Activity Types
Custom Object Types
Pipelines
Opportunity Statuses
Lead Statuses
Integration Links
Forms
Communication Configuration
Email Templates
SMS Templates
Outcomes
Playbooks
Scheduling Links Guide
Scheduling Links
Connected Accounts
Send As
Unsubscribed Emails
Phone Numbers
Blocked Phone Numbers
Dialers
Users & Organizations
Users
Organizations
Memberships
Roles
Groups
CRM Core
Leads
Create a new lead
Copy page
|
View as Markdown
|
Open in Claude
|
More actions
POST
https://api.close.com/api/v1/lead/
POST
/api/v1/lead/
cURL
$	curl -X POST https://api.close.com/api/v1/lead/ \
>	     -H "Content-Type: application/json" \
>	     -u "<CLOSE_API_KEY>:" \
>	     -d '{
>	  "addresses": [
>	    {
>	      "address_1": "747 Howard St",
>	      "address_2": "Room 3",
>	      "city": "San Francisco",
>	      "country": "US",
>	      "label": "business",
>	      "state": "CA",
>	      "zipcode": "94103"
>	    }
>	  ],
>	  "contacts": [
>	    {
>	      "emails": [
>	        {
>	          "email": "gob@example.com",
>	          "type": "office"
>	        }
>	      ],
>	      "name": "Gob",
>	      "phones": [
>	        {
>	          "phone": "8004445555",
>	          "type": "office"
>	        }
>	      ],
>	      "title": "Sr. Vice President"
>	    }
>	  ],
>	  "custom.cf_FSYEbxYJFsnY9tN1OTAPIF33j7Sw5Lb7Eawll7JzoNh": "Segway",
>	  "custom.cf_ORxgoOQ5YH1p7lDQzFJ88b4z0j7PLLTRaG66m8bmcKv": "Website contact form",
>	  "custom.cf_bA7SU4vqaefQLuK5UjZMVpbfHK4SVujTJ9unKCIlTvI": "Real Estate",
>	  "custom.cf_nenE344jkwrjyRRezwsf8b4V1MCoXWIDHIStmFavZks": [
>	    "Choice 1",
>	    "Choice 2"
>	  ],
>	  "description": "Best. Show. Ever.",
>	  "name": "Bluth Company",
>	  "status_id": "stat_1ZdiZqcSIkoGVnNOyxiEY58eTGQmFNG3LPlEVQ4V7Nk",
>	  "url": "http://thebluthcompany.tumblr.com/"
>	}'
200
Successful
1	{
2	  "contact_ids": [
3	    "cont_qpjDKxbN3WWsuhaJjg2Qr9pkqHqe1yviZ5BS0dEyz05"
4	  ],
5	  "created_by": "user_N6KhMpzHRCYQHdn4gRNIFNN5JExnsrprKA6ekxM63XA",
6	  "date_created": "2013-02-20T05:30:24.854000+00:00",
7	  "date_updated": "2013-02-20T05:30:24.854000+00:00",
8	  "description": "Best. Show. Ever.",
9	  "html_url": "https://app.close.com/lead/lead_70jZ5hiVt5X31MZ3vJ0R0GJMqJEihkoF7TtSVFbN2ty/",
10	  "id": "lead_70jZ5hiVt5X31MZ3vJ0R0GJMqJEihkoF7TtSVFbN2ty",
11	  "name": "Bluth Company",
12	  "organization_id": "orga_RbREgmiiwcr1w2b4cOnCMQaQPSIFxMqAD2Dh243uxcH",
13	  "status_id": "stat_1ZdiZqcSIkoGVnNOyxiEY58eTGQmFNG3LPlEVQ4V7Nk",
14	  "updated_by": "user_N6KhMpzHRCYQHdn4gRNIFNN5JExnsrprKA6ekxM63XA",
15	  "url": "http://thebluthcompany.tumblr.com/",
16	  "addresses": [
17	    {
18	      "address_1": "747 Howard St",
19	      "address_2": "Room 3",
20	      "city": "San Francisco",
21	      "country": "US",
22	      "label": "business",
23	      "state": "CA",
24	      "zipcode": "94103"
25	    }
26	  ],
27	  "display_name": "Bluth Company",
28	  "status_label": "Potential",
29	  "tasks": [],
30	  "contacts": [
31	    {
32	      "created_by": "user_N6KhMpzHRCYQHdn4gRNIFNN5JExnsrprKA6ekxM63XA",
33	      "date_created": "2013-02-20T05:30:24.844000+00:00",
34	      "date_updated": "2013-02-20T05:30:24.844000+00:00",
35	      "display_name": "Gob",
36	      "id": "cont_qpjDKxbN3WWsuhaJjg2Qr9pkqHqe1yviZ5BS0dEyz05",
37	      "name": "Gob",
38	      "organization_id": "orga_RbREgmiiwcr1w2b4cOnCMQaQPSIFxMqAD2Dh243uxcH",
39	      "title": "sr. vice president",
40	      "updated_by": "user_N6KhMpzHRCYQHdn4gRNIFNN5JExnsrprKA6ekxM63XA",
41	      "emails": [
42	        {
43	          "email": "gob@example.com",
44	          "is_unsubscribed": false,
45	          "type": "office"
46	        }
47	      ],
48	      "phones": [
49	        {
50	          "phone": "+18004445555",
51	          "type": "office",
52	          "phone_formatted": "+1 800-444-5555"
53	        }
54	      ]
55	    }
56	  ],
57	  "opportunities": [],
58	  "custom.cf_FSYEbxYJFsnY9tN1OTAPIF33j7Sw5Lb7Eawll7JzoNh": "Segway",
59	  "custom.cf_ORxgoOQ5YH1p7lDQzFJ88b4z0j7PLLTRaG66m8bmcKv": "Website contact form",
60	  "custom.cf_bA7SU4vqaefQLuK5UjZMVpbfHK4SVujTJ9unKCIlTvI": "Real Estate",
61	  "custom.cf_nenE344jkwrjyRRezwsf8b4V1MCoXWIDHIStmFavZks": [
62	    "Choice 1",
63	    "Choice 2"
64	  ]
65	}

Contacts, addresses, and custom fields can all be nested in the lead. Activities, tasks, and opportunities must be posted separately.

status / status_id (optional): Post either status or status_id (but not both). If neither is provided, the organization’s default (first) status will be used. Using status_id is recommended so that users can rename statuses in the UI without breaking your implementation.

custom.FIELD_ID (optional): Set custom fields by setting custom.FIELD_ID to the field value, where FIELD_ID is the ID of the custom field, e.g.:

1	{ "custom.cf_v6S011I6MqcbVvB2FA5Nk8dr5MkL8sWuCiG8cUleO9c": "value", "custom.cf_8wtBWsdRU2Fur7GDnEeXQ7ra2Vu7R4hG1SNYdiEhh0F": "other value" }

If a custom field has accepts_multiple_values: true, the entire value will be replaced. For example, given a Lead has a Custom Choice Field with value ["A", "B"], adding choice "C" would mean setting the value to ["A", "B", "C"].

Note that using the custom field dict or the custom.FIELD_NAME syntax (instead of custom field IDs) is deprecated and will be removed from the API. See Custom Fields for more details.

Authentication
Authorization
Basic
Use your API key as the username and leave the password empty.
OR
Authorization
Bearer

Bearer authentication of the form Bearer <token>, where token is your auth token.

Request
This endpoint expects any.
Response
Successful response
contact_ids
list of strings
created_by
string or null
date_created
datetime
date_updated
datetime
description
string or null
html_url
string
id
string
name
string or null
organization_id
string
status_id
string
updated_by
string or null
url
string or null
addresses
list of objects
Show 8 properties
contacts_summary
string
created_by_name
string or null
display_name
string
integration_links
list of objects
Show 2 properties
localtime
datetime or null
primary_address_summary
string or null
primary_email
object or null
Show 3 properties
primary_phone
object or null
Show 6 properties
recent_calls
list of maps from strings to any
source
string or null
status_label
string
summaries
list of maps from strings to any
tasks
list of maps from strings to any
updated_by_name
string or null
contacts
list of objects
Deprecated
Show 19 properties
opportunities
list of objects
Deprecated
Show 39 properties
Errors
400
Bad Request Error
401
Unauthorized Error
404
Not Found Error
Was this page helpful?
Yes
No
Previous
List Leads
Next
Merge two leads
Built with
Product
Overview
Communication
Automation
Integrations
Reporting
SMS
Calling
Security
Forms
Pricing & Use Cases
Pricing
Close vs Other CRMs
Customer Stories
Resources
Sales Blog
Sales Resources
Sales Guides
Webinars
On-Demand Demo
Sales Tools
Company
About
Careers
Partner with Close
Brand Guidelines
Terms
Privacy
GDPR
CCPA
Get Help
+1-833-GO-CLOSE
Help Center
Download the Close App
Product Updates
System Status