// @flow
/* eslint-disable flowtype/no-weak-types */
type Result = Promise<{
  text: () => Promise<string>,
  json: () => Promise<Object>
}>;

export default function fetch(
  uri: string,
  options: { method?: 'GET' | 'POST', body?: string } = {}
): Result {
  const method = options.method || 'GET';
  const xhr = createXHR();

  const promise =
    xhr instanceof XMLHttpRequest
      ? new Promise(xhrRequest(xhr))
      : new Promise(xdrRequest(xhr));

  xhr.open(method, uri);
  xhr.send(options.body);

  return promise;
}

function createXHR() {
  if (global.XDomainRequest) {
    return new XDomainRequest();
  }
  return new XMLHttpRequest();
}

function xdrRequest(xdr: XDomainRequest) {
  return (resolve, reject) => {
    xdr.onerror = reject;
    xdr.ontimeout = reject;

    xdr.onload = () => {
      resolve({
        text: () => Promise.resolve(xdr.responseText),
        json: () => Promise.resolve(JSON.parse(xdr.responseText))
      });
    };
  };
}

function xhrRequest(xhr: XMLHttpRequest) {
  return (resolve, reject) => {
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return;
      }
      if (xhr.status < 400) {
        resolve({
          text: () => Promise.resolve(xhr.responseText),
          json: () => Promise.resolve(JSON.parse(xhr.responseText))
        });
        return;
      }
      try {
        reject(JSON.parse(xhr.responseText));
      } catch (ex) {
        reject(xhr.responseText);
      }
    };
    xhr.ontimeout = reject;
  };
}
