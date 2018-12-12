# Axios Connect - HOC for react component to use axios

Simple [HOC](https://reactjs.org/docs/higher-order-components.html) which provides nice axios features as props.

## Install

`yarn add react-axios-connect`

`npm i react-axios-connect`

## How to use

This hoc pass `makeRequest()`, `isLoading`, `response` and `error` props to the wrapped component:

```
{
  makeRequest: (urlOrRequestParams, method = 'get', data = {}, config = {}) => Promise,
  isLoading: boolean,  // whether request is in progress
  response: Object,    // Axios response object, see https://github.com/axios/axios#response-schema
  error: null | Error, // Axios error if any
}
```
You can also [spread the response](#-`spreadResponse`-key) or [specify you own mapping](#-`mapping`-key) for the props

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
    initialData: any,        // null by default
    spreadResponse: boolean, // false by default, spread the response into data, status, headers e.t.c. props
    mapping: object,         // map hoc props to other props
}
```
#### `axios` key

Usable for passing custom axios instance

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
