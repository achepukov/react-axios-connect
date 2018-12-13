import React from 'react';
import { shallow } from 'enzyme';
import axiosConnect from '..';
import { axiosMock } from './axiosMock';

const FakeComponent = () => <div>test</div>;
const ConnectedComponent = axiosConnect()(FakeComponent);
const wrapper = shallow(<ConnectedComponent />);

it('should track request', (done) => {
    const responseOnGet = { some: 'json' };
    axiosMock.onGet('/').replyOnce(200, responseOnGet);

    const promise = wrapper.prop('makeRequest')('/');

    expect(wrapper.prop('isLoading')).toBeTruthy();
    promise.then(
        () => {
            const response = wrapper.prop('response');
            expect(response.data).toEqual(responseOnGet);
            expect(response.status).toEqual(200);
            expect(wrapper.prop('isLoading')).toBeFalsy();
            expect(wrapper.prop('error')).toBeNull();
            done();
        }
    );
});

it('should be able to post', (done) => {
    const responsePost = { some: 'json' };
    axiosMock.onPost('/some-url').replyOnce(201, responsePost);

    const promise = wrapper.prop('makeRequest')('/some-url', 'post');
    expect(wrapper.prop('isLoading')).toBeTruthy();
    promise.then(
        () => {
            const response = wrapper.prop('response');
            expect(response.data).toEqual(responsePost);
            expect(response.status).toEqual(201);
            expect(wrapper.prop('isLoading')).toBeFalsy();
            expect(wrapper.prop('error')).toBeNull();
            done();
        });
});
