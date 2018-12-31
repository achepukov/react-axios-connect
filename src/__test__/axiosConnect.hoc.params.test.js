import React from 'react';
import { shallow } from 'enzyme';
import axiosConnect from '..';
import { axiosMock } from './axiosMock';

const FakeComponent = () => <div>test</div>;
const ConnectedComponent = axiosConnect()(FakeComponent);
const wrapper = shallow(<ConnectedComponent />);


it('should have props: makeRequest, error, response, isLoading', () => {
    expect(wrapper.prop('makeRequest')).toBeDefined();
    expect(wrapper.prop('error')).toBeNull();
    expect(wrapper.prop('response')).toBeDefined();
    expect(wrapper.prop('isLoading')).toBeFalsy();
});

it('should not spread response by default', () => {
    expect(wrapper.prop('data')).toBeUndefined();
});

it('should use custom axios instance if provided', () => {
    const passedAxiosMock = {
        get: jest.fn(() => Promise.resolve('test'))
    };

    const Connected = axiosConnect({ axios: passedAxiosMock })(FakeComponent);
    const wrapper = shallow(<Connected />);
    wrapper.prop('makeRequest')('/some-url');
    expect(passedAxiosMock.get).toHaveBeenCalledWith('/some-url', {}, {});
});

it('should use initial data if provided', () => {
    const initialData = [1, 2, 3];
    const Connected = axiosConnect({ initialData })(FakeComponent);
    const wrapper = shallow(<Connected />);
    expect(wrapper.prop('response').data).toEqual(initialData);
});

it('should spread response if requested', (done) => {
    const Connected = axiosConnect({ spreadResponse: true })(FakeComponent);
    const wrapper = shallow(<Connected />);

    const responseOnGet = { some: 'json' };
    axiosMock.onGet('/').replyOnce(200, responseOnGet);
    wrapper.prop('makeRequest')('/').then(() => {
        expect(wrapper.prop('data')).toEqual(responseOnGet);
        expect(wrapper.prop('status')).toEqual(200);
        done();
    });
});

it('should use mapping if provided', (done) => {
    const mapping = (props) => ({
        requestInProgress: props.isLoading,
        responseData: props.data,
        doRequest: props.makeRequest
    });
    const Connected = axiosConnect({ mapping, spreadResponse: true })(FakeComponent);
    const wrapper = shallow(<Connected />);

    expect(wrapper.prop('isLoading')).toBeUndefined();
    expect(wrapper.prop('requestInProgress')).toBeFalsy();
    expect(wrapper.prop('data')).toBeUndefined();

    const responseOnGet = { some: 'json' };
    axiosMock.onGet('/').replyOnce(200, responseOnGet);
    const promise = wrapper.prop('doRequest')('/');
    expect(wrapper.prop('requestInProgress')).toBeTruthy();
    expect(wrapper.prop('data')).toBeUndefined();
    expect(wrapper.prop('responseData')).toBeDefined();
    promise.then(() => {
        expect(wrapper.prop('isLoading')).toBeUndefined();
        expect(wrapper.prop('responseData')).toEqual(responseOnGet);
        expect(wrapper.prop('requestInProgress')).toBeFalsy();
        done();
    });
});

it('should pass props through', () => {

});
