import axios from 'axios';
import * as core from '@actions/core';
import * as utils from './utils';

async function main(): Promise<void> {
  // get inputs
  console.debug('collecting inputs');
  const deployHook = core.getInput('deploy-hook', { required: true });
  const apiKey = core.getInput('api-key', { required: true });
  const serviceId = utils.getServiceId(deployHook);

  // render rest api base
  const renderApiBaseUrl = 'https://api.render.com/v1';

  // setup axios client
  const renderApi = axios.create({
    baseURL: renderApiBaseUrl,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${apiKey}`
    }
  });

  // check for serviceId before triggering deployment
  if (serviceId) {
    // trigger deployment
    console.debug('triggering service deployment');
    const deployId = await utils.triggerDeploy(deployHook, renderApi);

    // output deploy status url
    const deployStatusUrl = `${renderApiBaseUrl}/services/${serviceId}/deploys/${deployId}`;
    core.setOutput('deploy-status-url', deployStatusUrl);
  } else {
    core.error('service id not found in deploy webhook');
  }
}

main();
