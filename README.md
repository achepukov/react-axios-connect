[![Build Status](https://travis-ci.com/achepukov/react-axios-connect.svg?branch=master)](https://travis-ci.com/achepukov/react-axios-connect)
[![Coverage Status](https://coveralls.io/repos/github/achepukov/react-axios-connect/badge.svg?branch=master)](https://coveralls.io/github/achepukov/react-axios-connect?branch=master)

# HOC for react component to use axios

Simple [HOC](https://reactjs.org/docs/higher-order-components.html) which provides nice axios features as props.

## Install

`yarn add axios react-axios-connect`

`npm i axios react-axios-connect --save`

## How to use

This hoc pass `makeRequest()`, `isLoading`, `response` and `error` props to the wrapped component:

```
{
  error: null | Error, // Axios error if any
  isLoading: boolean,  // whether request is in progress
  makeRequest: (urlOrRequestParams, method = 'get', data = {}, config = {}) => Promise,
  response: Object,    // Axios response object, see https://github.com/axios/axios#response-schema
}
```
You can also [spread the response](#spreadresponse-key) or [specify you own mapping](#mapping-key) for the props

### Very Basic exapmple

```
  import axiosConnect from 'react-axios-connect';

  class SomeComponent extends React.PureComponent {

    componentDidMount() {
      this.props.makeRequest('/some-api')
    }
    render() {
       const { response: { data }, isLoading, error } = this.props;
       if (isLoading) {
         return '...loading';
       }
       if (error) {
         return 'An error occurred: ' + error;
       }
       return 'Got this data: ' + JSON.stringify(data);
    }
  }

  export default axiosConnect()(SomeComponent);
``` 
### Availabe params for `makeRequest(url, method, data, config)`

`POST` example: 
```
this.props.makeRequest(
  '/some-url',
  'post',
  {data: 'payload', 'for': 'post'}
)
```
`PUT` example with additional headers:
```
const headers = {
  Authorization: 'Bearer some-token'
}

this.props.makeRequest(
  '/some-url',
  'put',
  {data: 'payload', 'for': 'post'},
  { headers }
)
```

last param `config` is [request config](https://github.com/axios/axios#request-config)

You can also specify [full request config](https://github.com/axios/axios#request-config) as the only param of `makeRequest`: 

```
  const requestObj = {
    url: '/some/url',
    method: 'put',
    headers: {
    'Accept': 'json',
    'Authorization': 'Bearer some-oauth2-key'
    }
  }
  this.props.makeRequest(requestObj)
```

## HOC basic options

axiosConnect accepts the list of options to configure component behavior: `axiosConnect(options)(SomeComponent);`

`options` is an object which tracks the next keys:

```
{
    axios: CustomAxiosInstance,
    onMountRequestConfig: RequestConfig, // request config to be used in makeRequest on mount
    initialData: any,        // null by default
    mapping: Function,       // map hoc props to other props `(hocProps: Object): Object => mappedProps`
    spreadResponse: boolean, // false by default, spread the response into data, status, headers e.t.c. props
}
```
#### `axios` key

Pass custom axios instance

#### `onMountRequestConfig` key
[Request config](https://github.com/axios/axios#request-config) to be used in call on component mount. This key also can be passed as a prop. If passed both - hoc option & prop, then prop win.

Example: 

```
const onMountRequestConfig = {
  url: '/some-url',
  method: 'post',
  data: { some: 'data' }
}

axiosConnect({ onMountRequestConfig })(Component);

// or

const ConnectedComponent = axiosConnect()(Component);
<ConnectedComponent onMountRequestConfig={ onMountRequestConfig } />
```

You also can pass a function, it accepts own component props as argument:

```
const ConnectedComponent = axiosConnect({ onMountRequestConfig: props => {url: props.theUrl })(Component);
<ConnectedComponent theUrl="/some-url" />
```
In the example above component will load data from `/some-url`
#### `initialData` key

The initial `response.data` value. At very first load your component won't have any data loaded, so this is useful to not do additional check in your component, i.e. without `initialData` you'll need to write something like:

```
  class SomeComponent extends React.PureComponent {
    render() {
      const { response } = this.props;
      if (response.data && response.data.length) {
        // omg we finally got the data, let's render it
        ...
      } else {
        // either, the very first mount or loading
        ...
      }
    }
  }
```

If you define initial data, then it'll be something like this:

```
  class SomeComponent extends React.PureComponent {
    render() {
      const { response } = this.props;
      // response.data is always array, as either initialData is an array, or server returns the array
      return response.data.map( .../* render into particualr elements */ );
    }
  }

  axiosConnect({ initialData: [] })(SomeComponent)
```

#### `spreadResponse` key

If `true` your component will accept [reponse props](https://github.com/axios/axios#response-schema) instead of one prop `response`:
`data`, `status`, `headers`, `config` & `request`.  I.e.:

```
class SomeComponent extends React.PureComponent {
    render() {
      // no response prop here anymore
      const { data, status } = this.props;
      if (status === 200)
      return <div>{JSON.stringify(data)</div>;
    }
  }

  axiosConnect({ spreadResponse: true })(SomeComponent)
```

#### `mapping` key

You can provide your own mapping hoc props:

```
  class SomeComponent extends React.PureComponent {
    render() {
      // no 'response' prop here anymore
      const { requestInProgress, serverResponse, requestError } = this.props;
      if (requestInProgress)
        return <div>...loading</div>;
      ...
    }
  }
  const mapping = props => ({
    serverResponse: props.response,
    requestInProgress: props.isLoading,
    requestError: props.error,
    doRequest: props.makeRequest,
  })

  axiosConnect({ mapping })(SomeComponent)
```

# Report an issue / improvement

Feel free to [report issue on github](https://github.com/achepukov/react-axios-connect/issues).
