## render-service-deploy

Trigger and track progress of a Render service deployment.

## Usage

### Inputs

| Name        | Type     | Required | Description                | Example                                               |
| ----------- | -------- | -------- | -------------------------- | ----------------------------------------------------- |
| deploy-hook | `string` | `true`   | Render Service Deploy hook | `https://api.render.com/deploy/srv-XXYYZZ?key=AABBCC` |
| api-key     | `string` | `true`   | Render Service API Key     | `rnd_abcdefghijklmnopqrstuvwxyz123`                   |

### deploy-hook

This is the Deploy Hook that is automatically generated for your Render service.

[About Render Deploy Hooks](https://render.com/docs/deploy-hooks)

[Deploy specific commit via Deploy Hook](https://render.com/docs/deploy-a-commit)

### api-key

[Generate Render API Key](https://render.com/docs/api#creating-an-api-key)

### Outputs

| Name              | Type     | Description                        | Example                                                             |
| ----------------- | -------- | ---------------------------------- | ------------------------------------------------------------------- |
| deploy-status-url | `string` | URL for checking deployment status | `https://api.render.com/v1/services/{serviceId}/deploys/{deployId}` |
