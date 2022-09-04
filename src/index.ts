import axios from 'axios';
import * as core from '@actions/core';
import * as utils from './utils';

async function main(): Promise<void> {
  // get inputs
  console.debug('collecting inputs');
  const deployHook = core.getInput('deploy-hook', { required: true });
  const apiKey = core.getInput('api-key', { required: true });
  const serviceId = utils.getServiceId(deployHook);

  // setup axios client
  const renderApi = axios.create({
    baseURL: 'https://api.render.com/v1',
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

    // track progress
    core.info('deployment in progress');
    let deployInProgress = true;
    while (deployInProgress) {
      const status: string = await utils.getDeployStatus(serviceId, deployId, renderApi);

      switch (status) {
        case 'build_in_progress':
          core.debug('build in progress');
          break;
        case 'created':
          core.debug('deployment created');
          break;
        case 'canceled':
          deployInProgress = false;
          core.info('deployment canceled');
          break;
        case 'build_failed':
          deployInProgress = false;
          core.error('build failed');
          break;
        case 'live':
          core.debug('service is live!');
          deployInProgress = false;
          core.info('deployment compleete');
          break;
        default:
          core.info(status);
          deployInProgress = status.includes('fail') ? false : true;
          break;
      }
    }
  } else {
    core.error('service id not found in deploy webhook');
  }
}

main();
