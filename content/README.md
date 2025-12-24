# Biscayne Point HOA – Content Editing Guide

This folder contains the content for the Biscayne Point HOA website.
You do NOT need to know programming to update most of the site.

If you can edit a text file and save it, you can update the website.

---

IMPORTANT RULES (PLEASE READ)

1. Do NOT rename folders inside the content/ directory
2. Do NOT edit files outside the content/ directory
3. File names matter — use the same format as existing files
4. After changes are saved and committed, the website updates automatically

If you are unsure, ask before deleting anything.

---

ADDING A NEWS POST (MOST COMMON TASK)

News posts appear on:

- the Home page
- the News page
- individual shareable links

WHERE
content/news/

HOW

1. Copy an existing .md file
2. Rename it using this format:

YYYY-MM-DD-short-title.md

Example:
2026-01-15-annual-meeting.md

FILE FORMAT (DO NOT CHANGE THE STRUCTURE)

---

title: "Annual Meeting Scheduled"
date: "2026-01-15"
category: "Governance"
summary: "Join us for the annual meeting and board elections."

---

Write the full article text here.

You can use:

- paragraphs
- bullet points
- **bold text**

TIPS

- The summary appears on the Home and News list pages
- The text below the --- lines is the article body
- Dates must be in YYYY-MM-DD format

---

UPDATING EVENTS

Events appear on the Events page.

WHERE
content/events.json

HOW
Each event looks like this:

{
"title": "Board Meeting",
"start": "2026-02-12T19:00:00-05:00",
"location": "Community Center",
"description": "Monthly board meeting."
}

RULES

- Do NOT remove commas
- Keep the quotation marks
- Dates must follow the existing format
- New events go at the top of the list

---

MEETING MINUTES AND DOCUMENTS

Meeting minutes and official documents are linked from the website.

RECOMMENDED APPROACH

- Upload PDFs to Google Drive
- Use clear filenames such as:

Minutes_2026-01-12.pdf
Budget_2026.pdf

If documents later move into this site directly, instructions will be updated.

---

PHOTOS AND GALLERY (FUTURE)

Photos are not yet edited here.
When photo uploads are enabled, instructions will be added.

---

HOW TO CHECK YOUR WORK

Before asking for help:

1. Make sure the file saves without errors
2. Compare your file to an existing example
3. Confirm the website updated after publishing

---

NEED HELP?

If something does not look right:

- Do not panic
- Do not delete files
- Ask the site administrator for help

Thank you for helping keep the Biscayne Point community informed.
