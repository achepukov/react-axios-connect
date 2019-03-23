import React from 'react';
import axios from 'axios';

export const axiosConnect = (options = {}) => (Component) => class extends React.PureComponent {
    componentDidMount () {
        const onMountRequestConfig = this.props.onMountRequestConfig || options.onMountRequestConfig;
        if (typeof onMountRequestConfig === "object") {
            this.makeRequest(onMountRequestConfig);
        }
        if (typeof onMountRequestConfig === "function") {
            this.makeRequest(onMountRequestConfig(this.props));
        }
    }

  state = {
      error: null,
      response: { data: options.initialData || null },
      isLoading: false
  };

  axiosInstance = options.axios || axios;

  requestDoneHandler = (response, error = null) => {
      this.setState({ isLoading: false, response, error });
  }

  /***
   * doRequest('/some-api') // get request
   * doRequest('/some-api', 'get')
   * doRequest('/some-api', 'post', {foo: 'bar'})
   * doRequest('/some-api', 'post', {foo: 'bar'}, {headers: {'custom': 'header'}})
   */
  makeRequest = (urlOrRequestParams, method = 'get', data = {}, config = {}) => {
      this.setState({ isLoading: true });
      const promise = typeof urlOrRequestParams === 'object' ?
          this.axiosInstance.request(urlOrRequestParams) :
          this.axiosInstance[method](urlOrRequestParams, data, config);

      promise.then(this.requestDoneHandler);
      promise.catch(error => this.requestDoneHandler(error.response, error));

      return promise;
  }

  get computedProps () {
      const { response, ...restState } = this.state;
      const props = {
          makeRequest: this.makeRequest
      };
      return options.spreadResponse ? { ...props, ...restState, ...response } : { ...props, ...this.state };
  }

  get mappedProps () {
      const { computedProps } = this;
      const { mapping } = options;
      return mapping ? mapping(computedProps) : computedProps;
  }

  render () {
      return <Component {...this.mappedProps} {...this.props} />;
  }
};
