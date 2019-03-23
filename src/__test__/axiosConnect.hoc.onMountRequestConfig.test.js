import React from 'react';
import { shallow } from 'enzyme';
import axiosConnect from '..';
import { axiosMock } from './axiosMock';

const FakeComponent = () => <div>test</div>;

const url = '/some/url';
const method = 'put';

const onMountRequestConfig = {
    url, method
};

const responseData = { some: 'json 123' };

axiosMock.onPut(onMountRequestConfig.url).reply(201, responseData);

it('should track onMountRequestConfig object', (done) => {
    const ConnectedComponent = axiosConnect({ onMountRequestConfig })(FakeComponent);
    const wrapper = shallow(<ConnectedComponent />);
    setTimeout(() => {
        expect(wrapper.prop('response').data).toEqual(responseData);
        done();
    }, 0);
});

it('should track onMountRequestConfig function', (done) => {
    const onMountRequestConfigFn = props => props;
    const ConnectedComponent = axiosConnect({ onMountRequestConfig: onMountRequestConfigFn })(FakeComponent);
    const wrapper = shallow(<ConnectedComponent url={url} method={method} />);
    setTimeout(() => {
        expect(wrapper.prop('response').data).toEqual(responseData);
        done();
    }, 0);
});

it('should track onMountRequestConfig prop', (done) => {
    const ConnectedComponent = axiosConnect()(FakeComponent);
    const wrapper = shallow(<ConnectedComponent onMountRequestConfig={onMountRequestConfig} />);

    expect(wrapper.prop('isLoading')).toBeTruthy();
    setTimeout(() => {
        expect(wrapper.prop('response').data).toEqual(responseData);
        done();
    }, 0);
});


it('should not call makeRequest if no onMountRequestConfig passed', (done) => {
    const ConnectedComponent = axiosConnect()(FakeComponent);
    const wrapper = shallow(<ConnectedComponent />);

    expect(wrapper.prop('isLoading')).toBeFalsy();
    setTimeout(() => {
        expect(wrapper.prop('response').data).toBeNull();
        done();
    }, 0);
});
