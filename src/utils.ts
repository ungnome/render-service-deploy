import url from 'url';
import axios, { AxiosError, AxiosInstance } from 'axios';
import * as core from '@actions/core';

export { getRef, getServiceId, triggerDeploy, getDeployStatus, sleep };

function getRef(deployHook: string): string | undefined {
  const parsed = url.parse(deployHook);
  const queryArr = parsed.query?.split('&');

  const ref = queryArr
    ?.find((el) => {
      return el.startsWith('ref=');
    })
    ?.split('=')[1];

  return ref;
}

function getServiceId(deployHook: string) {
  const parsed = url.parse(deployHook);
  const pathArr = parsed.pathname?.split('/');
  const serviceId = pathArr?.find((el) => {
    return el.startsWith('srv-');
  });

  return serviceId;
}

async function triggerDeploy(deployHook: string, apiClient: AxiosInstance) {
  try {
    const res = await apiClient.get(deployHook, {});

    return res.data.deploy.id;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      handleAxiosError(err, "Couldn't trigger deployment");
    } else {
      // handle other errors
      core.error(`Couldn't trigger deployment: ${err}`);
    }
  }
}

async function getDeployStatus(
  serviceId: string,
  deployId: string,
  apiClient: AxiosInstance
) {
  try {
    const res = await apiClient.get(`/services/${serviceId}/deploys/${deployId}`);

    return res.data.status;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      handleAxiosError(err, "Couldn't get deployment status");
    } else {
      // handle other error
      core.error(`Couldn't get deployment status: ${err}`);
    }
  }
}

function sleep() {
  // must wait for 5 seconds to avoid rate limiting
  core.debug('sleeping for 5s');
  return new Promise((resolve) => setTimeout(resolve, 5000));
}

function handleAxiosError(err: AxiosError, messagePrefix: string) {
  if (err.response) {
    // handle response error
    core.error(`${messagePrefix}: Response Error: ${err.code} - ${err.message}`);
  } else if (err.request) {
    // handle request error
    core.error(`${messagePrefix}: Request Error: ${err.code} - ${err.message}`);
  } else {
    // handle other errors
    core.error(`${messagePrefix}: ${err.message}`);
  }
}
