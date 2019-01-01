import React from 'react';
import { shallow } from 'enzyme';
import axiosConnect from '..';
import { axiosMock } from './axiosMock';

const FakeComponent = () => <div>test</div>;

const onMountRequestConfig = {
    url: '/some/url',
    method: 'put'
};

const responseData = { some: 'json 123' };

axiosMock.onPut(onMountRequestConfig.url).reply(201, responseData);

it('should track onMountRequestConfig option', (done) => {
    const ConnectedComponent = axiosConnect({ onMountRequestConfig })(FakeComponent);
    const wrapper = shallow(<ConnectedComponent />);
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
