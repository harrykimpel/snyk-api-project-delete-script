# Snyk API project delete script

This script allows you to delete Snyk projects from your org based on branch name that should be kept (typically master branch) and last tested date. The use case is for example that you do not keep PR builds for longer than x days and would like to reduce the clutter.

The script can be configured using the below environment variables:
- SNYK_ORG_ID: the Snyk organization ID
- SNYK_API_TOKEN: the Snyk API token or service account token
- SNYK_KEEP_PROJECT_BRANCH_NAME: the branch name within your repos you want to keep (!)
- SNYK_KEEP_PROJECT_LAST_TESTED_WITHIN_DAYS: the number of days you want to define as a threshold for the last tested date by Snyk